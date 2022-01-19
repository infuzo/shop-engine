using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopEngine.Models;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class AdminPanelOrdersController : Controller
    {
    }
}
