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

        public async Task<List<DropDownViewModel>> GetUserMapCategoriesDropDown()
        {


            var allCategories = await _context.IssueCategories.AsNoTracking()
                        .Where(c => c.IsActive)
                        .Select(c => new DropDownViewModel
                        {
                            ShowText = c.IssueCategoriesName,
                            Value = c.IssueCategoriesId.ToString(),
                        })
                        .ToListAsync();

          

            return allCategories;
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


        public async Task<IEnumerable<Product>> GetProductsItems()
        {
            var products = await _context.Product
                    .Where(c => c.IsActive == true)
                        .Select(p => new Product
                        {
                            ProductId = p.ProductId,
                            ProductName = p.ProductName,
                            IsActive = p.IsActive,
                            CreatedTime = p.CreatedTime,
                            ModifiedTime = p.ModifiedTime
                        })
                        .ToListAsync();

            return products;
        }
        public async Task<List<DropDownViewModel>> GetCategoriesProductsDropDown()
        {
            var allPProducrs = await _context.Product.AsNoTracking()
                        .Where(c => c.IsActive)
                        .Select(c => new DropDownViewModel
                        {
                            ShowText = c.ProductName,
                            Value = c.ProductId.ToString(),
                        })
                        .ToListAsync();



            return allPProducrs;
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


