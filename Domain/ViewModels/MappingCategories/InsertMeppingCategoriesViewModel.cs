using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.MappingCategories
{
    public class MappingItem
    {
        public int UserId { get; set; }
        public int IssueCategoriesId { get; set; }
    }
    public class UnMappingItem
    {
        public int UserId { get; set; }
        public int IssueCategoriesId { get; set; }
        public DateTime CreateTime { get; set; }
    }
    public class ServiceResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class MappingUserCategoriesItem
    {
        public int UserId { get; set; }
        public List<int> CategoriesId { get; set; }
    }


}
