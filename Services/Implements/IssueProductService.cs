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

            var dbProduct = new Product();

            if (string.IsNullOrWhiteSpace(param.ProductName))
            {
                validate.Add("product", "กรุณาใส่ข้อมูลให้ครบถ้วน");
                validate.Throw();

            }

            if (param.ProductId <= 0 || param.ProductId == null)
            {
                dbProduct = await _context.Product
                          .FirstOrDefaultAsync(x => x.ProductName == param.ProductName && x.IsActive == true)!;
                if (dbProduct != null)
                {
                    validate.Add("product", "มีข้อมูลในระบบแล้ว");
                    validate.Throw();
                }

                dbProduct = new Product();
                dbProduct.ProductName = param.ProductName;
                dbProduct.CreatedTime = datenow;
                dbProduct.ModifiedTime = datenow;
                dbProduct.ModifiedBy = userId;
                dbProduct.IsActive = true;

                _context.Product.Add(dbProduct);
                await _context.SaveChangesAsync();


                var log = new IssueCategoriesAudit();
                AddLog("product", dbProduct.ProductId, userId, "Added Product", datenow);



            }
            else
            {
                TimeValidate(param.ModifiedTime, dbProduct.ModifiedTime, validate);

                dbProduct = await _context.Product
                           .FirstOrDefaultAsync(x => x.ProductId == param.ProductId && x.IsActive == true)!;

                if (param.Action == "Edit")
                {
                    CheckProductValueChanged(param, validate, dbProduct);

                    dbProduct.ProductName = param.ProductName;
                    dbProduct.ModifiedTime = datenow;
                    _context.Product.Update(dbProduct);
                    
                    AddLog("product", param.ProductId, userId, "Edited Product", datenow);

                }
                else if (param.Action == "Delete")

                   
                {

                    dbProduct.IsActive = false;
                    dbProduct.ModifiedBy = userId;
                    _context.Product.Update(dbProduct); 

                    AddLog("product", param.ProductId, userId, "Deactivated Product", datenow);
                }
            }

            await _context.SaveChangesAsync();

            return dbProduct;
        }

   

        private static bool CheckProductValueChanged(ProductParam param, ValidateException validate, Product? dbProduct)
        {
            

            if (param.ProductName == dbProduct.ProductName)
            {
                validate.Add("product", "คุณไม่ได้เปลี่ยนข้อมูล");
                validate.Throw();
            }

            return true;
        }

        public async Task<IssueCategories> SaveCategories(CategoriesParam param )
        {


            var userId = _claimsService.GetCurrentUserId();
            var dateNow = DateTime.Now;
            var validate = new ValidateException();

            var dbIssueCategory = new IssueCategories();

            if (string.IsNullOrWhiteSpace(param.IssueCategoriesName) || string.IsNullOrWhiteSpace(param.IssueCategoriesDescription))
            {
                validate.Add("categories", "กรอกข้อมูลให้ครบถ้วน");
                validate.Throw();
            }

            if (param.IssueCategoriesId <= 0 || param.IssueCategoriesId == null){

                dbIssueCategory = await _context.IssueCategories
                         .FirstOrDefaultAsync(x => x.IssueCategoriesName == param.IssueCategoriesName 
                         || x.IssueCategoriesDescription == param.IssueCategoriesDescription && x.IsActive == true)!;
                if (dbIssueCategory != null)
                {
                    validate.Add("categories", "มีข้อมูลในระบบแล้ว");
                    validate.Throw();
                }

                dbIssueCategory = new IssueCategories();
                dbIssueCategory.IssueCategoriesDescription = param.IssueCategoriesDescription;
                dbIssueCategory.IssueCategoriesName = param.IssueCategoriesName;
                dbIssueCategory.IsProgramIssue = param.IsProgramIssue;
                dbIssueCategory.CreatedTime = dateNow;
                dbIssueCategory.ModifiedTime = dateNow;
                dbIssueCategory.IsActive = true;
                dbIssueCategory.ModifiedBy = userId;

                _context.IssueCategories.Add(dbIssueCategory);
                await _context.SaveChangesAsync();


                AddLog("categories", dbIssueCategory.IssueCategoriesId, userId, "Added Categories", dateNow);

            }
            else {


                dbIssueCategory = await _context.IssueCategories
                           .FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId && x.IsActive == true)!;

                TimeValidate(dbIssueCategory.ModifiedTime, param.ModifiedTime, validate);


                if (param.Action == "Edit")
                {

                   


                    CheckCategoriesValueChanged(param, validate, dbIssueCategory);


                    dbIssueCategory.IssueCategoriesDescription = param.IssueCategoriesDescription;
                    dbIssueCategory.IssueCategoriesName = param.IssueCategoriesName;
                    dbIssueCategory.ModifiedTime = dateNow;
                    dbIssueCategory.ModifiedBy = userId;
                    _context.IssueCategories.Update(dbIssueCategory);

                    AddLog("categories", dbIssueCategory.IssueCategoriesId, userId, "Edited Categories", dateNow);
                }
                else if (param.Action == "Delete")
                {
                    var dbRelation = await _context.Rel_Categories_Product.FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId);

                    if (dbRelation != null)
                    {

                        validate.Add("categories", "ไม่สามารถดำเนินการได้ข้อมูลกำลังถูกใช้งาน");
                        validate.Throw();
                    }

                    DeActiveCategories(dbIssueCategory , userId);
                    AddLog("categories", dbIssueCategory.IssueCategoriesId, userId, "Deactivated Categories", dateNow);
                }
            }

            await _context.SaveChangesAsync();

            return dbIssueCategory;
            

        }

        private static void TimeValidate(DateTime dbTime , DateTime paramTime, ValidateException validate)
        {
            if (paramTime != dbTime)
            {
                validate.Add("modifiedTime", "กรุณารีเฟรชหน้านีแล้วลองใหม่");
                validate.Throw();
            }
        }

        private void DeActiveCategories(IssueCategories? dbIssueCategory ,int userId)
        {
            dbIssueCategory.IsActive = false;
            dbIssueCategory.ModifiedBy = userId;
            _context.IssueCategories.Update(dbIssueCategory);
        }

 

        private void AddLog(string db,int id, int userId, string action, DateTime dateNow)
        {        
            if (db == "product")
            {
                var log = new ProductAudit();
                log.Action = action;
                log.ActionTime = dateNow;
                log.ActionBy = userId;
                log.productId = id;
                _context.ProductAudit.Add(log);
            }
            else if(db == "categories") {
                var log = new IssueCategoriesAudit();
                log.Action = action;
                log.ActionTime = dateNow;
                log.ActionBy = userId;
                log.IssueCategoriesId = id;
                _context.IssueCategoriesAudit.Add(log);
            }
        }
    
        private static void CheckCategoriesValueChanged(CategoriesParam param, ValidateException validate, IssueCategories dbIssueCategory)
        {
            if (param.IssueCategoriesName == dbIssueCategory.IssueCategoriesName
                && param.IssueCategoriesDescription == dbIssueCategory.IssueCategoriesDescription)
            {
                validate.Add("categories", "คุณไม่ได้เปลี่ยนข้อมูล");
                validate.Throw();
            }
        }


        //mapIssueProduct
        public async Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param)
        {
            var validate = new ValidateException();
            var categories = await _context.IssueCategories
                .Include(c => c.Rel_Categories_Product)
                .FirstOrDefaultAsync(c => c.IssueCategoriesId == param.CategoriesId);

            if (categories == null)
                validate.Add("categories", "ไม่พบหมวดหมู่");

            var productList = await _context.Rel_Categories_Product
                .Where(r => r.IssueCategoriesId == param.CategoriesId)
                .ToListAsync();

            if (productList.Count > 0)
            {
                var dbModifiedTime = productList.Select(s => s.CreatedTime).Max();

                if (param.ModifiedTime != dbModifiedTime)
                {
                    validate.Add("modifiedTime", "กรุณารีเฟรชหน้านีแล้วลองใหม่");
                }
            }
            validate.Throw();
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
