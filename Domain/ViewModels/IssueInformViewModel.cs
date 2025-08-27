using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.ViewModels
{

    // =========================
    // Param models (Front-end -> Back-end)
    // =========================
    public class IssueFormParam
    {
        public int FormId { get; set; }
        public string DocNo { get; set; }
        public string StatusCode { get; set; }

        public int? CreatedBy { get; set; }
        public DateTime? CreatedTime { get; set; }

        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedTime { get; set; }

        public List<TaskParamViewModel> TaskItems { get; set; } = new();
    }

    public class TaskParamViewModel
    {
        public Guid? Id { get; set; }
        public int FormId { get; set; }
        public int? TaskSeq { get; set; }
        public int? IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public string Location { get; set; }
        public bool CanEdit { get; set; }
        public DateTime? DetectedTime { get; set; }
    }

    public class ValidateTaskParam
    {
        public List<TaskParamViewModel> DataSource { get; set; }
        public TaskParamViewModel Data { get; set; }
    }

    // =========================
    // DTO models (Back-end -> Front-end)
    // =========================
    public class IssueFormDto
    {
        public int FormId { get; set; }
        public string DocNo { get; set; }
        public string StatusCode { get; set; }

        public bool CanEditDelete { get; set; }
        public string Progressing { get; set; }           // เช่น "3/5"
        public string ModifiedByName{ get; set; }      
        public DateTime? ModifiedTime { get; set; }

        public List<TaskItemDto> TaskItems { get; set; } = new();
    }

    public class TaskItemDto
    {
        public Guid Id { get; set; }

        public int? IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public string Location { get; set; }
        public string StatusCode { get; set; }

        public DateTime? DetectedTime { get; set; }
    }


    //public class TaskParamViewModel

    //{

    //    public Guid? Id { get; set; }
    //    public int? IssueCategoriesId { get; set; }
    //    public string IssueCategoriesName { get; set; }
    //    public int? ProductId { get; set; }

    //    public string ProductName { get; set; }
    //    public int? Quantity { get; set; }
    //    public string? Location { get; set; }
    //    public DateTime? DetectedTime { get; set; }


    //}

    //public class ValidateTaskParam
    //{
    //    public List<TaskParamViewModel> DataSource { get; set; }
    //    public TaskParamViewModel Data { get; set; }
    //}

    //public class IssueFormParam
    //{
    //    public string DocNo { get; set; }
    //    public int FormId { get; set; }
    //    public string StatusCode { get; set; }
    //    public int? CreatedBy { get; set; }
    //    public DateTime? CreatedTime { get; set; }
    //    public int? ModifiedBy { get; set; }
    //    public DateTime? ModifiedTime { get; set; }
    //    public List<TaskParamViewModel> TaskItems { get; set; } = new();
    //}


    //public class IssueFormDto
    //{
    //    public int FormId { get; set; }
    //    public string DocNo { get; set; }
    //    public string StatusCode { get; set; }
    //    public string Progressing { get; set; }
    //    public string ModifiedBy { get; set; }
    //    public DateTime? ModifiedTime { get; set; }
    //    public List<TaskItemDto> TaskItems { get; set; } = new();
    //}

    //public class TaskItemDto
    //{
    //    public Guid Id { get; set; }
    //    public int? IssueCategoriesId { get; set; }
    //    public string IssueCategoriesName { get; set; }
    //    public int? ProductId { get; set; }
    //    public string ProductName { get; set; }
    //    public int? Quantity { get; set; }
    //    public string Location { get; set; }
    //    public DateTime? DetectedTime { get; set; }
    //}


}