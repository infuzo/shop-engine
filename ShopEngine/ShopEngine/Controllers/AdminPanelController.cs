using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelController : Controller
    {
        public IActionResult Index()
        {
            return Ok("This is admin panel");
        }
    }
}
