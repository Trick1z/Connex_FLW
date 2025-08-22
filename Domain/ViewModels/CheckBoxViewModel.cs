using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public  class CheckBoxViewModel<T> 
    {
        public T Value { get; set; }

        public string Text { get; set; }
        public bool Selected { get; set; }
    }


    //public  class CheckBoxCodeViewModel
    //{
    //    public int Id { get; set; }

    //    public string Text { get; set; }
    //    public bool Selected { get; set; }
    //}

}
