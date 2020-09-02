using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IFileUploadService
    {
        /// <summary>
        /// Returns full URL of new file.
        /// </summary>
        public Task<string> Upload(string directory, IFormFile formFile);
    }
}
