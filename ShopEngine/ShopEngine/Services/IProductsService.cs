using ShopEngine.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabet(bool force = false);
        /// <summary>
        /// If guid or vendor code are same or product name contains name string - it will return list of product.
        /// </summary>
        /// <param name="findInProductsCache">If cache of products exists - it will search in this cache.</param>
        /// <returns></returns>
        IEnumerable<ProductModel> FindProducts(
            string guidNameOrVendorCode,
            bool findInProductsCache);
        int PageSize { get; }
        ProductsViewModel GetProductsViewModelOnPage(int page, IEnumerable<ProductModel> allProducts);
    }
}
