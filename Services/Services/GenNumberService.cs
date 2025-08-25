using Domain.Interfaces;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//namespace Services.Services
//{
//    public class GenNumberService : IGenNumberService

//    {
//        private readonly MYGAMEContext _context;



//        public GenNumberService(MYGAMEContext context)
//        {
//            _context = context;
//        }

//        public async Task<string> GenDocNo(string prefix, int delay = 0)
//        {
//            var createTime = DateTime.Now;

//            try
//            {

//                using var tx = _context.Database.BeginTransaction();

//                RunningNo rn = _context.RunningNo.FirstOrDefault(r => r.Prefix == prefix) ?? new RunningNo() { NextNumber = 1, Prefix = prefix ,ModifiedTime = createTime };
//                if (rn.Id == 0)
//                    _context.RunningNo.Add(rn);


//                var docNo = $"{createTime.ToString(prefix)}{rn.NextNumber:000}";

//                rn.NextNumber++;
//                rn.ModifiedTime = createTime;

//                await _context.SaveChangesAsync();
//                await Task.Delay(delay); // จงใจหน่วง → เปิดโอกาสอีก thread เข้ามาล็อก



//                await tx.CommitAsync();
//                //Console.WriteLine($"Created Document {doc.DocNo}");
//                return  docNo;
//            }
//            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 1205)
//            {
//                Console.WriteLine($"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}");
//                return $"Deadlock detected in CreateDocument_Bad: {sqlEx.Message}";
//            }
//        }
//    }
//}


using System;
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
            var yearMonth = createTime.ToString("yyyyMM"); // ใช้ reset เดือนใหม่

            try
            {
                // ใช้ Serializable isolation level ป้องกัน race condition
                using var tx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

                // หา RunningNo ของเดือนปัจจุบัน
                var rn = await _context.RunningNo
                    .FirstOrDefaultAsync(r => r.Prefix == prefix && r.YearMonth == yearMonth);

                if (rn == null)
                {
                    // ถ้าไม่มี record เดือนนี้ → สร้างใหม่
                    rn = new RunningNo
                    {
                        Prefix = prefix,
                        YearMonth = yearMonth,
                        NextNumber = 1,
                        ModifiedTime = createTime
                    };
                    _context.RunningNo.Add(rn);
                }

                // สร้างเลขเอกสาร
                var docNo = $"{prefix}{yearMonth}{rn.NextNumber:000}";

                // เพิ่ม next number และปรับเวลาแก้ไข
                rn.NextNumber++;
                rn.ModifiedTime = createTime;

                await _context.SaveChangesAsync();

                // จำลอง delay เพื่อทดสอบ concurrency
                if (delay > 0)
                    await Task.Delay(delay);

                await tx.CommitAsync();

                return docNo;
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 1205)
            {
                // Deadlock handling
                Console.WriteLine($"Deadlock detected: {sqlEx.Message}");
                return $"Deadlock detected: {sqlEx.Message}";
            }
        }
    }
}
