using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.CategoriesProduct
{

    //product
    public class ProductItem
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }

    //categories




}
public class InsertCategories
{

    public string IssueCategoriesName { get; set; }
    public bool IsProgramIssue { get; set; }


}
public class InsertProduct
{

    public string ProductName { get; set; }


}