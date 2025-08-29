using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IDashBoardService
    {
        public Task<QueryViewModel<USP_Query_WorkloadSummaryResult>> QueryUserWorkLoad(DevExtremeParam<SearchUsernameParam> param);

        public Task<QueryViewModel<USP_Query_OverallFormsStatusResult>> QueryOverallFormStatus();

        public Task<QueryViewModel<USP_Query_OverallFormsStatusDetailResult>> QueryOverallFormStatusDetail(DevExtremeParam<QueryOverallDetailParam> param);
        public  Task<QueryViewModel<USP_Query_LogEnquiryResult>> QueryLogEnquiry(DevExtremeParam<QueryLogEnquiryParam> param);

        public Task<IEnumerable<USP_Query_ChartResult>> ActionFormChart();
    }
}
