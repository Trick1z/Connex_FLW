using Domain.Interfaces;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;




namespace Services.Services
{
    public class GenNumberService : IGenNumberService
    {
        private readonly MYGAMEContext _context;

        public GenNumberService(MYGAMEContext context)
        {
            _context = context;
        }

        public async Task<string> GenDocNo(string prefix, int delay = 0)
        {
            var createTime = DateTime.Now;

            var currentYearMonth = (createTime.Year) * 100 + createTime.Month;

            try
            {
                using var tx = await _context.Database.BeginTransactionAsync();
                var rn = await _context.RunningNo.FirstOrDefaultAsync(r => r.Prefix == prefix);
                if (rn == null)
                {
                    rn = new RunningNo
                    {
                        Prefix = prefix,
                        NextNumber = 1,
                        YearMonth = currentYearMonth.ToString(),
                        ModifiedTime = createTime
                    };
                    _context.RunningNo.Add(rn);
                }
                else
                {
                    if (rn.YearMonth != currentYearMonth.ToString())
                    {
                        rn.NextNumber = 1;
                        rn.YearMonth = currentYearMonth.ToString();
                    }
                }
                var docNo = $"{currentYearMonth}{rn.NextNumber:000}";

                rn.NextNumber++;
                rn.ModifiedTime = createTime;

                await _context.SaveChangesAsync();

                if (delay > 0)
                    await Task.Delay(delay);

                await tx.CommitAsync();

                return docNo;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 1205)
            {
                Console.WriteLine($"Deadlock detected in GenDocNo: {sqlEx.Message}");
                return $"Deadlock detected in GenDocNo: {sqlEx.Message}";
            }
        }
    }
}



