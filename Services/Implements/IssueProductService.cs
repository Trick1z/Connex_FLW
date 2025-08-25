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

        public async Task<IEnumerable<IssueCategories>> GetCategoriesItems() {
            var dbIssueCategories = await _context.IssueCategories
                .Where(x => x.IsActive == true)
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
                dbProduct.ProductName = param.ProductName;
                dbProduct.CreatedTime = datenow;
                dbProduct.ModifiedTime = datenow;
                dbProduct.IsActive = true;

                _context.Product.Add(dbProduct);
                await _context.SaveChangesAsync();


                var log = new IssueCategoriesAudit();
                ProductAddLog(dbProduct.ProductId, userId, "Added Product", datenow);

            }
            else
            {
                dbProduct = await _context.Product
                           .FirstOrDefaultAsync(x => x.ProductId == param.ProductId && x.IsActive == true)!;


                if (param.Action == "Edit")
                {
                    TimeValidate(param.ModifiedTime, dbProduct.ModifiedTime, validate);
                    IsProductValueChanged(param, validate, dbProduct);
                    UpdateProduct(param, datenow, dbProduct);

                   ProductAddLog(param.ProductId, userId, "Edited Product", datenow);
                }
                else if (param.Action == "Delete")
                {
                    TimeValidate( dbProduct.ModifiedTime, param.ModifiedTime , validate);
                    DeActiveProduct(dbProduct);
                    ProductAddLog(param.ProductId, userId, "Deactivated Product", datenow);

                }


            }

            await _context.SaveChangesAsync();

            return dbProduct;
        }

        private static void UpdateProduct(ProductParam param, DateTime datenow, Product dbProduct)
        {
            dbProduct.ProductName = param.ProductName;
            dbProduct.ModifiedTime = datenow;
        }

        private static bool IsProductValueChanged(ProductParam param, ValidateException validate, Product? dbProduct)
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
            var datenow = DateTime.Now;
            var validate = new ValidateException();

            var dbIssueCategory = new IssueCategories();

            if (string.IsNullOrWhiteSpace(param.IssueCategoriesName) || string.IsNullOrWhiteSpace(param.IssueCategoriesDescription))
            {
                validate.Add("categories", "กรอกข้อมูลให้ครบถ้วน");
                validate.Throw();
            }

            if (param.IssueCategoriesId <= 0 || param.IssueCategoriesId == null){

               

                dbIssueCategory.IssueCategoriesDescription = param.IssueCategoriesDescription;
                dbIssueCategory.IssueCategoriesName = param.IssueCategoriesName;
                dbIssueCategory.IsProgramIssue = param.IsProgramIssue;
                dbIssueCategory.CreatedTime = datenow;
                dbIssueCategory.ModifiedTime = datenow;
                dbIssueCategory.IsActive = true;

                _context.IssueCategories.Add(dbIssueCategory);
                await _context.SaveChangesAsync();


                var log = new IssueCategoriesAudit();
                CategoriesAddLog(dbIssueCategory.IssueCategoriesId, userId, "Added Categories", datenow);

            }
            else {
                dbIssueCategory = await _context.IssueCategories
                           .FirstOrDefaultAsync(x => x.IssueCategoriesId == param.IssueCategoriesId && x.IsActive == true)!;


                if (param.Action == "Edit")
                {
                    TimeValidate(param.ModifiedTime, dbIssueCategory.ModifiedTime, validate );
                    IsCategoriesValueChanged(param, validate, dbIssueCategory);
                    UpdateCategories(param, dbIssueCategory ,datenow);
                    CategoriesAddLog(param.IssueCategoriesId, userId, "Edited Categories", datenow);
                }
                else if (param.Action == "Delete")
                {
                    TimeValidate(param.ModifiedTime, dbIssueCategory.ModifiedTime, validate);
                    DeActiveCategories(dbIssueCategory);
                    CategoriesAddLog(param.IssueCategoriesId, userId, "Deactivated Categories", datenow);

                }

            }

            await _context.SaveChangesAsync();

            return dbIssueCategory;
            

        }

        private static void TimeValidate(DateTime dbTime , DateTime paramTime, ValidateException validate)
        {
            if (paramTime != dbTime)
            {
                validate.Add("time", "กรุณารีเฟรชหน้านีแล้วลองใหม่");
                validate.Throw();
            }
        }

        private void DeActiveCategories(IssueCategories? dbIssueCategory)
        {
            dbIssueCategory.IsActive = false;
            _context.IssueCategories.Update(dbIssueCategory);
        }

        private void DeActiveProduct(Product dbProduct)
        {
            dbProduct.IsActive = false;
            _context.Product.Update(dbProduct);
        }

        private void CategoriesAddLog(int categoriesId , int userId,string action,DateTime dateNow)
        {
            var log = new IssueCategoriesAudit();

            log.Action = action;
            log.ActionTime = dateNow;
            log.ActionBy = userId;
            log.IssueCategoriesId = categoriesId;

            _context.IssueCategoriesAudit.Add(log);
        }

        private void ProductAddLog(int productId, int userId, string action, DateTime dateNow)
        {
            var log = new IssueCategoriesAudit();

            log.Action = action;
            log.ActionTime = dateNow;
            log.ActionBy = userId;
            log.IssueCategoriesId = productId;

            _context.IssueCategoriesAudit.Add(log);
        }

        private void UpdateCategories(CategoriesParam param, IssueCategories dbIssueCategory, DateTime dateNow)
        {
            dbIssueCategory.IssueCategoriesDescription = param.IssueCategoriesDescription;
            dbIssueCategory.IssueCategoriesName = param.IssueCategoriesName;
            dbIssueCategory.ModifiedTime = dateNow;
            _context.IssueCategories.Update(dbIssueCategory);
        }

        private static void IsCategoriesValueChanged(CategoriesParam param, ValidateException validate, IssueCategories dbIssueCategory)
        {


            if (param.IssueCategoriesName == dbIssueCategory.IssueCategoriesName &&
      param.IssueCategoriesDescription == dbIssueCategory.IssueCategoriesDescription)
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
                validate.Add("Categories", "Categories not found");

            var productList = await _context.Rel_Categories_Product
                .Where(r => r.IssueCategoriesId == param.CategoriesId)
                .ToListAsync();

            if (productList.Count > 0)
            {
                // validate
                var dbModifiedTime = productList.Select(s => s.CreatedTime).Max();

                if (param.ModifiedTime != dbModifiedTime)
                {
                    // validate
                    validate.Add("ModifiedTime", "Time Not Match!");
                }
            }

            validate.Throw();

            // ดึง products ที่ active และอยู่ใน request
            var products = await _context.Product
                .Where(p => p.IsActive && param.product.Contains(p.ProductId))
                .ToListAsync();

            // สร้าง relation ใหม่
            var newRelations = products.Select(p => new Rel_Categories_Product
            {
                IssueCategories = categories,
                Product = p,
                CreatedTime = DateTime.Now
            }).ToList();

            // แทนที่ relation เดิม
            categories.Rel_Categories_Product = newRelations;

            await _context.SaveChangesAsync();

            return true;

        }

        

        public async Task<CategoriesMapProductViewModel> LoadCategories(int id)
        {
            var validate = new ValidateException();

            var selectedProducts = await _context.Rel_Categories_Product
                .Include(x => x.Product)
                     .Where(rc => rc.IssueCategoriesId == id)


                     .ToListAsync();


            validate.Throw();


            //สร้าง DTO
            var data = new CategoriesMapProductViewModel
            {
                CategoriesId = id,
                product = selectedProducts.Select(x => x.ProductId.ToString()).ToList(),
                ModifiedTime = selectedProducts.Max(x => x.CreatedTime),
                ProductText = string.Join(", ", selectedProducts.Select(x => x.Product.ProductName))
            };
            return data;
        }


        public int GetCurrentUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            //if (user == null) throw new Exception("User not found");

            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }





        //Query
        public async  Task<QueryViewModel<USP_Query_CategoriesResult>> QueryCategoriesByText(DevExtremeParam<SearchCategoriesParam> param)
        
        {

           

            var result = await _context.Procedures.USP_Query_CategoriesAsync(param.SearchCriteria.Text, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            //var result = await _context.Procedures.USP_Query_NameAsync(text, loadParam.Skip, loadParam.Take, loadParam.Sort[0].Selector, "DESC");
           
            var data = new QueryViewModel<USP_Query_CategoriesResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;



            return data;


        }

        //Product on categories
        public async Task<QueryViewModel<USP_Query_IssueProductResult>> QueryProducts(DevExtremeParam<SearchProductParam> param)

        {


            var result = await _context.Procedures.USP_Query_IssueProductAsync(param.SearchCriteria.ProductName, param.SearchCriteria.CategoriesText,param.SearchCriteria.IsMap, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            //var result = await _context.Procedures.USP_Query_NameAsync(text, loadParam.Skip, loadParam.Take, loadParam.Sort[0].Selector, "DESC");

            var data = new QueryViewModel<USP_Query_IssueProductResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;



            return data;


        }



    }
}
