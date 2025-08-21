using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
//using Services.Auth;
//using Services.Form;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IssueInformController : Controller
    {

        private readonly IIssueInformService _issueInformService;

        public IssueInformController(IIssueInformService issueInformService)
        {
            _issueInformService = issueInformService;
        }

        [HttpPost("ValidateTask")]
        public async Task<IActionResult> ValidateTaskItem(ValidateTaskParam param)
        {
            return Ok(await _issueInformService.SaveTask(param));
        }
   
        [HttpPost("SaveIssueForm/{status}")]
        public async Task<IActionResult> FinalValidateTaskItem(IssueFormParam param, string status)
        {
            return Ok(await _issueInformService.SaveIssueForm(param, status));
        }


        [HttpGet("GetIssueForm/{formId}")]
        public async Task<IActionResult> GetIssueFormById(int formId)
        {
            return Ok(await _issueInformService.GetIssueFormById(formId));
        }
    }
}
