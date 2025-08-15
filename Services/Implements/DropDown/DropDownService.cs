using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels.CategoriesProduct;
using Domain.ViewModels.MappingCategories;
using Domain.ViewModels.MappingCategoriesProduct;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements.DropDown
{
    public class DropDownService : IDropDownService
    {

        private readonly MYGAMEContext _context;

        public DropDownService(MYGAMEContext context)
        {
            _context = context;
        }

        public async Task<CategoriesWithSelectionDto> GetUserMapCategoriesDropDown(int userId)
        {
            // ดึง category ทั้งหมดที่ active
            var allCategories = await _context.IssueCategories
                .Where(c => c.IsActive)
                .ToListAsync();

            // ดึง categoryId ที่ user แมพอยู่
            var selectedCategoryIds = await _context.Rel_User_Categories
                .Where(rc => rc.UserId == userId)
                .Select(rc => rc.IssueCategoriesId)
                .ToListAsync();

            // สร้าง DTO
            var data = new CategoriesWithSelectionDto
            {
                AllProducts = allCategories,
                SelectedCategories = selectedCategoryIds
            };

            return data;
        }

        public async Task<ProductWithSelectionDto> GetProductsWithSelection(int categoryId)
        {
            var allProducts = await _context.Product
                .Where(p => p.IsActive)
                .ToListAsync();

            var selectedProductIds = allProducts
                .Where(p => _context.RelCategoriesProduct
                    .Any(rc => rc.IssueCategoriesId == categoryId && rc.ProductId == p.ProductId))
                .Select(p => p.ProductId)
                .ToList();


            ProductWithSelectionDto data = new ProductWithSelectionDto();
            data.AllProducts = allProducts;
            data.SelectedProductIds = selectedProductIds;

            return data;
        }


        //public async Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport()
        //{
        //    var usersWithRole = await (from u in _context.User
        //                               join r in _context.Role
        //                                   on u.RoleId equals r.RoleId
        //                               where r.RoleId == 3
        //                               select new UserWithRoleViewModel
        //                               {
        //                                   UserId = u.UserId,
        //                                   Username = u.Username,
        //                                   RoleId = r.RoleId,
        //                                   RoleName = r.RoleName
        //                               }).ToListAsync();

        //    return usersWithRole;
        //}

        public async Task<IEnumerable<Role>> GetRoleItem()
        {
            var role = await _context.Role.Where(r => r.IsActive == true)
                       .Select(r => new Role
                       {
                           RoleId = r.RoleId,
                           RoleName = r.RoleName

                       })
                       .ToListAsync();

            return role;
        }

        //public async Task<IEnumerable<IssueCategories>> GetCategoriesItems()
        //{
        //    var categories = await _context.IssueCategories
        //        .Where(c => c.IsActive == true)
        //                .Select(c => new IssueCategories
        //                {
        //                    IssueCategoriesId = c.IssueCategoriesId,
        //                    IssueCategoriesName = c.IssueCategoriesName,
        //                    IsProgramIssue = c.IsProgramIssue,
        //                    IsActive = c.IsActive,
        //                    CreatedTime = c.CreatedTime,
        //                    ModifiedTime = c.ModifiedTime
        //                })
        //                .ToListAsync();

        //    return categories;
        //}


        //public async Task<IEnumerable<Product>> GetProductItems()
        //{
        //    var products = await _context.Product
        //            .Where(c => c.IsActive == true)
        //                .Select(p => new Product
        //                {
        //                    ProductId = p.ProductId,
        //                    ProductName = p.ProductName,
        //                    IsActive = p.IsActive,

        //                    CreatedTime = p.CreatedTime
        //                    ,
        //                    ModifiedTime = p.ModifiedTime


        //                })
        //                .ToListAsync();

        //    return products;
        //}



    }



}


