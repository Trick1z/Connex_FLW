using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
//using Services.Auth;
//using Services.Form;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IssueInformController : Controller
    {

        private readonly IIssueInformService _issueInformService;

        public IssueInformController(IIssueInformService issueInformService)
        {
            _issueInformService = issueInformService;
        }

        //[HttpPost("createForm-task")]
        //public async Task<IActionResult> CreateFormAsync([FromBody] InsertFormViewModel request)
        //{
        //    return Ok(await _insertFormService.CreateFormAsync(request));
        //}

        //[HttpPost("Cre")]
        //public async Task<IEnumerable<AllProducts>> GetProductItemsMapByCategories(int id)
        //{
        //    return Ok(await _issueInformService.GetProductItemsMapByCategories(id));
        //}
    }
}
