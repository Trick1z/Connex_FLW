using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.UserControl
{
    public class CheckBoxService : ICheckBoxService
    {

        private readonly MYGAMEContext _context;

        public CheckBoxService(MYGAMEContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<CheckBoxViewModel<int>>> GetCategoryCheckBoxesAsync()
        {
            var categories = await _context.IssueCategories
                .Where(c => c.IsActive == true)
                        .Select(c => new CheckBoxViewModel<int>
                        {
                            Value  = c.IssueCategoriesId,
                            Text = c.IssueCategoriesName,
                            Selected = false
                        })
                        .ToListAsync();

            return categories;
        }

        public async Task<IEnumerable<CheckBoxViewModel<string>>> GetStatusCheckBoxesAsync()
        {
            var categories = await _context.Ref_FormStatus
                 .Select(c => new CheckBoxViewModel<string>
                 {
                     Value = c.SystemStatusCode,
                     Text = c.UserStatusCode,
                     Selected = false
                 })
                 .ToListAsync();

            return categories;

        }
    }
}
