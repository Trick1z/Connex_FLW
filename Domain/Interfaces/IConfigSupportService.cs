using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IConfigSupportService
    {

        public Task<Rel_User_Categories> InsertMapUserCategories(MappingUserCategoriesItem req);
        public Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport();



    }
}
