using Braintree;
using Domain.Exceptions;
using Domain.Interfaces.Auth;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements.Auth
{
    public class AuthenticationService : IAuthenticationService
    {

        private readonly IConfiguration _config;
        private readonly MYGAMEContext _context;
        private readonly IPasswordHasher<object> _hasher;





        public AuthenticationService(IPasswordHasher<object> hasher,MYGAMEContext context, IConfiguration config)
        {
            _config = config;
            _context = context;
            _hasher = hasher;
        }

        public async Task<LoginResponseViewModel> UserLoginAsync(LoginViewModel request)
        {
            var user = await _context.User.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null) throw new Exception("User not found");

            var hasher = new PasswordHasher<object>();
            var result = hasher.VerifyHashedPassword(null, user.Password, request.Password);
            if (result != PasswordVerificationResult.Success)
                throw new Exception("Username or Password are incorrect");

            // Query access pages
            var accessPages = await (from pr in _context.Rel_Page_Role
                                     join p in _context.Pages on pr.PageId equals p.PageId
                                     where pr.RoleId == user.RoleId && !p.IsDeleted
                                     select p.PageUrl).ToListAsync();

            // สร้าง JWT โดยใช้ RoleId (int)
            var token = GenerateJwtToken(user.UserId, user.RoleId);

            return new LoginResponseViewModel
            {
                UserId = user.UserId,
                Username = user.Username,
                Role = user.Role.RoleName,  // สำหรับ display
                Token = token,
                AccessPages = accessPages
            };
        }

        public async Task<object> CheckAccessAsync(int roleId, string pageUrl)
        {
            var page = await _context.Pages
                .FirstOrDefaultAsync(p => p.PageUrl == pageUrl && !p.IsDeleted);

            if (page == null)
                return new { allowed = false };

            bool allowed = await _context.Rel_Page_Role
                .AnyAsync(pr => pr.RoleId == roleId && pr.PageId == page.PageId);

            return new { allowed };
        }

        private string GenerateJwtToken(int userId, int roleId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);



            var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
    new Claim(ClaimTypes.Role, roleId.ToString())
};




            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //End new2

        public bool IsNullOrEmptyString(LoginViewModel request, ValidateException validateException)
        {


            if (string.IsNullOrWhiteSpace(request.Username))
                validateException.Add("Username", "Field Username must not be empty");

            if (string.IsNullOrWhiteSpace(request.Password))
                validateException.Add("Password", "Field Password must not be empty");

            return false;
        }

        public async Task<User> IsUsernameInTable(LoginViewModel request, ValidateException validateException)
        {
            var isExists = await _context.User.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (isExists == null)
                validateException.Add("Username,Password", "Username or Password are in correct !");

            return isExists;
        }



        //public async Task<string> UserLoginAsync(LoginViewModel request)
        //{

        //    var validateException = new ValidateException();

        //    IsNullOrEmptySpace(request, validateException);

        //    User user = await IsUserInTable(request, validateException);

        //    validateException.Throw();

        //    var hasher = new PasswordHasher<object>();
        //    var result = hasher.VerifyHashedPassword(null, user.Password, request.Password);



        //    if (!(result == PasswordVerificationResult.Success))
        //        validateException.Add("Username,Password", "Username and password are incorrect.");
        //    //validateException.Throw();


        //    return "Login Successfuly";

        //}

        //public bool IsNullOrEmptySpace(LoginViewModel request, ValidateException validateException)
        //{

        //    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        //        validateException.Add("Username", "Field Username Much Not Empty");

        //    return false;

        //}

        //public async Task<User> IsUserInTable(LoginViewModel request, ValidateException validateException)
        //{


        //    var user = await _context.User
        //       .FirstOrDefaultAsync(u => u.Username == request.Username);

        //    if (user == null)
        //        validateException.Add("Username,Password", "Username and password are incorrect.");

        //    return user;

        //}




        //jwt
        public string GenerateToken(string username, string role)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        //register
        public async Task<string> UserRegisterAsync(UserRegisterViewModel request)
        {
            var validate = new ValidateException();
            IsNullOrEmptyString(request, validate);
            await IsUsernameInTable(request, validate);
            await IsPasswordLengthMinimum(request, validate);
            await ArePasswordsMatching(request, validate);


            validate.Throw();


            var hashed = HashPassword(request);

            //add new member 
            User data = CreateRegisterData(request, hashed);
            _context.User.Add(data);
            await _context.SaveChangesAsync();

            return "Register Successfully";

        }

        private static User CreateRegisterData(UserRegisterViewModel request, string hashed)
        {
            var dateNow = DateTime.Now;

            var member = new User();
            member.Username = request.Username;
            member.Password = hashed;
            member.RoleId = request.Role;
            member.CreatedTime = dateNow;
            member.ModifiedTime = dateNow;

            return member;
        }

        public async Task<bool> IsPasswordLengthMinimum(UserRegisterViewModel request, ValidateException validate)
        {
            if (request.Password.Length < 4)

                validate.Add("Password", "Password Length minimum Required 6");


            return true;
        }




        public bool IsNullOrEmptyString(UserRegisterViewModel request, ValidateException validate)
        {


            if (string.IsNullOrWhiteSpace(request.Username))
                validate.Add("Username", "Field Username are required");

            if (string.IsNullOrWhiteSpace(request.Password))
                validate.Add("Password", "Field Password are required");




            if (string.IsNullOrWhiteSpace(request.ConfirmPassword))
                validate.Add("ConfirmPassword", "Field ConfirmPassword are required");

            //if (string.IsNullOrWhiteSpace(request.Role))
            //    validate.Add("Role", "Field Role are required");

            if (request.Role <= 0)
            {
                validate.Add("Role", "Field Role is required and must be greater than 0");
            }


            return false;
        }

        public async Task<bool> IsUsernameInTable(UserRegisterViewModel request, ValidateException validate)
        {
            //var validat = new ValidateException();

            var isExists = await _context.User.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (isExists != null)
                validate.Add("Username", "This Username are already taken!");

            return false;
        }

        public async Task<bool> ArePasswordsMatching(UserRegisterViewModel request, ValidateException validate)
        {
            if (request.Password != request.ConfirmPassword)
                validate.Add("Password", "Password and ConfirmPassword do not match");


            return true;
        }

        public string HashPassword(UserRegisterViewModel request)
        {
            return _hasher.HashPassword(null, request.Password);
        }
    }
}
