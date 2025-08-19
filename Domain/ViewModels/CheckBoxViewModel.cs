using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public  class CheckBoxViewModel
    {
        public int Id { get; set; }

        public string Text { get; set; }
        public bool Selected { get; set; }
    }

}
