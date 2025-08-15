//using Domain.Exceptions;
//using Domain.Models;
//using Domain.ViewModels;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace MyApp
//{
//    public class ExampleCode_II_EF
//    {
//        public void ExampleUseCaseSimple_สร้างแม่สร้างลูก(InsertFormViewModel viewModelแม่)
//        {
//            var context = Program.CreateDbContext();

//            //create new object ของแม่
//            var form = new Form();
//            //mapping field to update
//            form.MemberId = viewModelแม่.UserId;
//            form.Description = viewModelแม่.Description;
//            foreach (var viewModelลูก_ทีละตัว in viewModelแม่.FormTask)
//            {
//                var สร้างลูกใหม่ = new FormTask();
//                สร้างลูกใหม่.Category = viewModelลูก_ทีละตัว.Category;
//                สร้างลูกใหม่.TaskName = viewModelลูก_ทีละตัว.TaskName;
//                //ย้ำ
//                สร้างลูกใหม่.Form = form;

//                //เพิ่มลูกลงไปให้แม่ด้วย
//                form.FormTask.Add(สร้างลูกใหม่);
//            }

//            //กด F12 ไปตรง Form จะเจอ DbSet<className> ให้มองเหมือนมันเป็น List
//            //จริงๆมันเป็นอะไร ? การบ้าน
//            context.Form.Add(form);
//            context.SaveChanges();
//        }

//        public Form ExampleUseCaseSimple_Loadแม่พร้อมลูกด้วย(int formId)
//        {
//            var context = Program.CreateDbContext();

//            //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List
//            //ทำการค้นหา
//            var dbForm = context.Form.Where(x => x.FormId == formId)
//                                .Include(x => x.FormTask)//เพิ่มตารางที่อยาก Join มาด้วยจะทำให้เข้าถึงลูกได้
//                                .FirstOrDefault();

//            //if (dbForm is null)
//                //throw new ValidateException("ใส่ Error Case นี้ไป");

//            //ค้นหาของไม่ต้องบันทึกอะไร
//            //context.SaveChanges();
//            return dbForm;
//        }

//        public void ExampleUseCaseSimple_Update_ลูกเก่าโดนลบ_ลูกใหม่โดนเพิ่ม_คนเดิมอัพเดท(int formId, InsertFormViewModel viewModel)
//        {
//            var context = Program.CreateDbContext();
//            //จะอัพเดทต้องหาของที่จะอัพในระบบก่อน > แล้วค่อย Update > แล้วค่อยเรียก Save Change
//            var dbForm = this.ExampleUseCaseSimple_Loadแม่พร้อมลูกด้วย(formId);//ถ้าหาไม่เจอ จะ Error ออกไป
//            //อัพเดท แม่ก่อน
//            dbForm.MemberId = viewModel.UserId;
//            dbForm.Description = viewModel.Description;
//            //ลบคนที่หายไปก่อน
//            var หาIdที่ส่งมาปัจจุบัน = viewModel.FormTask.Select(x => x.FormTaskId).ToList();
//            var notInNewSave = dbForm.FormTask.Where(x => !หาIdที่ส่งมาปัจจุบัน.Contains(x.TaskId));
//            foreach (var oldNotInNew in notInNewSave)
//            {
//                dbForm.FormTask.Remove(oldNotInNew);
//            }

//            //update หรือ add
//            foreach (var ทยอยเช็คทีละรายการ in viewModel.FormTask)
//            {
//                var dbItem = dbForm.FormTask.Where(x => x.TaskId == ทยอยเช็คทีละรายการ.FormTaskId).FirstOrDefault();
//                var isNew = dbItem is null;
//                dbItem = dbItem ?? new FormTask();
//                //ปรับข้อมูลให้ถูก
//                dbItem.Category = ทยอยเช็คทีละรายการ.Category;
//                dbItem.TaskName = ทยอยเช็คทีละรายการ.TaskName;
//                if (isNew)
//                    dbForm.FormTask.Add(dbItem);
//            }

//            //ไม่ต้อง add DBSet เพราะจะ Update ไม่ใช่เพิ่ม Record ใหม่
//            //เครื่องมือจะช่วยเรื่องของ add/update/delete ลูกให้อัตโนมัติเลย ถ้าเข้าใจความสำพันธ์ ดีดี
//            context.SaveChanges();
//        }


//        public void ExampleUseCaseSimple_Delete_ลบลูกก่อนลบแม่(int formId)
//        {
//            var context = Program.CreateDbContext();
//            //จะลบต้องหาของที่จะลบในระบบก่อน > แล้วค่อย Delete > แล้วค่อยเรียก Save Change
//            var dbForm = this.ExampleUseCaseSimple_Loadแม่พร้อมลูกด้วย(formId);

//            //พักตัวแปรก่อน
//            var tmpDelList = dbForm.FormTask.Select(x => x).ToList();
//            foreach (var item in tmpDelList)
//            {
//                //ลบลูกก่อนลบแม่
//                dbForm.FormTask.Remove(item);
//            }
//            //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List > แล้วลบมันออกจาก List ซะ
//            context.Form.Remove(dbForm);
//            //ไม่ต้อง add DBSet เพราะจะ Update ไม่ใช่เพิ่ม Record ใหม่
//            context.SaveChanges();
//        }



//    }
//}
