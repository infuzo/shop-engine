using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

using ShopEngine.Models;
using Microsoft.Extensions.Logging;
using System.Text;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelCategoriesController : Controller
    {
        [Route("AdminPanel/Categories")]
        public IActionResult Index()
        {
            return View("~/Views/AdminPanel/Categories.cshtml");
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
                model.Id = null;
                await dbContext.Categories.AddAsync(model);
                var result = await dbContext.SaveChangesAsync();
            }
            catch(Exception exception)
            {
                loggerFactory.CreateLogger("AdminPanel").LogError(exception.ToString());
                return StatusCode(500);
            }

            return Ok();            
        }
    }
}
