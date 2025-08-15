// See https://aka.ms/new-console-template for more information
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

using Microsoft.EntityFrameworkCore.Design;
using System.IO;
using Microsoft.Extensions.Logging;

internal class Program
{
    private static void Main(string[] args)
    {

        //using var context = CreateDbContext();
        //Console.WriteLine("create context");

        //Member member = createNewMember();

        //addDataToTable(context, member);

        //confirmChangeToDb(context);

    }

    //private static void confirmChangeToDb(MYGAMEContext context)
    //{
    //    context.SaveChanges();
    //}

    //private static void addDataToTable(MYGAMEContext context)
    //{
    //    context.Member.Add(member);
    //}

    //private static Member createNewMember()
    //{
    //    var member = new Member();
    //    var dateNow = DateTime.Now;

    //    member.Username = "admin1";
    //    member.Password = "root1";
    //    member.IsVip = true;
    //    member.CreatedTime = dateNow;
    //    member.ModifiedTime = dateNow;
    //    Console.WriteLine("create data");
    //    return member;
    //}

    //public static MYGAMEContext CreateDbContext()
    //{
    //    var options = new DbContextOptionsBuilder<MYGAMEContext>()
    //                    .UseSqlServer("Server=.\\SQLEXPRESS;Database=MYGAME;Trusted_Connection=True;TrustServerCertificate=True;") // หรือใช้ connection string ของคุณ
    //                    .LogTo(Console.WriteLine, LogLevel.Information) // <<=== ดู SQL Query ที่ EF สร้าง
    //                    .EnableSensitiveDataLogging() // <<== แสดงพารามิเตอร์จริง (ระวัง production!)
    //                    .Options;
    //    var context = new MYGAMEContext(options);

    //    return context;
    //    //return context;
    //}
}