using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
//using Services.Auth;
//using Services.Form;

namespace MyAPI.Controllers.IssueForm
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

        [HttpPost("SaveTask")]
        public async Task<IActionResult> TaskItemsAsync(ValidateTaskParam param)
        {
            return Ok(await _issueInformService.ValidateTaskItemsAsync(param)); 
        }

        [HttpPost("DeleteTask")]
        public async Task<IActionResult> DeleteTask(ValidateTaskParam param)
        {
            return Ok(await _issueInformService.DeleteTask(param)); 
        }

        [HttpPost("SaveIssueForm/{formId}/{status}")]
        public async Task<IActionResult> SaveIssueForm(IssueFormParam param, int formId, string status)
        {
            return Ok(await _issueInformService.SaveIssueForm(param, formId, status));
        }


        [HttpPost("CloseIssueForm")]
        public async Task<IActionResult> CloseIssueForm(USP_Query_IssueFormsResult param)
        {
            return Ok(await _issueInformService.CloseForms(param));
        }

        [HttpGet("GetIssueForm/{formId}")]
        public async Task<IActionResult> GetIssueFormById(int formId)
        {
            return Ok(await _issueInformService.GetIssueFormById(formId));
        }

        [HttpPost("queryIssueforms/unsuccess/{formStatus}")]
        public async Task<IActionResult> GetForms(DevExtremeParam<QueryUserForm> param , string formStatus)
        {
            return Ok(await _issueInformService.GetForms( param , formStatus)); 
        }

        [HttpPost("queryIssueforms/unsuccessTaskDetail")]
        public async Task<IActionResult> GetUnsuscessFormTaskDetail(DevExtremeParam<QueryUserFormDetail> param)
        {
            return Ok(await _issueInformService.GetFormsDetail(param ));
        }

        [HttpPost("queryTask-user")]
        public async Task<IActionResult> QueryFormUser(DevExtremeParam<JobForUser> param)
        {
            return Ok(await _issueInformService.QueryFormUser(param));
        }


        [HttpPost("ListTaskManagement/{status}")]
        public async Task<IActionResult> ListTaskManagement(List<USP_Query_FormTasksByStatusResult> param, string status)
        {
            return Ok(await _issueInformService.ListTaskManagement(param, status));
        }
        [HttpPost("TaskManagement/{status}")]
        public async Task<IActionResult> TaskManagement(USP_Query_FormTasksByStatusResult param, string status)
        {
            return Ok(await _issueInformService.TaskManagement(param, status));
        }
    }
}
