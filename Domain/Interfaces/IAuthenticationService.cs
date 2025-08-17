using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IAuthenticationService
    {
        public Task<LoginResponseViewModel> UserLoginAsync(LoginViewModel request);
        public Task<object> CheckAccessAsync(int roleId, string pageUrl);
        public Task<bool> UserRegisterAsync(UserRegisterViewModel request);

    }
}
