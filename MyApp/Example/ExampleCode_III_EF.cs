//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace MyApp
//{
//    public class ExampleCode_III_EF
//    {
//        public void ExampleUseCaseTransaction_การปรับปรุงข้อมูล_พร้อม_Logging(int formId)
//        {
//            var context = Program.CreateDbContext();

//            //ระหว่าง Save ต้องการ Id เพื่อเอาไป Log ด้วย


//            //ไม่ต้อง add DBSet เพราะจะ Update ไม่ใช่เพิ่ม Record ใหม่
//            context.SaveChanges();
//        }
//    }
//}
