using System.Collections.Generic;

namespace ShopEngine.Models
{
    public class ProductsViewModel
    {
        public IEnumerable<ProductModel> Products { get; set; }
        public int CurrentPage { get; set; }
        public int TotalProductsCount { get; set; }
        public int TotalPagesCount { get; set; }
    }
}
