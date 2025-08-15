using Domain.Interfaces.ConfigSupport;
using Domain.ViewModels.CategoriesProduct;
using Domain.ViewModels.MappingCategories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers.ConfigSupportController
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

        //[HttpPost("Categories")]
        //public async Task<IActionResult> UpdateCategoryItem([FromBody] UpdateCategories req)
        //{
        //    return Ok(await _updateCategoriesProducts.UpdateCategoriesItems(req));
        //}

        //[HttpPost("Product")]
        //public async Task<IActionResult> UpdateProductItem([FromBody] UpdateProduct req)
        //{
        //    return Ok(await _updateCategoriesProducts.UpdateProductItems(req));
        //}

        [HttpPost("InsertMappingUserCategories")]
        public async Task<IActionResult> InsertMappingUserCategoriesItem(MappingUserCategoriesItem req)
        {
            return Ok(await _configSupportService.InsertMapUserCategories(req));
        }

        [HttpGet("userByRole")]
        public async Task<IActionResult> GetUserByRoleItem()
        {
            return Ok(await _configSupportService.GetUserByRoleSupport());
        }


    }


}
