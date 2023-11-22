using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;

namespace NetCoreAPI.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserDto, User>();
            CreateMap<User, UserDto>();
            CreateMap<CreateProductDto, Product>();


        }
    }
}
