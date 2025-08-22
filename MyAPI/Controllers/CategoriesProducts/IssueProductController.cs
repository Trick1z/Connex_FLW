using Domain.Interfaces;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MyAPI.Controllers.CategoriesProducts
{
    [ApiController]
    //[Authorize]
    [Route("api/[controller]")]
    public class IssueProductController : Controller
    {
        private readonly IIssueProductService _issueProduct;

        public IssueProductController(IIssueProductService issueProduct)
        {
            _issueProduct = issueProduct;
        }

        [HttpPost("SaveIssueMapProduct")]
        public async Task<IActionResult> InsertMappingCategoriesProductItem(SaveCategoriesProductParam req)
        {
            return Ok(await _issueProduct.SaveCategoriesProduct(req));
        }

        [HttpPost("DeleteCategories")]
        public async Task<IActionResult> DeleteCategoryItem([FromBody] DeleteCategories req)
        {
            return Ok(await _issueProduct.DeleteCategoriesItems(req)); 
        }

        [HttpPost("DeleteProduct")]
        public async Task<IActionResult> DeleteProductItem([FromBody] DeleteProduct req)
        {
            return Ok(await _issueProduct.DeleteProductItems(req)); 
        }

        [HttpPost("SaveCategories")]
        public async Task<IActionResult> InsertCategories([FromBody] InsertCategories request)
        {
            return Ok(await _issueProduct.InsertCategories(request));
        }

        [HttpPost("SaveProduct")]
        public async Task<IActionResult> InsertProduct([FromBody] InsertProduct request)
        {
            return Ok(await _issueProduct.InsertProduct(request));
        }

        [HttpPost("UpdateCategories")]
        public async Task<IActionResult> UpdateCategories([FromBody] UpdateCategories req)
        {
            return Ok(await _issueProduct.UpdateCategories(req));
        }

        [HttpPost("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProduct req)
        {
            return Ok(await _issueProduct.UpdateProduct(req)); 
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
