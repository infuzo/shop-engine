using ShopEngine.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabet(bool force = false);
        Task<IEnumerable<ProductModel>> FindProducts(string guidNameOrVendorCode);
        int PageSize { get; }
        ProductsViewModel GetProductsViewModelOnPage(int page, IEnumerable<ProductModel> allProducts);
    }
}
