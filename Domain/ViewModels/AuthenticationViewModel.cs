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
        //public int UserId { get; set; }             // ไอดีของผู้ใช้
        public string Username { get; set; }  // ชื่อผู้ใช้
        //public string Role { get; set; }      // ชื่อ role
        public string Token { get; set; }     // JWT token
        //public List<string> AccessPages { get; set; } // รายการหน้าที่เข้าถึงได้
    }



}
