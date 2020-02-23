using Microsoft.EntityFrameworkCore;

namespace ShopEngine.Models
{
    public class ShopEngineDbContext : DbContext
    {
        public DbSet<SiteAboutModel> SiteAbouts { get; set; }
        public DbSet<EmailSettingsModel> EmailSettings { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<ProductModel> Products { get; set; }

        public ShopEngineDbContext(DbContextOptions<ShopEngineDbContext> options) : base(options) { }
    }
}
