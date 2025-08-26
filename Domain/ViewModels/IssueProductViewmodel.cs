using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class CategoriesParam
    {
        public int IssueCategoriesId { get; set; }
        public string? IssueCategoriesName { get; set; }
        public string? IssueCategoriesDescription { get; set; }

        public DateTime ModifiedTime { get; set; }

        public bool IsProgramIssue { get; set; }

        public string Action { get; set; }


    }

    public class ProductParam
    {
        public int ProductId{ get; set; }
        public string ProductName { get; set; }

        public DateTime ModifiedTime { get; set; }

        public string Action { get; set; }


    }


    public class SaveCategoriesProductParam
    {
        public int CategoriesId { get; set; }
        public List<int> product { get; set; }

        public DateTime? ModifiedTime { get; set; }
    }



   
    public class CategoriesMapProductViewModel
    {
        public int CategoriesId { get; set; }
        //public string Username { get; set; }

        public List<string> product { get; set; }
        public string ProductText { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }



    public class SearchCategoriesParam
    {

        public string Text { get; set; }

    }
    public class SearchProductParam
    {
        public string ProductName { get; set; }
        public string CategoriesText { get; set; }
        public bool IsMap { get; set; }

    }



    public class IssueCategoriesViewModel
    {
        public int IssueCategoriesId { get; set; }

        public string IssueCategoriesName { get; set; }

        public bool IsProgramIssue { get; set; }

        public string ModifiedByUserName { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime ModifiedTime { get; set; }

        public string IssueCategoriesDescription { get; set; }

    }




}
