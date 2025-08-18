namespace Domain.ViewModels
{
    public class SaveUserCategoriesParam
    {
        public int UserId { get; set; }
        public List<int> Categories { get; set; }

        public DateTime? ModifiedTime { get; set; }
    }

    public class UserMapCategoriesViewModel
    {
        public int UserId { get; set; }
        //public string Username { get; set; }

        public List<string> Categories { get; set; }
        public string CategoriesText { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }

    public class UserWithRoleViewModel
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }


    public class SearchUsernameParam
    {

        public string Text { get; set; }

    }



}
