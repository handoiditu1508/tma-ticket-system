using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppApi.Data;
using AppApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiCore.Models;
using System.Net.Http;
using ApiCore.Models.ViewModels;
using System.Net.Http.Json;
using System;
using System.Net.Http.Headers;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace AppApi.Controllers
{
	[Authorize]
	[ApiController]
	[Route("[controller]")]
	public class EquipmentsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IConfiguration _configuration;

		public EquipmentsController(ApplicationDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		[HttpGet("{id:min(1):int}")]
		public async Task<ActionResult<EquipmentViewModel>> GetById(int id)
		{
			if (id < 1)
				return BadRequest();

			Equipment equipment = await _context.Equipments.FindAsync(id);

			if (equipment == null)
				return NotFound(new Response { Success = false, Message = "Equipment not found" });

			return Ok(new EquipmentViewModel
			{
				Id = equipment.Id,
				Name = equipment.Name,
				Description = equipment.Description,
				StatusId = equipment.StatusId,
				TypeId = equipment.TypeId,
				UserId = equipment.UserId
			});
		}

		[HttpGet("list")]
		public async Task<ActionResult<ListItemResponse<EquipmentViewModel>>> GetList(int? typeId, int? statusId, int? userId, int? skip, int? offset)
		{
			IQueryable<Equipment> equipments = _context.Equipments;

			if (statusId != null)
				equipments = equipments.Where(e => e.StatusId == statusId);

			if (typeId != null)
				equipments = equipments.Where(e => e.TypeId == typeId);

			if (userId != null)
				equipments = equipments.Where(e => e.UserId == userId);

			int itemCount = await equipments.CountAsync();

			if (skip != null && skip > 0)
				equipments = equipments.Skip((int)skip);

			if (offset != null && offset > 0)
				equipments = equipments.Take((int)offset);

			return Ok(new ListItemResponse<EquipmentViewModel>
			{
				Items = await equipments.Select(e => new EquipmentViewModel
				{
					Id = e.Id,
					Name = e.Name,
					Description = e.Description,
					StatusId = e.StatusId,
					TypeId = e.TypeId,
					UserId = e.UserId
				}).ToListAsync(),
				TotalItem = itemCount
			});
		}

		/*[Authorize(Roles = RoleType.Admin)]
		[HttpPut("assign/{equipmentId:min(1):int}/to/{userId:min(1):int?}")]
		public async Task<IActionResult> AssignTo(int equipmentId, int? userId)
		{
			if (equipmentId < 1)
				return BadRequest();

			Equipment equipment = await _context.Equipments.FindAsync(equipmentId);
			if (equipment == null)
				return NotFound(new Response { Success = false, Message = "Equipment not found" });

			if (userId != null)
			{
				if (equipment.UserId != null)
					return Conflict(new Response { Success = false, Message = "Equipment've already assigned" });
				else if (userId < 1)
					return BadRequest();
				else
				{
					var user = await findUserById((int)userId);
					if (user == null)
						return NotFound(new Response { Success = false, Message = "User not found" });
				}
			}
			else equipment.StatusId = 2;

			equipment.UserId = userId;

			await _context.SaveChangesAsync();

			return Ok();
		}*/

		[Authorize(Roles = RoleType.Admin)]
		[HttpPut("update/{id:min(1):int}")]
		public async Task<IActionResult> Update(int id, [FromBody] EquipmentUpdateModel model)
		{
			if (id < 1)
				return BadRequest();

			if (string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Description) ||
				!await _context.EquipmentTypes.AnyAsync(t => t.Id == model.TypeId))
				return BadRequest();

			#region UserId
			Equipment equipment = await _context.Equipments.FindAsync(id);
			if (equipment == null)
				return NotFound(new Response { Success = false, Message = "Equipment not found" });

			if (model.UserId != null)
			{
				if (equipment.UserId != null)
					return Conflict(new Response { Success = false, Message = "Equipment've already assigned" });
				else if (model.UserId < 1)
					return BadRequest();
				else
				{
					var user = await findUserById((int)model.UserId);
					if (user == null)
						return NotFound(new Response { Success = false, Message = "User not found" });
					equipment.StatusId = (int)EquipmentStatusType.Occupied;
				}
			}
			else if (await _context.EquipmentStatuses.AnyAsync(s => s.Id == model.StatusId))
				equipment.StatusId = model.StatusId;
			else equipment.StatusId = (int)EquipmentStatusType.Available;

			equipment.UserId = model.UserId;
			equipment.Name = model.Name;
			equipment.Description = model.Description;
			equipment.TypeId = model.TypeId;
			#endregion

			await _context.SaveChangesAsync();

			return Ok();
		}

		private async Task<UserViewModel> findUserById(int id)
		{
			//proxy settings
			var webProxy = new WebProxy
			{
				Address = new Uri(_configuration["Proxy:Address"] + ":" + _configuration["Proxy:Port"]),
				BypassProxyOnLocal = true,
				UseDefaultCredentials = false,
				Credentials = new NetworkCredential(_configuration["Username"], _configuration["Password"])
			};
			var proxyHttpClientHandler = new HttpClientHandler
			{
				Proxy = webProxy,
				UseProxy = true,
			};
			using (HttpClient client = new HttpClient(proxyHttpClientHandler))
			{
				client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", createToken());
				client.BaseAddress = new Uri("https://localhost:5001");
				client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

				using (var response = await client.GetAsync($"/Users/{id}"))
				{
					if (response.IsSuccessStatusCode)
					{
						return await response.Content.ReadAsAsync<UserViewModel>();
					}
				}
			}
			return null;
		}

		private string createToken()
		{
			var authClaims = new List<Claim>
				{
					new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
					new Claim(ClaimTypes.Role, RoleType.Admin)
				};
			var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
			var token = new JwtSecurityToken(
				issuer: _configuration["JWT:Issuer"],
				audience: _configuration["JWT:Audience"],
				expires: DateTime.Now.AddSeconds(30),
				claims: authClaims,
				signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		[Authorize(Roles = RoleType.Admin)]
		[HttpPost("create")]
		public async Task<ActionResult<EquipmentViewModel>> Create([FromBody] EquipmentCreateModel model)
		{
			if (model == null)
				return BadRequest();

			if (string.IsNullOrWhiteSpace(model.Name) ||
				string.IsNullOrWhiteSpace(model.Description) ||
				!await _context.EquipmentStatuses.AnyAsync(s => s.Id == model.StatusId) ||
				!await _context.EquipmentTypes.AnyAsync(t => t.Id == model.TypeId))
				return BadRequest();

			Equipment equipment = new Equipment
			{
				Name = model.Name,
				Description = model.Description,
				StatusId = model.StatusId,
				TypeId = model.TypeId
			};

			await _context.Equipments.AddAsync(equipment);

			await _context.SaveChangesAsync();

			return Ok(new EquipmentViewModel
			{
				Id = equipment.Id,
				Name = equipment.Name,
				Description = equipment.Description,
				StatusId = equipment.StatusId,
				TypeId = equipment.TypeId,
				UserId = equipment.UserId
			});
		}

		[HttpGet("statuses")]
		public async Task<ActionResult<ListItemResponse<EquipmentStatusViewModel>>> GetStatusesList()
		{
			return Ok(new ListItemResponse<EquipmentStatusViewModel>
			{
				Items = await _context.EquipmentStatuses.Select(s => new EquipmentStatusViewModel
				{
					Id = s.Id,
					Name = s.Name
				}).ToListAsync(),
				TotalItem = await _context.EquipmentStatuses.CountAsync()
			});
		}

		[HttpGet("types")]
		public async Task<ActionResult<ListItemResponse<EquipmentTypeViewModel>>> GetTypesList()
		{
			return Ok(new ListItemResponse<EquipmentTypeViewModel>
			{
				Items = await _context.EquipmentTypes.Select(s => new EquipmentTypeViewModel
				{
					Id = s.Id,
					Name = s.Name
				}).ToListAsync(),
				TotalItem = await _context.EquipmentTypes.CountAsync()
			});
		}

		[HttpDelete("delete/{id:min(1):int}")]
		public async Task<IActionResult> Delete(int id)
		{
			if (!await _context.Equipments.AnyAsync(e => e.Id == id))
				return NotFound();

			Equipment equipment = new Equipment
			{
				Id = id
			};

			_context.Entry<Equipment>(equipment).State = EntityState.Deleted;

			await _context.SaveChangesAsync();

			return Ok();
		}
	}
}