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
    }
}
