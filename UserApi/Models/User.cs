using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace UserApi.Models
{
	public class User : IdentityUser<int>
	{
		public virtual ICollection<IdentityUserRole<int>> UserRoles { get; } = new List<IdentityUserRole<int>>();
	}
}