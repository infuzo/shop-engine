using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelController : Controller
    {
        [Route("Account/Login")] //TODO: remove after adding common users auth
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login() 
        {
            return View();
        }

        [Route("Account/Login")] //TODO: remove after adding common users auth
        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(
            AdminPanelLoginModel model,
            [FromServices] SignInManager<IdentityUser> signInManager) 
        {
            var signInResult = await signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            if (signInResult.Succeeded)
            {
                return RedirectToAction("Index", "AdminPanel");
            }

            ModelState.AddModelError("", "Invalid username or password");
            return View(model);
        }

        public async Task<IActionResult> Logout(
            [FromServices] SignInManager<IdentityUser> signInManager)
        {
            await signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Index(
            [FromServices] IConfiguration configuration)
        {
            return RedirectToAction(configuration.GetSection("AdminPanel:StartPage").Value, "AdminPanel");
        }

        public async Task<IActionResult> SiteAbout(
            [FromServices] ShopEngineDbContext dbContext)
        {
            var siteAboutsRowsCount = await dbContext.SiteAbouts.CountAsync();
            if (siteAboutsRowsCount > 0)
            {
                var siteAbout = await dbContext.SiteAbouts.FirstAsync();
                return View(siteAbout);
            }

            var newModel = new SiteAboutModel { Id = 0 };
            return View(newModel);
        }

        [HttpPost]
        public async Task<IActionResult> SiteAbout(
            SiteAboutModel model,
            [FromServices] ShopEngineDbContext dbContext,
            [FromServices] ILoggerFactory loggerFactory)
        {
            if(ModelState.ErrorCount > 0)
            {
                loggerFactory.CreateLogger("AdminPanel").LogInformation($"Model errors count: {ModelState.ErrorCount}");
                return View(model);
            }

            var siteAboutsRowsCount = await dbContext.SiteAbouts.CountAsync();
            if (siteAboutsRowsCount == 0)
            {
                loggerFactory.CreateLogger("AdminPanel").LogInformation($"Add new model. Model ID: {model.Id}");
                dbContext.SiteAbouts.Add(model);
            }
            else
            {
                loggerFactory.CreateLogger("AdminPanel").LogInformation($"Update existing model. Model ID: {model.Id}");
                dbContext.SiteAbouts.Update(model);
            }
            await dbContext.SaveChangesAsync();

            return RedirectToAction("SiteAbout", "AdminPanel");
        }
    }
}
