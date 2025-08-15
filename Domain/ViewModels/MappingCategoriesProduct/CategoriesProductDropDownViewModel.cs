using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.MappingCategoriesProduct
{
    public class ProductWithSelectionDto
    {
        public IEnumerable<Product> AllProducts { get; set; }
        public List<int> SelectedProductIds { get; set; }
    }

}
