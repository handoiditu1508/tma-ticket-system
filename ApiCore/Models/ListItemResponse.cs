using System.Collections.Generic;

namespace ApiCore.Models
{
	public class ListItemResponse<T>
	{
		public IEnumerable<T> Items { get; set; }
		public int TotalItem { get; set; }
	}
}