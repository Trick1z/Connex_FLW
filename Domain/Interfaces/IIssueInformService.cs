using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IIssueInformService
    {

        public Task<IEnumerable<AllProducts>> GetProductItemsMapByCategories(int id);


        public Task<List<TaskParamViewModel>> SaveTask(ValidateTaskParam param);

        //public Task<ValidatedTaskViewModel> EditValidateTaskItem(EditValidatedTaskViewModel param);

        public Task<IssueFormParam> SaveIssueForm(IssueFormParam param , string status);

    }
}
