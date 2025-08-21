using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.ViewModels
{
    public class TaskParamViewModel
        
    {

        public Guid? Id { get; set; }
        public int? IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }
        public int? ProductId { get; set; }

        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public string? Location { get; set; }
        public DateTime? DetectedTime { get; set; }


    }

    public class ValidateTaskParam
    {
        public List<TaskParamViewModel> DataSource { get; set; }
        public TaskParamViewModel Data { get; set; }
    }

    //public class IssueFormParam
    //{
    //    public string DocNo { get; set; }
    //    public int FormId { get; set; }
    //    public string StatusCode { get; set; }
    //    public List<TaskParamViewModel> TaskItems { get; set; }


    //}

    public class IssueFormParam
    {
        public string DocNo { get; set; }
        public int FormId { get; set; }
        public string StatusCode { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime ?CreatedTime { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedTime { get; set; }
        public List<TaskParamViewModel> TaskItems { get; set; } = new();
    }

    //public class IssueInformWaitTask { 
    //    public IssueForm IssueForm { get; set; }
    //    public List<IssueFormTask> TaskItems { get; set; }


    //}


}
