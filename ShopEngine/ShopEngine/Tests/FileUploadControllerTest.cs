using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using ShopEngine.Controllers;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace ShopEngine.Tests
{
    public class FileUploadControllerTest
    {
        [Fact]
        public async void EmptyDirectoryRequest()
        {
            var uploadController = new FileUploadController();
            string directory = null;

            var result = await uploadController.Upload(directory, null);

            Assert.True(result is BadRequestObjectResult);
            Assert.Equal((result as BadRequestObjectResult).Value as string,
                FileUploadController.ErrorEmptyDirectoryOrHasSubdirectory);
        }

        [Fact]
        public async void DirectoryWithSubcategoryForwardSlash()
        {
            var uploadController = new FileUploadController();
            string directory = "images/subCat";
            var mockEnvironment = new Mock<IWebHostEnvironment>();
            var mockLoggerFactory = new Mock<ILoggerFactory>();

            var result = await uploadController.Upload(directory, null, mockEnvironment.Object, mockLoggerFactory.Object);

            Assert.True(result is BadRequestObjectResult);
            Assert.Equal((result as BadRequestObjectResult).Value as string,
                FileUploadController.ErrorEmptyDirectoryOrHasSubdirectory);
        }

        [Fact]
        public async void DirectoryWithSubcategoryBackwardSlash()
        {
            var uploadController = new FileUploadController();
            string directory = "images\\subCat";
            var mockEnvironment = new Mock<IWebHostEnvironment>();
            var mockLoggerFactory = new Mock<ILoggerFactory>();

            var result = await uploadController.Upload(directory, null, mockEnvironment.Object, mockLoggerFactory.Object);

            Assert.True(result is BadRequestObjectResult);
            Assert.Equal((result as BadRequestObjectResult).Value as string,
                FileUploadController.ErrorEmptyDirectoryOrHasSubdirectory);
        }

        [Fact]
        public async void UploadedFileIsNull()
        {
            var uploadController = new FileUploadController();
            string directory = "images";
            var mockEnvironment = new Mock<IWebHostEnvironment>();
            var mockLoggerFactory = new Mock<ILoggerFactory>();

            var result = await uploadController.Upload(directory, null, mockEnvironment.Object, mockLoggerFactory.Object);

            Assert.True(result is BadRequestObjectResult);
            Assert.Equal((result as BadRequestObjectResult).Value as string,
                FileUploadController.ErrorFormFileNull);
        }
    }
}
