using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopEngine.Models
{
    public class ProductModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public Guid CategoryId { get; set; }
        [MaxLength(60)]
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        /// <summary>
        /// Two arrays in this json - keys and values.
        /// </summary>
        [Required]
        public string SpecificationsJson { get; set; }

        public CategoryModel Category { get; set; }

        public IDictionary<string, string> GetSpecifications()
        {
            throw new NotImplementedException();
        }
    }
}
