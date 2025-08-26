using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IIssueProductService
    {

        public Task<IssueCategories> SaveCategories(CategoriesParam param);

        public Task<Product> SaveProduct(ProductParam param);


        public Task<IEnumerable<IssueCategoriesViewModel>> GetCategoriesItems();
        
        





        public Task<CategoriesMapProductViewModel> LoadCategories(int id); 
        public Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param);
        public Task<QueryViewModel<USP_Query_CategoriesResult>> QueryCategoriesByText(DevExtremeParam<SearchCategoriesParam> param);
        public Task<QueryViewModel<USP_Query_IssueProductResult>> QueryProducts(DevExtremeParam<SearchProductParam> param); 
    }
}
