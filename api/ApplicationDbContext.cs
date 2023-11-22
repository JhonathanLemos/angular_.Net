using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NetCoreAPI.Dtos;
using NetCoreAPI.Models;

namespace NetCoreAPI
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Produtos { get; set; }
        public DbSet<Customer> Clientes { get; set; }
        public DbSet<User> Usuarios { get; set; }
        public DbSet<EmailCode> EmailCode { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasIndex(e => e.Email)
                .IsUnique();
        }
    }

}
