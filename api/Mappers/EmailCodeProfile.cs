using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;

namespace NetCoreAPI.Mappers
{
    public class EmailCodeProfile : Profile
    {
        public EmailCodeProfile()
        {
            CreateMap<EmailCodeDto, EmailCode>();
            CreateMap<EmailCode, EmailCodeDto>();


        }
    }
}
