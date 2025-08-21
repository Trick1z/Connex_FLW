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

        //public async Task<IssueFormParam> SaveIssueForm(IssueFormParam param, string status)
        //{

        //    var validate = new ValidateException();
        //    var indexItem = 1;

        //    foreach (var item in param.TaskItems)
        //    {
        //        validate = ValidateTaskItem(item, validate, indexItem);
        //        indexItem++;
        //    }

        //    validate.Throw();



        //    var userId = _claimsService.GetCurrentUserId();
        //    var dateNow = DateTime.Now;


        //    await using var transaction = await _context.Database.BeginTransactionAsync();


        //    var lastestId = 0;

        //    if (param.FormId == 0)
        //    {
        //        var genDocNumber = await _genNumberService.GenDocNo("yymmm");
        //        var dbIssueForm = new IssueForm();

        //        dbIssueForm.DocNo = genDocNumber;
        //        dbIssueForm.SystemStatusCode = status;
        //        dbIssueForm.CreatedBy = userId;
        //        dbIssueForm.CreatedTime = dateNow;
        //        dbIssueForm.ModifiedTime = dateNow;


        //        var taskSeq = 1;


        //        foreach (var taskItem in param.TaskItems)
        //        {

        //            var dbIssueFormTask = new IssueFormTask();
        //            dbIssueFormTask.TaskSeq = taskSeq;
        //            dbIssueFormTask.IssueCategoriesId = taskItem.IssueCategoriesId;
        //            dbIssueFormTask.ProductId = taskItem.ProductId;
        //            dbIssueFormTask.SystemStatusCode = status;
        //            dbIssueFormTask.CreatedTime = dateNow;
        //            dbIssueFormTask.ModifiedTime = dateNow;

        //            if (dbIssueFormTask.IssueCategoriesId == 1)
        //            {
        //                dbIssueFormTask.Br_Qty = taskItem.Quantity;
        //            }
        //            else if (dbIssueFormTask.IssueCategoriesId == 2)
        //            {

        //                dbIssueFormTask.Rp_Location = taskItem.Location;
        //                dbIssueFormTask.DetectedTime = taskItem.DetectedTime;

        //            }
        //            else if (dbIssueFormTask.IssueCategoriesId == 3) {

        //                dbIssueFormTask.DetectedTime = taskItem.DetectedTime;

        //            }

        //            if (status == "Submit")
        //            {
        //                dbIssueFormTask.SubmitTime = dateNow;

        //            }

        //            dbIssueForm.IssueFormTask.Add(dbIssueFormTask);
        //            taskSeq++;
        //        }

        //        _context.IssueForm.Add(dbIssueForm);

        //        await _context.SaveChangesAsync();


        //        lastestId = dbIssueForm.FormId;

        //        LogSaved(param, dbIssueForm,"User Added Form" ,userId, dateNow);

        //    }
        //    else
        //    {

        //        var dbIssueForm = await _context.IssueForm
        //             .Include(x => x.IssueFormTask)
        //             .FirstOrDefaultAsync(x => x.FormId == param.FormId);

        //        CheckDbIssueFormFound(validate, indexItem, dbIssueForm);



        //        dbIssueForm.SystemStatusCode = status;
        //        dbIssueForm.ModifiedTime = dateNow;
        //        dbIssueForm.ModifiedBy = userId;

        //        var taskSeq = 1;
        //        foreach (var taskItem in param.TaskItems)
        //        {
        //            // หาว่า TaskSeq นี้มีอยู่แล้วหรือยัง
        //            var dbTask = dbIssueForm.IssueFormTask
        //                .FirstOrDefault(t => t.TaskSeq == taskSeq);

        //            if (dbTask == null)
        //            {
        //                // Insert task ใหม่
        //                dbTask = new IssueFormTask
        //                {
        //                    TaskSeq = taskSeq,
        //                    CreatedTime = dateNow,
        //                };
        //                dbIssueForm.IssueFormTask.Add(dbTask);
        //            }

        //            // Update task (ทั้งของเดิมและของใหม่)
        //            dbTask.IssueCategoriesId = taskItem.IssueCategoriesId;
        //            dbTask.ProductId = taskItem.ProductId;
        //            dbTask.SystemStatusCode = status;
        //            dbTask.ModifiedTime = dateNow;

        //            if (dbTask.IssueCategoriesId == 1)
        //            {
        //                dbTask.Br_Qty = taskItem.Quantity;
        //            }
        //            else if (dbTask.IssueCategoriesId == 2)
        //            {
        //                dbTask.Rp_Location = taskItem.Location;
        //                dbTask.DetectedTime = taskItem.DetectedTime;
        //            }
        //            else if (dbTask.IssueCategoriesId == 3)
        //            {
        //                dbTask.DetectedTime = taskItem.DetectedTime;
        //            }

        //            if (status == "Submit")
        //            {
        //                dbTask.SubmitTime = dateNow;
        //            }

        //            taskSeq++;
        //        }

        //        await _context.SaveChangesAsync();
        //        lastestId = param.FormId;

        //        LogSaved(param, dbIssueForm,"User Edited Form",userId , dateNow );

        //    }


        //    await transaction.CommitAsync();

        //    param.FormId = lastestId;
        //    return param;
        //}

        public async Task<IssueFormParam> SaveIssueForm(IssueFormParam param, string status)
        {
            var validate = new ValidateException();
            var indexItem = 1;

            // Validate TaskItems
            foreach (var item in param.TaskItems)
            {
                validate = ValidateTaskItem(item, validate, indexItem);
                indexItem++;
            }

            validate.Throw();

            var userId = _claimsService.GetCurrentUserId();
            var dateNow = DateTime.Now;
            int lastestId = 0;

            if (param.FormId == 0)
            {
                // CREATE
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
                    var dbIssueFormTask = new IssueFormTask
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
                    };

                    dbIssueForm.IssueFormTask.Add(dbIssueFormTask);
                    taskSeq++;
                }

                _context.IssueForm.Add(dbIssueForm);
                await _context.SaveChangesAsync();

                lastestId = dbIssueForm.FormId;

                LogSaved(param, dbIssueForm, "User Added Form", userId, dateNow);
            }
            else
            {
                // EDIT
                var dbIssueForm = await _context.IssueForm
                    .Include(x => x.IssueFormTask)
                    .FirstOrDefaultAsync(x => x.FormId == param.FormId);

                CheckDbIssueFormFound(validate, indexItem, dbIssueForm);

                dbIssueForm.SystemStatusCode = status;
                dbIssueForm.ModifiedTime = dateNow;
                dbIssueForm.ModifiedBy = userId;

                int taskSeq = 1;
                foreach (var taskItem in param.TaskItems)
                {
                    var dbTask = dbIssueForm.IssueFormTask.FirstOrDefault(t => t.TaskSeq == taskSeq);

                    if (dbTask == null)
                    {
                        dbTask = new IssueFormTask
                        {
                            TaskSeq = taskSeq,
                            CreatedTime = dateNow
                        };
                        dbIssueForm.IssueFormTask.Add(dbTask);
                    }

                    dbTask.IssueCategoriesId = taskItem.IssueCategoriesId;
                    dbTask.ProductId = taskItem.ProductId;
                    dbTask.SystemStatusCode = status;
                    dbTask.ModifiedTime = dateNow;
                    dbTask.Br_Qty = taskItem.IssueCategoriesId == 1 ? taskItem.Quantity : null;
                    dbTask.Rp_Location = taskItem.IssueCategoriesId == 2 ? taskItem.Location : null;
                    dbTask.DetectedTime = (taskItem.IssueCategoriesId == 2 || taskItem.IssueCategoriesId == 3) ? taskItem.DetectedTime : null;
                    dbTask.SubmitTime = status == "Submit" ? dateNow : null;

                    taskSeq++;
                }

                await _context.SaveChangesAsync();
                lastestId = param.FormId;

                LogSaved(param, dbIssueForm, "User Edited Form", userId, dateNow);
            }

            param.FormId = lastestId;
            return param;
        }

        private static void CheckDbIssueFormFound(ValidateException validate, int indexItem, IssueForm? dbIssueForm)
        {
            if (dbIssueForm == null)
            {
                validate.Add("Form", $"Item {indexItem} : Form Not Found");
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

        public async Task<List<TaskParamViewModel>> SaveTask(ValidateTaskParam param)
        {
            var indexItem = 1;
            ValidateException validate = ValidateTaskItem(param.Data, new ValidateException() ,indexItem);


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

        private static ValidateException ValidateTaskItem(TaskParamViewModel param, ValidateException validate,int index)
        {



            CheckCategoriesNullOrBrlowZero(param, validate, index);

            validate.Throw();


            if (param.IssueCategoriesId == 1)
            {

                CheckProductNullOrBelowZero(param, validate , index);
                CheckiQuantityBelowOrZero(param, validate, index);

            }
            else if (param.IssueCategoriesId == 2)
            {
                CheckProductNullOrBelowZero(param, validate, index );
                CheckLocationNullOrEmptySpace(param, validate, index);
                CheckDateNull(param, validate, index);
            }
            else if (param.IssueCategoriesId == 3)
            {
                CheckProductNullOrBelowZero(param, validate, index);
                CheckDateNull(param, validate, index);

            }

            validate.Throw();
            return validate;
        }

 


        private static void CheckDateNull(TaskParamViewModel param, ValidateException validate, int index )
        {
            if (param.DetectedTime == null)
            {
                validate.Add("Date", $"Item {index} : Date is Requird");
            }
        }

        private static void CheckLocationNullOrEmptySpace(TaskParamViewModel param, ValidateException validate, int index)
        {
            if (string.IsNullOrWhiteSpace(param.Location))
            {
                validate.Add("Location", $"Item {index} : Locations Is Required");
            }
        }

        private static void CheckiQuantityBelowOrZero(TaskParamViewModel param, ValidateException validate, int index)
        {
            if (param.Quantity <= 0 || param.Quantity == null)
                validate.Add("Quantity", $"Item {index} : Quantity Is Required");
        }

        private static void CheckProductNullOrBelowZero(TaskParamViewModel param, ValidateException validate, int index)
        {
            if (param.ProductId <= 0 || param.IssueCategoriesId == null)
                validate.Add("Product", $"Item {index} : Product Is Required");
        }

        private static void CheckCategoriesNullOrBrlowZero(TaskParamViewModel param, ValidateException validate, int index)
        {
            if (param.IssueCategoriesId <= 0 || param.IssueCategoriesId == null)
                validate.Add("Categories", $"Item {index} : Categories Is Required ");
        }

        public int GetCurrentUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            //if (user == null) throw new Exception("User not found");

            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }

    }


}
