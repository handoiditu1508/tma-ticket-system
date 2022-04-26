using AppApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AppApi.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<Equipment> Equipments { get; set; }
		public DbSet<EquipmentStatus> EquipmentStatuses { get; set; }
		public DbSet<EquipmentType> EquipmentTypes { get; set; }

		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{ }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
			=> optionsBuilder
			.UseLazyLoadingProxies();
	}
}