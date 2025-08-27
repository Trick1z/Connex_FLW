using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Implements;

namespace MyAPI.Controllers.DashBoard
{
    [ApiController]
    [Route("api/[controller]")]

    [Authorize]
    public class DashBoardController : Controller
    {
        private readonly IDashBoardService _dashBoardService;

        public DashBoardController(IDashBoardService dashBoardService)
        {
            _dashBoardService = dashBoardService;
        }


        [HttpPost("QueryUserWorkLoad")]
        public async Task<IActionResult> QueryWorkLoad(DevExtremeParam<SearchUsernameParam> param)
        {
            return Ok(await _dashBoardService.QueryUserWorkLoad(param));
        }

    }
}

