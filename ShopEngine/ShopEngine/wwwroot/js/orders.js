var Orders = new function () {
	const idProductsList = "ordersSelectProductWindow";
	const idSelectedOrderState = "selectedOrderState";

	this.initialize = function () {
		loadCss();

		loadProductsPageAndFillList(1, true);
		document.addEventListener("onProductSelect", event => onProductSelected(event.product));
		OrderProductsList.initialize();
	}

	function loadProductsPageAndFillList(page, fromCache) {
		productsSearchableList.setProductsListWaitingStatus(true);
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

	function loadCss() {
		var head = document.getElementsByTagName("head")[0];
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/listOfProducts.css";

		head.appendChild(link);
	}

	this.onAddProductClick = function() {
		setProductsListVisible(true);
	}

	function setProductsListVisible(visible = Boolean) {
		document.getElementById(idProductsList).style.display =
			visible ? 'block' : 'none';
	}

	this.onProductsListButtonCloseClick = function() {
		setProductsListVisible(false);
	}

	function onProductSelected(product) {
		console.log(product);
		OrderProductsList.addProductToList(product);
	}
}