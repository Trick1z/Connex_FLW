using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class DropDownService : IDropDownService
    {

        private readonly MYGAMEContext _context;

        public DropDownService(MYGAMEContext context)
        {
            _context = context;
        }

        public async Task<CategoriesWithSelectedItem> GetUserMapCategoriesDropDown(int userId)
        {


            var allCategories = await _context.IssueCategories
                        .Where(c => c.IsActive)
                        .Select(c => new AllCategories
                        {
                            IssueCategoriesId = c.IssueCategoriesId,
                            IssueCategoriesName = c.IssueCategoriesName
                        })
                        .ToListAsync();

            var selectedCategories = await _context.Rel_User_Categories
                        .Where(rc => rc.UserId == userId)
                        .Join(
                            _context.IssueCategories,
                            rc => rc.IssueCategoriesId,
                            c => c.IssueCategoriesId,
                            (rc, c) => new AllCategories
                            {
                                IssueCategoriesId = c.IssueCategoriesId,
                                IssueCategoriesName = c.IssueCategoriesName
                            })
                        .ToListAsync();


            // สร้าง DTO
            var data = new CategoriesWithSelectedItem
            {
                AllCategories = allCategories,
                SelectedCategories = selectedCategories
            };

            return data;
        }

        public async Task<ProductWithSelectionDto> GetProductsWithSelection(int categoryId)
        {
            // ดึงสินค้าทั้งหมดที่ Active
            var allProducts = await _context.Product
                .Where(p => p.IsActive)
                .Select(p => new AllProducts
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName
                })
                .ToListAsync();

            // ดึงสินค้าที่ถูกเลือก (mapped กับ categoryId)
            var selectedProductIds = await _context.RelCategoriesProduct
                .Where(rc => rc.IssueCategoriesId == categoryId)
                .Select(rc => rc.ProductId)
                .ToListAsync();

            // ส่งข้อมูลออก (AllProducts = ตัวเลือกทั้งหมด, SelectedProduct = id ที่เลือกไว้)
            var productWithSelection = new ProductWithSelectionDto
            {
                AllProducts = allProducts,
                SelectedProduct = allProducts
                    .Where(p => selectedProductIds.Contains(p.ProductId))
                    .ToList()
            };

            return productWithSelection;
        }



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

       

    }



}


