using Domain.Interfaces;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Infrastructure.Data;
//using Domain.Entities; // Your EF models


namespace Services.Implements.Form
{
    //public class InsertFormService
    //{
    //    private readonly MYGAMEContext _context;

    //    public InsertFormService(MYGAMEContext context)
    //    {
    //        _context = context;
    //    } 

    //    //public async Task<int> CreateFormAsync(InsertFormViewModel request)
    //    //{
    //    //    using var transaction = await _context.Database.BeginTransactionAsync();

    //    //    var dateNow = DateTime.Now;

    //    //    try
    //    //    {
    //    //        var form = new Domain.Models.Form
    //    //        {
    //    //            MemberId = request.UserId,
    //    //            Description = request.Description,
    //    //            Status = "Pending",
    //    //            CreatedTime = dateNow
    //    //        };
    //    //        AddFormData(form);
    //    //        await OnSaveChange();

    //    //        foreach (var item in request.FormTask)
    //    //        {
    //    //            var assignedUserId = await GetUserByType(item.Category);

    //    //            var task = new FormTask
    //    //            {
    //    //                TaskName = item.TaskName,
    //    //                FormId = form.FormId,
    //    //                Category = item.Category,
    //    //                AssignmentId = assignedUserId,
    //    //                Status = "Pending"
    //    //            };

    //    //            _context.FormTask.Add(task);
    //    //        }

    //    //        await _context.SaveChangesAsync();
    //    //        await transaction.CommitAsync();

    //    //        return form.FormId;
    //    //    }
    //    //    catch
    //    //    {
    //    //        await transaction.RollbackAsync();
    //    //        throw;
    //    //    }
    //    //}

    //    //private async Task OnSaveChange()
    //    //{
    //    //    await _context.SaveChangesAsync();
    //    //}

    //    //private void AddFormData(Domain.Models.Form form)
    //    //{
    //    //    _context.Form.Add(form);
    //    //}

        

    //    //public async Task<int> CreateFormAsync(InsertFormViewModel request)
    //    //{
    //    //    var dateNow = DateTime.Now;
    //    //    var defaultStatus = "pending";



    //    //    //create new object ของแม่
    //    //    var form = new Domain.Models.Form();
    //    //    //mapping field to update
    //    //    form.MemberId = request.UserId;
    //    //    form.Description = request.Description;
    //    //    form.Status = defaultStatus;
    //    //    form.CreatedTime = dateNow;


    //    //    foreach (var taskItem in request.FormTask)
    //    //    {
    //    //        var assignedUserId = await GetUserByType(taskItem.Category);



    //    //        var newFormTask = new FormTask();
    //    //        newFormTask.Category = taskItem.Category;
    //    //        newFormTask.TaskName = taskItem.TaskName;
    //    //        newFormTask.Status = defaultStatus;
    //    //        newFormTask.AssignmentId = assignedUserId;
    //    //        //ย้ำ
    //    //        newFormTask.Form = form;

    //    //        //เพิ่มลูกลงไปให้แม่ด้วย
    //    //        form.FormTask.Add(newFormTask);
    //    //    }

    //    //    //กด F12 ไปตรง Form จะเจอ DbSet<className> ให้มองเหมือนมันเป็น List
    //    //    //จริงๆมันเป็นอะไร ? การบ้าน
    //    //    _context.Form.Add(form);
    //    //    _context.SaveChanges();


    //    //    return form.FormId;


    //    //}

    //    //private async Task<int> GetUserByType(int id)
    //    //{
    //    //    var role = id;

    //    //    var user = await _context.User
    //    //        .Where(u => u.RoleId == role)
    //    //        .FirstOrDefaultAsync();

    //    //    if (user == null)
    //    //        throw new Exception($"ไม่พบผู้ดูแลประเภทงาน: {role}");

    //    //    return user;
    //    //}


    //}
}
