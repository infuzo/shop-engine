using ShopEngine.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    interface ICategoriesService
    {
        Task<IReadOnlyList<CategoryModel>> GetCategoriesAsync(bool fromCache = true);
        Task<string> GetCategoriesChainOfProduct(ProductModel product, bool fromCache = true);
        Task<bool> IsCategoryValid(ProductModel productModel, bool fromCache = false);
    }
}
