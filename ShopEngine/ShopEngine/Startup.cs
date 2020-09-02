using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShopEngine.Models;
using ShopEngine.Services;

namespace ShopEngine
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ShopEngineDbContext>(options => 
                options.UseSqlServer(Configuration.GetConnectionString("Data")));
            services.AddDbContext<ShopEngineIdentityDbContext>(options => 
                options.UseSqlServer(Configuration.GetConnectionString("Identity")));

            services.AddIdentity<IdentityUser, IdentityRole>(options => options.Password.RequireNonAlphanumeric = false)
                 .AddEntityFrameworkStores<ShopEngineIdentityDbContext>()
                 .AddDefaultTokenProviders();

            services.AddTransient<IProductsService, ProductsService>();
            services.AddTransient<IFileUploadService, FileUploadService>();

            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
