var OrderProductsList = new function () {
	const idSelectedOrderProductsList = "selectedOrderProductsList";

	const maxProductNameLength = 100;

	const idEditProductCount = "selectedOrderEditCount";
	const idEditProductPrice = "selectedOrderEditPrice";
	const idRemoveProduct = "selectedOrderRemoveProduct";

	let orderProductsSelectElement = HTMLSelectElement;

	let buttonEditProductCount = HTMLButtonElement;
	let buttonEditProductPrice = HTMLButtonElement;
	let buttonRemoveProduct = HTMLButtonElement;

	this.initialize = function () {
		orderProductsSelectElement = document.getElementById(idSelectedOrderProductsList);
		orderProductsSelectElement.addEventListener("change", onSelectedProductChange);

		buttonEditProductCount = document.getElementById(idEditProductCount);
		buttonEditProductPrice = document.getElementById(idEditProductPrice);
		buttonRemoveProduct = document.getElementById(idRemoveProduct);

		updateProductsListButtonsVisibility();
	}

	this.addProductToList = function (product) {
		let option = document.createElement('option');
		option.value = {
			product: product,
			count: 1,
			overriddenPrice: -1 //price less than null for not-overridden price
		};
		updateOptionInnerHTML(option);
		orderProductsSelectElement.appendChild(option);
	}

	function updateOptionInnerHTML(option) {
		let productInfo = option.value;
		let price = productInfo.overriddenPrice < 0 ? productInfo.product.Price : productInfo.overriddenPrice;
		option.innerHTML = productInfo.product.Name.substring(0, maxProductNameLength) + '    x' + productInfo.count + '    Cost: ' + price;
	}

	function updateProductsListButtonsVisibility() {
		let displayValue = orderProductsSelectElement.selectedIndex != -1 ? "inline-block" : "none";
		buttonEditProductCount.style.display = displayValue;
		buttonEditProductPrice.style.display = displayValue;
		buttonRemoveProduct.style.display = displayValue;
	}

	function onSelectedProductChange() {
		orderProductsSelectElement.selectedIndex = orderProductsSelectElement.selectedIndex;
		updateProductsListButtonsVisibility();
	}
}