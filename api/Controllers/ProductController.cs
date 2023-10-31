using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetCoreAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IRepository<Product> _repository;
    public ProductController(IRepository<Product> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetAll input)
    {
        var query = _repository.GetAll();

        if (input.Search != null)
            query = query.Where(x => x.NomeProduto.Contains(input.Search));

        int totalItems = query.Count();

        int skip = input.PageIndex * input.PageSize;

        var items = query.Include(x => x.Customer).Skip(skip).Take(input.PageSize).ToList();
        var itemsDto = _mapper.Map<List<ProductDto>?>(items);
        var result = new
        {
            TotalItems = totalItems,
            Items = itemsDto
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _repository.GetById(id);
        if (result == null)
            return NotFound("Entidade não encontrada");

        return Ok(_mapper.Map<ProductDto>(result));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateProductDto produtoDto)
    {
        var produto = _mapper.Map<Product>(produtoDto);
        return Ok(await _repository.Add(produto));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] CreateProductDto produtoDto)
    {
        var entity = await _repository.GetById(id);
        if (entity == null)
            return NotFound("Nenhum entidade encontrada!");

        _mapper.Map(produtoDto, entity);
        return Ok(await _repository.Update(entity));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _repository.GetById(id);
        if (result == null)
            return NotFound("Entidade nao encontrada");

        await _repository.Delete(result);
        return Ok();
    }
}
