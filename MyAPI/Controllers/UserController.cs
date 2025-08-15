using Domain.Interfaces.Auth;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//using Services.Auth;
//using Services.CalculateScore;
using System.Security.Claims;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : Controller
    {
        //private readonly IUserRegisterService _userRegisterService;
        //private readonly IUserLoginService _userLoginService;
        private readonly IAuthenticationService _authenticationService;

        public UserController(IAuthenticationService authenticationService)
        {

            //_userRegisterService = userRegisterService;
            //_userLoginService = userLoginService;
            _authenticationService = authenticationService;
        }

        [HttpPost("register")]
        [AllowAnonymous]

        public async Task<IActionResult> Register([FromBody] UserRegisterViewModel request)
        {
            return Ok(await _authenticationService.UserRegisterAsync(request));
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel request)
        {
            return Ok(await _authenticationService.UserLoginAsync(request));
        }

       

        
        [HttpPost("check-access")]
        public async Task<IActionResult> CheckAccess([FromBody] CheckAccessRequestViewModel request)
        {
            return Ok(await _authenticationService.CheckAccessAsync(int.Parse(User.Claims.First(c => c.Type == ClaimTypes.Role).Value), request.PageUrl));
        }
    }
}
