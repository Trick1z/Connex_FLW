using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class MemberRegisterViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool IsVip { get; set; }
    }


    public class UserRegisterViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

        //public T UserData { get; set; }
        public string ConfirmPassword { get; set; }

        public int Role { get; set; }
    }

    public class LoginViewModel
    {

        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponseViewModel
    {
        public string Username { get; set; }  
        public string Token { get; set; }     
    }



}
