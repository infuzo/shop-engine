using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Models
{
    public class ShopEngineIdentityDbContext : IdentityDbContext<IdentityUser>
    {
        public ShopEngineIdentityDbContext(DbContextOptions<ShopEngineIdentityDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
