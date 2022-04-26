using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppApi.Models
{
	public class EquipmentStatus
	{
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[InverseProperty(nameof(Equipment.Status))]
		public virtual ICollection<Equipment> Equipments { get; } = new List<Equipment>();
	}
}