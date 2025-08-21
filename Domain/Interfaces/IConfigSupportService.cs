using Domain.Models;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IConfigSupportService
    {
        public Task<Rel_User_Categories> SaveUserCategoriesMapping(SaveUserCategoriesParam param);

        public Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport();

        public Task<UserMapCategoriesViewModel> LoadUser(int id);

        public Task<QueryViewModel<USP_Query_NameResult>> QueryUser(DevExtremeParam<SearchUsernameParam> param);
    }
}
