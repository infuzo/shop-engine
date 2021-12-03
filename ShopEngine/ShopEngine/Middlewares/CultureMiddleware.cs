using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using ShopEngine.Middlewares;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Middlewares
{
    public class CultureMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IApplicationBuilder builder;

        private static readonly IList<CultureInfo> supportedCultures = new CultureInfo[] { new CultureInfo("en-US") };
        private static readonly RequestCulture defaultRequestCulture = new RequestCulture("en-US");

        public CultureMiddleware(
            RequestDelegate next, 
            IApplicationBuilder builder)
        {
            this.next = next;
            this.builder = builder;
        }

        public async Task Invoke(HttpContext context)
        {
            builder.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = defaultRequestCulture,
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            });

            await next.Invoke(context);
        }
    }
}

public static class CultureMiddlewareExtension
{
    public static IApplicationBuilder UseLocalization(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CultureMiddleware>(builder);
    }
}
