using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [NotMapped]
        public IFormFile LogoImage { get; set; }
        [Required]
        public string ContactsInfo { get; set; }
    }
}
