using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailCodeController : ControllerBase
    {
        private readonly IRepository<EmailCode> _repository;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IUserRepository _userRepository;

        public EmailCodeController(IRepository<EmailCode> repository, IMapper mapper, IMemoryCache memoryCache, IUserRepository userRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _repository = repository;
            _memoryCache = memoryCache;
        }
       

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EmailCodeDto emailCodeDto)
        {
            var emailCode = _mapper.Map<EmailCode>(emailCodeDto);
            var result = await _repository.Add(emailCode);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("VerifyCode")]
        public async Task<IActionResult> VerifyCode(EmailCodeDto emailCode)
        {
            var resultr = _memoryCache.Get("userId");
            var result = await _repository.GetAll().Where(x => x.UserId == emailCode.UserId && x.Code == emailCode.Code).FirstOrDefaultAsync();

            if (result is not null)
            {
                var user = await _userRepository.GetById(emailCode.UserId);
                user.EmailConfirmed = true;
                await _userRepository.Update(user);
                await _repository.Delete(result);
                return Ok(result);

            }

            return BadRequest();
        }
    }
}
