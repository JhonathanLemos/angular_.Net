using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPI.Models;

namespace NetCoreAPI.Repositories
{
    public class UserRepository : ControllerBase, IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<User> Add(User entity)
        {
            _context.Users.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Delete(User entity)
        {
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public IQueryable<User> GetAll()
        {
            return _context.Set<User>().AsQueryable();
        }

        public async Task<User> GetById(string id)
        {
            return await _context.Set<User>().Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> Update(User entity)
        {
            _context.Update(entity);
            _context.SaveChanges();
            return entity;
        }
    }
}
