using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Helpers;
using ShopEngine.Models;
using ShopEngine.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelProductsController : Controller
    {
        private const string noProductsAfterSearch = "There are no products by this search request.";
        private const string invalidCategoryOfProduct = "Category doesn't exits";

        private const string productImagesDirectory = "img/productIcons";

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

        [HttpPost]
        [Route("AdminPanel/UploadProductImages")]
        public async Task<IActionResult> UploadProductImage(
            Guid productGuid,
            IFormFile[] images,
            [FromServices] IFileUploadService fileUploadService)
        {
            var productDirectory = Path.Combine(productImagesDirectory, productGuid.ToString());

            var urls = new List<string>();
            var uploadedImagesPaths = new List<string>();
            try
            {
                foreach (var image in images) //todo check mime
                {
                    var fileName = $"{Guid.NewGuid()}{new FileInfo(image.FileName).Extension}";
                    var url = await fileUploadService.Upload(productDirectory, fileName, image, HttpContext);
                    uploadedImagesPaths.Add(Path.Combine(productDirectory, fileName).Replace("\\", "/"));
                    urls.Add(url);
                }
            }
            catch
            {
                foreach(var path in uploadedImagesPaths)
                {
                    await fileUploadService.Delete(path);
                }
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return new JsonResult(new
            {
                urls = urls,
                relatives = uploadedImagesPaths
            }) ;
        }

        [HttpPost]
        [Route("AdminPanel/EditProduct")]
        public async Task<IActionResult> EditProduct(
            ProductModel model,
            [FromServices] ShopEngineDbContext dbContext,
            [FromServices] ILoggerFactory loggerFactory,
            [FromServices] IProductsService productsService)
        {
            if (ModelState.ErrorCount > 0)
            {
                return StatusCode(500, ModelErrorHelper.GetModelErrors(ModelState));
            }

            if(!await productsService.IsCategoryValid(model))
            {
                return StatusCode(500, invalidCategoryOfProduct);
            }

            try
            {
                var result = dbContext.Products.Update(model);
                await dbContext.SaveChangesAsync();
                result.Entity.CategoriesChain = await productsService.GetCategoriesChainOfProduct(result.Entity);
                return Json(result.Entity);
            }
            catch (Exception exception)
            {
                loggerFactory.CreateLogger<AdminPanelController>().LogError(exception.ToString());
                return StatusCode(500);
            }
        }

        [HttpPost]
        [Route("AdminPanel/AddProduct")]
        public async Task<IActionResult> AddProduct(
            ProductModel model,
            [FromServices] ShopEngineDbContext dbContext,
            [FromServices] ILoggerFactory loggerFactory,
            [FromServices] IProductsService productsService)
        {
            if (ModelState.ErrorCount > 0)
            {
                var errors = ModelErrorHelper.GetModelErrors(ModelState);
                loggerFactory.CreateLogger<AdminPanelController>().LogError(errors);

                return StatusCode(500, errors);
            }

            if (!await productsService.IsCategoryValid(model))
            {
                return StatusCode(500, invalidCategoryOfProduct);
            }

            try
            {
                var result = await dbContext.Products.AddAsync(model);
                await dbContext.SaveChangesAsync();
                return Json(result.Entity);
            }
            catch (Exception exception)
            {
                loggerFactory.CreateLogger<AdminPanelController>().LogError(exception.ToString());
                return StatusCode(500);
            }
        }
    }
}
