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
            
            try
            {
         
                using var tx = _context.Database.BeginTransaction();

                RunningNo rn = _context.RunningNo.FirstOrDefault(r => r.Prefix == prefix) ?? new RunningNo() { NextNumber = 1, Prefix = prefix ,ModifiedTime = createTime };
                if (rn.Id == 0)
                    _context.RunningNo.Add(rn);


                var docNo = $"{createTime.ToString(prefix)}{rn.NextNumber:000}";
            
                rn.NextNumber++;
                rn.ModifiedTime = createTime;

                await _context.SaveChangesAsync();
                await Task.Delay(delay); // จงใจหน่วง → เปิดโอกาสอีก thread เข้ามาล็อก
               


                await tx.CommitAsync();
                //Console.WriteLine($"Created Document {doc.DocNo}");
                return  docNo;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 1205)
            {
                Console.WriteLine($"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}");
                return $"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}";
            }
        }
    }
}
