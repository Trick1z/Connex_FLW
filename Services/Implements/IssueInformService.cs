using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<IssueFormParam> SaveIssueForm(IssueFormParam param, string status)
        {

            var validate = new ValidateException();

            foreach (var item in param.TaskItems)
            {
                validate = ValidateTaskItem(item, validate);


            }




            validate.Throw();






            if (param.FormId == 0)
            {
                var genDocNumber = await _genNumberService.GenDocNo("yyMMM");
                var userId = _claimsService.GetCurrentUserId();
                var dbIssueForm = new IssueForm();
                var dateNow = DateTime.Now;

                dbIssueForm.DocNo = genDocNumber;
                dbIssueForm.SystemStatusCode = status;
                dbIssueForm.CreatedBy = userId;
                dbIssueForm.CreatedTime = dateNow;
                dbIssueForm.ModifiedTime = dateNow;

              
                var taskSeq = 1;


                foreach (var taskItem in param.TaskItems)
                {

                    var dbIssueFormTask = new IssueFormTask();
                    dbIssueFormTask.TaskSeq = taskSeq;
                    dbIssueFormTask.IssueCategoriesId = taskItem.IssueCategoriesId;
                    dbIssueFormTask.ProductId = taskItem.ProductId;
                    dbIssueFormTask.SystemStatusCode = status;
                    dbIssueFormTask.CreatedTime = dateNow;
                    dbIssueFormTask.ModifiedTime = dateNow;

                    if (dbIssueFormTask.IssueCategoriesId == 1)
                    {
                        dbIssueFormTask.Br_Qty = taskItem.Quantity;
                        //dbIssueFormTask.
                    }
                    else if (dbIssueFormTask.IssueCategoriesId == 2)
                    {

                        dbIssueFormTask.Rp_Location = taskItem.Location;
                        dbIssueFormTask.DetectedTime = taskItem.DetectedTime;

                    }
                    else if (dbIssueFormTask.IssueCategoriesId == 3) {

                        dbIssueFormTask.DetectedTime = taskItem.DetectedTime;

                    }



                    if (status == "Submit")
                    {
                        dbIssueFormTask.SubmitTime = dateNow;

                    }







                    dbIssueForm.IssueFormTask.Add(dbIssueFormTask);
                    
                    //ite
                   


                    taskSeq++;
                }

                _context.IssueForm.Add(dbIssueForm);

                await _context.SaveChangesAsync();

                LogSaved(param, dbIssueForm);
            }
            else { }



            return param;
        }

        private void LogSaved(IssueFormParam param, IssueForm dbIssueForm)
        {

                    
            }

        public async Task<List<TaskParamViewModel>> SaveTask(ValidateTaskParam param)
        {
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





            //Console.WriteLine(singleData);


            //if (string.IsNullOrWhiteSpace(param.Data.Id))
            //{

            //}

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

        private static ValidateException ValidateTaskItem(TaskParamViewModel param, ValidateException validate)
        {
            //var validate = new ValidateException();
            IsCategoriesNullOrBrlowZero(param, validate);

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

        public async Task<bool> FinalValidateTaskItem(List<TaskParamViewModel> param, string status)
        {
            var validate = new ValidateException();

            //if (param == null || param.Count == 0)  // ตรวจ null และว่าง
            //{
            //    validate.Add("Data", "No Task Added");
            //}

            //foreach (var item in param)
            //{
            //    var validateData = await ValidateTaskItem(item);
            //}

            // สามารถโยน validate exception ได้ถ้ามี
            validate.Throw();

            //var getUsetIdByClaims = GetCurrentUserId();
            //var dateNow = DateTime.Now;


            //var task = new Task
            //{
            //    ActionBy = getUsetIdByClaims,
            //    ActionTime = dateNow,
            //    Status = status
            //};
            //var form =new IssueForm


            //var log = new Log_User_Form();
            //log.ActionBy = getUsetIdByClaims;
            //log.ActionTime = dateNow;
            //log.ActionType = "User Added Form";
            ////log.FormId = lastest id 

            return true;
        }




        private static void CheckDateNull(TaskParamViewModel param, ValidateException validate)
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
                validate.Add("Quantity", "Quantity Is Required");
        }

        private static void CheckProductNullOrBelowZero(TaskParamViewModel param, ValidateException validate)
        {
            if (param.ProductId <= 0 || param.IssueCategoriesId == null)
                validate.Add("Product", "Product Is Required");
        }

        private static void IsCategoriesNullOrBrlowZero(TaskParamViewModel param, ValidateException validate)
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
