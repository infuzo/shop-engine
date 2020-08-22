﻿class Product {
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

const idPagesNavigation = "pagesNavigation";
const idProductsListParent = "productsListParent";
const idSearchInputField = "productSearchInput";
const idSearchButton = "productSearchButton";
const idSearchInput = "productSearchInput";
const idClearSearchResultsButton = "clearSearchResultsButton";

const textWaitingForProductsList = "Products list are loading. Please wait";
const textEmptySearchRequest = "Search request is empty";

var productsList = new Array();
var cachedSearchRequest = String("");
var isSearchRequestInAction = false;
var defaulSearchInputWidth = Number(-1);

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
		var newProductLink = document.createElement("a");
		newProductLink.href = "#";
		//todo: add event
		newProductLink.innerText = `${product.Name} (${product.CategoriesChain})`;

		productsListParent.appendChild(newProductLink);

		var newBr = document.createElement("br");
		productsListParent.appendChild(newBr);
	}
}

function createPagesNavigationBar(
	page = Number,
	totalPages = Number,
	productsCount = Number,
	onButtonChangePageClick) {

	var pagesNavigation = document.getElementById(idPagesNavigation);
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
	var searchInput = document.getElementById(idSearchInputField);
	var clearButton = document.getElementById(idClearSearchResultsButton);

	if (defaulSearchInputWidth < 0) {
		defaulSearchInputWidth = searchInput.clientWidth;
	}

	var visible = cachedSearchRequest != null && cachedSearchRequest.length > 0;

	searchInput.style.width = (visible ? defaulSearchInputWidth : defaulSearchInputWidth + clearButton.clientWidth) + "px";
	clearButton.style.display = visible ? "block" : "none";
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
		removeAllChildren(document.getElementById(idPagesNavigation));

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