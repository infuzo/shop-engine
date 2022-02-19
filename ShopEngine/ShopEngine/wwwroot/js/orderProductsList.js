var OrderProductsList = new function () {
	const idSelectedOrderProductsList = "selectedOrderProductsList";

	const idAddProductButton = "selectedOrderAddProduct";
	const idEditProductCount = "selectedOrderEditCount";
	const idEditProductPrice = "selectedOrderEditPrice";
	const idRemoveProduct = "selectedOrderRemoveProduct";

	let orderProductsSelectElement = HTMLSelectElement;

	this.initialize = function () {
		orderProductsSelectElement = document.getElementById(idSelectedOrderProductsList);
		updateProductsListButtonsVisibility();
	}

	this.addProductToList = function (product) {
		let option = document.createElement('option');
		option.value = product;
		option.innerHTML = product.Name;
		orderProductsSelectElement.appendChild(option);
	}

	function updateProductsListButtonsVisibility() {
		orderProductsSelectElement.op
	}
}