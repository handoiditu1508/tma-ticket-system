using System.Collections.Generic;

namespace ApiCore.Models.ViewModels
{
	public class UserViewModel
	{
		public int Id { get; set; }
		public string Username { get; set; }
		public string Email { get; set; }
		public IList<int> RoleIds { get; set; }
	}
}