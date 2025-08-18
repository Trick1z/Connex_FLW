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

        public Task<Rel_User_Categories> SaveUserCategories(SaveUserCategoriesParam req);
        public Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport();
        public Task<UserMapCategoriesViewModel> LoadUser(int id);

        public Task<QueryViewModel<USP_Query_NameResult>> QueryUserByRole(DevExtremeParam<SearchUsernameParam> loadParam);
    }
}
