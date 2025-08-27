using Braintree;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SqlServer.Server;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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


        public async Task<QueryViewModel<USP_Query_IssueFormsResult>> QueryForms(DevExtremeParam<QueryUserForm> param, string formStatus)
        {

            var result = await _context.Procedures.USP_Query_IssueFormsAsync(param.SearchCriteria.DocNo, formStatus, param.SearchCriteria.ProductName,
                param.SearchCriteria.Categories, param.SearchCriteria.StatusCode, param.SearchCriteria.StartDate, param.SearchCriteria.EndDate,
                param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);


            var data = new QueryViewModel<USP_Query_IssueFormsResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;
            return data;
        }

        public async Task<QueryViewModel<USP_Query_FormTaskDetailResult>> GetFormsDetail(DevExtremeParam<QueryUserFormDetail> param)
        {

            var result = await _context.Procedures.USP_Query_FormTaskDetailAsync(param.SearchCriteria.FormId, param.LoadOption.Skip
                , param.LoadOption.Take, param.SortField, param.SortBy);

            if (param.SearchCriteria.DataSource == null)
                param.SearchCriteria.DataSource = new List<USP_Query_FormTaskDetailResult>();

            return new QueryViewModel<USP_Query_FormTaskDetailResult>
            {
                Data = result,
                TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0
            };
        }

        public async Task<IssueFormParam> GetIssueFormById(int formId)
        {
            var dbIssueForm = await _context.IssueForm
                .Include(f => f.IssueFormTask)
                    .ThenInclude(t => t.Rel_Categories_Product).ThenInclude(p => p.Product)
                    .ThenInclude(t => t.Rel_Categories_Product).ThenInclude(c => c.IssueCategories)
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
                    FormId = t.FormId,
                    TaskSeq = t.TaskSeq,
                    IssueCategoriesId = t.Rel_Categories_Product?.IssueCategoriesId,
                    IssueCategoriesName = t.Rel_Categories_Product?.IssueCategories?.IssueCategoriesName ?? "",
                    ProductId = t.Rel_Categories_Product?.ProductId,
                    ProductName = t.Rel_Categories_Product?.Product?.ProductName ?? "",
                    Quantity = t.Br_Qty,
                    Location = t.Rp_Location,
                    DetectedTime = t.DetectedTime,
                    CanEdit = t.SystemStatusCode == Domain.Enums.TaskStatus.Draft
                             || t.SystemStatusCode == Domain.Enums.TaskStatus.Submit,

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
                validate.Add("task", "กรุณาเพิ่มปัญหาที่ต้องการแจ้ง");
                validate.Throw();
            }

            foreach (var item in param.TaskItems)
            {
                validate = ValidateTaskItem(item, validate);
            }
            validate.Throw();


            using var transaction = await _context.Database.BeginTransactionAsync();

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

                CreatedFormAddFormLog(param, userId, dateNow);
                CreatedFormAddTaskLog(param, userId, dateNow, dbIssueForm);

                await _context.SaveChangesAsync();




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
                    foreach (var t in toDelete)
                    {
                        var log = new IssueFormTaskAudit
                        {
                            FormId = param.FormId,
                            TaskSeq = t.TaskSeq,
                            Action = "Deleted Task",
                            ActionBy = userId,
                            ActionTime = dateNow,
                            IssueCategoriesId = t.IssueCategoriesId,
                            ProductId = t.ProductId,
                            Qty = t.Br_Qty,
                            Location = t.Rp_Location,
                            DectectedTime = t.DetectedTime
                        };
                        _context.IssueFormTaskAudit.Add(log);
                    }

                    await _context.SaveChangesAsync();



                }


                // -----------------
                // UPDATE or ADD tasks
                // -----------------
                foreach (var dsTask in param.TaskItems)
                {
                    var logAction = "Edited Task";
                    var dbTask = dbIssueForm.IssueFormTask
                        .FirstOrDefault(t => t.TaskSeq == dsTask.TaskSeq);
                    int maxTaskSeq = dbIssueForm.IssueFormTask.Any() ? dbIssueForm.IssueFormTask.Max(t => t.TaskSeq) : 0;
                    if (dbTask == null)
                    {
                        dbTask = new IssueFormTask
                        {
                            FormId = dbIssueForm.FormId,
                            TaskSeq = maxTaskSeq + 1,
                            CreatedTime = dateNow
                        };
                        dbIssueForm.IssueFormTask.Add(dbTask);

                        logAction = "Added Task";
                    }

                    dbTask.IssueCategoriesId = dsTask.IssueCategoriesId;
                    dbTask.ProductId = dsTask.ProductId;
                    dbTask.SystemStatusCode = status;
                    dbTask.ModifiedTime = dateNow;
                    dbTask.Br_Qty = dsTask.IssueCategoriesId == 1 ? dsTask.Quantity : null;
                    dbTask.Rp_Location = dsTask.IssueCategoriesId == 2 ? dsTask.Location : null;
                    dbTask.DetectedTime = (dsTask.IssueCategoriesId == 2 || dsTask.IssueCategoriesId == 3) ? dsTask.DetectedTime : null;
                    dbTask.SubmitTime = status == "Submit" ? dateNow : null;

                    CreatedTaskAddLog(param, userId, dateNow, dsTask, logAction, maxTaskSeq);
                }

                EdtiedTaskFormAddLog(formId, userId, dateNow);

                await _context.SaveChangesAsync();
            }


            return param;
        }

        private void CreatedTaskAddLog(IssueFormParam param, int userId, DateTime dateNow, TaskParamViewModel dsTask, string logAction, int maxTaskSeq)
        {
            var log = new IssueFormTaskAudit
            {
                FormId = param.FormId,
                TaskSeq = maxTaskSeq + 1,
                Action = logAction,
                ActionBy = userId,
                ActionTime = dateNow,
                IssueCategoriesId = dsTask.IssueCategoriesId,
                ProductId = dsTask.ProductId,
                Qty = dsTask.Quantity,
                Location = dsTask.Location,
                DectectedTime = dsTask.DetectedTime
            };
            _context.IssueFormTaskAudit.Add(log);
        }

        private void EdtiedTaskFormAddLog(int formId, int userId, DateTime dateNow)
        {
            var formLog = new IssueFormAudit();

            formLog.ActionTime = dateNow;
            formLog.ActionBy = userId;
            formLog.Action = "Edited Task In Form";
            formLog.FormId = formId;

            _context.IssueFormAudit.Add(formLog);
        }

        private void CreatedFormAddFormLog(IssueFormParam param, int userId, DateTime dateNow)
        {
            var formLog = new IssueFormAudit();
            formLog.Action = "Created Form";
            formLog.ActionTime = dateNow;
            formLog.FormId = param.FormId;
            formLog.ActionBy = userId;

            _context.IssueFormAudit.Add(formLog);
        }

        private void CreatedFormAddTaskLog(IssueFormParam param, int userId, DateTime dateNow, IssueForm dbIssueForm)
        {
            foreach (var t in dbIssueForm.IssueFormTask)
            {
                var taskLog = new IssueFormTaskAudit();

                taskLog.TaskSeq = t.TaskSeq;
                taskLog.Action = "Created Task";
                taskLog.FormId = param.FormId;
                taskLog.ActionBy = userId;
                taskLog.ActionTime = dateNow;
                taskLog.IssueCategoriesId = t.IssueCategoriesId;
                taskLog.ProductId = t.ProductId;
                taskLog.Qty = t.Br_Qty;
                taskLog.Location = t.Rp_Location;
                taskLog.DectectedTime = t.DetectedTime;

                _context.IssueFormTaskAudit.Add(taskLog);

            }
        }

        public async Task<bool> CloseForms(USP_Query_IssueFormsResult param)
        {
            var validate = new ValidateException();
            var userId = _claimsService.GetCurrentUserId();
            var dateNow = DateTime.Now;
            var dbForm = await _context.IssueForm.FirstOrDefaultAsync(x => x.FormId == param.FormId);

            CloseFormValidate(param, validate, dbForm);
            ClosedFormUpdated(userId, dateNow, dbForm);
            ClosedFormAddLog(param, userId, dateNow);

            //await _context.SaveChangesAsync();
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                if (ex.InnerException != null)
                    Console.WriteLine(ex.InnerException.Message);
                throw; // หรือจัดการ error ตามต้องการ
            }



            return true;

        }

        private void ClosedFormAddLog(USP_Query_IssueFormsResult param, int userId, DateTime dateNow)
        {
            var log = new IssueFormAudit();
            log.FormId = param.FormId;
            log.Action = "Closed Form";
            log.ActionTime = dateNow;
            log.ActionBy = userId;
            _context.IssueFormAudit.Add(log);
        }

        private void ClosedFormUpdated(int userId, DateTime dateNow, IssueForm? dbForm)
        {
            dbForm.SystemStatusCode = "Closed";
            dbForm.ModifiedBy = userId;
            dbForm.ClosedBy = userId;
            dbForm.ModifiedTime = dateNow;
            dbForm.ClosedTime = dateNow;

            _context.IssueForm.Update(dbForm);

        }

        private static void CloseFormValidate(USP_Query_IssueFormsResult param, ValidateException validate, IssueForm? dbForm)
        {
            if (dbForm == null)
            {
                validate.Add("form", "ไม่เจอฟอร์ม");
                validate.Throw();
            }

            if (param.ModifiedTime != dbForm.ModifiedTime)
            {
                validate.Add("time", "กรุณารีเฟรชหน้านีแล้วลองใหม่");
                validate.Throw();

            }
        }

        private static void CheckDbIssueFormFound(ValidateException validate, IssueForm? dbIssueForm)
        {


            if (dbIssueForm == null)
            {
                validate.Add("form", "ไม่เจอฟอร์ม");
            }

            validate.Throw();
        }



        public async Task<List<TaskParamViewModel>> DeleteTask(ValidateTaskParam param)
        {

            if (param.Data.FormId == 0 || param.Data.FormId == null)
            {
                param.DataSource.RemoveAll(x => x.Id == param.Data.Id);
            }
            else
            {
                var dbIssueFormTasks = await _context.IssueFormTask
                        .Where(x => x.FormId == param.Data.FormId && x.TaskSeq == param.Data.TaskSeq).FirstOrDefaultAsync();


                var validate = new ValidateException();
                ValidateTask(param, dbIssueFormTasks, validate);

                // ลบรายการที่ Id ตรงกับ Data.Id
                param.DataSource.RemoveAll(x => x.Id == param.Data.Id);

            }


            return param.DataSource;

        }

        private static void ValidateTask(ValidateTaskParam param, IssueFormTask? dbIssueFormTasks, ValidateException validate)
        {
            if (dbIssueFormTasks.SystemStatusCode != "Draft")
            {
                validate.Add("task", "มีคนรับงานนี้เรียบร้อยแล้ว");
            }


            if (param?.DataSource == null || param.Data?.Id == null)
            {

                validate.Add("task", "ไม่พบข้อมูล");

            }


            validate.Throw();
        }

        public async Task<List<TaskParamViewModel>> ValidateTaskItemsAsync(ValidateTaskParam param)
        {
            ValidateException validate = new ValidateException();


            foreach (var item in param.DataSource)
            {

                if ((param.Data.IssueCategoriesId == IssueCategoriesId.Borrow) && (param.Data.ProductId == item.ProductId))
                {
                    validate.Add("item", "คุณเพิ่มข้อมูลนี้แล้ว");
                    validate.Throw();
                }


                if ((param.Data.IssueCategoriesId == IssueCategoriesId.Repair) && (param.Data.ProductId == item.ProductId) && (param.Data.Location == item.Location))
                {
                    validate.Add("item", "คุณเพิ่มข้อมูลนี้แล้ว");
                    validate.Throw();
                }

                if ((param.Data.IssueCategoriesId == IssueCategoriesId.Progream) && (param.Data.DetectedTime == item.DetectedTime))
                {
                    validate.Add("item", "คุณเพิ่มข้อมูลนี้แล้ว");
                    validate.Throw();

                }



            }

            ValidateTaskItem(param.Data, validate);




            var dbRCP = await _context.Rel_Categories_Product
                    .Include(c => c.IssueCategories)
                    .Include(p => p.Product)
                    .FirstOrDefaultAsync(r => r.IssueCategoriesId == param.Data.IssueCategoriesId && r.ProductId == param.Data.ProductId);  // หรือเงื่อนไขอื่น

            if (dbRCP == null)
            {
                validate.Add("categories", "ไม่พบข้อมูล");
                validate.Throw();
            }

            List<TaskParamViewModel> newData = param.DataSource;


            if (param.Data.Id == null)
            {

                var item = new TaskParamViewModel
                {
                    ProductId = dbRCP.ProductId,
                    ProductName = dbRCP.Product.ProductName,
                    IssueCategoriesId = dbRCP.IssueCategoriesId,
                    IssueCategoriesName = dbRCP.IssueCategories.IssueCategoriesName,
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



                item.ProductId = dbRCP.ProductId;
                item.ProductName = dbRCP.Product.ProductName;
                item.IssueCategoriesId = dbRCP.IssueCategoriesId;
                item.IssueCategoriesName = dbRCP.IssueCategories.IssueCategoriesName;
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
            CheckProductNullOrBelowZero(param, validate);


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



        private static void CheckDateNull(TaskParamViewModel param, ValidateException validate)
        {
            if (param.DetectedTime == null)
            {
                validate.Add("date", "กรุณากรอกวันที่");
            }
        }

        private static void CheckLocationNullOrEmptySpace(TaskParamViewModel param, ValidateException validate)
        {
            if (string.IsNullOrWhiteSpace(param.Location))
            {
                validate.Add("location", "กรุณากรอกสถานที่");
            }
        }

        private static void CheckiQuantityBelowOrZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.Quantity <= 0 || param.Quantity == null)
                validate.Add("quantity", "กรูณากรอกจำนวน");
        }

        private static void CheckProductNullOrBelowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.ProductId <= 0 || param.ProductId == null)
                validate.Add("product", "กรุณเลือก product");
            validate.Throw();

        }

        private static void CheckCategoriesNullOrBrlowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.IssueCategoriesId <= 0 || param.IssueCategoriesId == null)
                validate.Add("categories", "กรุณเลือก category");
            validate.Throw();

        }

        public int GetCurrentUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            //if (user == null) throw new Exception("User not found");

            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        public async Task<QueryViewModel<USP_Query_FormTasksByStatusResult>> QueryFormUser(DevExtremeParam<JobForUser> param)
        {
            var userId = _claimsService.GetCurrentUserId();

            var result = await _context.Procedures.USP_Query_FormTasksByStatusAsync(userId,
                   param.SearchCriteria.Status, param.SearchCriteria.DocNo, param.SearchCriteria.Categories
                   , param.SearchCriteria.StartDate, param.SearchCriteria.EndDate, param.LoadOption.Skip
                   , param.LoadOption.Take, param.SortField, param.SortBy);

            var data = new QueryViewModel<USP_Query_FormTasksByStatusResult>();


            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;



            return data;


        }

        //public async Task<bool> ListTaskManagement(List<USP_Query_FormTasksByStatusResult> param, string status)
        //{
        //    foreach (var item in param)
        //    {
        //        await TaskManagement(item, status);
        //    }
        //    return true;
        //}


        public async Task<bool> TaskManagement(USP_Query_FormTasksByStatusResult param, string status)
        {
            var validate = new ValidateException();
            var userId = _claimsService.GetCurrentUserId();

            var userTaskSeq = await _context.IssueFormTask
                .FirstOrDefaultAsync(t => t.FormId == param.FormId && t.TaskSeq == param.TaskSeq);

            IsTaskFound(validate, userTaskSeq);

            var dateNow = DateTime.Now;


            IsLatestData(param, validate, userTaskSeq);
            await UpdateTask(param, userTaskSeq, dateNow, status, userId);
            await UpdateFormStatusCode(validate, userTaskSeq, dateNow, userId, param.FormId ?? 0);
            AddLog(userId, userTaskSeq, dateNow, status);

            await _context.SaveChangesAsync();

            //Updateform 


            return true;
        }

        private async Task UpdateFormStatusCode(ValidateException validate, IssueFormTask? userTaskSeq, DateTime dateNow, int userId, int formId)
        {
            if (userTaskSeq == null)
            {
                validate.Add("task", "ไม่พบข้อมูล");
                validate.Throw();
                return;
            }

            var issueForm = await _context.IssueForm
                .FirstOrDefaultAsync(x => x.FormId == userTaskSeq.FormId);

            if (issueForm == null)
            {
                validate.Add("form", "ไม่พอมฟอร์ม");
                validate.Throw();
                return;
            }

            // เช็คว่า Form ลูกทั้งหมด Done หรือ Rejected
            bool areAllTaskDone = await _context.IssueFormTask
                .Where(t => t.FormId == issueForm.FormId)
                .AllAsync(t => t.SystemStatusCode == "Done" || t.SystemStatusCode == "Rejected");


            //var statusList = new[] { "Assigned", "Done", "Rejected" };
            //var AnyTaskAssigned = await _context.IssueFormTask
            //    .FirstOrDefaultAsync(x => statusList.Contains(x.SystemStatusCode)
            //                              && x.FormId == formId);

            //if (AnyTaskAssigned != null)
            //{
            //    issueForm.SystemStatusCode = "Assigned";
            //    issueForm.DoneTime = null;
            //}

            if (areAllTaskDone)
            {

                issueForm.SystemStatusCode = "Done";
                issueForm.DoneTime = dateNow;
                issueForm.ClosedBy = userId;
                issueForm.ClosedTime = dateNow;
            }



        }


        private async Task UpdateTask(USP_Query_FormTasksByStatusResult param, IssueFormTask? userTaskSeq, DateTime dateNow, string status, int userId)
        {

            var userStatusCode = await _context.Ref_TaskStatus
                .Where(s => s.SystemStatusCode == status)
                .Select(s => s.UserStatusCode)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(param.RejectReason))
                userTaskSeq.RejectReason = param.RejectReason;

            userTaskSeq.SystemStatusCode = userStatusCode;
            userTaskSeq.ModifiedTime = dateNow;

            if (status == "Done" || status == "Rejected")
            {
                userTaskSeq.DoneTime = dateNow;
                userTaskSeq.Br_Qty = param.Br_Qty;

            }

            if (status == "Assigned")
            {
                userTaskSeq.AssignedTime = dateNow;
                userTaskSeq.AssignedTo = userId;

            }
            if (status == "CancelAssigned")
            {
                userTaskSeq.AssignedTo = userId;
                userTaskSeq.AssignedTime = null;

            }

            if (status == "CancelCompleted")
            {
                userTaskSeq.DoneTime = null;
                userTaskSeq.AssignedTo = userId;
                userTaskSeq.AssignedTime = dateNow;

            }





            _context.IssueFormTask.Update(userTaskSeq);
            await _context.SaveChangesAsync();
        }

        private async Task AddLog(int userId, IssueFormTask? userTaskSeq, DateTime dateNow, string status)
        {
            var log = new IssueFormTaskAudit
            {
                FormId = userTaskSeq.FormId,
                TaskSeq = userTaskSeq.TaskSeq,
                Action = status,
                ActionBy = userId,
                ActionTime = dateNow,
                IssueCategoriesId = userTaskSeq.IssueCategoriesId,
                ProductId = userTaskSeq.ProductId,
                Qty = userTaskSeq.Br_Qty,
                Location = userTaskSeq.Rp_Location,
                DectectedTime = userTaskSeq.DetectedTime,

            };

            _context.IssueFormTaskAudit.Add(log);

            // Save Log
        }

        private static bool IsLatestData(USP_Query_FormTasksByStatusResult param, ValidateException validate, IssueFormTask? userTaskSeq)
        {

            //ไม่เจอโยน validate
            if (param.ModifiedTime != userTaskSeq.ModifiedTime)
            {
                validate.Add("update", "กรุณารีเฟรชหน้านีแล้วลองใหม่");
                validate.Throw();

            }

            return true;
        }

        private static bool IsTaskFound(ValidateException validate, IssueFormTask? userTaskSeq)
        {
            //ไม่เจอโยน validate
            if (userTaskSeq == null)
            {
                validate.Add("task", "ไม่พบข้อมูล");
                validate.Throw();
            }

            return true;
        }
    }


}
