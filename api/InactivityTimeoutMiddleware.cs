using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

public class InactivityTimeoutMiddleware
{
    private readonly RequestDelegate _next;
    private readonly TimeSpan _inactivityTimeout;

    public InactivityTimeoutMiddleware(RequestDelegate next, TimeSpan inactivityTimeout)
    {
        _next = next;
        _inactivityTimeout = inactivityTimeout;
    }

    public async Task Invoke(HttpContext context)
    {
        // Verifique se o usuário está autenticado (use sua lógica de verificação).
        if (context.User.Identity.IsAuthenticated)
        {
            // Recupere a data da última atividade do usuário (a partir do token JWT ou de outro local).
             var lastActivity = GetLastActivity(context.User);

            // Calcule o tempo decorrido desde a última atividade.
            TimeZoneInfo brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            DateTime currentTimeInBrazil = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
            var elapsed = currentTimeInBrazil - lastActivity;

            // Se o tempo decorrido for maior que o limite de inatividade, invalide o token.
            if (elapsed > _inactivityTimeout)
            {
                await context.SignOutAsync();

                return;
            }
            UpdateLastActivityClaimInToken(context.User, currentTimeInBrazil);
        }

        await _next(context);
    }

    private DateTime GetLastActivity(System.Security.Claims.ClaimsPrincipal user)
    {
        // Recupere o claim "last_activity" do usuário.
        var lastActivityClaim = user.Claims.FirstOrDefault(c => c.Type == "last_activity");
        if (lastActivityClaim != null && DateTime.TryParse(lastActivityClaim.Value, out var lastActivity))
        {
            return lastActivity;
        }

        // Se não houver registro da última atividade, retorne uma data/hora fixa ou use um valor padrão.
        return DateTime.UtcNow;
    }

    private void UpdateLastActivityClaimInToken(ClaimsPrincipal user, DateTime newLastActivity)
    {
        var identity = (ClaimsIdentity)user.Identity;
        var lastActivityClaim = identity.FindFirst("last_activity");
        if (lastActivityClaim != null)
        {
            identity.RemoveClaim(lastActivityClaim); // Remove o claim antigo
        }
        identity.AddClaim(new Claim("last_activity", newLastActivity.ToString("o"))); // Adiciona o novo claim
    }
}
