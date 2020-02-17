using System.ComponentModel.DataAnnotations;

namespace ShopEngine.Models
{
    public class SiteAboutModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string LogoUrl { get; set; }
        [Required]
        public string ContactsInfo { get; set; }
    }
}
