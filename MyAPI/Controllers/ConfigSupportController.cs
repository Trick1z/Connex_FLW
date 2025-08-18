using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConfigSupportController : Controller
    {
        private readonly IConfigSupportService _configSupportService;
        public ConfigSupportController(IConfigSupportService configSupportService)
        {
            _configSupportService = configSupportService;
        }

        [HttpPost("InsertMappingUserCategories")]
        public async Task<IActionResult> InsertMappingUserCategoriesItem(SaveUserCategoriesParam req)
        {
            return Ok(await _configSupportService.SaveUserCategories(req));
        }

        [HttpGet("userByRole")]
        public async Task<IActionResult> GetUserByRoleItem()
        {
            return Ok(await _configSupportService.GetUserByRoleSupport());
        }
        [HttpGet("loadUser/{id}")]
        public async Task<IActionResult> LoadUser(int id)
        {
            return Ok(await _configSupportService.LoadUser(id));
        }

        [HttpPost("queryUserByText")]
        public async Task<IActionResult> QueryUserByRole(DevExtremeParam<SearchUsernameParam> param)
        {
            return Ok(await _configSupportService.QueryUserByRole(param));
        }
    }
}
