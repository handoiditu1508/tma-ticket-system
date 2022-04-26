using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppApi.Models
{
	public class EquipmentType
	{
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[InverseProperty(nameof(Equipment.Type))]
		public virtual ICollection<Equipment> Equipments { get; } = new List<Equipment>();
	}
}