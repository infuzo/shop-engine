using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopEngine.Controllers
{
    public class DefaultUserWithAdminRoleController : Controller
    {

        [AllowAnonymous]
        public async Task<IActionResult> Create(
            [FromServices] RoleManager<IdentityRole> roleManager,
            [FromServices] UserManager<IdentityUser> userManager,
            [FromServices] ILoggerFactory loggerFactory,
            [FromServices] IConfiguration configuration)
        {
            loggerFactory.CreateLogger<AdminPanelController>().LogWarning("Someone tries to create default user with admin role.");

            if (!IsAllowedDefaultUserWithAdminRoleCreation(configuration))
            {
                return StatusCode(500, "Creation of default user with admin role isn't allowed in configuration.");
            }

            var role = await roleManager.FindByNameAsync(Consts.AdminRoleName);
            if (role == null)
            {
                role = new IdentityRole(Consts.AdminRoleName);
                var roleCreateResult = await roleManager.CreateAsync(role);
                if (!roleCreateResult.Succeeded)
                {
                    return StatusCode(500, GetStringIdentityErrors(roleCreateResult.Errors));
                }
            }

            var userName = configuration.GetSection("DefaultUserWithAdminRole:UserName").Value;
            if (string.IsNullOrEmpty(userName))
            {
                return StatusCode(500, "Username of default user with admin role doesn't exist in application configuration. See documentation.");
            }

            var user = await userManager.FindByNameAsync(userName);
            if (user != null)
            {
                return StatusCode(500, "Default admin user already exist. You can't create it twice.");
            }

            var userPassword = configuration.GetSection("DefaultUserWithAdminRole:Password").Value;
            if (string.IsNullOrEmpty(userPassword))
            {
                return StatusCode(500, "Password of default user with admin role doesn't exist in application configuration. See documentation.");
            }

            user = new IdentityUser(userName);
            var userCreateResult = await userManager.CreateAsync(user, userPassword);
            if (!userCreateResult.Succeeded)
            {
                return StatusCode(500, GetStringIdentityErrors(userCreateResult.Errors));
            }

            var userAddRoleResult = await userManager.AddToRoleAsync(user, Consts.AdminRoleName);
            if (!userAddRoleResult.Succeeded)
            {
                return StatusCode(500, GetStringIdentityErrors(userAddRoleResult.Errors));
            }

            return Ok("Default user with admin role successfully created. See credentials in your's application configuration.");
        }

        private string GetStringIdentityErrors(IEnumerable<IdentityError> errors)
        {
            var errorMessages = new StringBuilder();
            foreach (var error in errors)
            {
                errorMessages.AppendLine($"{error?.Code} - {error?.Description}");
            }

            return errorMessages.ToString();
        }

        /// <summary>
        /// Return false if creation of user with admin role isn't allowed or noticed in app configuration.
        /// </summary>
        private bool IsAllowedDefaultUserWithAdminRoleCreation(IConfiguration configuration)
        {
            bool result;
            if (!bool.TryParse(configuration.GetSection("DefaultUserWithAdminRole:Allowed")?.Value, out result))
            {
                return false;
            }

            return result;
        }

    }
}
