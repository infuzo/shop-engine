using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShopEngine.Services;

namespace ShopEngine.Controllers
{
    [Authorize(Roles = Consts.AdminRoleName)]
    public class FileUploadController : Controller //todo: replace to fileuploadservice and remove
    {

        [HttpPost]
        public async Task<IActionResult> Upload(
            string directory,
            string nameWithExtension,
            IFormFile formFile,
            [FromServices] IFileUploadService fileUploadService)
        {
            string url = null;
            try
            {
                url = await fileUploadService.Upload(directory, nameWithExtension, formFile, Request.HttpContext);
            }
            catch(ArgumentException exception)
            {
                return new BadRequestObjectResult(exception.Message);
            }
            catch(Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            return Ok(url);
        }
    }
}