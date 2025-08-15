using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class ProductWithSelectionDto
    {
        public IEnumerable<AllProducts> AllProducts { get; set; }
        //public List<int> SelectedProductIds { get; set; }
        public IEnumerable<AllProducts> SelectedProduct { get; set; }
    }

    public class CategoriesWithSelectedItem
    {
        public IEnumerable<AllCategories> AllCategories { get; set; }
        //public List<int> SelectedCategories { get; set; }
        public IEnumerable<AllCategories> SelectedCategories { get; set; }

    }



    public class AllCategories {
        public int IssueCategoriesId { get; set; }
        public string IssueCategoriesName { get; set; }

    }
    public class AllProducts {
        public int ProductId { get; set; }
        public string ProductName { get; set; }

    }






}
