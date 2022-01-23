using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelOrdersController : Controller
    {
        [Route("AdminPanel/Orders")]
        public IActionResult Orders()
        {
            return View("~/Views/AdminPanel/Orders.cshtml");
        }
    }
}
