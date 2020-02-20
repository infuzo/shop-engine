using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

using ShopEngine.Models;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Collections.Generic;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelCategoriesController : Controller
    {
        [Route("AdminPanel/Categories")]
        public async Task<IActionResult> Index(
            [FromServices] ShopEngineDbContext dbContext)
        {
            var allCategories = await dbContext.Categories.ToArrayAsync();

            return View("~/Views/AdminPanel/Categories.cshtml", allCategories);
        }

        [Route("AdminPanel/AddCategory")]
        [HttpPost]
        public async Task<IActionResult> AddCategory(
            CategoryModel model,
            [FromServices] ShopEngineDbContext dbContext,
            [FromServices] ILoggerFactory loggerFactory)
        {
            if (ModelState.ErrorCount > 0)
            {
                StringBuilder message = new StringBuilder("There are errors in the model.\n");
                foreach (var error in ModelState)
                {
                    if (error.Value.Errors.Count > 0)
                    {
                        message.Append(error.Key + ": ");
                        foreach (var errorMessage in error.Value.Errors)
                        {
                            message.Append(errorMessage.ErrorMessage + "; ");
                        }
                        message.AppendLine();
                    }
                }

                return StatusCode(500, message.ToString());
            }

            try
            {
                if (model.SubCategoryGuid == Guid.Empty)
                {
                    model.SubCategoryGuid = null;
                }

                await dbContext.Categories.AddAsync(model);
                await dbContext.SaveChangesAsync();
            }
            catch(Exception exception)
            {
                loggerFactory.CreateLogger("AdminPanel").LogError(exception.ToString());
                return StatusCode(500);
            }

            return new JsonResult(model);            
        }
    }
}
