using ShopEngine.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopEngine.Services
{
    public interface IProductsService
    {
        public Task<IEnumerable<ProductModel>> GetAllProductsSortedByAlphabet(bool force = false);
        public int PageSize { get; }
    }
}
