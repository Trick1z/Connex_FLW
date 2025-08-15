using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.CategoriesProduct
{
    public class UpdateCategories
    {
        public int IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }
        public bool IsProgramIssue { get; set; }
    }

    public class UpdateProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }



    //public class DeleteProduct
    //{
    //    public int ProductId { get; set; }
    //    public string ProductName { get; set; }
    //}
}
