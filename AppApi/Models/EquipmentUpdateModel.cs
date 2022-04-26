namespace AppApi.Models
{
	public class EquipmentUpdateModel
	{
		public string Name { get; set; }

		public string Description { get; set; }

		public int? UserId { get; set; }

		public int StatusId { get; set; }

		public int TypeId { get; set; }
	}
}