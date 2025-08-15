using Domain.Models;
using Domain.ViewModels.CategoriesProduct;
using Domain.ViewModels.MappingCategoriesProduct;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.IssueProduct
{
    public interface IIssueProductService
    {
        public Task<IEnumerable<IssueCategories>> DeleteCategoriesItems(DeleteCategories req);
        public Task<IEnumerable<Product>> DeleteProductItems(DeleteProduct req);
        public Task<IEnumerable<IssueCategories>> InsertCategoriesItems(InsertCategories requried);
        public Task<IEnumerable<RelCategoriesProduct>> InsertMapCategoriesProduct(MappingCategoriesProductItem req);
        public Task<IEnumerable<Product>> InsertProductItem(InsertProduct request);
        public Task<IssueCategories> UpdateCategoriesItems(UpdateCategories req);
        public Task<Product> UpdateProductItems(UpdateProduct req);

        public Task<IEnumerable<IssueCategories>> GetCategoriesItems();
        public Task<IEnumerable<Product>> GetProductItems();

    }
}
