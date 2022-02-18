var Orders = new function () {

	const idProductsList = "ordersSelectProductWindow";
	const idSelectedOrderState = "selectedOrderState";
	const idSelectedOrderProductsList = "selectedOrderProductsList";

	let productsSearchableList;

	this.initialize = function () {
		loadCss();

		productsSearchableList = new ProductsSearchableList(
			"ordersProductsPagesNavigation",
			"ordersListItemsParent");

		loadProductsPageAndFillList(1, true);
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
}