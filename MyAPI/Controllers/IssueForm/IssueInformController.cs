using Domain.Enums;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Services.DashBoard;
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

        [HttpPost("SaveDraftIssueForm/{formId}")]
        public async Task<IActionResult> SaveDraftIssueForm(IssueFormParam param, int formId)
        {
            return Ok(await _issueInformService.SaveIssueForm(param, formId,DocumentStatus.Draft ));
        }


        [HttpPost("SaveSubmitIssueForm/{formId}")]
        public async Task<IActionResult> SaveSubmitIssueForm(IssueFormParam param, int formId)
        {
            return Ok(await _issueInformService.SaveIssueForm(param, formId, DocumentStatus.Submit));
        }





        [HttpPost("CloseIssueForm")]
        public async Task<IActionResult> CloseIssueForm(USP_Query_IssueFormsResult param)
        {
            return Ok(await _issueInformService.CloseForms(param));
        }
        [HttpPost("DeleteForm")]
        public async Task<IActionResult> DeleteIssueForm(USP_Query_IssueFormsResult param)
        {
            return Ok(await _issueInformService.DeleteForm(param));
        }

        [HttpGet("GetIssueForm/{formId}")]
        public async Task<IActionResult> GetIssueFormById(int formId)
        {
            return Ok(await _issueInformService.GetIssueFormById(formId));
        }

        [HttpPost("queryIssueforms/unsuccess/Open")]
        public async Task<IActionResult> QueryOpenForms(DevExtremeParam<QueryUserForm> param)
        {
            return Ok(await _issueInformService.QueryForms( param , QueryFormStatus.Open)); 
        }

        [HttpPost("queryIssueforms/unsuccess/Closed")]
        public async Task<IActionResult> QueryClosedForms(DevExtremeParam<QueryUserForm> param )
        {
            return Ok(await _issueInformService.QueryForms( param , QueryFormStatus.Closed)); 
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


        

        [HttpPost("QueryTaskLog")]
        public async Task<IActionResult> QueryTaskLog(TaskLogParam param)
        {
            return Ok(await _issueInformService.QueryTaskSeqLog(param));
        }


        [HttpPost("TaskManagement/Assigned")]
        public async Task<IActionResult> TaskAssignedManagement(USP_Query_FormTasksByStatusResult param)
        {
            return Ok(await _issueInformService.TaskManagement(param, TaskManagementStatus.Assigned));
        }

        [HttpPost("TaskManagement/Rejected")]
        public async Task<IActionResult> TaskRejectedManagement(USP_Query_FormTasksByStatusResult param)
        {
            return Ok(await _issueInformService.TaskManagement(param, TaskManagementStatus.Rejected));
        }

        [HttpPost("TaskManagement/CancelAssigned")]
        public async Task<IActionResult> TaskCancelAssignedManagement(USP_Query_FormTasksByStatusResult param)
        {
            return Ok(await _issueInformService.TaskManagement(param, TaskManagementStatus.CancelAssigned));
        }

        [HttpPost("TaskManagement/Done")]
        public async Task<IActionResult> TaskDoneManagement(USP_Query_FormTasksByStatusResult param)
        {
            return Ok(await _issueInformService.TaskManagement(param, TaskManagementStatus.Done));
        }

        [HttpPost("TaskManagement/CancelCompleted")]
        public async Task<IActionResult> TaskCancelCompletedManagement(USP_Query_FormTasksByStatusResult param)
        {
            return Ok(await _issueInformService.TaskManagement(param, TaskManagementStatus.CancelCompleted));
        }


    }
}
