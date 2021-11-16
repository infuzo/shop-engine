class Product {
	constructor(
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
}

const idNoSelectedContent = "noSelectedContent";
const idSelectedItemContent = "selectedItemContent";

const idSelectedProductHeader = "selectedProductHeader";
const idSelectedProductName = "selectedProductName";
const idSelectedProductDescription = "selectedProductDescription";
const idSelectedProductCategoryGuid = "selectedProductCategoryGuid";
const idSelectedProductPrice = "selectedProductPrice";
const idSelectedProductCategoriesChain = "selectedProductCategoriesChain";
const idSelectedProductInStock = "selectedProductInStock";
const idSelectedProductIconUrl = "selectedProductIconUrl";
const idListOfImages = "productListImages";
const idSelectedProductCustomVendorCode = "selectedProductCustomVendorCode";

const selectedProductAddOrSaveId = 'selectedProductAddOrSave';
const selectedProductRemoveId = 'selectedProductRemove';

let listOfImages = EditableListOfImagesView;
let productsSearchableList = new ProductsSearchableList();

function loadProductsPageAndFillList(page = Number, fromCache = Boolean) {
	productsSearchableList.setProductsListWaitingStatus(true);

	setSelectedContentVisibility(false);

	if (listOfImages == null || !listOfImages.Initialized) {
		listOfImages = new EditableListOfImagesView(idListOfImages);
		listOfImages.initialize();
	}

	productsSearchableList.getProductsOnPage(page, fromCache)
		.then(content => {
			productsSearchableList.setProductsListWaitingStatus(false);
			productsSearchableList.initializeArrayAndPaginationFromJson(content, page => loadProductsPageAndFillList(page, true));
		})
		.catch(content => {
			productsSearchableList.setProductsListWaitingStatus(false);
			alert(content);
		});
}

function setSelectedContentVisibility(isVisible = Boolean) {
	document.getElementById(idNoSelectedContent).style.display = isVisible ? 'none' : 'block';
	document.getElementById(idSelectedItemContent).style.display = isVisible ? 'block' : 'none';
}

function showProductInfo(product = Product) {
	setSelectedContentVisibility(true);
	clearProductInfo();

	document.getElementById(idSelectedProductHeader).innerText = product.Name;
	document.getElementById(idSelectedProductName).value = product.Name;
	document.getElementById(idSelectedProductDescription).value = product.Description;
	document.getElementById(idSelectedProductCategoryGuid).value = product.CategoryId;
	document.getElementById(idSelectedProductPrice).value = product.Price;
	document.getElementById(idSelectedProductCategoriesChain).innerText = product.CategoriesChain;
	document.getElementById(idSelectedProductInStock).checked = product.InStock;

	var iconsArray = null;
	try {
		iconsArray = JSON.parse(product.ImagesUrlJson).urls;		
	}
	catch (e) {
		console.error(e);
	}

	var firstIconUrl = "";

	var prefix = location.protocol + '//' + location.host + '/';

	if (iconsArray != null && iconsArray.length > 0) {
		firstIconUrl = iconsArray[0];

		for (let index = 0; index < iconsArray.length; index++) {
			iconsArray[index] = prefix + iconsArray[index];
		}

		listOfImages.updateImagesList(iconsArray);
	}
	else {
		listOfImages.updateImagesList(null);
	}

	let addOrSaveButton = document.getElementById(selectedProductAddOrSaveId);
	addOrSaveButton.onclick = event => buttonProductAddOrSaveClick(product);
	addOrSaveButton.innerText = "Save"; //todo: text for add new product

	let removeButton = document.getElementById(selectedProductRemoveId);
	removeButton.onclick = event => buttonProductRemoveClick(product);
	removeButton.innerText = "Remove";

	document.getElementById(idSelectedProductIconUrl).value = firstIconUrl; 
	document.getElementById(idSelectedProductCustomVendorCode).value = product.CustomVendorCode;
}

function clearProductInfo() {
	document.getElementById(idSelectedProductHeader).innerText = "HEADER_UNDEFINED_CONTENT";
	document.getElementById(idSelectedProductName).value = "";
	document.getElementById(idSelectedProductDescription).value = "";
	document.getElementById(idSelectedProductCategoryGuid).value = "";
	document.getElementById(idSelectedProductPrice).value = null;
	document.getElementById(idSelectedProductCategoriesChain).innerText = "";
	document.getElementById(idSelectedProductInStock).checked = false;
	document.getElementById(idSelectedProductIconUrl).value = ""; 
	document.getElementById(idSelectedProductCustomVendorCode).value = "";
}

function buttonProductAddOrSaveClick(product = Product) {
	setActionButtonsVisibility(false);
	listOfImages.uploadNewImages(product.Guid, onSuccessImageLoad, onFailImageLoad);
}

function buttonProductRemoveClick(product = Product) {
	//todo: implement
}

function setActionButtonsVisibility(isVisible = Boolean) {
	document.getElementById(selectedProductAddOrSaveId).style.display = isVisible ? "inline-block" : "none";
	document.getElementById(selectedProductRemoveId).style.display = isVisible ? "inline-block" : "none";
}

function onSuccessImageLoad() {
	setActionButtonsVisibility(true);
	//todo: send product on server with edited list of images
}

function onFailImageLoad(result) {
	setActionButtonsVisibility(true);
	console.log(result);
}