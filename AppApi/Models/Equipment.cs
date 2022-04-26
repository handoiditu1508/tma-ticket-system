using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppApi.Models
{
	public class Equipment
	{
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		public string Description { get; set; }

		public int? UserId { get; set; }

		[Required]
		public int TypeId { get; set; }
		[ForeignKey(nameof(TypeId))]
		public virtual EquipmentType Type { get; set; }

		[Required]
		public int StatusId { get; set; }
		[ForeignKey(nameof(StatusId))]
		public virtual EquipmentStatus Status { get; set; }
	}
}