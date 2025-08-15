using Domain.Models;
using Domain.ViewModels.MappingCategories;
using Domain.ViewModels.MappingCategoriesProduct;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IDropDownService
    {

        public Task<ProductWithSelectionDto> GetProductsWithSelection(int categoryId);
        public Task<CategoriesWithSelectionDto> GetUserMapCategoriesDropDown(int userId);

        public Task<IEnumerable<Role>> GetRoleItem();

        //public Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport();


        //public Task<IEnumerable<IssueCategories>> GetCategoriesItems();
        //public Task<IEnumerable<Product>> GetProductItems();



    }
 }
