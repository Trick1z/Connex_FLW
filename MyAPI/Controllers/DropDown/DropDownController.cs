using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Implements.Auth;

namespace MyAPI.Controllers.DropDown
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class DropDownController : Controller
    {
       
       

            private readonly IDropDownService _getDropdownService;



            public DropDownController(IDropDownService getDropdownService)
            {

            _getDropdownService = getDropdownService;
            }


            [HttpGet("GetProductsWithSelection/{id}")]
            public async Task<IActionResult> GetProductsWithSelection(int id)
            {
                return Ok(await _getDropdownService.GetProductsWithSelection(id));
            }

        [HttpGet("userMapCategoriesByUserId/{id}")]
        public async Task<IActionResult> GetmappedCategoryItems(int id)
        {
            return Ok(await _getDropdownService.GetUserMapCategoriesDropDown(id));
        }

        [AllowAnonymous]
        [HttpGet("role")]
        public async Task<IActionResult> GetRole()
        {
            return Ok(await _getDropdownService.GetRoleItem());
        }

        //[HttpGet("Categories/item")]
        //public async Task<IActionResult> GetCategoryItem()
        //{
        //    return Ok(await _getDropdownService.GetCategoriesItems());
        //}

        //[HttpGet("Products/item")]
        //public async Task<IActionResult> GetProductItems()
        //{
        //    return Ok(await _getDropdownService.GetProductItems());
        //}

        //[HttpGet("userByRole")]
        //public async Task<IActionResult> GetUserByRoleItem()
        //{
        //    return Ok(await _getDropdownService.GetUserByRoleSupport());
        //}
    }
    }

