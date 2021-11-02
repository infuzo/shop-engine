using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public class FileUploadService : IFileUploadService
    {
        public const string ErrorFormFileNull = "Uploaded file mustn't be null";

        IWebHostEnvironment environment;
        ILoggerFactory loggerFactory;

        public FileUploadService(
            IWebHostEnvironment environment,
            ILoggerFactory loggerFactory)
        {
            this.environment = environment;
            this.loggerFactory = loggerFactory;
        }

        public async Task<string> Upload(
            string directory, 
            string nameWithExtension, 
            IFormFile formFile,
            HttpContext context)
        {
            if (formFile == null)
            {
                throw new ArgumentException(ErrorFormFileNull);
            }

            try
            {
                var path = Path.Combine(environment.WebRootPath, directory, nameWithExtension);

                using (var fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
                {
                    await formFile.CopyToAsync(fileStream);
                }
            }
            catch (Exception exception)
            {
                loggerFactory.CreateLogger<FileUploadService>().LogError(exception.ToString());
                throw exception;
            }

            return $"http://{context.Request.Host.ToString()}/{directory}/{nameWithExtension}";
        }
    }
}
