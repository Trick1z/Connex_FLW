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

        private readonly IInsertFormService _insertFormService;

        public IssueInformController(IInsertFormService insertFormService)
        {
            _insertFormService = insertFormService;
        }

        [HttpPost("createForm-task")]
        public async Task<IActionResult> CreateFormAsync([FromBody] InsertFormViewModel request)
        {
            return Ok(await _insertFormService.CreateFormAsync(request));
        }
    }
}
