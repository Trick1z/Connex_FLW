using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    //public class LoadOptionsViewModel
    //{
    //}

    public class LiteLoadOptions
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public List<LiteSort>? Sort { get; set; }
    }

    public class LiteSort
    {
        public string Selector { get; set; } = default!;
        public bool Desc { get; set; }
    }

    public class DevExtremeParam<T> where T : class
    {
        public LiteLoadOptions LoadOption { get; set; }
        public T SearchCriteria { get; set; }
        public string SortField
        {
            get
            {
                return LoadOption.Sort?.FirstOrDefault()?.Selector;
            }
        }

        public string SortBy
        {
            get
            {
                return LoadOption.Sort?.FirstOrDefault()?.Desc == true ? "DESC" : "ASC";



            }

        }
    }

    public class QueryViewModel<T> where T : class
    {
        public List<T> Data { get; set; } = default!;
        public int TotalCount { get; set; }
    }

}








//public 


//public class SearchCategoriesSplitStringParam
//{

//    public string Text { get; set; }

//    public LiteLoadOptions LoadOption { get; set; }
//}



