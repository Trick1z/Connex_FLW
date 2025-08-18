using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
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

        public DateTime? ModifiedTime { get; set; }
    }

    public class UpdateProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public DateTime? ModifiedTime { get; set; }
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

    public class SaveCategoriesProductParam
    {
        public int CategoriesId { get; set; }
        public List<int> product { get; set; }

        public DateTime? ModifiedTime { get; set; }
    }






    //out
    public class MappingCategoriesProductItem
    {
        public int CategoriesId { get; set; }
        public List<int> ProductsId { get; set; }
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

    }




}
