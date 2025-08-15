//using Domain.Exceptions;
//using Domain.Models;
//using Domain.ViewModels;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace MyApp
//{
//    public class ExampleCode_EF
//    {

//        public void ExampleUseCaseSimple_Create(InsertFormViewModel viewModel)
//        {
//            var context = Program.CreateDbContext();

//            //create new object
//            var form = new Form();
//            //mapping field to update
//            form.MemberId = viewModel.UserId;
//            form.Description = viewModel.Description;

//            //กด F12 ไปตรง Form จะเจอ DbSet<className> ให้มองเหมือนมันเป็น List
//            //จริงๆมันเป็นอะไร ? การบ้าน
//            context.Form.Add(form);
//            context.SaveChanges();
//        }

//        //public Form ExampleUseCaseSimple_GetById(int formId)
//        //{
//        //    var context = Program.CreateDbContext();

//        //    //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List
//        //    //ทำการค้นหา
//        //    var dbForm = context.Form.Where(x => x.FormId == formId).FirstOrDefault();

//        //    if (dbForm is null)
//        //        //throw new ValidateException("ใส่ Error Case นี้ไป");

//        //    //ค้นหาของไม่ต้องบันทึกอะไร
//        //    //context.SaveChanges();
//        //    return dbForm;
//        //}

//        //public void ExampleUseCaseSimple_Update(int formId, InsertFormViewModel viewModel)
//        //{
//        //    var context = Program.CreateDbContext();
//        //    //จะอัพเดทต้องหาของที่จะอัพในระบบก่อน > แล้วค่อย Update > แล้วค่อยเรียก Save Change
//        //    var dbForm = this.ExampleUseCaseSimple_GetById(formId);//ถ้าหาไม่เจอ จะ Error ออกไป
//        //    //mapping field to update
//        //    dbForm.MemberId = viewModel.UserId;
//        //    dbForm.Description = viewModel.Description;
//        //    //ไม่ต้อง add DBSet เพราะจะ Update ไม่ใช่เพิ่ม Record ใหม่
//        //    context.SaveChanges();
//        //}


//        //public void ExampleUseCaseSimple_Delete(int formId)
//        //{
//        //    var context = Program.CreateDbContext();
//        //    //จะลบต้องหาของที่จะลบในระบบก่อน > แล้วค่อย Delete > แล้วค่อยเรียก Save Change
//        //    var dbForm = this.ExampleUseCaseSimple_GetById(formId);
//        //    //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List > แล้วลบมันออกจาก List ซะ
//        //    context.Form.Remove(dbForm);
//        //    //ไม่ต้อง add DBSet เพราะจะ Update ไม่ใช่เพิ่ม Record ใหม่
//        //    context.SaveChanges();
//        //}

//        #region Bulk - Case

//        public void ExampleUseCaseSimple_BulkActionCreate(List<InsertFormViewModel> หลายรายการ)
//        {//แบบ ง่ายสร้างทีละหลายรายการ (มั่นใจว่า add ทั้งหมด,หรือ ลบ ทั้งหมด)
//            var context = Program.CreateDbContext();
//            List<Form> formที่เตรียมเพิ่ม = new List<Form>();
//            foreach (var ฟอร์ม in หลายรายการ)
//            {
//                var form = new Form() { MemberId = ฟอร์ม.UserId, Description = ฟอร์ม.Description };
//                formที่เตรียมเพิ่ม.Add(form);
//            }
//            //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List > แล้วadd ยกชุด ซะ
//            context.Form.AddRange(formที่เตรียมเพิ่ม);
//            context.SaveChanges();//ส่งตำสั่งไป Update id_หลายรายการ

//        }

//        public void ExampleUseCaseSimple_BulkActionRemove(List<int> id_หลายรายการ)
//        {//แบบ ง่ายสร้างทีละหลายรายการ (มั่นใจว่า add ทั้งหมด,หรือ ลบ ทั้งหมด)
//            var context = Program.CreateDbContext();
//            List<Form> formที่เตรียมลบ = new List<Form>();
//            //foreach (var ฟอร์ม in id_หลายรายการ)
//            //{
//            //    //อย่าทำนะ มัน Query Database รัวมากๆ
//            //    var dbForm = this.ExampleUseCaseSimple_Loadแม่พร้อมลูกด้วย(ฟอร์ม);
//            //    formที่เตรียมลบ.Add(dbForm);
//            //}
//            formที่เตรียมลบ = context.Form.Where(x => id_หลายรายการ.Contains(x.FormId)).ToList();

//            //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List > แล้วadd ยกชุด ซะ
//            context.Form.RemoveRange(formที่เตรียมลบ);
//            context.SaveChanges();//ส่งตำสั่งไป Update id_หลายรายการ
//            //ให้มอง DbSet<Form> เหมือนมันเป็นที่มีข้อมูลอยู่ List > แล้วลบมันออกจาก List ซะ

//        }

//        #endregion


//    }
//}
