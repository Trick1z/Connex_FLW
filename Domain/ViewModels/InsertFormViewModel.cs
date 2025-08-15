using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.ViewModels
{
    public class InsertFormViewModel
    {
        public int UserId { get; set; }
        public string Description { get; set; }
        public List<FormTaskViewModel> FormTask { get; set; }


    }

    public class FormTaskViewModel { 
        public string TaskName { get; set; }
        public string Category { get; set; }
        public int FormTaskId{ get; set; }
    }
}
