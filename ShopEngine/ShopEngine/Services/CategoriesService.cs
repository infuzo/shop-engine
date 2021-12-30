using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public class CategoriesService : ICategoriesService
    {
        private const string cacheIdCategories = "categories";
        private const int defaultExpirationInMinutesIfAbsenceInConf = 10;

        private ShopEngineDbContext dbContext;
        private IMemoryCache cacheProvider;
        private IConfiguration configuration;

        private ILogger logger;

        public CategoriesService(
            ShopEngineDbContext dbContext,
            IMemoryCache cacheProvider,
            IConfiguration configuration,
            ILoggerFactory loggerFactory)
        {
            this.dbContext = dbContext;
            this.cacheProvider = cacheProvider;
            this.configuration = configuration;

            logger = loggerFactory.CreateLogger<ProductsService>();
        }

        private TimeSpan Expiration
        {
            get
            {
                var configurationValue = configuration.GetSection("Categories:CacheIntervalInMinutes")?.Value;
                int minutes;
                if (!string.IsNullOrEmpty(configurationValue) &&
                    int.TryParse(configurationValue, out minutes))
                {
                    return TimeSpan.FromMinutes(minutes);
                }

                logger.LogError("Expriation for proudcts cache doesn't exist or has invalid value in configuration");
                return TimeSpan.FromMinutes(defaultExpirationInMinutesIfAbsenceInConf);
            }
        }

        public async Task<IReadOnlyList<CategoryModel>> GetCategoriesAsync(bool fromCache = true)
        {
            try
            {
                List<CategoryModel> categories = null;
                if (!fromCache || !cacheProvider.TryGetValue(cacheIdCategories, out categories))
                {
                    if (!fromCache)
                    {
                        cacheProvider.Remove(cacheIdCategories);
                    }

                    categories = await dbContext.Categories.ToListAsync();
                    if (categories != null)
                    {
                        cacheProvider.Set(cacheIdCategories, categories, new MemoryCacheEntryOptions()
                            .SetAbsoluteExpiration(Expiration));
                    }
                }
                return categories;
            }
            catch (Exception exception)
            {
                logger.LogError(exception.ToString());
                throw;
            }
        }

        public async Task<string> GetCategoriesChainOfProduct(ProductModel product, bool fromCache = true)
        {
            var result = new StringBuilder();

            Guid? subCatId = product.CategoryId;
            while (subCatId != null)
            {
                var currentCategory = (await GetCategoriesAsync(fromCache)).FirstOrDefault(c => c.Id == subCatId.Value);
                if (currentCategory != null)
                {
                    result.Append(currentCategory.Name);
                    if (currentCategory.SubCategoryGuid != null)
                    {
                        result.Append(" - ");
                    }
                    subCatId = currentCategory.SubCategoryGuid;
                }
                else
                {
                    return string.Empty;
                }
            }

            return result.ToString();
        }

        public async Task<bool> IsCategoryValid(ProductModel productModel, bool fromCache = false)
        {
            return (await GetCategoriesAsync(fromCache)).Any(c => c.Id == productModel.CategoryId);
        }
    }
}
