using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MyAPI.Controllers.CategoriesProducts
{
    [ApiController]
    [Route("api/[controller]")]

    [Authorize]
    public class IssueProductController : Controller
    {
        private readonly IIssueProductService _issueProduct;

        public IssueProductController(IIssueProductService issueProduct)
        {
            _issueProduct = issueProduct;
        }

        [HttpPost("SaveIssueMapProduct")]
        public async Task<IActionResult> InsertMappingCategoriesProductItem(SaveCategoriesProductParam param)
        {
            return Ok(await _issueProduct.SaveCategoriesProduct(param));

        }

        [HttpGet("GetIssueCategoriesItem")]
        public async Task<IActionResult> GetIssueCategoriesItem()
        {
            return Ok(await _issueProduct.GetCategoriesItems());

        }

        [HttpPost("CategoriesManagement")]
        public async Task<IActionResult> CategoriesManagement([FromBody] CategoriesParam param)
        {
            return Ok(await _issueProduct.SaveCategories(param ));
        }


        [HttpPost("ProductManagement")]
        public async Task<IActionResult> ProductManagement([FromBody] ProductParam param)
        {
            return Ok(await _issueProduct.SaveProduct(param ));
        }





        [HttpGet("LoadCategories/{id}")]
        public async Task<IActionResult> LoadCategories(int id)
        {
            return Ok(await _issueProduct.LoadCategories(id)); 
        }

        [HttpPost("QueryCategoriesByText")]
        public async Task<IActionResult> QueryCategoriesByText(DevExtremeParam<SearchCategoriesParam> param)
        {
            return Ok(await _issueProduct.QueryCategoriesByText(param)); 
        }

        [HttpPost("QueryProductOnCategories")]
        public async Task<IActionResult> QueryProducts(DevExtremeParam<SearchProductParam> param)
        {
            return Ok(await _issueProduct.QueryProducts(param)); 
        }
    }
}
