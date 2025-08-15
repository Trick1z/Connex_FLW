using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.MappingCategoriesProduct
{
    public class MappingCategoriesProductItem
    {
        public int CategoriesId { get; set; }
        public List<int> ProductsId { get; set; }
    }

    //public class ProductItemInMapping { 
    //public int ProductId { get; set; }
    //}
}
