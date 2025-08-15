using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.MappingCategories
{
    public class CategoriesWithSelectionDto
    {
        public IEnumerable<IssueCategories> AllProducts { get; set; }
        public List<int> SelectedCategories{ get; set; }
    }
}
