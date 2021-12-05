﻿class Product {
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

		let imagesJson = {
			urls: this.imagesUrlArray
		};

		return "Id=" + encodeURIComponent(this.Guid) +
			"&CategoryId=" + encodeURIComponent(this.CategoryId) +
			"&Name=" + encodeURIComponent(this.Name) +
			"&Description=" + encodeURIComponent(this.Description) +
			"&SpecificationsJson=" + encodeURIComponent(this.Specifications) +
			"&Price=" + this.Price +
			"&InStock=" + this.InStock +
			"&ImagesUrlJson=" + JSON.stringify(imagesJson) +
			"&PreviewImageIndex=" + this.PreviewImageIndex +
			"&CustomVendorCode=" + this.CustomVendorCode;
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
}

const idNoSelectedContent = "noSelectedContent";
const idSelectedItemContent = "selectedItemContent";

const idSelectedProductGuid = "selectedProductGuid";
const idSelectedProductHeader = "selectedProductHeader";
const idSelectedProductName = "selectedProductName";
const idSelectedProductDescription = "selectedProductDescription";
const idSelectedProductCategoryGuid = "selectedProductCategoryGuid";
const idSelectedProductPrice = "selectedProductPrice";
const idSelectedProductCategoriesChain = "selectedProductCategoriesChain";
const idSelectedProductInStock = "selectedProductInStock";
const idListOfImages = "productListImages";
const idSelectedProductCustomVendorCode = "selectedProductCustomVendorCode";

const selectedProductAddOrSaveId = 'selectedProductAddOrSave';
const selectedProductRemoveId = 'selectedProductRemove';

const textSaveProduct = 'Save';
const textAddProduct = 'Add';
const textDeleteProduct = 'Delete';
const textAddingNewProduct = 'Adding the new product';
const textNewProductImagesFail = 'Error - Creation of product was successful, but there were errors when uploading of images.';

const startRelativeUrl = '/img';

let listOfImages = EditableListOfImagesView;
let productsSearchableList = new ProductsSearchableList();

let wasFirstActionButtonVisible = true;
let wasSecondActionButtonVisible = true;

function loadProductsPageAndFillList(page = Number, fromCache = Boolean, onComplete) {
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
			if (onComplete != undefined) {
				onComplete();
			}
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

function addProduct() {
	let product = new Product();
	showProductInfo(product, true);
}

function showProductInfo(product = Product, isNew = Boolean) {
	setSelectedContentVisibility(true);
	clearProductInfo();

	selectedProductId = product.Guid;

	var productGuidElement = document.getElementById(idSelectedProductGuid);

	if (isNew) {
		productGuidElement.style.display = 'none';
	}
	else {
		productGuidElement.style.display = 'inline-block';
		productGuidElement.value = product.Guid;
	}

	document.getElementById(idSelectedProductHeader).innerText = isNew ? textAddingNewProduct : product.Name;
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

	var prefix = location.protocol + '//' + location.host + '/';

	if (iconsArray != null && iconsArray.length > 0) {

		for (let index = 0; index < iconsArray.length; index++) {
			iconsArray[index] = prefix + iconsArray[index];
		}

		listOfImages.updateImagesList(iconsArray, product.PreviewImageIndex);
	}
	else {
		listOfImages.updateImagesList(null);
	}

	let addOrSaveButton = document.getElementById(selectedProductAddOrSaveId);
	if (isNew) {
		addOrSaveButton.onclick = event => buttonAddProductClick(product);
	}
	else {
		addOrSaveButton.onclick = event => buttonSaveProductClick(product);
	}
	addOrSaveButton.innerText = isNew ? textAddProduct : textSaveProduct;

	let removeButton = document.getElementById(selectedProductRemoveId);

	if (isNew) {
		removeButton.style.display = 'none';
	}
	else {
		removeButton.style.display = 'inline-block';
		removeButton.onclick = event => buttonProductRemoveClick(product);
		removeButton.innerText = textDeleteProduct;
	}

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
	document.getElementById(idSelectedProductCustomVendorCode).value = "";
}

function buttonSaveProductClick(product = Product) {
	setActionButtonsVisibility(false);
	listOfImages.uploadNewImages(product.Guid, () => editSelectedProduct(product.Guid), onFailImageLoad);
}

function buttonAddProductClick(product = Product) {
	setActionButtonsVisibility(false);
	newProductListOfImages = listOfImages.filesToUpload;
	sendProductFormData(
		"/AdminPanel/AddProduct",
		getProductFromInput(undefinedGuid),
		newProduct => {
			listOfImages.uploadNewImages(
				newProduct.Guid,
				() => {
					newProduct.imagesUrlArray = listOfImages.getRelativeUrls(startRelativeUrl);
					onNewProductImagesComplete(newProduct);
				},
				response => onNewProductImagesFails(newProduct, response));
		}
	);
}

function onNewProductImagesComplete(product = Product) {
	showProductInfo(product, false);
	setActionButtonsVisibility(true);
}

function onNewProductImagesFails(product = Product, response) {
	showProductInfo(product, false);
	setActionButtonsVisibility(true);
	alert(textNewProductImagesFail);
	console.log(response);
}

function buttonProductRemoveClick(product = Product) {
	//todo: implement
}

function setActionButtonsVisibility(isVisible = Boolean) {
	let firstAction = document.getElementById(selectedProductAddOrSaveId);
	let secondAction = document.getElementById(selectedProductRemoveId);

	if (isVisible) {
		firstAction.style.display = wasFirstActionButtonVisible ? "inline-block" : "none";
		secondAction.style.display = wasSecondActionButtonVisible ? "inline-block" : "none";
	}
	else {
		wasFirstActionButtonVisible = firstAction.style.display != "none";
		wasSecondActionButtonVisible = secondAction.style.display != "none";

		firstAction.style.display = "none";
		secondAction.style.display = "none";
	}
}

function editSelectedProduct(selectedProductGuid = String) {
	sendProductFormData(
		"/AdminPanel/EditProduct",
		getProductFromInput(selectedProductGuid),
		product => {
			showProductInfo(product, false);
			setActionButtonsVisibility(true);
		}
	);
}

function getProductFromInput(productGuid = String) {
	let product = new Product();
	product.initialize(
		productGuid,
		document.getElementById(idSelectedProductCategoryGuid).value,
		document.getElementById(idSelectedProductName).value,
		document.getElementById(idSelectedProductDescription).value,
		"{}", //todo: implement list of specifiactions
		document.getElementById(idSelectedProductPrice).value,
		"",
		document.getElementById(idSelectedProductInStock).checked,
		"{}",
		listOfImages.previewImageIndex,
		document.getElementById(idSelectedProductCustomVendorCode).value);
	product.imagesUrlArray = listOfImages.getRelativeUrls(startRelativeUrl);
	return product;
}

function sendProductFormData(requestUrl = String, product = Product, onComplete) {
	let request = new XMLHttpRequest();
	request.open("POST", requestUrl);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');

	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			if (request.status == 200) {
				loadProductsPageAndFillList(
					productsSearchableList.currentPage,
					false,
					() => {
						var product = new Product();
						product.initializeFromJson(JSON.parse(request.responseText));

						if (onComplete != undefined) {
							onComplete(product);
						}
					});				
			}
			else {
				setActionButtonsVisibility(true);
				alert(`${request.status} - ${request.responseText}`);
			}
		}
	};

	request.send(product.getFormData());
}

function onFailImageLoad(result) {
	setActionButtonsVisibility(true);
	console.log(result);
}