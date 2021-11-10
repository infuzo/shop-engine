class ProductsSearchableList {

	constructor() {
		this.classPagesNavigation = "pagesNavigation";
		this.idProductsListParent = "listItemsParent";
		this.idSearchInputField = "productSearchInput";
		this.idSearchButton = "productSearchButton";
		this.idSearchInput = "productSearchInput";
		this.idClearSearchResultsButton = "clearSearchResultsButton";
		this.idClearSearchResultsButtonContainer = "clearSearchResultsButtonContainer";

		this.textWaitingForProductsList = "Products list are loading. Please wait";
		this.textEmptySearchRequest = "Search request is empty";

		this.productsList = new Array(Product);
		this.cachedSearchRequest = String("");
		this.isSearchRequestInAction = false;
	}

	setProductsListWaitingStatus(waiting = Boolean) {

		var listOfProductsParent = document.getElementById(this.idProductsListParent);
		removeAllChildren(listOfProductsParent);
		if (waiting) {
			removeAllChildren(document.getElementsByClassName(this.classPagesNavigation)[0]);

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

	renderPageOfProductsList(
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

	createShowProductLink(product = Product, parent = HTMLElement) {
		var newProductLink = document.createElement("a");
		newProductLink.href = "#";
		var productToShow = product;
		newProductLink.onclick = () => showProductInfo(productToShow);
		newProductLink.innerText = `${product.Name} (${product.CategoriesChain})`;

		parent.appendChild(newProductLink);

		var newBr = document.createElement("br");
		parent.appendChild(newBr);
	}

	createPagesNavigationBar(
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

	setClearSerchResultButtonVisibilty() {
		var visible = cachedSearchRequest != null && cachedSearchRequest.length > 0;

		document.getElementById(idClearSearchResultsButtonContainer).style.display = visible ? "table-cell" : "none";
	}


	subscribeSearchButton() {
		document.getElementById(idSearchButton).onclick = () => onSearchButtonClick(null);

		var searchInput = document.getElementById(idSearchInput);
		searchInput.removeEventListener("keyup", onSearchButtonClick);
		searchInput.addEventListener("keyup", onSearchButtonClick);

		searchInput.removeEventListener("focus", onSearchInputFocus);
		searchInput.addEventListener("focus", onSearchInputFocus);

		var clearSearchResultsButton = document.getElementById(idClearSearchResultsButton);
		clearSearchResultsButton.onclick = onClearSearchResultsButtonClick;
	}

	onSearchInputFocus(event) {
		document.getElementById(idSearchInput).select();
	}

	onSearchButtonClick(event) {
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
		clearProductInfo();
		findProductsRequestByCached(1, true);
	}

	onClearSearchResultsButtonClick(event) {
		if (cachedSearchRequest == null || cachedSearchRequest.length == 0) {
			return;
		}

		cachedSearchRequest = null;
		document.getElementById(idSearchInputField).value = "";
		loadProductsPageAndFillList(1, false);
	}

	findProductsRequestByCached(page = Number, fromCache = Boolean) {
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