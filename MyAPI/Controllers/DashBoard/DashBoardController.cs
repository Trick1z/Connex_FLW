using Domain.Interfaces;
using Domain.Models;
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

        [HttpGet("QueryOverallFormStatus")]
        public async Task<IActionResult> QueryOverallFormStatus()
        {
            return Ok(await _dashBoardService.QueryOverallFormStatus());
        }

        [HttpPost("QueryOverallFormStatusDetail")]
        public async Task<IActionResult> QueryOverallFormStatusDetail(DevExtremeParam<QueryOverallDetailParam>  param)
        {
            return Ok(await _dashBoardService.QueryOverallFormStatusDetail(param));
        }

        [HttpPost("QueryLogEnquiry")]
        public async Task<IActionResult> QueryEnQuiry(DevExtremeParam<QueryLogEnquiryParam>  param)
        {
            return Ok(await _dashBoardService.QueryLogEnquiry(param));
        }

        [HttpGet("ActionFormChart")]
        public async Task<IActionResult> ActionFormChart()
        {
            return Ok(await _dashBoardService.ActionFormChart());
        }



    }
}

