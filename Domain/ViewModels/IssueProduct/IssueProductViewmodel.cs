using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.IssueProduct
{
    public class InsertCategories
    {

        public string IssueCategoriesName { get; set; }
        public bool IsProgramIssue { get; set; }


    }
    public class InsertProduct
    {

        public string ProductName { get; set; }


    }
    public class ProductItem
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }

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

    public class DeleteCategories
    {
        public int IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }
    }

    public class DeleteProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }



}
