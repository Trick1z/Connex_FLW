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
    public class ConfigSupportService : IConfigSupportService
    {

        private readonly MYGAMEContext _context;

        public ConfigSupportService(MYGAMEContext context)
        {
            _context = context;
        }

        public async Task<Rel_User_Categories> SaveUserCategories(SaveUserCategoriesParam param)
        {
            // ดึง user พร้อม relation ปัจจุบัน
            var validate = new ValidateException();

            var user = await _context.User
                .Include(u => u.Rel_User_Categories)
                .FirstOrDefaultAsync(u => u.UserId == param.UserId);

            if (user == null)
                throw new Exception("User not found");

            var categoriesList = await _context.Rel_User_Categories.Where(r => r.UserId == param.UserId).ToListAsync();

            if (categoriesList.Count > 0)
            {
                //validate


                var dbModifiedTime = categoriesList.Select(s => s.CreatedTime).Max();


                if (param.ModifiedTime != dbModifiedTime)
                {
                    //validate
                    validate.Add("ModifiedTime", "Time Not Match!");  
                }


            }

            validate.Throw();












            // ดึง categories ที่ active และอยู่ใน request
            var categories = await _context.IssueCategories
                .Where(c => c.IsActive && param.Categories.Contains(c.IssueCategoriesId))
                .ToListAsync();

            // สร้าง relation ใหม่
            var newRelations = categories.Select(c => new Rel_User_Categories
            {
                User = user,
                IssueCategories = c,
                CreatedTime = DateTime.Now
            }).ToList();

            // แทนที่ relation เดิม
            user.Rel_User_Categories = newRelations;

            await _context.SaveChangesAsync();

            return null;
        }

        public async Task<IEnumerable<UserWithRoleViewModel>> GetUserByRoleSupport()
        {
            var usersWithRole = await (from u in _context.User
                                       join r in _context.Role
                                           on u.RoleId equals r.RoleId
                                       where r.RoleId == 3
                                       select new UserWithRoleViewModel
                                       {
                                           UserId = u.UserId,
                                           Username = u.Username,
                                           RoleId = r.RoleId,
                                           RoleName = r.RoleName
                                       }).ToListAsync();

            return usersWithRole;
        }

        public async Task<UserMapCategoriesViewModel> LoadUser(int id)
        {
            var selectedCategories = await _context.Rel_User_Categories
                .Include(x => x.IssueCategories)
                     .Where(rc => rc.UserId == id)
                     

                     .ToListAsync();


            //สร้าง DTO
            var data = new UserMapCategoriesViewModel
            {
                UserId = id,
                Categories = selectedCategories.Select(x => x.IssueCategoriesId.ToString()).ToList(),
                ModifiedTime = selectedCategories.Max(x => x.CreatedTime),
                CategoriesText = string.Join(", ", selectedCategories.Select(x => x.IssueCategories.IssueCategoriesName))
            };
            return data;
        }
    }
}
