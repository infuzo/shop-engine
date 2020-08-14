using ShopEngine.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabet(bool force = false);
        IEnumerable<ProductModel> FindProducts(
            string guidNameOrVendorCode,
            bool findInProductsCache);
        int PageSize { get; }
        ProductsViewModel GetProductsViewModelOnPage(int page, IEnumerable<ProductModel> allProducts);
    }
}
