class Product {
	constructor() {
		this.Guid = undefinedGuid;
		this.CategoryId = undefinedGuid;
		this.Name = '';
		this.Description = '';
		this.Specifications = '{}';
		this.Price = 0;
		this.CategoriesChain = '';
		this.InStock = true;
		this.ImagesUrlJson = '{}';
		this.PreviewImageIndex = 0;
		this.CustomVendorCode = null;
	}

	imagesUrlArray = [];

	initialize(
		guid = String,
		categoryId = String,
		name = String,
		description = String,
		specifications = String,
		price = Number,
		categoriesChain = String,
		inStock = Boolean,
		imagesUrlJson = String,
		previewImageIndex = Number,
		customVendorCode = Number
	) {
		this.Guid = guid;
		this.CategoryId = categoryId;
		this.Name = name;
		this.Description = description;
		this.Specifications = specifications;
		this.Price = price;
		this.CategoriesChain = categoriesChain;
		this.InStock = inStock;
		this.ImagesUrlJson = imagesUrlJson;
		this.PreviewImageIndex = previewImageIndex;
		this.CustomVendorCode = customVendorCode;
	}

	getFormData() {
		this.updateImagesUrlJson();
		var result = "Id=" + encodeURIComponent(this.Guid) +
			"&CategoryId=" + encodeURIComponent(this.CategoryId) +
			"&Name=" + encodeURIComponent(this.Name) +
			"&Description=" + encodeURIComponent(this.Description) +
			"&SpecificationsJson=" + encodeURIComponent(this.Specifications) +
			"&Price=" + this.Price +
			"&InStock=" + this.InStock +
			"&ImagesUrlJson=" + this.ImagesUrlJson +
			"&PreviewImageIndex=" + this.PreviewImageIndex;
		if (this.CustomVendorCode != null) {
			result += "&CustomVendorCode=" + this.CustomVendorCode;
		}
		return result;
	}

	initializeFromJson(productJson) {
		this.Guid = productJson.id;
		this.CategoryId = productJson.categoryId;
		this.Name = productJson.name;
		this.Description = productJson.description;
		this.Specifications = productJson.specificationsJson;
		this.Price = productJson.price;
		this.CategoriesChain = productJson.categoriesChain;
		this.InStock = productJson.inStock;
		this.ImagesUrlJson = productJson.imagesUrlJson;
		this.PreviewImageIndex = productJson.previewImageIndex;
		this.CustomVendorCode = productJson.customVendorCode;
	}

	updateImagesUrlJson() {
		let imagesJson = {
			urls: this.imagesUrlArray
		};

		this.ImagesUrlJson = JSON.stringify(imagesJson);
	}
}