using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
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

        public IActionResult Index()
        {
            return View();
        }
    }
}
