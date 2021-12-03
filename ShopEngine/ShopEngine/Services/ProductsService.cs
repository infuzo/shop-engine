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
                            .SetAbsoluteExpiration(Expiration));
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

        private TimeSpan Expiration
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
            var products = dbContext.Products
                .ToArray()
                .OrderBy(p => p.Name)
                .ToArray();

            foreach (var product in products) 
            {
                product.CategoriesChain = await GetCategoriesChainOfProduct(product);
            }

            return products;
        }

        public async Task<string> GetCategoriesChainOfProduct(ProductModel product)
        {
            var result = new StringBuilder();

            Guid? subCatId = product.CategoryId;
            while (subCatId != null)
            {
                var currentCategory = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == subCatId.Value);
                if (currentCategory != null)
                {
                    result.Append(currentCategory.Name);
                    if(currentCategory.SubCategoryGuid != null)
                    {
                        result.Append(" - ");
                    }
                }
                subCatId = currentCategory.SubCategoryGuid;
            }

            return result.ToString();
        }

        public IEnumerable<ProductModel> FindProducts(
            string guidNameOrVendorCode,
            bool findInProductsCache)
        {
            if (string.IsNullOrEmpty(guidNameOrVendorCode))
            {
                throw new ArgumentException("Can't find the product with null argument");
            }

            IEnumerable<ProductModel> products = null;
            if (findInProductsCache)
            {
                cacheProvider.TryGetValue(cacheIdAllProductsArray, out products);
            }

            if(products == null)
            {
                products = dbContext.Products.ToArray();
            }

            var productModels = FindProductByName(products, guidNameOrVendorCode);

            Guid guid;
            if (Guid.TryParse(guidNameOrVendorCode, out guid))
            {
                productModels = productModels.Union(FindProductByGuid(products, guid));
            }
            else
            {
                int customVendorCode;
                if(int.TryParse(guidNameOrVendorCode, out customVendorCode))
                {
                    productModels = productModels.Union(FindProductByVendorCode(products, customVendorCode));
                }
            }

            return productModels;
        }

        public IEnumerable<ProductModel> FindProductByGuid(IEnumerable<ProductModel> products, Guid guid)
        {
            //todo: AsParallel
            return products
                .Where(product => product.Id == guid);
        }

        public IEnumerable<ProductModel> FindProductByName(IEnumerable<ProductModel> products, string name)
        {
            //todo: AsParallel
            //todo: split name and query by spaces
            return products
                .Where(product => product.Name.ToLower().Contains(name.ToLower()));
        }

        public IEnumerable<ProductModel> FindProductByVendorCode(IEnumerable<ProductModel> products, int vendorCode)
        {
            //todo: AsParallel
            return products
                .Where(product => product.CustomVendorCode != null && product.CustomVendorCode == vendorCode);
        }

        public ProductsViewModel GetProductsViewModelOnPage(int page, IEnumerable<ProductModel> allProducts)
        {
            if (page <= 0)
            {
                throw new ArgumentException("Page number can't be less than 1.");
            }

            var productsCount = allProducts.Count();
            var totalPagesCount = (int)MathF.Ceiling((float)productsCount / (float)PageSize);

            if (page > totalPagesCount)
            {
                throw new ArgumentException($"Page number {page} is greater than max pages count {totalPagesCount}.");
            }

            var productsOnPage = allProducts.Skip((page - 1) * PageSize).Take(PageSize);

            return new ProductsViewModel
            {
                Products = productsOnPage,
                TotalProductsCount = productsCount,
                CurrentPage = page,
                TotalPagesCount = totalPagesCount
            };
        }

        public async Task<bool> IsCategoryValid(ProductModel productModel)
        {
            return await dbContext.Categories.AnyAsync(c => c.Id == productModel.CategoryId);
        }

        //TODO: add get by category sorted by alphabets with pagination
    }
}
