using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IFileUploadService
    {
        Task Delete(string path);

        /// <summary>
        /// Returns full URL of new file. Overwrites if file exists.
        /// </summary>
        public Task<string> Upload(
            string directory, 
            string nameWithExtension, 
            IFormFile formFile,
            HttpContext context);
    }
}
