using Domain.Interfaces.IssueProduct;
using Domain.ViewModels.CategoriesProduct;
using Domain.ViewModels.MappingCategoriesProduct;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers.IssueProduct
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class IssueProductController : Controller
    {
        private readonly IIssueProductService _issueProduct;



        public IssueProductController(IIssueProductService issueProduct)
        {
            _issueProduct = issueProduct;
        }


        [HttpPost("SaveIssueMapProduct")]
        public async Task<IActionResult> InsertMappingCategoriesProductItem(MappingCategoriesProductItem req)
        {

            return Ok(await _issueProduct.InsertMapCategoriesProduct(req));
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
        public async Task<IActionResult> InsertCategoriesItems([FromBody] InsertCategories request)
        {

            return Ok(await _issueProduct.InsertCategoriesItems(request));
        }


        [HttpPost("SaveProduct")]
        public async Task<IActionResult> InsertProductItems([FromBody] InsertProduct request)
        {
            return Ok(await _issueProduct.InsertProductItem(request));
        }

        [HttpPost("UpdateCategories")]
        public async Task<IActionResult> UpdateCategoryItem([FromBody] UpdateCategories req)
        {
            return Ok(await _issueProduct.UpdateCategoriesItems(req));
        }

        [HttpPost("UpdateProduct")]
        public async Task<IActionResult> UpdateProductItem([FromBody] UpdateProduct req)
        {
            return Ok(await _issueProduct.UpdateProductItems(req));
        }



        //[HttpPost("MappingCategoriesProduct")]
        //public async Task<IActionResult> InsertMappingCategoriesProductItem(MappingCategoriesProductItem req)
        //{

        //    return Ok(await _insertMapCategoriesProductService.InsertMapCategoriesProduct(req));
        //}

        [HttpGet("Categories/item")]
        public async Task<IActionResult> GetCategoryItem()
        {
            return Ok(await _issueProduct.GetCategoriesItems());
        }

        [HttpGet("Products/item")]
        public async Task<IActionResult> GetProductItems()
        {
            return Ok(await _issueProduct.GetProductItems());
        }
    }


}
