using NetCoreAPI.Controllers;
using NetCoreAPI.Models;
using NetCoreAPI.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using AutoMapper;
using NetCoreAPI.Dtos;

namespace NetCoreAPI.teste
{
    public class CustomerTests
    {
        private readonly CustomerController _customerController;
        private readonly Mock<IRepository<Customer>> _repository;
        private readonly Mock<IMapper> _mapper;
        public CustomerTests()
        {
            _mapper = new Mock<IMapper>();
            _repository = new Mock<IRepository<Customer>>();
            _customerController = new CustomerController(_repository.Object, (IMapper)_mapper);
        }

        [Fact]
        public async void Create_Customers()
        {
            var result = await _customerController.GetAll(new GetAll());
            Assert.NotNull(result);
        }

        [Fact]
        public void GetAll_Customers()
        {

        }
    }
}
