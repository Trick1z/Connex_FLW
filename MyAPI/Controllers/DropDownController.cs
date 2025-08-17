using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Implements.Auth;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]

    public class DropDownController : Controller
    {



        private readonly IDropDownService _getDropdownService;



        public DropDownController(IDropDownService getDropdownService)
        {

            _getDropdownService = getDropdownService;
        }


        [HttpGet("CategoriesMapProductDropDown")]
        public async Task<IActionResult> CategoriesMapProductDropDown()
        {
            return Ok(await _getDropdownService.GetCategoriesProductsDropDown());
        }

        [HttpGet("userMapCategoriesByUserId")]
        public async Task<IActionResult> GetmappedCategoryItems()
        {
            return Ok(await _getDropdownService.GetUserMapCategoriesDropDown());
        }

        [AllowAnonymous]
        [HttpGet("role")]
        public async Task<IActionResult> GetRole()
        {
            return Ok(await _getDropdownService.GetRoleItem());
        }

    }
}

