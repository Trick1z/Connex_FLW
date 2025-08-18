using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Implements.Auth;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class DropDownController : Controller
    {



        private readonly IDropDownService _getDropdownService;
        private readonly IGenNumberService _genNumberService;



        public DropDownController(IDropDownService getDropdownService, IGenNumberService genNumberService)
        {

            _getDropdownService = getDropdownService;
            _genNumberService = genNumberService;
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



        [AllowAnonymous]
        [HttpGet("testGen/{prefix}/{delay}")]
        public async Task<IActionResult> GenNo(string prefix , int delay)
        {
            return Ok(await _genNumberService.GenDocNo(prefix));
        }

    }
}

