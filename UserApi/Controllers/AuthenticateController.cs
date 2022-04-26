using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ApiCore.Models;
using ApiCore.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using UserApi.Models;

namespace UserApi.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class AuthenticateController : ControllerBase
	{
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<Role> _roleManager;
		private readonly IConfiguration _configuration;

		public AuthenticateController(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration)
		{
			_userManager = userManager;
			_roleManager = roleManager;
			_configuration = configuration;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginModel model)
		{
			var user = await _userManager.FindByNameAsync(model.Username);
			if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
			{
				var RoleType = await _userManager.GetRolesAsync(user);

				var authClaims = new List<Claim>
				{
					new Claim(ClaimTypes.Name,user.UserName),
					new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
				};

				foreach (var userRole in RoleType)
				{
					authClaims.Add(new Claim(ClaimTypes.Role, userRole));
				}

				var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

				var token = new JwtSecurityToken(
					issuer: _configuration["JWT:Issuer"],
					audience: _configuration["JWT:Audience"],
					expires: DateTime.Now.AddHours(3),
					claims: authClaims,
					signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
				);

				return Ok(new
				{
					success = true,
					token = new JwtSecurityTokenHandler().WriteToken(token),
					expiration = token.ValidTo,
					user = new UserViewModel
					{
						Id = user.Id,
						Email = user.Email,
						Username = user.UserName,
						RoleIds = user.UserRoles.Select(ur => ur.RoleId).ToList()
					}
				});
			}
			return Unauthorized(new { success = false });
		}

		[HttpPost("register")]
		public async Task<IActionResult> RegisterUser([FromBody] RegisterModel model)
		{
			var userExists = await _userManager.FindByNameAsync(model.Username);
			if (userExists != null)
				return StatusCode(StatusCodes.Status500InternalServerError, new Response { Success = false, Message = "User already exists!" });

			User user = new User()
			{
				Email = model.Email,
				SecurityStamp = Guid.NewGuid().ToString(),
				UserName = model.Username
			};

			if (!await _roleManager.RoleExistsAsync(RoleType.Admin))
				await _roleManager.CreateAsync(new Role(RoleType.Admin));
			if (!await _roleManager.RoleExistsAsync(RoleType.User))
				await _roleManager.CreateAsync(new Role(RoleType.User));

			int roleCount = await _roleManager.Roles.Where(r => model.RoleIds.Any(rid => rid == r.Id)).CountAsync();
			if (roleCount != model.RoleIds.Count())
				return BadRequest();

			foreach (int roleId in model.RoleIds)
			{
				user.UserRoles.Add(new IdentityUserRole<int>
				{
					RoleId = roleId
				});
			}

			var result = await _userManager.CreateAsync(user, model.Password);
			if (!result.Succeeded)
				return StatusCode(StatusCodes.Status500InternalServerError, new Response { Success = false, Message = "User creation failed! Please check user details and try again." });

			return Ok(new Response { Success = true, Message = "User created successfully!" });
		}

		/*[HttpPost("register-admin")]
		public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
		{
			var userExists = await _userManager.FindByNameAsync(model.Username);
			if (userExists != null)
				return StatusCode(StatusCodes.Status500InternalServerError, new Response { Success = false, Message = "User already exists!" });

			User user = new User()
			{
				Email = model.Email,
				SecurityStamp = Guid.NewGuid().ToString(),
				UserName = model.Username
			};
			var result = await _userManager.CreateAsync(user, model.Password);
			if (!result.Succeeded)
				return StatusCode(StatusCodes.Status500InternalServerError, new Response { Success = false, Message = "User creation failed! Please check user details and try again." });

			if (!await _roleManager.RoleExistsAsync(RoleType.Admin))
				await _roleManager.CreateAsync(new Role(RoleType.Admin));
			if (!await _roleManager.RoleExistsAsync(RoleType.User))
				await _roleManager.CreateAsync(new Role(RoleType.User));

			if (await _roleManager.RoleExistsAsync(RoleType.Admin))
			{
				await _userManager.AddToRoleAsync(user, RoleType.Admin);
			}

			return Ok(new Response { Success = true, Message = "User created successfully!" });
		}*/
	}
}