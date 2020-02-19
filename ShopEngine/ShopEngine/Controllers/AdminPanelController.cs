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
            [FromServices] ShopEngineDbContext dbContext)
        {
            if(ModelState.ErrorCount > 0)
            {
                return View(model);
            }

            var siteAboutsRowsCount = await dbContext.SiteAbouts.CountAsync();
            if (siteAboutsRowsCount == 0)
            {
                dbContext.SiteAbouts.Add(model);
            }
            else
            {
                dbContext.SiteAbouts.Update(model);
            }
            await dbContext.SaveChangesAsync();

            return RedirectToAction("SiteAbout", "AdminPanel");
        }

        public async Task<IActionResult> EmailSettings(
            [FromServices] ShopEngineDbContext dbContext) 
        {
            var emailSettingsRowsCount = await dbContext.EmailSettings.CountAsync();
            if (emailSettingsRowsCount > 0)
            {
                var emailSettings = await dbContext.EmailSettings.FirstAsync();
                return View(emailSettings);
            }

            var newModel = new EmailSettingsModel { Id = 0 };
            return View(newModel);
        }

        [HttpPost]
        public async Task<IActionResult> EmailSettings(
            EmailSettingsModel model,
            [FromServices] ShopEngineDbContext dbContext)
        {
            if (ModelState.ErrorCount > 0)
            {
                return View(model);
            }

            var emailSettingsRowsCount = await dbContext.EmailSettings.CountAsync();
            if (emailSettingsRowsCount == 0)
            {
                dbContext.EmailSettings.Add(model);
            }
            else
            {
                dbContext.EmailSettings.Update(model);
            }
            await dbContext.SaveChangesAsync();

            return RedirectToAction("EmailSettings", "AdminPanel");
        }
    }
}
