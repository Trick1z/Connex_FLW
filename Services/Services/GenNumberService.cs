using Domain.Interfaces;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



//        public async Task<string> GenDocNo(string prefix, int delay = 0)
//        {
//            var createTime = DateTime.Now;
//            try
//            {

//                using var tx = _context.Database.BeginTransaction();

//                RunningNo rn = _context.RunningNo.FirstOrDefault(r => r.Prefix == prefix) ?? new RunningNo() { NextNumber = 1, Prefix = prefix, ModifiedTime = createTime };


//                if (rn.Id == 0)
//                    _context.RunningNo.Add(rn);


//                var docNo = $"{createTime.ToString(prefix)}{rn.NextNumber:000}";

//                rn.NextNumber++;
//                rn.ModifiedTime = createTime;

//                await _context.SaveChangesAsync();
//                await Task.Delay(delay); // จงใจหน่วง → เปิดโอกาสอีก thread เข้ามาล็อก



//                await tx.CommitAsync();
//                //Console.WriteLine($"Created Document {doc.DocNo}");
//                return docNo;
//            }
//            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 1205)
//            {
//                Console.WriteLine($"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}");
//                return $"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}";
//            }
//        }
//    }


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

            // แปลงเป็น YearMonth (ถ้าต้องการใช้ พ.ศ. = +543) เช่น 256808
            var currentYearMonth = (createTime.Year + 543) * 100 + createTime.Month;

            try
            {
                using var tx = await _context.Database.BeginTransactionAsync();

                // ดึง RunningNo ของ prefix
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
                    // ถ้าเดือนเปลี่ยน → รีเซ็ต NextNumber
                    if (rn.YearMonth != currentYearMonth.ToString())
                    {
                        rn.NextNumber = 1;
                        rn.YearMonth = currentYearMonth.ToString();
                    }
                }

                // สร้างเลขเอกสาร (format: PREFIX-YYYYMM-###)
                var docNo = $"{currentYearMonth}{rn.NextNumber:000}";

                // อัปเดต NextNumber และ ModifiedTime
                rn.NextNumber++;
                rn.ModifiedTime = createTime;

                await _context.SaveChangesAsync();

                // intentional delay เพื่อทดสอบ concurrency
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



