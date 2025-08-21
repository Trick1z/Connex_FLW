using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class IssueInformService : IIssueInformService
    {

        private readonly MYGAMEContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenNumberService _genNumberService;
        private readonly IClaimsService _claimsService;


        public IssueInformService(MYGAMEContext context, IHttpContextAccessor contextAccessor, IGenNumberService genNumberService, IClaimsService claimsService)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            _genNumberService = genNumberService;
            _claimsService = claimsService;
        }

        //service start here 

        public async Task<List<IssueFormDto>> GetSubmittedOrInProgressForms()
        {
            // 1. ดึง IssueForm + TaskItems + Product + Category
            var forms = await _context.IssueForm
                .Where(f => f.SystemStatusCode != "Completed" || f.SystemStatusCode != "Rejected" )
                .Include(f => f.IssueFormTask)
                    .ThenInclude(t => t.Rel_Categories_Product)
                        .ThenInclude(rcp => rcp.Product)
                .Include(f => f.IssueFormTask)
                    .ThenInclude(t => t.Rel_Categories_Product)
                        .ThenInclude(rcp => rcp.IssueCategories)
                .ToListAsync();

            // 2. ดึง UserName สำหรับ CreatedBy / ModifiedBy
            var userIds = forms
                .SelectMany(f => new[] { f.CreatedBy, f.ModifiedBy })
                .Where(x => x.HasValue)
                .Select(x => x.Value)
                .Distinct()
                .ToList();

            var users = await _context.User
                .Where(u => userIds.Contains(u.UserId))
                .ToDictionaryAsync(u => u.UserId, u => u.Username);

            // 3. Map EF Models -> DTO
            var result = forms.Select(f =>
            {
                var taskItems = f.IssueFormTask.Select(t => new TaskItemDto
                {
                    Id = Guid.NewGuid(),
                    IssueCategoriesId = t.Rel_Categories_Product?.IssueCategoriesId,
                    IssueCategoriesName = t.Rel_Categories_Product?.IssueCategories?.IssueCategoriesName ?? "",
                    ProductId = t.Rel_Categories_Product?.ProductId,
                    ProductName = t.Rel_Categories_Product?.Product?.ProductName ?? "",
                    StatusCode = t.SystemStatusCode ,
                    Quantity = t.Br_Qty,
                    Location = t.Rp_Location,
                    DetectedTime = t.DetectedTime
                }).ToList();

                // 4. คำนวณ Progressing (ตัวอย่าง: count task ที่ approve/reject ต่อทั้งหมด)
                int total = taskItems.Count;
                //int completed = f.IssueFormTask.Count(t => f.SystemStatusCode != "Completed" || f.SystemStatusCode != "Rejected" || f.SystemStatusCode != "Draft");
                int completed = f.IssueFormTask.Count(t => t.SystemStatusCode == "Approve" || t.SystemStatusCode == "Reject" 
                                                   || t.SystemStatusCode == "InProgress" || t.SystemStatusCode == "Completed");
                bool editDeleteState = true;
                if (completed != 0)
                {
                    editDeleteState = false;
                }

                return new IssueFormDto
                {
                    FormId = f.FormId,
                    DocNo = f.DocNo,
                    CanEditDelete = editDeleteState,
                    StatusCode = f.SystemStatusCode,
                    Progressing = $"{completed}/{total}",
                    ModifiedByName = f.ModifiedBy.HasValue && users.ContainsKey(f.ModifiedBy.Value) ? users[f.ModifiedBy.Value] : null,
                    ModifiedTime = f.ModifiedTime,
                    TaskItems = taskItems
                };
            }).ToList();

            return result;
        }





        public async Task<IssueFormParam> GetIssueFormById(int formId)
        {
            var dbIssueForm = await _context.IssueForm
                .Include(f => f.IssueFormTask)
                    .ThenInclude(t => t.Rel_Categories_Product).ThenInclude(p => p.Product)
                    .ThenInclude(t => t.Rel_Categories_Product).ThenInclude(c => c.IssueCategories)  // join table Product + Category
                .FirstOrDefaultAsync(f => f.FormId == formId);

            if (dbIssueForm == null) return null;

            var result = new IssueFormParam
            {
                FormId = dbIssueForm.FormId,
                DocNo = dbIssueForm.DocNo,
                StatusCode = dbIssueForm.SystemStatusCode,
                CreatedBy = dbIssueForm.CreatedBy,
                CreatedTime = dbIssueForm.CreatedTime,
                ModifiedBy = dbIssueForm.ModifiedBy,
                ModifiedTime = dbIssueForm.ModifiedTime,
                TaskItems = dbIssueForm.IssueFormTask.Select(t => new TaskParamViewModel
                {
                    Id = Guid.NewGuid(),
                    IssueCategoriesId = t.Rel_Categories_Product?.IssueCategoriesId,
                    IssueCategoriesName = t.Rel_Categories_Product?.IssueCategories?.IssueCategoriesName ?? "",
                    ProductId = t.Rel_Categories_Product?.ProductId,
                    ProductName = t.Rel_Categories_Product?.Product?.ProductName ?? "",
                    Quantity = t.Br_Qty,
                    Location = t.Rp_Location,
                    DetectedTime = t.DetectedTime
                }).ToList()
            };

            return result;
        }






        public async Task<IEnumerable<AllProducts>> GetProductItemsMapByCategories(int id)
        {
            var products = await _context.Rel_Categories_Product
                .Where(c => c.IssueCategoriesId == id)
                .Include(c => c.Product)
                .Select(c => new AllProducts
                {
                    ProductId = c.Product.ProductId,
                    ProductName = c.Product.ProductName,

                })
                .ToListAsync();


            return products;
        }

        public async Task<IssueFormParam> SaveIssueForm(IssueFormParam param, int formId, string status)
        {
            var userId = _claimsService.GetCurrentUserId();
            var dateNow = DateTime.Now;
            var validate = new ValidateException();

            // Validate TaskItems
            if (param.TaskItems.Count == 0)
            {
                validate.Add("Task", "No Task Added");
                validate.Throw();
            }

            foreach (var item in param.TaskItems)
            {
                validate = ValidateTaskItem(item, validate);
            }
            validate.Throw();

            if (param.FormId == 0)
            {
                // -----------------
                // CREATE
                // -----------------
                var genDocNumber = await _genNumberService.GenDocNo("yymmm");
                var dbIssueForm = new IssueForm
                {
                    DocNo = genDocNumber,
                    SystemStatusCode = status,
                    CreatedBy = userId,
                    CreatedTime = dateNow,
                    ModifiedTime = dateNow
                };

                int taskSeq = 1;
                foreach (var taskItem in param.TaskItems)
                {
                    dbIssueForm.IssueFormTask.Add(new IssueFormTask
                    {
                        TaskSeq = taskSeq,
                        IssueCategoriesId = taskItem.IssueCategoriesId,
                        ProductId = taskItem.ProductId,
                        SystemStatusCode = status,
                        CreatedTime = dateNow,
                        ModifiedTime = dateNow,
                        Br_Qty = taskItem.IssueCategoriesId == 1 ? taskItem.Quantity : null,
                        Rp_Location = taskItem.IssueCategoriesId == 2 ? taskItem.Location : null,
                        DetectedTime = (taskItem.IssueCategoriesId == 2 || taskItem.IssueCategoriesId == 3) ? taskItem.DetectedTime : null,
                        SubmitTime = status == "Submit" ? dateNow : null
                    });
                    taskSeq++;
                }

                _context.IssueForm.Add(dbIssueForm);
                await _context.SaveChangesAsync();

                param.FormId = dbIssueForm.FormId;
                LogSaved(param, dbIssueForm, "User Added Form", userId, dateNow);
            }
            else
            {
                // -----------------
                // EDIT
                // -----------------
                var dbIssueForm = await _context.IssueForm
                    .Include(f => f.IssueFormTask)
                    .FirstOrDefaultAsync(f => f.FormId == param.FormId);

                CheckDbIssueFormFound(validate, dbIssueForm);

                dbIssueForm.SystemStatusCode = status;
                dbIssueForm.ModifiedTime = dateNow;
                dbIssueForm.ModifiedBy = userId;

                // -----------------
                // DELETE tasks not in DataSource
                // -----------------
                var dsTaskSeqs = param.TaskItems.Select(t => t.TaskSeq).ToList();
                var toDelete = dbIssueForm.IssueFormTask
                    .Where(dbTask => !dsTaskSeqs.Contains(dbTask.TaskSeq))
                    .ToList();

                if (toDelete.Any())
                {
                    _context.IssueFormTask.RemoveRange(toDelete);
                }

                // -----------------
                // UPDATE or ADD tasks
                // -----------------
                foreach (var dsTask in param.TaskItems)
                {
                    var dbTask = dbIssueForm.IssueFormTask
                        .FirstOrDefault(t => t.TaskSeq == dsTask.TaskSeq);

                    if (dbTask == null)
                    {
                        int maxTaskSeq = dbIssueForm.IssueFormTask.Any() ? dbIssueForm.IssueFormTask.Max(t => t.TaskSeq) : 0;
                        dbTask = new IssueFormTask
                        {
                            FormId = dbIssueForm.FormId,
                            TaskSeq = maxTaskSeq + 1,
                            CreatedTime = dateNow
                        };
                        dbIssueForm.IssueFormTask.Add(dbTask);
                    }

                    dbTask.IssueCategoriesId = dsTask.IssueCategoriesId;
                    dbTask.ProductId = dsTask.ProductId;
                    dbTask.SystemStatusCode = status;
                    dbTask.ModifiedTime = dateNow;
                    dbTask.Br_Qty = dsTask.IssueCategoriesId == 1 ? dsTask.Quantity : null;
                    dbTask.Rp_Location = dsTask.IssueCategoriesId == 2 ? dsTask.Location : null;
                    dbTask.DetectedTime = (dsTask.IssueCategoriesId == 2 || dsTask.IssueCategoriesId == 3) ? dsTask.DetectedTime : null;
                    dbTask.SubmitTime = status == "Submit" ? dateNow : null;
                }

                await _context.SaveChangesAsync();
                LogSaved(param, dbIssueForm, "User Edited Form", userId, dateNow);
            }

            return param;
        }


        //public async Task<IssueFormParam> SaveIssueForm(IssueFormParam param,int formId, string status)
        //{
        //    var userId = _claimsService.GetCurrentUserId();
        //    var dateNow = DateTime.Now;
        //    int lastestId = 0;
        //    var validate = new ValidateException();


        //    if (param.FormId == 0)
        //    {

        //        if (param.TaskItems.Count() == 0)
        //        {

        //            validate.Add("Task", "No Task Added");
        //            validate.Throw();

        //        }

        //        // Validate TaskItems
        //        foreach (var item in param.TaskItems)
        //        {
        //            validate = ValidateTaskItem(item, validate);
        //        }

        //        validate.Throw();



        //        //if (param.FormId == 0)
        //        //{
        //            // CREATE
        //            var genDocNumber = await _genNumberService.GenDocNo("yymmm");
        //            var dbIssueForm = new IssueForm
        //            {
        //                DocNo = genDocNumber,
        //                SystemStatusCode = status,
        //                CreatedBy = userId,
        //                CreatedTime = dateNow,
        //                ModifiedTime = dateNow
        //            };

        //            int taskSeq = 1;
        //            foreach (var taskItem in param.TaskItems)
        //            {
        //                var dbIssueFormTask = new IssueFormTask
        //                {
        //                    TaskSeq = taskSeq,
        //                    IssueCategoriesId = taskItem.IssueCategoriesId,
        //                    ProductId = taskItem.ProductId,
        //                    SystemStatusCode = status,
        //                    CreatedTime = dateNow,
        //                    ModifiedTime = dateNow,
        //                    Br_Qty = taskItem.IssueCategoriesId == 1 ? taskItem.Quantity : null,
        //                    Rp_Location = taskItem.IssueCategoriesId == 2 ? taskItem.Location : null,
        //                    DetectedTime = (taskItem.IssueCategoriesId == 2 || taskItem.IssueCategoriesId == 3) ? taskItem.DetectedTime : null,
        //                    SubmitTime = status == "Submit" ? dateNow : null
        //                };

        //                dbIssueForm.IssueFormTask.Add(dbIssueFormTask);
        //                taskSeq++;
        //            }

        //            _context.IssueForm.Add(dbIssueForm);
        //            await _context.SaveChangesAsync();

        //            lastestId = dbIssueForm.FormId;
        //            LogSaved(param, dbIssueForm, "User Added Form", userId, dateNow);
        //        //}
        //        //else
        //        //{


        //        //    // EDIT
        //        //    var dbIssueForm = await _context.IssueForm
        //        //        .Include(x => x.IssueFormTask)
        //        //        .FirstOrDefaultAsync(x => x.FormId == param.FormId);

        //        //    CheckDbIssueFormFound(validate, dbIssueForm);

        //        //    dbIssueForm.SystemStatusCode = status;
        //        //    dbIssueForm.ModifiedTime = dateNow;
        //        //    dbIssueForm.ModifiedBy = userId;

        //        //    int taskSeq = 1;
        //        //    foreach (var taskItem in param.TaskItems)
        //        //    {
        //        //        var dbTask = dbIssueForm.IssueFormTask.FirstOrDefault(t => t.TaskSeq == taskSeq);

        //        //        if (dbTask == null)
        //        //        {
        //        //            dbTask = new IssueFormTask
        //        //            {
        //        //                TaskSeq = taskSeq,
        //        //                CreatedTime = dateNow
        //        //            };
        //        //            dbIssueForm.IssueFormTask.Add(dbTask);
        //        //        }

        //        //        dbTask.IssueCategoriesId = taskItem.IssueCategoriesId;
        //        //        dbTask.ProductId = taskItem.ProductId;
        //        //        dbTask.SystemStatusCode = status;
        //        //        dbTask.ModifiedTime = dateNow;
        //        //        dbTask.Br_Qty = taskItem.IssueCategoriesId == 1 ? taskItem.Quantity : null;
        //        //        dbTask.Rp_Location = taskItem.IssueCategoriesId == 2 ? taskItem.Location : null;
        //        //        dbTask.DetectedTime = (taskItem.IssueCategoriesId == 2 || taskItem.IssueCategoriesId == 3) ? taskItem.DetectedTime : null;
        //        //        dbTask.SubmitTime = status == "Submit" ? dateNow : null;

        //        //        taskSeq++;
        //        //    }

        //        //    await _context.SaveChangesAsync();
        //        //    lastestId = param.FormId;

        //        //    LogSaved(param, dbIssueForm, "User Edited Form", userId, dateNow);
        //        //}

        //        //param.FormId = lastestId;
        //        //return param;
        //    }
        //    else
        //    {
        //        // EDIT MODE
        //        var dbIssueForm = await _context.IssueForm
        //            .Include(x => x.IssueFormTask)
        //            .FirstOrDefaultAsync(x => x.FormId == param.FormId);

        //        CheckDbIssueFormFound(validate, dbIssueForm);

        //        dbIssueForm.SystemStatusCode = status;
        //        dbIssueForm.ModifiedTime = dateNow;
        //        dbIssueForm.ModifiedBy = userId;

        //        // ------------------------
        //        // Step 1) ลบตัวที่ไม่มีใน DS
        //        // ------------------------
        //        var dsTaskSeqs = param.TaskItems.Select(t => t.TaskSeq).ToList();
        //        var toDelete = dbIssueForm.IssueFormTask
        //            .Where(dbTask => !dsTaskSeqs.Contains(dbTask.TaskSeq))
        //            .ToList();

        //        foreach (var del in toDelete)
        //        {
        //            _context.IssueFormTask.Remove(del);
        //        }

        //        // ------------------------
        //        // Step 2 & 3) อัปเดต หรือ เพิ่ม
        //        // ------------------------
        //        foreach (var dsTask in param.TaskItems)
        //        {
        //            // หาใน DB ด้วย FormId + TaskSeq
        //            var dbTask = dbIssueForm.IssueFormTask
        //                .FirstOrDefault(t => t.TaskSeq == dsTask.TaskSeq);

        //            if (dbTask == null)
        //            {
        //                // ADD

        //                int maxTaskSeq = await GetMaxTaskSeqAsync(formId) ;
        //                dbTask = new IssueFormTask
        //                {
        //                    FormId = dbIssueForm.FormId,
        //                    TaskSeq = maxTaskSeq + 1,
        //                    CreatedTime = dateNow
        //                };
        //                dbIssueForm.IssueFormTask.Add(dbTask);
        //            }

        //            // UPDATE common fields
        //            dbTask.IssueCategoriesId = dsTask.IssueCategoriesId;
        //            dbTask.ProductId = dsTask.ProductId;
        //            dbTask.SystemStatusCode = status;
        //            dbTask.ModifiedTime = dateNow;
        //            dbTask.Br_Qty = dsTask.IssueCategoriesId == 1 ? dsTask.Quantity : null;
        //            dbTask.Rp_Location = dsTask.IssueCategoriesId == 2 ? dsTask.Location : null;
        //            dbTask.DetectedTime = (dsTask.IssueCategoriesId == 2 || dsTask.IssueCategoriesId == 3) ? dsTask.DetectedTime : null;
        //            dbTask.SubmitTime = status == "Submit" ? dateNow : null;
        //        }

        //        await _context.SaveChangesAsync();
        //        lastestId = param.FormId;

        //        LogSaved(param, dbIssueForm, "User Edited Form", userId, dateNow);

        //        param.FormId = lastestId;
        //        return param;
        //    }

        //    return param;



        //}

        private static void CheckDbIssueFormFound(ValidateException validate, IssueForm? dbIssueForm)
        {
            if (dbIssueForm == null)
            {
                validate.Add("Form", "Form Not Found");
            }

            validate.Throw();
        }

        private void LogSaved(IssueFormParam param, IssueForm dbIssueForm, string action, int userId, DateTime dateNow  )
        {
            var log = new Log_User_Form();
 
            log.ActionBy= userId;
            log.ActionTime = dateNow;
            log.ActionType = action;
            log.FormId = param.FormId;
            log.DocNo = param.DocNo;

            _context.Log_User_Form.Add(log);
            _context.SaveChanges();

        }

        public async Task<List<TaskParamViewModel>> DeleteTask(ValidateTaskParam param) 
        {
            if (param?.DataSource == null || param.Data?.Id == null)
                return param?.DataSource;

            // ลบรายการที่ Id ตรงกับ Data.Id
            param.DataSource.RemoveAll(x => x.Id == param.Data.Id);

            return param.DataSource;

        }


        public async Task<List<TaskParamViewModel>> ValidateTaskItemsAsync(ValidateTaskParam param)
        {

            //if (formId <= 0 || formId == null)
            //{
                ValidateException validate = ValidateTaskItem(param.Data, new ValidateException());


                var singleData = await _context.Rel_Categories_Product
                        .Include(c => c.IssueCategories)
                        .Include(p => p.Product)
                        .FirstOrDefaultAsync(r => r.IssueCategoriesId == param.Data.IssueCategoriesId && r.ProductId == param.Data.ProductId);  // หรือเงื่อนไขอื่น

                if (singleData == null)
                {
                    validate.Add("CategoriesProduct", "Invalid Categories");
                    validate.Throw();
                }

                List<TaskParamViewModel> newData = param.DataSource;


                if (param.Data.Id == null)
                {

                    var item = new TaskParamViewModel
                    {
                        ProductId = singleData.ProductId,
                        ProductName = singleData.Product.ProductName,
                        IssueCategoriesId = singleData.IssueCategoriesId,
                        IssueCategoriesName = singleData.IssueCategories.IssueCategoriesName,
                        Quantity = param.Data.Quantity,
                        Location = param.Data.Location,
                        DetectedTime = param.Data.DetectedTime
                    };



                    item.Id = Guid.NewGuid();

                    newData.Add(item);
                    return newData;

                }
                else
                {



                    var item = param.DataSource.FirstOrDefault(item => item.Id == param.Data.Id);



                    item.ProductId = singleData.ProductId;
                    item.ProductName = singleData.Product.ProductName;
                    item.IssueCategoriesId = singleData.IssueCategoriesId;
                    item.IssueCategoriesName = singleData.IssueCategories.IssueCategoriesName;
                    item.Quantity = param.Data.Quantity;
                    item.Location = param.Data.Location;
                    item.DetectedTime = param.Data.DetectedTime;

                    return param.DataSource;

                }
            
        }

        public async Task<int> GetMaxTaskSeqAsync(int formId)
        {
            var maxTaskSeq = await _context.IssueFormTask
                .Where(t => t.FormId == formId)
                .Select(t => (int?)t.TaskSeq) // cast เป็น nullable
                .MaxAsync();

            return maxTaskSeq ?? 0;
        }

        private static ValidateException ValidateTaskItem(TaskParamViewModel param, ValidateException validate)
        {



            CheckCategoriesNullOrBrlowZero(param, validate);
            CheckProductIsNullOrBeLowZero(param, validate);

            validate.Throw();


            if (param.IssueCategoriesId == 1)
            {

                CheckProductNullOrBelowZero(param, validate);
                CheckiQuantityBelowOrZero(param, validate);

            }
            else if (param.IssueCategoriesId == 2)
            {
                CheckProductNullOrBelowZero(param, validate);
                CheckLocationNullOrEmptySpace(param, validate);
                CheckDateNull(param, validate);
            }
            else if (param.IssueCategoriesId == 3)
            {
                CheckProductNullOrBelowZero(param, validate);
                CheckDateNull(param, validate);

            }

            validate.Throw();
            return validate;
        }

        private static void CheckProductIsNullOrBeLowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.ProductId <= 0 || param.ProductId == null)
            {
                validate.Add("Product", "Product Is Requierd");
            }
        }



        private static void CheckDateNull(TaskParamViewModel param, ValidateException validate )
        {
            if (param.DetectedTime == null)
            {
                validate.Add("Date", "Date is Requird");
            }
        }

        private static void CheckLocationNullOrEmptySpace(TaskParamViewModel param, ValidateException validate)
        {
            if (string.IsNullOrWhiteSpace(param.Location))
            {
                validate.Add("Location", "Locations Is Required");
            }
        }

        private static void CheckiQuantityBelowOrZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.Quantity <= 0 || param.Quantity == null)
                validate.Add("Quantity","Quantity Is Required");
        }

        private static void CheckProductNullOrBelowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.ProductId <= 0 || param.IssueCategoriesId == null)
                validate.Add("Product", "Product Is Required");
        }

        private static void CheckCategoriesNullOrBrlowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.IssueCategoriesId <= 0 || param.IssueCategoriesId == null)
                validate.Add("Categories", "Categories Is Required ");
        }

        public int GetCurrentUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            //if (user == null) throw new Exception("User not found");

            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }

    }


}
