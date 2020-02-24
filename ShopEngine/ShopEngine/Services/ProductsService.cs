using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShopEngine.Models;

namespace ShopEngine.Services
{
    public class ProductsService : IProductsService
    {
        private const string cacheIdAllProductsArray = "allProducts";
        private const int defaultExpirationInMinutesIfAbsenceInConf = 10;
        private const int defaultPageSizeIfAbsenceInConfiguration = 20;

        private ShopEngineDbContext dbContext;
        private IMemoryCache cacheProvider;
        private IConfiguration configuration;

        private ILogger logger;

        public ProductsService(
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

        public async Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabet(bool force = false)
        {
            try
            {
                IEnumerable<ProductModel> products = null;
                if (force || !cacheProvider.TryGetValue(cacheIdAllProductsArray, out products))
                {
                    if (force)
                    {
                        cacheProvider.Remove(cacheIdAllProductsArray);
                    }

                    products = await GetAllProductsSortedByAlphabetFromDatabase();
                    if (products != null)
                    {
                        cacheProvider.Set(cacheIdAllProductsArray, products, new MemoryCacheEntryOptions()
                            .SetAbsoluteExpiration(expiration));
                    }
                    else
                    {
                        throw new Exception("Can't retrive products list from database.");
                    }
                }

                return products;
            }
            catch (Exception exception)
            {
                logger.LogError(exception.ToString());
                throw;
            }
        }

        private TimeSpan expiration
        {
            get
            {
                var configurationValue = configuration.GetSection("Products:CacheIntervalInMinutes")?.Value;
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

        public int PageSize
        {
            get
            {
                int pageSize;
                var stringConfiguration = configuration.GetSection("Products:CountOnPage")?.Value;
                if(!string.IsNullOrEmpty(stringConfiguration) &&
                    int.TryParse(stringConfiguration, out pageSize))
                {
                    return pageSize;
                }

                logger.LogError("PageSize of products page absence or has invalid value in configuration.");
                return defaultPageSizeIfAbsenceInConfiguration;
            }
        }

        private async Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabetFromDatabase()
        {
            var products = await dbContext.Products.OrderBy(p => p.Name).ToArrayAsync();

            foreach (var product in products) 
            {
                product.CategoriesChain = await GetCategoriesChainOfProduct(product);
            }

            return products;
        }

        private async Task<String> GetCategoriesChainOfProduct(ProductModel product)
        {
            string result = string.Empty;

            Guid? subCatId = product.CategoryId;
            while (subCatId != null)
            {
                var currentCategory = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == subCatId.Value);
                if (currentCategory != null)
                {
                    result = currentCategory.Name + (result.Length == 0 ? string.Empty : " - ") + result;
                }
                subCatId = currentCategory.SubCategoryGuid;
            }

            return result;
        }

        //TODO: add get by category sorted by alphabets product with pagination
    }
}
