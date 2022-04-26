using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace UserApi.Models
{
	public class Role : IdentityRole<int>
	{
		public virtual ICollection<IdentityUserRole<int>> UserRoles { get; } = new List<IdentityUserRole<int>>();

		public Role() : base()
		{ }
		public Role(string roleName) : base(roleName)
		{ }
	}
}