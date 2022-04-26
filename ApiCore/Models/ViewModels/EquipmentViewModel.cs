namespace ApiCore.Models.ViewModels
{
	public class EquipmentViewModel
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public int? UserId { get; set; }
		public int TypeId { get; set; }
		public int StatusId { get; set; }
	}
}