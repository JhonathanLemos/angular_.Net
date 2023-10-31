using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IRepository<Customer> _repository;
        private readonly IMapper _mapper;
        public CustomerController(IRepository<Customer> repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetAll input)
        {
            var query = _repository.GetAll();

            if (input.Search != null)
                query = query.Where(x => x.NomeCliente.Contains(input.Search));

            int totalItems = query.Count();

            int skip = input.PageIndex * input.PageSize;

            var items = query.Skip(skip).Take(input.PageSize).ToList();

            var result = new
            {
                TotalItems = totalItems,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet("GetAllCustomers")]
        public async Task<IActionResult> GetAllCustomers()
        {

            return Ok(await _repository.GetAll().ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var entity = await _repository.GetById(id);
            if (entity == null)
                return NotFound("Entidade não encontrada");

            return Ok(entity);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CustomerDto customerDto)
        {
            var customer = _mapper.Map<Customer>(customerDto);
            var result = await _repository.Add(customer);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CustomerDto customerDto)
        {
            var entity = await _repository.GetById(id);
            if (entity == null)
                return NotFound("Entidade não encontrada");

            var result = await _repository.Update(entity);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _repository.GetById(id);
            if (entity == null)
                return NotFound("Entidade não encontrada");

            await _repository.Delete(entity);
            return Ok();

        }
    }
}
