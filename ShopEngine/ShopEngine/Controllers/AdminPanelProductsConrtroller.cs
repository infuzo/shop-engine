using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
using ShopEngine.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelProductsConrtroller : Controller
    {
        private const string noProductsAfterSearch = "There are no products by this search request.";

        [Route("AdminPanel/Products")]
        public IActionResult Products(
            [FromServices] ILoggerFactory loggerFactory,
            [FromServices] IProductsService productService,
            int page = 1)
        {
            return View("~/Views/AdminPanel/Products.cshtml", page);
        }

        /// <summary>
        /// Get n products (n from configuration) from list of products, sorted alphabetic.
        /// </summary>
        /// <param name="fromCache">Get from memory cache (true) or from database (false)?</param>
        [Route("AdminPanel/GetProductsPage")] 
        public async Task<IActionResult> GetProductsOnPage(
            int page, 
            bool fromCache,
            [FromServices] IProductsService productService) 
        {
            try
            {
                var allProducts = await productService.GetAllProductsSortedByAlphabet(!fromCache);
                return new JsonResult(productService.GetProductsViewModelOnPage(page, allProducts));
            }
            catch (ArgumentException exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Route("AdminPanel/FindProducts")]
        public IActionResult FindProducts(
            string guidNameOrVendorCode,
            int page,
            bool findInProductsCache,
            [FromServices] IProductsService productsService)
        {
            try
            {
                var searchResult = productsService.FindProducts(guidNameOrVendorCode, findInProductsCache);
                if(searchResult != null && searchResult.Any())
                {
                    return new JsonResult(productsService.GetProductsViewModelOnPage(page, searchResult)); 
                }
                return NotFound(noProductsAfterSearch);
            }
            catch(ArgumentException exception)
            {
                return NotFound(exception.Message);
            }
        }
    }
}
