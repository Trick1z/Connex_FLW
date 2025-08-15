using Domain.Models;
using Domain.ViewModels;
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
        public Task<CategoriesWithSelectedItem> GetUserMapCategoriesDropDown(int userId);

        public Task<IEnumerable<Role>> GetRoleItem();


    }
 }
