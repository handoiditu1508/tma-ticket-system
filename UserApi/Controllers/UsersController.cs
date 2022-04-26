using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserApi.Data;
using UserApi.Models;
using ApiCore.Models;
using ApiCore.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace UserApi.Controllers
{
	[Authorize]
	[ApiController]
	[Route("[controller]")]
	public class UsersController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<Role> _roleManager;

		public UsersController(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
		{
			_context = context;
			_userManager = userManager;
			_roleManager = roleManager;
		}

		[HttpGet("{id:min(1):int}")]
		public async Task<ActionResult<UserViewModel>> GetById(int id)
		{
			if (id < 1)
				return BadRequest();

			User user = await _context.Users
				.Include(u => u.UserRoles)
				.FirstOrDefaultAsync(u => u.Id == id);

			if (user == null)
				return NotFound(new Response { Success = false, Message = "User not found" });

			return Ok(new UserViewModel
			{
				Id = user.Id,
				Email = user.Email,
				Username = user.UserName,
				RoleIds = user.UserRoles.Select(ur => ur.RoleId).ToList()
			});
		}

		[HttpGet("list")]
		public async Task<ActionResult<ListItemResponse<UserViewModel>>> GetList(int? roleId, int? skip, int? offset)
		{
			IQueryable<User> users = _context.Users
				.Include(u => u.UserRoles);

			if (roleId != null)
				users = users.Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId));

			int itemCount = await users.CountAsync();

			if (skip != null && skip > 0)
				users = users.Skip((int)skip);

			if (offset != null && offset > 0)
				users = users.Take((int)offset);

			return new ListItemResponse<UserViewModel>
			{
				Items = await users
					.Select(u => new UserViewModel
					{
						Id = u.Id,
						Email = u.Email,
						Username = u.UserName,
						RoleIds = u.UserRoles.Select(ur => ur.RoleId).ToList()
					}).ToListAsync(),
				TotalItem = itemCount
			};
		}

		[AllowAnonymous]
		[HttpGet("roles")]
		public async Task<ActionResult<ListItemResponse<RoleViewModel>>> GetRolesList()
		{
			return Ok(new ListItemResponse<RoleViewModel>
			{
				Items = await _context.Roles.Select(r => new RoleViewModel
				{
					Id = r.Id,
					Name = r.Name
				}).ToListAsync(),
				TotalItem = await _context.Roles.CountAsync()
			});
		}
	}
}