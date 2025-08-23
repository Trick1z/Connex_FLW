using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers.UserControlController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class DropDownController : Controller
    {
        private readonly IDropDownService _getDropdownService;
        private readonly IGenNumberService _genNumberService;
        private readonly IIssueInformService _issueInformService;

        public DropDownController(IDropDownService getDropdownService, IGenNumberService genNumberService, IIssueInformService issueInformService)
        {
            _getDropdownService = getDropdownService;
            _genNumberService = genNumberService;
            _issueInformService = issueInformService;
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
        public async Task<IActionResult> GetRoleItem()
        {
            return Ok(await _getDropdownService.GetRoleItem()); 
        }

        [HttpGet("ProductMapByCategories/{id}")]
        public async Task<IActionResult> GetProductItemsMapByCategories(int id)
        {
            return Ok(await _issueInformService.GetProductItemsMapByCategories(id));
        }

        [AllowAnonymous]
        [HttpGet("CategoriesItem")]
        public async Task<IActionResult> GetCategoriesItems()
        {
            return Ok(await _getDropdownService.GetCategoriesItems());
        }

        [AllowAnonymous]
        [HttpGet("ProductsItem")]
        public async Task<IActionResult> GetProductsItems()
        {
            return Ok(await _getDropdownService.GetProductsItems()); 
        }
    }
}
