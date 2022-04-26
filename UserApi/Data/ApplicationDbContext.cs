using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UserApi.Models;

namespace UserApi.Data
{
	public class ApplicationDbContext : IdentityDbContext<User, Role, int>
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{ }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
			=> optionsBuilder
			.UseLazyLoadingProxies();

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<User>()
				.HasMany(u => u.UserRoles)
				.WithOne()
				.HasForeignKey(ur => ur.UserId)
				.IsRequired();

			modelBuilder.Entity<Role>()
				.HasMany(r => r.UserRoles)
				.WithOne()
				.HasForeignKey(ur => ur.RoleId)
				.IsRequired();
		}
	}
}