using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public class FileUploadService : IFileUploadService
    {
        public const string ErrorEmptyDirectoryOrHasSubdirectory =
            "Directory parameter mustn't contain subdirectories or be empty";
        public const string ErrorFormFileNull = "Uploaded file mustn't be null";

        IWebHostEnvironment environment;
        ILoggerFactory loggerFactory;
        HttpContext context;

        public FileUploadService(
            IWebHostEnvironment environment,
            ILoggerFactory loggerFactory,
            HttpContext context)
        {
            this.environment = environment;
            this.loggerFactory = loggerFactory;
            this.context = context;
        }

        public async Task<string> Upload(string directory, IFormFile formFile)
        {
            if (string.IsNullOrEmpty(directory) || directory.Contains("\\") || directory.Contains("/"))
            {
                throw new ArgumentException(ErrorEmptyDirectoryOrHasSubdirectory);
            }

            if (formFile == null)
            {
                throw new ArgumentException(ErrorFormFileNull);
            }

            try
            {
                var path = Path.Combine(environment.WebRootPath, directory, formFile.Name);

                using (var fileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
                {
                    await formFile.CopyToAsync(fileStream);
                }
            }
            catch (Exception exception)
            {
                loggerFactory.CreateLogger<FileUploadService>().LogError(exception.ToString());
                throw new Exception();
            }

            return $"{context.Request.Host.ToString()}/{directory}/{formFile.Name}";
        }
    }
}
