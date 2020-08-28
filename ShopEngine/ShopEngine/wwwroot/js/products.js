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

const classPagesNavigation = "pagesNavigation";
const idProductsListParent = "listItemsParent";
const idSearchInputField = "productSearchInput";
const idSearchButton = "productSearchButton";
const idSearchInput = "productSearchInput";
const idClearSearchResultsButton = "clearSearchResultsButton";
const idClearSearchResultsButtonContainer = "clearSearchResultsButtonContainer";

const textWaitingForProductsList = "Products list are loading. Please wait";
const textEmptySearchRequest = "Search request is empty";

const idSelectedProductHeader = "selectedProductHeader";
const idSelectedProductName = "selectedProductName";
const idSelectedProductDescription = "selectedProductDescription";
const idSelectedProductCategoryGuid = "selectedProductCategoryGuid";
const idSelectedProductPrice = "selectedProductPrice";
const idSelectedProductCategoriesChain = "selectedProductCategoriesChain";
const idSelectedProductInStock = "selectedProductInStock";
const idSelectedProductIconUrl = "selectedProductIconUrl";
const idSelectedProductCustomVendorCode = "selectedProductCustomVendorCode";

var productsList = new Array(Product);
var cachedSearchRequest = String("");
var isSearchRequestInAction = false;

function loadProductsPageAndFillList(page = Number, fromCache = Boolean) {
	setProductsListWaitingStatus(true);

	getProductsOnPage(page, fromCache)
		.then(content => {
			setProductsListWaitingStatus(false);
			initializeArrayAndPaginationFromJson(content, page => loadProductsPageAndFillList(page, true));
		})
		.catch(content => {
			setProductsListWaitingStatus(false);
			alert(content);
		});
}

function initializeArrayAndPaginationFromJson(json = String, onButtonChangePageClick) {
	var response = JSON.parse(json);

	productsList = new Array();
	for (product of response.products) {
		productsList.push(new Product(
			product.id,
			product.categoryId,
			product.name,
			product.description,
			product.specificationsJson,
			product.price,
			product.categoriesChain,
			product.inStock,
			product.imagesUrlJson,
			product.previewImageIndex,
			product.customVendorCode
		));
	}

	renderPageOfProductsList(
		response.currentPage,
		response.totalPagesCount,
		response.totalProductsCount,
		onButtonChangePageClick);
}

function renderPageOfProductsList(
	page = Number,
	totalPages = Number,
	productsCount = Number,
	onButtonChangePageClick) {

	createPagesNavigationBar(page, totalPages, productsCount, onButtonChangePageClick);
	subscribeSearchButton();
	setClearSerchResultButtonVisibilty();

	var productsListParent = document.getElementById(idProductsListParent);
	removeAllChildren(productsListParent);

	for (product of productsList) {
		createShowProductLink(product, productsListParent);
	}
}

function createShowProductLink(product = Product, parent = HTMLElement) {
	var newProductLink = document.createElement("a");
	newProductLink.href = "#";
	var productToShow = product;
	newProductLink.onclick = () => showProductInfo(productToShow);
	newProductLink.innerText = `${product.Name} (${product.CategoriesChain})`;

	parent.appendChild(newProductLink);

	var newBr = document.createElement("br");
	parent.appendChild(newBr);
}

function createPagesNavigationBar(
	page = Number,
	totalPages = Number,
	productsCount = Number,
	onButtonChangePageClick) {

	var pagesNavigation = document.getElementsByClassName(classPagesNavigation)[0];
	removeAllChildren(pagesNavigation);

	var previousButton = document.createElement("button");
	if (page > 1) {
		previousButton.onclick = () => onButtonChangePageClick(page - 1);
	}
	previousButton.innerText = "< Previous";
	pagesNavigation.appendChild(previousButton);

	var paginationInfo = document.createElement("span");
	paginationInfo.innerHTML = "<b>" + page + " from " + totalPages + "</b>";
	paginationInfo.innerHTML += " (" + productsList.length + " from " + productsCount + ")";
	pagesNavigation.appendChild(paginationInfo);

	var nextButton = document.createElement("button");
	if (page < totalPages) {
		nextButton.onclick = () => onButtonChangePageClick(page + 1);
	}
	nextButton.innerText = "Next >";
	pagesNavigation.appendChild(nextButton);
}

function setClearSerchResultButtonVisibilty() {
	var visible = cachedSearchRequest != null && cachedSearchRequest.length > 0;

	document.getElementById(idClearSearchResultsButtonContainer).style.display = visible ? "table-cell" : "none";
}

function subscribeSearchButton() {
	document.getElementById(idSearchButton).onclick = () => onSearchButtonClick(null);

	var searchInput = document.getElementById(idSearchInput);
	searchInput.removeEventListener("keyup", onSearchButtonClick);
	searchInput.addEventListener("keyup", onSearchButtonClick);

	searchInput.removeEventListener("focus", onSearchInputFocus);
	searchInput.addEventListener("focus", onSearchInputFocus);

	var clearSearchResultsButton = document.getElementById(idClearSearchResultsButton);
	clearSearchResultsButton.onclick = onClearSearchResultsButtonClick;
}

function onSearchInputFocus(event) {
	document.getElementById(idSearchInput).select();
}

function onSearchButtonClick(event) {
	if (event != null) {
		if (event.keyCode != 13 || event.key != "Enter") {
			return;
		}
	}

	if (isSearchRequestInAction) {
		return;
	}

	var searchRequest = document.getElementById(idSearchInputField).value;
	if (searchRequest.length == 0) {
		alert(textEmptySearchRequest);
		return;
	}

	cachedSearchRequest = searchRequest;
	setClearSerchResultButtonVisibilty();
	findProductsRequestByCached(1, true);
}

function onClearSearchResultsButtonClick(event) {
	if (cachedSearchRequest == null || cachedSearchRequest.length == 0) {
		return;
	}

	cachedSearchRequest = null;
	document.getElementById(idSearchInputField).value = "";
	loadProductsPageAndFillList(1, false);
}

function showProductInfo(product = Product) {
	document.getElementById(idSelectedProductHeader).innerText = product.Name;
	document.getElementById(idSelectedProductName).value = product.Name;
	document.getElementById(idSelectedProductDescription).value = product.Description;
	document.getElementById(idSelectedProductCategoryGuid).value = product.CategoryId;
	document.getElementById(idSelectedProductPrice).value = product.Price;
	document.getElementById(idSelectedProductCategoriesChain).innerText = product.CategoriesChain;
	document.getElementById(idSelectedProductInStock).value = product.InStock;

	var iconsArray = null;
	try {
		iconsArray = JSON.parse(product.ImagesUrlJson).urls;		
	}
	catch (e) {
		console.error(e);
	}

	var firstIconUrl = "";
	if (iconsArray != null && iconsArray.length > 0) {
		firstIconUrl = iconsArray[0];
	}

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
	document.getElementById(idSelectedProductInStock).value = false;
	document.getElementById(idSelectedProductIconUrl).value = ""; 
	document.getElementById(idSelectedProductCustomVendorCode).value = "";
}

function findProductsRequestByCached(page = Number, fromCache = Boolean) {
	isSearchRequestInAction = true;

	setProductsListWaitingStatus(true);
	findProducts(cachedSearchRequest, page, fromCache)
		.then(content => {
			setProductsListWaitingStatus(false);
			isSearchRequestInAction = false;
			initializeArrayAndPaginationFromJson(content, page => findProductsRequestByCached(page, true));
		})
		.catch(content => {
			setProductsListWaitingStatus(false);
			isSearchRequestInAction = false;
			alert(content);
		});
}

function setProductsListWaitingStatus(waiting = Boolean) {

	var listOfProductsParent = document.getElementById(idProductsListParent);
	removeAllChildren(listOfProductsParent);
	if (waiting) {
		removeAllChildren(document.getElementsByClassName(classPagesNavigation)[0]);

		let waitingCaption = document.createElement("span");
		waitingCaption.innerText = textWaitingForProductsList;
		listOfProductsParent.appendChild(waitingCaption);
	}
}

function getProductsOnPage(pageNumber = Number, fromCache = Boolean) {
	return new Promise(function (succeed, fail) {
		let request = new XMLHttpRequest();
		request.open("GET", "/AdminPanel/GetProductsPage?page=" + pageNumber + "&fromCache=" + fromCache, true);
		request.addEventListener("load", function () {
			if (request.status == 200) {
				succeed(request.response);
			}
			else {
				fail(new Error("Status code: " + request.status + "; Message: " + request.response));
			}
		});
		request.addEventListener("error", function () {
			fail(new Error("NetworkError"));
		});
		request.send();
	});
}

function findProducts(guidNameOrVendorCode = String, page = Number, fromCache = Boolean) {
	return new Promise(function (succeed, fail) {
		let request = new XMLHttpRequest();
		request.open("GET", "/AdminPanel/FindProducts?guidNameOrVendorCode=" + guidNameOrVendorCode + "&page=" + page + "&findInProductsCache=" + fromCache, true);
		request.addEventListener("load", function () {
			if (request.status == 200) {
				succeed(request.response);
			}
			else {
				fail(new Error("Status code: " + request.status + "; Message: " + request.response));
			}
		});
		request.addEventListener("error", function () {
			fail(new Error("NetworkError"));
		});
		request.send();
	});
}

function removeAllChildren(element = HTMLElement) {
	while (element.firstChild != null) {
		element.removeChild(element.firstChild);
	}
}