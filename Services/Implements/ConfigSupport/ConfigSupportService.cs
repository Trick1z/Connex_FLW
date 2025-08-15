using Domain.Interfaces.ConfigSupport;
using Domain.Models;
using Domain.ViewModels.MappingCategories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements.ConfigSupport
{
    public class ConfigSupportService : IConfigSupportService
    {

        private readonly MYGAMEContext _context;

        public ConfigSupportService(MYGAMEContext context)
        {
            _context = context;
        }

        public async Task<Rel_User_Categories> InsertMapUserCategories(MappingUserCategoriesItem param)
        {
            // ดึง user พร้อม relation ปัจจุบัน
            var user = await _context.User
                .Include(u => u.Rel_User_Categories)
                .FirstOrDefaultAsync(u => u.UserId == param.UserId);

            if (user == null)
                throw new Exception("User not found");

            // ดึง categories ที่ active และอยู่ใน request
            var categories = await _context.IssueCategories
                .Where(c => c.IsActive && param.CategoriesId.Contains(c.IssueCategoriesId))
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
    }
}
