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

        //[HttpPost("createForm-task")]
        //public async Task<IActionResult> CreateFormAsync([FromBody] InsertFormViewModel request)
        //{
        //    return Ok(await _insertFormService.CreateFormAsync(request));
        //}

        [HttpPost("ValidateTask")]
        public async Task<IActionResult> ValidateTaskItem(ValidateTaskParam param)
        {
            return Ok(await _issueInformService.SaveTask(param));
        }

        //[HttpPost("EditValidateTaskItem")]
        //public async Task<IActionResult> EditValidateTaskItem(EditValidatedTaskViewModel param)
        //{
        //    return Ok(await _issueInformService.EditValidateTaskItem(param));
        //}
        [HttpPost("SaveIssueForm/{status}")]
        public async Task<IActionResult> FinalValidateTaskItem(IssueFormParam param, string status)
        {
            return Ok(await _issueInformService.SaveIssueForm(param, status));
        }
    }
}
