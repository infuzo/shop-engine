using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
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
                var directoryPath = Path.Combine(environment.WebRootPath, directory);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                Debug.WriteLine(environment.WebRootPath);
                var path = Path.Combine(directoryPath, nameWithExtension);
                using (var fileStream = new FileStream(path, FileMode.CreateNew))
                {
                    await formFile.CopyToAsync(fileStream);
                }
            }
            catch (Exception exception)
            {
                loggerFactory.CreateLogger<FileUploadService>().LogError(exception.ToString());
                throw exception;
            }

            var protocol = context.Request.IsHttps ? "https" : "http";
            return $"{protocol}://{context.Request.Host}/{directory}/{nameWithExtension}";
        }

        public async Task Delete(
            string path)
        {
            await Task.Factory.StartNew(() => File.Delete(Path.Combine(environment.WebRootPath, path)));
        }
    }
}
