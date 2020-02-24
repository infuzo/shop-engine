using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
using ShopEngine.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelProductsConrtroller : Controller
    {
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
            if(page <= 0)
            {
                return NotFound("Page number can't be less than 1.");
            }

            var allProducts = await productService.GetAllProductsSortedByAlphabet(!fromCache);
            var productsCount = allProducts.Count();
            var totalPagesCount = (int)MathF.Ceiling((float)productsCount / (float)productService.PageSize);

            if(page > totalPagesCount)
            {
                return NotFound($"Page number {page} is greater than max pages count {totalPagesCount}.");
            }

            var productsOnPage = allProducts.Skip((page - 1) * productService.PageSize).Take(productService.PageSize);

            return new JsonResult(new ProductsViewModel { 
                Products = productsOnPage, 
                TotalProductsCount = productsCount, 
                CurrentPage = page,
                TotalPagesCount = totalPagesCount
            });
        }
    }
}
