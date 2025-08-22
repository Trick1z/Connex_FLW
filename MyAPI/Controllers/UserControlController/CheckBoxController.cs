using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace MyAPI.Controllers.UserControlController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CheckBoxController : Controller
    {
        private readonly ICheckBoxService _checkBoxService;


        public CheckBoxController(ICheckBoxService checkBoxService)
        {
            _checkBoxService = checkBoxService;
        }

        [HttpGet("CheckBoxCategoriesItem")]
        public async Task<IActionResult> GetCheckCategoryItem()
        {
            return Ok(await _checkBoxService.GetCategoryCheckBoxesAsync());
        }


    }
}
