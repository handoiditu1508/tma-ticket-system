namespace AppApi.Models
{
	public class EquipmentsFilterModel
	{
		public int? TypeId { get; set; }
		public int? StatusId { get; set; }
		public int? UserId { get; set; }
		public int? Skip { get; set; }
		public int? Offset { get; set; }
	}
}