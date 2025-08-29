using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public class Constance
    {
        public const int AdminId = 1;


    }

    public class IssueCategoriesId
    {
        public const int Borrow = 1;
        public const int Repair = 2;
        public const int Progream = 3;
    }

    public class QueryFormStatus{
        public const string Open = "Open";
        public const string Closed = "Closed";
    }

    public class TaskManagementStatus
    {
        public const string Assigned = "Assigned";
        public const string Rejected = "Rejected";
        public const string CancelAssigned = "CancelAssigned";
        public const string Done = "Done";
        public const string CancelCompleted = "CancelCompleted";
    }

    public class DocumentStatus
    {
        public const string Draft = "Draft";
        public const string Submit = "Submit";
        public const string Done = "Done";
        public const string InProgress = "InProgress";
        public const string Closed = "Closed";
    }
    public class IssueTaskStatus
    {
        public const string Assigned = "Assigned";
        public const string CancelAssigned = "CancelAssigned";
        public const string CancelCompleted = "CancelCompleted";
        public const string CancelRejected = "CancelRejected";
        public const string Done = "Done";
        public const string Draft = "Draft";
        public const string Rejected = "Rejected";
        public const string Submit = "Submit";
    }

    public class ValidateKey
    {
        public const string Username = "username";
        public const string Password = "password";
        public const string ConfirmPassword = "confirmPassword";
        public const string Role = "role";
        public const string Categories = "categories";
        public const string Product = "product";
        public const string Time = "time";
        public const string Task = "task";
        public const string Form = "form";
        public const string User = "user";
        public const string Date = "date";
        public const string Location = "location";
        public const string Quantity = "quantity";
    }

    public class ValidateMsg
    {
        public const string UserPasswordIncorrect = "ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด";
        public const string UsernameRequired = "กรุณากรอก ชื่อผู้ใช้";
        public const string UserTaken = "ชื่อผู้ใช้ มีในระบบแล้ว";
        public const string PasswordRequired = "กรุณากรอก รหัสผ่าน";
        public const string ConfirmPasswordRequired = "กรุณากรอก ยืนยันรหัสผ่าน";
        public const string PasswordNotMatch = "รหัสผ่านไม่ตรงกัน";
        public const string RoleRequired = "กรุณาเลือก Role";
        public const string UsernameMinLength = "ชื่อผู้ใช้ ต้องมีความยาว 6 ตัวขึ้นไป";
        public const string PasswordMinLength = "รหัสผ่าน ต้องมีความยาว 6 ตัวขึ้นไป";


        public const string NotFound = "ไม่พบข้อมูล";
        public const string DataAllReadyUsed = "ข้อมูลกำลังถูกใช้งาน";
        public const string PleaseFillAllInfo = "กรุณาใส่ข้อมูลให้ครบถ้วน";
        public const string DataAlreadyExists = "มีข้อมูลในระบบแล้ว";
        public const string NoChangesMade = "คุณไม่ได้เปลี่ยนข้อมูล";
        public const string TimeNoMatch = "กรุณารีเฟรชหน้านีแล้วลองใหม่";
        public const string EmptyTaskList = "กรุณาเพิ่มปัญหาที่ต้องการแจ้ง";
        public const string AllreadyAssigned = "มีคนรับงานนี้เรียบร้อยแล้ว";
        public const string DupicatedItem = "คุณเพิ่มข้อมูลนี้แล้ว";

        public const string CategoriesRequired = "กรุณเลือก category";
        public const string ProductRequired = "กรุณเลือก product";
        public const string DateRequired = "กรุณากรอกวันที่";
        public const string LocationRequired = "กรุณากรอกสถานที่";
        public const string QuantityRequired = "กรูณากรอกจำนวน";

        public const string SupportAreWorking = "มีคนกำลังทำงานนี้ไม่สามารถลบได้";

        //public const string NotFround = "ไม่พบข้อมูล";


    }
    public class DbRef
    {
        public const string Product = "product";
        public const string Categories = "categories";
    }

    public class LogActionRef {
        public const string AddProduct = "Added Product";
        public const string EditProduct = "Edited Product";
        public const string DeactiveProduct = "Deactivated Product";

        public const string AddCategories = "Added Categories";
        public const string EditCategories = "Edited Categories";
        public const string DeactiveCategories = "Deactivated Categories";

    }

    public class LogTaskActionRef 
    {
        public const string DeleteTask = "Deleted Task";
        public const string EditTask = "Edited Task";
        public const string AddTask = "Added Task";

    }

    public class LogFormActionRef
    {
        public const string TaskEdited = "Task Edited";
        public const string Created = "Created Form";
        public const string AddTask = "Added Task";
        public const string Closed = "Closed Task";

    }
}
