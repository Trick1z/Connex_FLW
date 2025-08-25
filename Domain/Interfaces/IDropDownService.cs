using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IDropDownService
    {
        public Task<List<DropDownViewModel>> GetCategoriesProductsDropDown();

        public Task<List<DropDownViewModel>> GetUserMapCategoriesDropDown();

        public Task<IEnumerable<Role>> GetRoleItem();

        public Task<IEnumerable<IssueCategories>> GetCategoriesDropDownItems(); 
        public Task<IEnumerable<Product>> GetProductsDropDownItems();
    }
}
