using Domain.Exceptions;
using Domain.Interfaces.IssueProduct;
using Domain.Models;
using Domain.ViewModels.CategoriesProduct;
using Domain.ViewModels.MappingCategoriesProduct;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements.IssueProduct
{
    public class IssueProductService : IIssueProductService
    {



        private readonly MYGAMEContext _context;

        public IssueProductService(MYGAMEContext context)
        {
            _context = context;
        }
        //InsertCategories
        public async Task<IEnumerable<IssueCategories>> InsertCategoriesItems(InsertCategories requried)
        {
            var validate = new ValidateException();
            await IsNullOrEmptyString(requried, validate);
            await IsCategoryInTable(requried, validate);

            //var dateNow = DateTime.Now

            validate.Throw();



            IssueCategories data = PackedData(requried);

            _context.IssueCategories.Add(data);
            await _context.SaveChangesAsync();

            //return data;
            return new List<IssueCategories> { data };

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

        public async Task<bool> IsCategoryInTable(InsertCategories request, ValidateException validate)
        {
            var isExists = await _context.IssueCategories
     .FirstOrDefaultAsync(u => u.IssueCategoriesName == request.IssueCategoriesName);

            if (isExists != null)
                validate.Add("CategoryName", "This CategoryName are already added!");

            return false;
        }


        public async Task<bool> IsNullOrEmptyString(InsertCategories requried, ValidateException validate)
        {
            if (string.IsNullOrWhiteSpace(requried.IssueCategoriesName))
                validate.Add("CategoryName", "Field CategoryName Much Not Empty");


            return false;
        }

        //InsertProduct
        public async Task<IEnumerable<Product>> InsertProductItem(InsertProduct requried)
        {
            var validate = new ValidateException();

            IsNullOrEmpty(requried, validate);
            await IsProductInTable(requried, validate);

            validate.Throw();

            Product data = PackedData(requried);
            _context.Product.Add(data);
            await _context.SaveChangesAsync();


            return new List<Product> { data };

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

        public bool IsNullOrEmpty(InsertProduct requried, ValidateException validate)
        {


            if (string.IsNullOrEmpty(requried.ProductName))
                validate.Add("ProductName", "ProductName Much Not Empty!!");

            return false;



        }
        public async Task<bool> IsProductInTable(InsertProduct request, ValidateException validate)
        {
            var isExists = await _context.Product
     .FirstOrDefaultAsync(u => u.ProductName == request.ProductName);

            if (isExists != null)
                validate.Add("ProductName", "This ProductName are already added!");

            return false;
        }


        //Update
        public async Task<IssueCategories> UpdateCategoriesItems(UpdateCategories req)
        {
            var validate = new ValidateException();

            IsCategoriesIdValidate(req, validate);
            IsCategoriesFieldNullOrEmptyString(req, validate);

            IssueCategories resp = await IsCategoriesInDatabase(req, validate);

            validate.Throw();

            var dateNow = DateTime.Now;
            resp.IssueCategoriesName = req.IssueCategoriesName;
            resp.IsProgramIssue = req.IsProgramIssue;
            resp.ModifiedTime = dateNow;

            await _context.SaveChangesAsync();



            //return new List<IssueCategories> { resp };
            return resp;

        }

        public async Task<Product> UpdateProductItems(UpdateProduct req)
        {
            var validate = new ValidateException();

            IsProductIdValidate(req, validate);
            IsProductFieldNullOrEmptyString(req, validate);
            Product resp = await IsProductInDatabase(req, validate);

            validate.Throw();

            var dateNow = DateTime.Now;
            resp.ProductName = req.ProductName;
            resp.ModifiedTime = dateNow;

            await _context.SaveChangesAsync();

            return resp;

        }


        //futures



        private async Task<IssueCategories> IsCategoriesInDatabase(UpdateCategories req, ValidateException validate)
        {
            var IsInDb = await _context.IssueCategories.FirstOrDefaultAsync(u => u.IssueCategoriesId == req.IssueCategoriesId);

            if (IsInDb == null)
                validate.Add("Categories", "Not Found Categories");

            return IsInDb;
        }


        private bool IsCategoriesFieldNullOrEmptyString(UpdateCategories req, ValidateException validate)
        {
            if (string.IsNullOrWhiteSpace(req.IssueCategoriesName))
            {
                validate.Add("Categories", "IssueCategoriesName is required for update");
                return true;
            }

            return false;
        }


        private bool IsCategoriesIdValidate(UpdateCategories req, ValidateException validate)
        {
            if (req.IssueCategoriesId < 0)
            {
                validate.Add("Categories", "IssueCategoriesId is required for update");

                return false;
            }

            return true;
        }

        //product
        private bool IsProductIdValidate(UpdateProduct req, ValidateException validate)
        {
            if (req.ProductId < 0)
            {
                validate.Add("Product", "ProductId is required for update");

                return false;
            }

            return true;
        }
        private bool IsProductFieldNullOrEmptyString(UpdateProduct req, ValidateException validate)
        {
            if (string.IsNullOrWhiteSpace(req.ProductName))
            {
                validate.Add("Product", "ProductName is required for update");
                return true;
            }

            return false;
        }

        private async Task<Product> IsProductInDatabase(UpdateProduct req, ValidateException validate)
        {
            var IsInDb = await _context.Product.FirstOrDefaultAsync(u => u.ProductId == req.ProductId);

            if (IsInDb == null)
                validate.Add("Product", "Not Found Product");

            return IsInDb;

        }


        //delete

        public async Task<IEnumerable<IssueCategories>> DeleteCategoriesItems(DeleteCategories req)
        {


            var validate = new ValidateException();

            IssueCategories res = await IsExists(req, validate);

            validate.Throw();

            var dateNow = DateTime.Now;

            //update isactive and save 
            res.IsActive = false;
            res.ModifiedTime = dateNow;
            await _context.SaveChangesAsync();

            return new List<IssueCategories> { res };

        }

        public async Task<IEnumerable<Product>> DeleteProductItems(DeleteProduct req)
        {
            var validate = new ValidateException();

            Product res = await IsProductExists(req, validate);

            validate.Throw();

            var dateNow = DateTime.Now;

            //update isactive and save 
            res.IsActive = false;
            res.ModifiedTime = dateNow;
            await _context.SaveChangesAsync();

            return new List<Product> { res };

        }

        //futures
        private async Task<IssueCategories> IsExists(DeleteCategories req, ValidateException validate)
        {
            var isExists = await _context.IssueCategories
                            .FirstOrDefaultAsync(u => u.IssueCategoriesName == req.IssueCategoriesName &&
                                        u.IssueCategoriesId == req.IssueCategoriesId);

            if (isExists == null)
                validate.Add("Categories", "Not Found This Categories");


            return isExists;
        }

        private async Task<Product> IsProductExists(DeleteProduct req, ValidateException validate)
        {
            var isExists = await _context.Product
                            .FirstOrDefaultAsync(u => u.ProductName == req.ProductName &&
                                        u.ProductId == req.ProductId);

            if (isExists == null)
                validate.Add("Product", "Not Found This Product");


            return isExists;
        }


        //mapIssueProduct
        public async Task<IEnumerable<RelCategoriesProduct>> InsertMapCategoriesProduct(MappingCategoriesProductItem req)
        {


            var category = await _context.IssueCategories.Include(x => x.RelCategoriesProduct)
                .FirstOrDefaultAsync(x => x.IssueCategoriesId == req.CategoriesId);

            var products = await _context.Product.Where(x => x.IsActive == true)
                .Where(x => req.ProductsId.Contains(x.ProductId)).ToListAsync();


            var list = new List<RelCategoriesProduct>();
            foreach (var item in products)
            {
                list.Add(new RelCategoriesProduct()
                {
                    Product = item,
                    IssueCategories = category,
                    IsActive = true,
                    DeleteFlag = "N",
                    CreatedTime = DateTime.Now,
                    ModifiedTime = DateTime.Now
                });
            }

            category.RelCategoriesProduct = list;

            await _context.SaveChangesAsync();


            return null;
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

                            CreatedTime = p.CreatedTime
                            ,
                            ModifiedTime = p.ModifiedTime


                        })
                        .ToListAsync();

            return products;
        }

    }
}
