using Domain.ViewModels;
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
