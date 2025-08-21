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

        public IssueProductService(MYGAMEContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _contextAccessor = httpContextAccessor;

        }
        //InsertCategories
        public async Task<IEnumerable<IssueCategories>> InsertCategoriesItems(InsertCategories requried)
        {
            var validate = new ValidateException();
            var itemIndex = 1;
            await IsNullOrEmptyString(requried, validate, itemIndex);
            await IsCategoryInTable(requried, validate, itemIndex);

            validate.Throw();

            IssueCategories data = PackedData(requried);

            _context.IssueCategories.Add(data);
            //log

            Log_Categories log = PrepairLogData(GetCurrentUserId());

            _context.Log_Categories.Add(log);

            await _context.SaveChangesAsync();

            //return data;
            return new List<IssueCategories> { data };

        }

        private static Log_Categories PrepairLogData(int userId)
        {
            var log = new Log_Categories();
            log.ActionBy = userId;
            log.ActionTime = DateTime.Now;
            log.ActionType = "Save Categories";
            return log;
        }

        private static IssueCategories PackedData(InsertCategories requried)

        {

            var dateNow = DateTime.Now;

            IssueCategories data = new IssueCategories();
            data.IssueCategoriesName = requried.IssueCategoriesName;
            data.IsProgramIssue = requried.IsProgramIssue;
            data.IsActive = true;
            data.CreatedTime = dateNow;
            data.ModifiedTime = dateNow;
            return data;
        }

        public async Task<bool> IsCategoryInTable(InsertCategories request, ValidateException validate, int itemIndex)
        {
            var isExists = await _context.IssueCategories
     .FirstOrDefaultAsync(u => u.IssueCategoriesName == request.IssueCategoriesName);

            if (isExists != null)
                validate.Add("CategoryName", $"Item {itemIndex} : This CategoryName are already added!");

            return false;
        }


        public async Task<bool> IsNullOrEmptyString(InsertCategories requried, ValidateException validate, int itemIndex)
        {
            if (string.IsNullOrWhiteSpace(requried.IssueCategoriesName))
                validate.Add("CategoryName", $"Item {itemIndex} : Field CategoryName Much Not Empty");


            return false;
        }

        //InsertProduct
        public async Task<IEnumerable<Product>> InsertProductItem(InsertProduct requried)
        {
            var validate = new ValidateException();
            var itemIndex = 1;


            IsNullOrEmpty(requried, validate,itemIndex);
            await IsProductInTable(requried, validate , itemIndex);

            validate.Throw();

            Product data = PackedData(requried);

            Log_Categories log = AddLog(GetCurrentUserId());

            _context.Product.Add(data);
            _context.Log_Categories.Add(log);
            await _context.SaveChangesAsync();


            return new List<Product> { data };

        }

        private static Log_Categories AddLog(int userId)
        {
            var log = new Log_Categories();
            log.ActionBy = userId;
            log.ActionTime = DateTime.Now;
            log.ActionType = "Save Products";
            return log;
        }

        public static Product PackedData(InsertProduct requried)
        {
            var date = DateTime.Now;
            Product data = new Product();

            data.ProductName = requried.ProductName;
            data.CreatedTime = date;
            data.IsActive = true;
            data.ModifiedTime = date;

            return data;
        }

        public bool IsNullOrEmpty(InsertProduct requried, ValidateException validate, int itemIndex)
        {


            if (string.IsNullOrEmpty(requried.ProductName))
                validate.Add("ProductName", $"Item {itemIndex} : ProductName Much Not Empty!!");

            return false;



        }
        public async Task<bool> IsProductInTable(InsertProduct request, ValidateException validate, int itemIndex)
        {
            var isExists = await _context.Product
     .FirstOrDefaultAsync(u => u.ProductName == request.ProductName);

            if (isExists != null)
                validate.Add("ProductName", $"Item {itemIndex} : This ProductName are already added!");

            return false;
        }


        //Update
        public async Task<IssueCategories> UpdateCategoriesItems(UpdateCategories param)
        {
            var validate = new ValidateException();
            var itemIndex = 1;
            IsCategoriesIdValidate(param, validate, itemIndex);
            IsCategoriesFieldNullOrEmptyString(param, validate, itemIndex);

            IssueCategories resp = await GetExistCategoriesInDatabase(param, validate, itemIndex);

            var categoriesItem = await _context.IssueCategories.Where(r => r.IssueCategoriesId == param.IssueCategoriesId).ToListAsync();


            var dbModifiedTime = categoriesItem.Select(s => s.ModifiedTime).Max();


            if (param.ModifiedTime != dbModifiedTime)
            {
                validate.Add("ModifiedTime", "Please f5 and try again");
            }


            validate.Throw();

            var dateNow = DateTime.Now;
            resp.IssueCategoriesName = param.IssueCategoriesName;
            resp.IsProgramIssue = param.IsProgramIssue;
            resp.ModifiedTime = dateNow;

            var log = new Log_Categories();

            log.ActionTime = DateTime.Now;
            log.ActionBy = GetCurrentUserId();
            log.ActionType = "Update Categories";
            _context.Log_Categories.Add(log);

            await _context.SaveChangesAsync();



            //return new List<IssueCategories> { resp };
            return resp;

        }

        public async Task<Product> UpdateProductItems(UpdateProduct param)
        {
            var validate = new ValidateException();
            var itemIndex = 1;
            IsProductIdValidate(param, validate, itemIndex);
            IsProductFieldNullOrEmptyString(param, validate, itemIndex);
            Product resp = await GetExistProductInDatabase(param, validate, itemIndex);

            var productItem = await _context.Product
                .Where(r => r.ProductId == param.ProductId).ToListAsync();


            var dbModifiedTime = productItem.Select(s => s.ModifiedTime).Max();


            if (param.ModifiedTime != dbModifiedTime)
            {
                validate.Add("ModifiedTime", "Please Reload Page and try again");
            }


            validate.Throw();

            var dateNow = DateTime.Now;
            resp.ProductName = param.ProductName;
            resp.ModifiedTime = dateNow;

            var log = new Log_Categories();

            log.ActionTime = DateTime.Now;
            log.ActionBy = GetCurrentUserId();
            log.ActionType = "Update Product";

            _context.Log_Categories.Add(log);


            await _context.SaveChangesAsync();

            return resp;

        }


        //futures



        private async Task<IssueCategories> GetExistCategoriesInDatabase(UpdateCategories req, ValidateException validate,int itemIndex)
        {
            var DataInDb = await _context.IssueCategories.FirstOrDefaultAsync(u => u.IssueCategoriesId == req.IssueCategoriesId);

            if (DataInDb == null)
                validate.Add("Categories", $"Item {itemIndex} : Not Found Categories");

            return DataInDb;
        }


        private bool IsCategoriesFieldNullOrEmptyString(UpdateCategories req, ValidateException validate, int itemIndex)
        {
            if (string.IsNullOrWhiteSpace(req.IssueCategoriesName))
            {
                validate.Add("Categories", $"Item {itemIndex} : IssueCategoriesName is required for update");
                return true;
            }

            return false;
        }


        private bool IsCategoriesIdValidate(UpdateCategories req, ValidateException validate, int itemIndex)
        {
            if (req.IssueCategoriesId < 0)
            {
                validate.Add("Categories", $"Item {itemIndex} : IssueCategoriesId is required for update");

                return false;
            }

            return true;
        }

        //product
        private bool IsProductIdValidate(UpdateProduct req, ValidateException validate, int itemIndex)
        {
            if (req.ProductId < 0)
            {
                validate.Add("Product", $"Item {itemIndex} : ProductId is required for update");

                return false;
            }

            return true;
        }
        private bool IsProductFieldNullOrEmptyString(UpdateProduct req, ValidateException validate, int itemIndex)
        {
            if (string.IsNullOrWhiteSpace(req.ProductName))
            {
                validate.Add("Product", $"Item {itemIndex} : ProductName is required for update");
                return true;
            }

            return false;
        }

        private async Task<Product> GetExistProductInDatabase(UpdateProduct req, ValidateException validate, int itemIndex)
        {
            var IsInDb = await _context.Product.FirstOrDefaultAsync(u => u.ProductId == req.ProductId);

            if (IsInDb == null)
                validate.Add("Product", $"Item {itemIndex} : Not Found Product");

            return IsInDb;

        }


        //delete

        public async Task<IEnumerable<IssueCategories>> DeleteCategoriesItems(DeleteCategories req)
        {


            var validate = new ValidateException();
            var itemIndex = 1;
            IssueCategories res = await GetIssueCategoriesExists(req, validate ,itemIndex );

            validate.Throw();

            var dateNow = DateTime.Now;

            //update isactive and save 
            res.IsActive = false;
            res.ModifiedTime = dateNow;

            var log = new Log_Categories();

            log.ActionTime = DateTime.Now;
            log.ActionBy = GetCurrentUserId();
            log.ActionType = "Delete Categories";

            _context.Log_Categories.Add(log);

            await _context.SaveChangesAsync();

            return new List<IssueCategories> { res };

        }

        public async Task<IEnumerable<Product>> DeleteProductItems(DeleteProduct req)
        {
            var validate = new ValidateException();
            var itemIndex = 1;
            Product res = await IsProductExists(req, validate,itemIndex);

            validate.Throw();

            var dateNow = DateTime.Now;

            //update isactive and save 
            res.IsActive = false;
            res.ModifiedTime = dateNow;

            var log = new Log_Categories();

            log.ActionTime = DateTime.Now;
            log.ActionBy = GetCurrentUserId();
            log.ActionType = "Delete Product";

            _context.Log_Categories.Add(log);

            await _context.SaveChangesAsync();

            return new List<Product> { res };

        }

        //futures
        private async Task<IssueCategories> GetIssueCategoriesExists(DeleteCategories req, ValidateException validate, int itemIndex)
        {
            var DataExists = await _context.IssueCategories
                            .FirstOrDefaultAsync(u => u.IssueCategoriesName == req.IssueCategoriesName &&
                                        u.IssueCategoriesId == req.IssueCategoriesId);

            if (DataExists == null)
                validate.Add("Categories", $"Item {itemIndex} : Not Found This Categories");


            return DataExists;
        }

        private async Task<Product> IsProductExists(DeleteProduct req, ValidateException validate , int itemIndex)
        {
            var dataExists = await _context.Product
                            .FirstOrDefaultAsync(u => u.ProductName == req.ProductName &&
                                        u.ProductId == req.ProductId);

            if (dataExists == null)
                validate.Add("Product", $"Item {itemIndex} : Not Found This Product");


            return dataExists;
        }


        //mapIssueProduct
        public async Task<bool> SaveCategoriesProduct(SaveCategoriesProductParam param)
        {
            var validate = new ValidateException();
            var itemIndex = 1;

            var categories = await _context.IssueCategories
                .Include(c => c.Rel_Categories_Product)
                .FirstOrDefaultAsync(c => c.IssueCategoriesId == param.CategoriesId);

            if (categories == null)
                validate.Add("Categories", $"Item {itemIndex} : Categories not found");

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
                    validate.Add("ModifiedTime", $"Item {itemIndex} : Time Not Match!");
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

        public async Task<IEnumerable<IssueCategories>> GetCategoriesItems()
        {
            var categories = await _context.IssueCategories
                .Where(c => c.IsActive == true)
                        .Select(c => new IssueCategories
                        {
                            IssueCategoriesId = c.IssueCategoriesId,
                            IssueCategoriesName = c.IssueCategoriesName,
                            IsProgramIssue = c.IsProgramIssue,
                            IsActive = c.IsActive,
                            CreatedTime = c.CreatedTime,
                            ModifiedTime = c.ModifiedTime
                        })
                        .ToListAsync();

            return categories;
        }


        public async Task<IEnumerable<Product>> GetProductItems()
        {
            var products = await _context.Product
                    .Where(c => c.IsActive == true)
                        .Select(p => new Product
                        {
                            ProductId = p.ProductId,
                            ProductName = p.ProductName,
                            IsActive = p.IsActive,
                            CreatedTime = p.CreatedTime  ,
                            ModifiedTime = p.ModifiedTime
                        })
                        .ToListAsync();

            return products;
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


            var result = await _context.Procedures.USP_Query_IssueProductAsync(param.SearchCriteria.ProductName, param.SearchCriteria.CategoriesText, param.LoadOption.Skip, param.LoadOption.Take, param.SortField, param.SortBy);
            //var result = await _context.Procedures.USP_Query_NameAsync(text, loadParam.Skip, loadParam.Take, loadParam.Sort[0].Selector, "DESC");

            var data = new QueryViewModel<USP_Query_IssueProductResult>();
            data.Data = result;
            data.TotalCount = result.Select(x => x.TotalCount).FirstOrDefault() ?? 0;



            return data;


        }


        public async Task<IEnumerable<CheckBoxViewModel>> GetCheckBoxCategoriesItems()
        {
            var categories = await _context.IssueCategories
                .Where(c => c.IsActive == true)
                        .Select(c => new CheckBoxViewModel
                        {
                            Id = c.IssueCategoriesId,
                            Text = c.IssueCategoriesName,
                            Selected = false
                        })
                        .ToListAsync();

            return categories;
        }

    }
}
