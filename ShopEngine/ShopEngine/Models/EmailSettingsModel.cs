using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ShopEngine.Models
{
    public class EmailSettingsModel
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(60)]
        public string SenderName { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string EmailAddress { get; set; }

        [Required]
        public string SmtpHost { get; set; }
        [Required]
        public int SmtpPort { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
