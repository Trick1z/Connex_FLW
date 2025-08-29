using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DashBoard
{
    public class DashBoardService : IDashBoardService
    {

        private readonly MYGAMEContext _context;


        public DashBoardService(MYGAMEContext context)
        {
            _context = context;

        }

        public async Task<QueryViewModel<USP_Query_WorkloadSummaryResult>> QueryUserWorkLoad(DevExtremeParam<SearchUsernameParam> param)
        {
            var result = await _context.Procedures.USP_Query_WorkloadSummaryAsync(param.SearchCriteria.Text,
                param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);

            var data = new QueryViewModel<USP_Query_WorkloadSummaryResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;
            return data;
        }

        public async Task<QueryViewModel<USP_Query_OverallFormsStatusResult>> QueryOverallFormStatus()
        {
            var result = await _context.Procedures.USP_Query_OverallFormsStatusAsync();
            var data = new QueryViewModel<USP_Query_OverallFormsStatusResult>();

            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;
            return data;

        }

        public async Task<QueryViewModel<USP_Query_OverallFormsStatusDetailResult>> QueryOverallFormStatusDetail(DevExtremeParam<QueryOverallDetailParam> param)
        {

            var result = await _context.Procedures.USP_Query_OverallFormsStatusDetailAsync(null, param.SearchCriteria.Status, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            var data = new QueryViewModel<USP_Query_OverallFormsStatusDetailResult>();

            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;

            return data;


        }

        public async Task<QueryViewModel<USP_Query_LogEnquiryResult>> QueryLogEnquiry(DevExtremeParam<QueryLogEnquiryParam> param)
        {

            var result = await _context.Procedures.USP_Query_LogEnquiryAsync(param.SearchCriteria.DocNo , param.SearchCriteria.FormId , param.SearchCriteria.Username 
                , param.SearchCriteria.TaskSeq, param.SearchCriteria.StartDate , param.SearchCriteria.EndDate, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            var data = new QueryViewModel<USP_Query_LogEnquiryResult>();

            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;

            return data;

        }

        public async Task<IEnumerable<USP_Query_ChartResult>> ActionFormChart()
        {
            var result = await _context.Procedures.USP_Query_ChartAsync();
            return result;
        }
    }
}
