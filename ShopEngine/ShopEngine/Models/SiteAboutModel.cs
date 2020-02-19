using System.ComponentModel.DataAnnotations;

namespace ShopEngine.Models
{
    public class SiteAboutModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(60)]
        public string Name { get; set; }
        [StringLength(200)]
        [Required]
        public string Description { get; set; }
        public string LogoUrl { get; set; }
        [Required]
        public string ContactsInfo { get; set; }
    }
}
