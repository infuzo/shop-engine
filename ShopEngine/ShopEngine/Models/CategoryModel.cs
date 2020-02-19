using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShopEngine.Models
{
    public class CategoryModel
    {
        public Guid Id { get; set; }
        
        /// <summary>
        /// Null for root categories.
        /// </summary>
        public string SubCategoryGuid { get; set; }
        [Required]
        [MaxLength(60)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Description { get; set; }
    }
}
