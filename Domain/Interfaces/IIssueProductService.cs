using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IIssueProductService
    {
        public Task<IEnumerable<IssueCategories>> DeleteCategoriesItems(DeleteCategories param); 
        public Task<IEnumerable<Product>> DeleteProductItems(DeleteProduct param); 

        public Task<IEnumerable<IssueCategories>> InsertCategories(InsertCategories param); 

        public Task<IEnumerable<Product>> InsertProduct(InsertProduct param); 

        public Task<IssueCategories> UpdateCategories(UpdateCategories param);
        public Task<Product> UpdateProduct(UpdateProduct param);
        public Task<CategoriesMapProductViewModel> LoadCategories(int id); 
        public Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param);
        public Task<QueryViewModel<USP_Query_CategoriesResult>> QueryCategoriesByText(DevExtremeParam<SearchCategoriesParam> param);
        public Task<QueryViewModel<USP_Query_IssueProductResult>> QueryProducts(DevExtremeParam<SearchProductParam> param); 
    }
}
