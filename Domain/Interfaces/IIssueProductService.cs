using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IIssueProductService
    {
        public Task<IEnumerable<IssueCategories>> DeleteCategoriesItems(DeleteCategories param);
        public Task<IEnumerable<Product>> DeleteProductItems(DeleteProduct param);
        public Task<IEnumerable<IssueCategories>> InsertCategoriesItems(InsertCategories requried);
        //public Task<IEnumerable<RelCategoriesProduct>> InsertMapCategoriesProduct(MappingCategoriesProductItem req);
        public Task<IEnumerable<Product>> InsertProductItem(InsertProduct param );
        public Task<IssueCategories> UpdateCategoriesItems(UpdateCategories req);
        public Task<Product> UpdateProductItems(UpdateProduct param);

        public Task<IEnumerable<IssueCategories>> GetCategoriesItems();
        public Task<IEnumerable<Product>> GetProductItems();

        public Task<CategoriesMapProductViewModel> LoadCategories(int id);

        public Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param);

    }
}
