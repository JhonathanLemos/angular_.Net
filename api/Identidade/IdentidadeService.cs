using Castle.Core.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MyApi.Identidade
{
    public class IdentidadeService 
    {


        public IdentidadeService()
        {
        }

        [AllowAnonymous]
        public async Task SendEmailAsync(UserDto usuario, string code, string subject, string body)
        {
            if (usuario.Email != null)
            {

                try
                {
                    string smtpServer = "smtp.office365.com";
                    int smtpPort = 587;
                    string userName = "hracademy2023@outlook.com";
                    string password = "02252713Fc!";

                    SmtpClient client = new SmtpClient(smtpServer, smtpPort);
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(userName, password);

                    MailMessage message = new MailMessage();
                    message.From = new MailAddress("hracademy2023@outlook.com");
                    message.To.Add(usuario.Email);
                    message.Subject = subject;
                    message.Body = string.Format(body, usuario.UserName, code);
                    message.IsBodyHtml = true;
                    client.Send(message);
                }
                catch (Exception ex)
                {
                }
            }
            else
                throw new Exception("Usuário não possui e-mail cadastrado.");
        }

        public async Task SendEmailRecoveryPasswordAsync(UserDto usuario, string code, string subject, string body)
        {
            if (usuario.Email != null)
            {

                try
                {
                    string smtpServer = "smtp.office365.com";
                    int smtpPort = 587;
                    string userName = "hracademy2023@outlook.com";
                    string password = "02252713Fc!";

                    SmtpClient client = new SmtpClient(smtpServer, smtpPort);
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(userName, password);

                    MailMessage message = new MailMessage();
                    message.From = new MailAddress("hracademy2023@outlook.com");
                    message.To.Add(usuario.Email);
                    message.Subject = subject;
                    message.Body = string.Format(body, usuario.UserName, code);
                    message.IsBodyHtml = true;
                    client.Send(message);
                }
                catch (Exception ex)
                {
                }
            }
            else
                throw new Exception("Usuário não possui e-mail cadastrado.");
        }
    }
}