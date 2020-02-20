using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopEngine.Models
{
    public class CategoryModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        
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
