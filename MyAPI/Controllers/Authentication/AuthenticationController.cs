using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MyAPI.Controllers.Authentication
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuthenticationController : Controller
    {
       
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {

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
