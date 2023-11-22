using AutoMapper;
using AutoMapper.Internal.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using MyApi.Identidade;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NetCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IRepository<EmailCode> _emailCode;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IdentidadeService _identidadeService;
        private readonly IMemoryCache _memoryCache;

        public LoginController(IMemoryCache memoryCache,IdentidadeService identidadeService, IRepository<EmailCode> emailCode, IMapper mapper,UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _identidadeService = identidadeService;
            _memoryCache = memoryCache;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailCode = emailCode;
            _mapper = mapper;
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser(Login login)
        {

            User user = new User() { UserName = login.UserName, Email = login.Email };
            var result = await _userManager.CreateAsync(user, login.Password);
            if (result.Succeeded)
            {
                var useree = _mapper.Map<UserDto>(user);

                await GenerateCodeToValidateUser(useree);
                return Ok(new { UserId = user.Id, RegistrationResult = result });
            }
            else
            {
                return BadRequest(result.TranslateErrors());
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IResult> Login(Login login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null)
                return Results.BadRequest();

            if (!user.EmailConfirmed)
                return Results.BadRequest("EmailNotValidated");

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded)
                return Results.BadRequest();

          

            var key = Encoding.ASCII.GetBytes(_configuration["JwtBearerTokenSettings:SecretKey"]);
            TimeZoneInfo brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            DateTime currentTimeInBrazil = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                SigningCredentials =
               new SigningCredentials(
                   new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _configuration["JwtBearerTokenSettings:Audience"],
                Issuer = _configuration["JwtBearerTokenSettings:Issuer"],
                Expires = DateTime.UtcNow.AddMinutes(10),
                Subject = new ClaimsIdentity(new[]
    {
        new Claim("last_activity",currentTimeInBrazil.ToString("o"))
    }),
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);



            return Results.Ok(new
            {

                token = tokenHandler.WriteToken(token)
            });
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        private async Task GenerateCodeToValidateUser(UserDto user)
        {
            Random random = new Random();
            int randomNumber = random.Next(100000, 999999);
            string randomCode = randomNumber.ToString("D6");

            var emailCodeDto = new EmailCodeDto() { Code = randomCode, UserId = user.Id };
            await _emailCode.Add(_mapper.Map<EmailCode>(emailCodeDto));
            await _identidadeService.SendEmailAsync(user, randomCode, Resource.SubjectEmail, Resource.bodyEmailCode);

        }

        [AllowAnonymous]
        [HttpPost("GenCode")]
        public async Task<IActionResult> GenCode(Login user)
        {
           var result = await _userManager.FindByEmailAsync(user.Email);
           if(result.EmailConfirmed)
                return Ok();
            else
            {
                await this.GenerateCodeToValidateUser(_mapper.Map<UserDto>(result));
                return BadRequest(new { UserId = result.Id, RegistrationResult = "ValidateUser" });
            }
        }
    }
}
