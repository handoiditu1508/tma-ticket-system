namespace AppApi.Models
{
	public class EquipmentCreateModel
	{
		public string Name { get; set; }

		public string Description { get; set; }

		public int TypeId { get; set; }

		public int StatusId { get; set; }
	}
}