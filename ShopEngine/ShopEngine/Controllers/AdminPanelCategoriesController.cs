using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
