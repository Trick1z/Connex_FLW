using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements
{

    public class IssueProductService : IIssueProductService
    {


        private readonly IHttpContextAccessor _contextAccessor;
        private readonly MYGAMEContext _context;

        private readonly IClaimsService _claimsService;

        public IssueProductService(MYGAMEContext context, IHttpContextAccessor httpContextAccessor , IClaimsService claimsService)
        {
            _context = context;
            _contextAccessor = httpContextAccessor;
            _claimsService = claimsService;

        }


        //public async Task<bool> DeletedProduct(List<int> id) {
        //    var userId = _claimsService.GetCurrentUserId();
        //    var validate = new ValidateException();
        //    var dateNow = DateTime.Now;

        //    foreach (var item in id)
        //    {              
        //        var dbProduct = await _context.Product.FirstOrDefaultAsync(x => x.ProductId == item && x.IsActive == true );
        //        if (dbProduct != null)
        //        {
        //            var dbIssueTask = await _context.IssueFormTask.Include(t=>t.Form)
        //                .FirstOrDefaultAsync(x => x.ProductId == item);

        //            if (dbIssueTask != null )
        //            {
        //                validate.Add("product",$"ข้อมูลกำลังถูกใช้งานอยู่ที่ Task {dbIssueTask.Form.DocNo} ,{dbIssueTask.FormId} , {dbIssueTask.TaskSeq}" );
        //            }
        //            dbProduct.IsActive = false;
        //            dbProduct.ModifiedBy = userId;
        //            _context.Product.Update(dbProduct);

        //            AddLog("product", item, userId, "Deactivated Product", dateNow);
        //        }
        //        else {
        //            validate.Add("product", "");
        //        }
        //    }
        //    validate.Throw();
        //    await _context.SaveChangesAsync();         
        //    return true;
        //}



        public async Task<IEnumerable<IssueCategoriesViewModel>> GetCategoriesItems() {

            var dbIssueCategories = await _context.IssueCategories
                     .Where(c => c.IsActive)
                     .Include(c => c.ModifiedByNavigation)
                     .Select(c => new IssueCategoriesViewModel
                     {
                         IssueCategoriesId = c.IssueCategoriesId,
                         IssueCategoriesName = c.IssueCategoriesName,
                         IssueCategoriesDescription = c.IssueCategoriesDescription,
                         CreatedTime = c.CreatedTime,
                         ModifiedTime = c.ModifiedTime,
                         IsProgramIssue =c.IsProgramIssue,
                         ModifiedByUserName = c.ModifiedByNavigation != null ? c.ModifiedByNavigation.Username : null
                     })
                     .ToListAsync();  

            return dbIssueCategories;  


        }


        public async Task<Product> SaveProduct(ProductParam param)
        {

            var userId = _claimsService.GetCurrentUserId();
            var datenow = DateTime.Now;
            var validate = new ValidateException();
            Product dbProduct;


            if (string.IsNullOrWhiteSpace(param.ProductName))
            {
                validate.Add(ValidateKey.Product, ValidateMsg.PleaseFillAllInfo);
                validate.Throw();

            }

            await ValidateProductDupicated(param, validate);



            if (param.ProductId == null || param.ProductId <= 0)
            {
                 dbProduct = new Product();

                UpdateDbProduct(param, userId, datenow, dbProduct);
                dbProduct.IsActive = true;
                dbProduct.CreatedTime = datenow;

                _context.Product.Add(dbProduct);
                await _context.SaveChangesAsync();

                AddLog(DbRef.Product, dbProduct.ProductId, userId, LogActionRef.AddProduct, datenow);

            }
            else
            {

                 dbProduct = await _context.Product
                         .FirstOrDefaultAsync(x => x.ProductId == param.ProductId && x.IsActive == true);

                if (dbProduct == null) {
                    validate.Add(ValidateKey.Product,ValidateMsg.NotFound);
                }

                TimeValidate(param.ModifiedTime, dbProduct.ModifiedTime, validate);
                CheckProductValueChanged(param, validate, dbProduct);
                UpdateDbProduct(param, userId, datenow, dbProduct);

                _context.Product.Update(dbProduct);

                AddLog(DbRef.Product, param.ProductId, userId, LogActionRef.EditProduct, datenow);

            }

            await _context.SaveChangesAsync();

            return dbProduct;
        }

        public async Task<Product> DeleteProduct(ProductParam param)
        {
            var userId = _claimsService.GetCurrentUserId();
            var validate = new ValidateException();
            var dateNow = DateTime.Now;
            var dbProduct = await _context.Product.FirstOrDefaultAsync(x => x.ProductId == param.ProductId);

            if (dbProduct == null)
            {
                validate.Add(ValidateKey.Product, ValidateMsg.NotFound);
                validate.Throw();
            }

            TimeValidate(param.ModifiedTime, dbProduct.ModifiedTime, validate);

            var dbRelation = await _context.Rel_Categories_Product.FirstOrDefaultAsync(x => x.ProductId == param.ProductId);
            if (dbRelation != null)
            {
                validate.Add(ValidateKey.Product, ValidateMsg.DataAllReadyUsed);
                validate.Throw();
            }

            dbProduct.IsActive = false;
            dbProduct.ModifiedBy = userId;
            dbProduct.ModifiedTime = dateNow;
            _context.Product.Update(dbProduct);

            AddLog(DbRef.Product, param.ProductId, userId, LogActionRef.DeactiveProduct, dateNow);

            await _context.SaveChangesAsync();
            return dbProduct;
        }
        public async Task<IssueCategories> SaveCategories(CategoriesParam param)
        {

            var userId = _claimsService.GetCurrentUserId();
            var datenow = DateTime.Now;
            var validate = new ValidateException();
            IssueCategories dbCategories;


            if (string.IsNullOrWhiteSpace(param.IssueCategoriesName) || string.IsNullOrWhiteSpace(param.IssueCategoriesDescription))
            {
                validate.Add(ValidateKey.Categories, ValidateMsg.PleaseFillAllInfo);
                validate.Throw();
            }

            await ValidateCategoriesDupicated(param, validate);



            if (param.IssueCategoriesId == null || param.IssueCategoriesId <= 0)
            {
                dbCategories = new IssueCategories();

                UpdateDbCategories(param, userId, datenow, dbCategories);
                dbCategories.IsActive = true;
                dbCategories.CreatedTime = datenow;

                _context.IssueCategories.Add(dbCategories);
                await _context.SaveChangesAsync();

                AddLog(DbRef.Categories, dbCategories.IssueCategoriesId, userId, LogActionRef.AddCategories, datenow);

            }
            else
            {

                dbCategories = await _context.IssueCategories
                        .FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId && x.IsActive == true);

                if (dbCategories == null)
                {
                    validate.Add(ValidateKey.Categories, ValidateMsg.NotFound);
                }

                TimeValidate(param.ModifiedTime, dbCategories.ModifiedTime, validate);

                CheckCategoriesValueChanged(param, validate, dbCategories);

                UpdateDbCategories(param, userId, datenow, dbCategories);

                _context.IssueCategories.Update(dbCategories);

                AddLog(DbRef.Categories, param.IssueCategoriesId, userId, LogActionRef.EditCategories, datenow);

            }

            await _context.SaveChangesAsync();

            return dbCategories;

        }

        public async Task<string> DeleteCategories(CategoriesParam param)
        {
            var userId = _claimsService.GetCurrentUserId();
            var validate = new ValidateException();
            var dateNow = DateTime.Now;
            var dbCategories = await _context.IssueCategories.FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId);

            if (dbCategories == null)
            {
                validate.Add(ValidateKey.Categories, ValidateMsg.NotFound);
                validate.Throw();
            }

            TimeValidate(param.ModifiedTime, dbCategories.ModifiedTime, validate);

            var dbRelation = await _context.Rel_Categories_Product.FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId);

            if (dbRelation != null)
            {
                validate.Add(ValidateKey.Categories, ValidateMsg.DataAllReadyUsed);
                validate.Throw();
            }

            dbCategories.ModifiedBy = userId;
            dbCategories.ModifiedTime = dateNow;
            dbCategories.IsActive = false;
            _context.IssueCategories.Update(dbCategories);

            AddLog(DbRef.Categories, param.IssueCategoriesId, userId, LogActionRef.DeactiveCategories, dateNow);

            await _context.SaveChangesAsync();
            return "OK";
        }

        private static void UpdateDbProduct(ProductParam param, int userId, DateTime datenow, Product dbProduct)
        {
            dbProduct.ProductName = param.ProductName;
            dbProduct.ModifiedTime = datenow;
            dbProduct.ModifiedBy = userId;
        }
        private static void UpdateDbCategories(CategoriesParam param, int userId, DateTime datenow, IssueCategories dbCategories)
        {
            dbCategories.IssueCategoriesName = param.IssueCategoriesName;
            dbCategories.IssueCategoriesDescription = param.IssueCategoriesDescription;
            dbCategories.ModifiedTime = datenow;
            dbCategories.ModifiedBy = userId;
        }

        private async Task ValidateProductDupicated(ProductParam param, ValidateException validate)
        {
           var  dbProduct = await _context.Product
                   .FirstOrDefaultAsync(x => x.ProductName == param.ProductName
                   && x.ProductId != param.ProductId && x.IsActive == true);

            if (dbProduct != null)
            {
                validate.Add(ValidateKey.Product, ValidateMsg.DataAlreadyExists );
                validate.Throw();
            }


        }

        private async Task ValidateCategoriesDupicated(CategoriesParam param, ValidateException validate)
        {
            var dbCategories = await _context.IssueCategories
                    .FirstOrDefaultAsync(x => x.IssueCategoriesName == param.IssueCategoriesName
                    && x.IssueCategoriesId != param.IssueCategoriesId && x.IsActive == true);

            if (dbCategories != null)
            {
                validate.Add(ValidateKey.Categories, ValidateMsg.DataAlreadyExists);
                validate.Throw();
            }


        }


        private static bool CheckProductValueChanged(ProductParam param, ValidateException validate, Product? dbProduct)
        {
            

            if (param.ProductName == dbProduct.ProductName)
            {
                validate.Add(ValidateKey.Product, ValidateMsg.NoChangesMade);
                validate.Throw();
            }

            return true;
        }
        private static bool CheckCategoriesValueChanged(CategoriesParam param, ValidateException validate, IssueCategories? dbCategories)
        {
            if (param.IssueCategoriesDescription == dbCategories.IssueCategoriesDescription)
            {
                validate.Add(ValidateKey.Categories, ValidateMsg.NoChangesMade);
                validate.Throw();
            }

            return true;
        }


        private static void TimeValidate(DateTime dbTime , DateTime paramTime, ValidateException validate)
        {
            if (paramTime != dbTime)
            {
                validate.Add(ValidateKey.Time  , ValidateMsg.TimeNoMatch);
                validate.Throw();
            }
        }


        private void AddLog(string db,int id, int userId, string action, DateTime dateNow)
        {        
            if (db == DbRef.Product)
            {
                var log = new ProductAudit();
                log.Action = action;
                log.ActionTime = dateNow;
                log.ActionBy = userId;
                log.productId = id;
                _context.ProductAudit.Add(log);
            }
            else if(db == DbRef.Categories) {
                var log = new IssueCategoriesAudit();
                log.Action = action;
                log.ActionTime = dateNow;
                log.ActionBy = userId;
                log.IssueCategoriesId = id;
                _context.IssueCategoriesAudit.Add(log);
            }
        }
   
        public async Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param)
        {
            var validate = new ValidateException();
            var categories = await _context.IssueCategories
                .Include(c => c.Rel_Categories_Product)
                .FirstOrDefaultAsync(c => c.IssueCategoriesId == param.CategoriesId);

            if (categories == null) { 
                validate.Add(ValidateKey.Categories, ValidateMsg.NotFound);
                validate.Throw();
            }

            //foreach (var item in param.product)
            //{
            //    var IsUserUsed = await _context.IssueFormTask.FirstOrDefaultAsync(x => x.IssueCategoriesId == item);

            //    if (IsUserUsed != null)
            //    { }

            //}

            var dbRelation = await _context.Rel_Categories_Product
                .Where(s => s.IssueCategoriesId == param.CategoriesId)
                .FirstOrDefaultAsync();

            if (dbRelation != null)
            {
                bool IsUserUsed = await _context.IssueFormTask.AnyAsync(x => param.product.Contains(x.IssueCategoriesId.Value));
                if (IsUserUsed)
                {
                    validate.Add(ValidateKey.Product, ValidateMsg.DataAllReadyUsed);
                    validate.Throw();
                }

            }

            var productList = await _context.Rel_Categories_Product
                .Where(r => r.IssueCategoriesId == param.CategoriesId)
                .ToListAsync();

            if (productList.Count > 0)
            {
                var dbModifiedTime = productList.Select(s => s.CreatedTime).Max();

                if (param.ModifiedTime != dbModifiedTime)
                {
                    validate.Add(ValidateKey.Time, ValidateMsg.TimeNoMatch);
                    validate.Throw();

                }
            }

            var products = await _context.Product
                .Where(p => p.IsActive && param.product.Contains(p.ProductId))
                .ToListAsync();

            var newRelations = products.Select(p => new Rel_Categories_Product
            {
                IssueCategories = categories,
                Product = p,
                CreatedTime = DateTime.Now
            }).ToList();

            categories.Rel_Categories_Product = newRelations;
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<CategoriesMapProductViewModel> LoadCategories(int id)
        {
            var selectedProducts = await _context.Rel_Categories_Product
                .Include(x => x.Product)
                     .Where(rc => rc.IssueCategoriesId == id)
                     .ToListAsync();

            var data = new CategoriesMapProductViewModel
            {
                CategoriesId = id,
                product = selectedProducts.Select(x => x.ProductId.ToString()).ToList(),
                ModifiedTime = selectedProducts.Max(x => x.CreatedTime),
                ProductText = string.Join(", ", selectedProducts.Select(x => x.Product.ProductName))
            };
            return data;
        }

        //Query
        public async  Task<QueryViewModel<USP_Query_CategoriesResult>> QueryCategoriesByText(DevExtremeParam<SearchCategoriesParam> param)
        
        {
            var result = await _context.Procedures.USP_Query_CategoriesAsync(param.SearchCriteria.Text, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            var data = new QueryViewModel<USP_Query_CategoriesResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;
            return data;
        }

        //Product on categories
        public async Task<QueryViewModel<USP_Query_IssueProductResult>> QueryProducts(DevExtremeParam<SearchProductParam> param)

        {
            var result = await _context.Procedures.USP_Query_IssueProductAsync(param.SearchCriteria.ProductName, param.SearchCriteria.CategoriesText,param.SearchCriteria.IsMap, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            var data = new QueryViewModel<USP_Query_IssueProductResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;
            return data;
        }
    }
}
