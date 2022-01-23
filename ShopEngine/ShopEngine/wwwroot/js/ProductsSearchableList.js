class ProductsSearchableList {

	constructor(
		classPagesNavigation = "pagesNavigation",
		idProductsListParent = "listItemsParent",
		idSearchInputField = "productSearchInput",
		idSearchButton = "productSearchButton",
		idSearchInput = "productSearchInput",
		idClearSearchResultsButton = "clearSearchResultsButton",
		idClearSearchResultsButtonContainer = "clearSearchResultsButtonContainer") {
		this.classPagesNavigation = classPagesNavigation;
		this.idProductsListParent = idProductsListParent;
		this.idSearchInputField = idSearchInputField;
		this.idSearchButton = idSearchButton;
		this.idSearchInput = idSearchInput;
		this.idClearSearchResultsButton = idClearSearchResultsButton;
		this.idClearSearchResultsButtonContainer = idClearSearchResultsButtonContainer;

		this.textWaitingForProductsList = "Products list are loading. Please wait";
		this.textEmptySearchRequest = "Search request is empty";

		this.productsList = new Array(Product);
		this.cachedSearchRequest = String("");
		this.isSearchRequestInAction = false;
	}

	currentPage = Number;

	setProductsListWaitingStatus(waiting = Boolean) {

		var listOfProductsParent = document.getElementById(this.idProductsListParent);
		this.removeAllChildren(listOfProductsParent);
		if (waiting) {
			this.removeAllChildren(document.getElementsByClassName(this.classPagesNavigation)[0]);

			let waitingCaption = document.createElement("span");
			waitingCaption.innerText = this.textWaitingForProductsList;
			listOfProductsParent.appendChild(waitingCaption);
		}
	}

	removeAllChildren(element = HTMLElement) {
		while (element.firstChild != null) {
			element.removeChild(element.firstChild);
		}
	}

	initializeArrayAndPaginationFromJson(json = String, onButtonChangePageClick) {
		var response = JSON.parse(json);

		this.productsList = new Array(Product);
		this.productsList = [];
		for (let product of response.products) {
			var newProduct = new Product();
			newProduct.initializeFromJson(product);
			this.productsList.push(newProduct);
		}

		this.renderPageOfProductsList(
			response.currentPage,
			response.totalPagesCount,
			response.totalProductsCount,
			onButtonChangePageClick);
	}

	renderPageOfProductsList(
		page = Number,
		totalPages = Number,
		productsCount = Number,
		onButtonChangePageClick) {

		this.currentPage = page;

		this.createPagesNavigationBar(page, totalPages, productsCount, onButtonChangePageClick);
		this.subscribeSearchButton();
		this.setClearSerchResultButtonVisibilty();

		var productsListParent = document.getElementById(this.idProductsListParent);
		this.removeAllChildren(productsListParent);

		for (let index = 0; index < this.productsList.length; index++) {
			this.createShowProductLink(index, productsListParent);
		}
	}

	createShowProductLink(productIndex = Number, parent = HTMLElement) {
		let product = this.productsList[productIndex];
		var newProductLink = document.createElement("a");
		newProductLink.href = "#";
		newProductLink.onclick = () => showProductInfo(product, false);
		newProductLink.innerText = `${product.Name} (${product.CategoriesChain})`;

		if (product.CategoriesChain == null || product.CategoriesChain == "") {
			newProductLink.style = "color: red;";
		}

		parent.appendChild(newProductLink);

		var newBr = document.createElement("br");
		parent.appendChild(newBr);
	}

	createPagesNavigationBar(
		page = Number,
		totalPages = Number,
		productsCount = Number,
		onButtonChangePageClick) {

		var pagesNavigation = document.getElementsByClassName(this.classPagesNavigation)[0];
		this.removeAllChildren(pagesNavigation);

		var previousButton = document.createElement("button");
		if (page > 1) {
			previousButton.onclick = () => onButtonChangePageClick(page - 1);
		}
		previousButton.innerText = "< Previous";
		pagesNavigation.appendChild(previousButton);

		var paginationInfo = document.createElement("span");
		paginationInfo.innerHTML = "<b>" + page + " from " + totalPages + "</b>";
		paginationInfo.innerHTML += " (" + this.productsList.length + " from " + productsCount + ")";
		pagesNavigation.appendChild(paginationInfo);

		var nextButton = document.createElement("button");
		if (page < totalPages) {
			nextButton.onclick = () => onButtonChangePageClick(page + 1);
		}
		nextButton.innerText = "Next >";
		pagesNavigation.appendChild(nextButton);
	}

	setClearSerchResultButtonVisibilty() {
		var visible = this.cachedSearchRequest != null && this.cachedSearchRequest.length > 0;

		document.getElementById(this.idClearSearchResultsButtonContainer).style.display = visible ? "table-cell" : "none";
	}

	subscribeSearchButton() {
		document.getElementById(this.idSearchButton).onclick = () => this.onSearchButtonClick(null);

		var searchInput = document.getElementById(this.idSearchInput);
		searchInput.removeEventListener("keyup", this.onSearchButtonClick);
		searchInput.addEventListener("keyup", this.onSearchButtonClick);

		searchInput.removeEventListener("focus", this.onSearchInputFocus);
		searchInput.addEventListener("focus", this.onSearchInputFocus);

		var clearSearchResultsButton = document.getElementById(this.idClearSearchResultsButton);
		clearSearchResultsButton.onclick = this.onClearSearchResultsButtonClick;
	}

	onSearchInputFocus(event) {
		document.getElementById(productsSearchableList.idSearchInput).select();
	}

	onSearchButtonClick(event) {
		if (event != null) {
			if (event.keyCode != 13 || event.key != "Enter") {
				return;
			}
		}

		if (productsSearchableList.isSearchRequestInAction) {
			return;
		}

		var searchRequest = document.getElementById(productsSearchableList.idSearchInputField).value;
		if (searchRequest.length == 0) {
			alert(productsSearchableList.textEmptySearchRequest);
			return;
		}

		productsSearchableList.cachedSearchRequest = searchRequest;
		productsSearchableList.setClearSerchResultButtonVisibilty();
		clearProductInfo();
		productsSearchableList.findProductsRequestByCached(1, true);
	}

	onClearSearchResultsButtonClick(event) {
		if (productsSearchableList.cachedSearchRequest == null || productsSearchableList.cachedSearchRequest.length == 0) {
			return;
		}

		productsSearchableList.cachedSearchRequest = null;
		document.getElementById(productsSearchableList.idSearchInputField).value = "";
		loadProductsPageAndFillList(1, false);
	}

	findProductsRequestByCached(page = Number, fromCache = Boolean) {
		this.isSearchRequestInAction = true;

		this.setProductsListWaitingStatus(true);
		this.findProducts(this.cachedSearchRequest, page, fromCache)
			.then(content => {
				this.setProductsListWaitingStatus(false);
				this.isSearchRequestInAction = false;
				this.initializeArrayAndPaginationFromJson(content, page => this.findProductsRequestByCached(page, true));
			})
			.catch(content => {
				this.setProductsListWaitingStatus(false);
				this.isSearchRequestInAction = false;
				alert(content);
			});
	}

	getProductsOnPage(pageNumber = Number, fromCache = Boolean) {
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

	findProducts(guidNameOrVendorCode = String, page = Number, fromCache = Boolean) {
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
}