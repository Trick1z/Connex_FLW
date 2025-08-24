using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IIssueInformService
    {
        public Task<IEnumerable<AllProducts>> GetProductItemsMapByCategories(int id); 

        public Task<List<TaskParamViewModel>> ValidateTaskItemsAsync(ValidateTaskParam param);

        public Task<List<TaskParamViewModel>> DeleteTask(ValidateTaskParam param); 

       
        public Task<IssueFormParam> SaveIssueForm(IssueFormParam param, int formId, string status);
        public Task<bool> CloseForms(USP_Query_IssueFormsResult param);

        public Task<IssueFormParam> GetIssueFormById(int formId);

        //public Task<List<IssueFormDto>> GetUnsuccessForms(); 

        public Task<QueryViewModel<USP_Query_IssueFormsResult>> GetForms(DevExtremeParam<QueryUserForm> param , string formStatus);

        public Task<QueryViewModel<USP_Query_FormTaskDetailResult>> GetFormsDetail(DevExtremeParam<QueryUserFormDetail> param);

        //public Task<List<IssueFormDto>> GetSuccessForms();

        public Task<QueryViewModel<USP_Query_FormTasksByStatusResult>> QueryFormUser(DevExtremeParam<JobForUser> param);
        public Task<bool> ListTaskManagement(List<USP_Query_FormTasksByStatusResult> param, string status);
        public Task<bool> TaskManagement(USP_Query_FormTasksByStatusResult param, string status);
    }
}
