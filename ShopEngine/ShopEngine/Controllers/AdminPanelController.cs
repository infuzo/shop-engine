using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
using ShopEngine.Services;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelController : Controller
    {
        public const string ModelErrorInvalidImageType = "Invalid logo image type. Need to use only PNG.";

        [Route("Account/Login")] //TODO: remove after adding common users auth
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login() 
        {
            Response.StatusCode = 401;
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
            if(model == null)
            {
                ModelState.AddModelError("", "Invalid username or password");
                return View(model);
            }

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
            [FromServices] IFileUploadService fileUploadService,
            [FromServices] IConfiguration configuration)
        {
            if(ModelState.ErrorCount > 0)
            {
                return View(model);
            }

            string newLogoUrl = null;
            if(model.LogoImage != null)
            {
                if(model.LogoImage.ContentType != "image/png")
                {
                    ModelState.AddModelError(nameof(model.LogoImage), ModelErrorInvalidImageType);
                    return View(model);
                }

                try
                {
                    var directoryName = configuration.GetSection("Graphics:DirectoryName").Value;
                    var fileName = configuration.GetSection("Graphics:SiteLogoFileName").Value;

                    newLogoUrl = await fileUploadService.Upload(
                        directoryName, fileName, model.LogoImage, Request.HttpContext);
                }
                catch(Exception exception)
                {
                    ModelState.AddModelError(nameof(model.LogoImage), exception.Message);
                }
            }

            if (!string.IsNullOrEmpty(newLogoUrl))
            {
                model.LogoUrl = newLogoUrl;
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
