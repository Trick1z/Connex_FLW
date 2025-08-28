using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class DashBoardViewModel
    {
    }

    public class QueryOverallDetailParam
    { 
        public string DocNo { get; set; }
        public string Status { get; set; }
    }

    public class QueryLogEnquiryParam
    {
        public string? DocNo { get; set; }
        public int? FormId { get; set; }
        public int? TaskSeq { get; set; }
        public string? Username { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }



}
