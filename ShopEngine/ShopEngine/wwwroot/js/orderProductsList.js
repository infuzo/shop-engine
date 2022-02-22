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

	let optionsProductsInfo = new Map();

	this.initialize = function () {
		orderProductsSelectElement = document.getElementById(idSelectedOrderProductsList);
		orderProductsSelectElement.addEventListener("change", onSelectedProductChange);

		buttonEditProductCount = document.getElementById(idEditProductCount);
		buttonEditProductCount.addEventListener("click", onButtonEditProductCountClick);
		buttonEditProductPrice = document.getElementById(idEditProductPrice);
		buttonRemoveProduct = document.getElementById(idRemoveProduct);

		updateProductsListButtonsVisibility();
	}

	this.addProductToList = function (product) {
		let option = document.createElement('option');
		optionsProductsInfo.set(option,
			{
				product: product,
				count: 1,
				overriddenPrice: -1 //price less than null for not-overridden price
			});
		updateOptionInnerHTML(option);
		orderProductsSelectElement.appendChild(option);
	}

	function updateOptionInnerHTML(option) {
		let productInfo = optionsProductsInfo.get(option);
		let price = productInfo.overriddenPrice < 0 ? productInfo.product.Price : productInfo.overriddenPrice;
		option.innerHTML = productInfo.product.Name.substring(0, maxProductNameLength) + '&nbsp;&nbsp;&nbsp;&nbsp;x' + productInfo.count + '&nbsp;&nbsp;&nbsp;&nbsp;Cost: ' + price + '&nbsp;&nbsp;&nbsp;&nbsp;Total: ' + (price * productInfo.count);
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

	function onButtonEditProductCountClick() {
		let option = orderProductsSelectElement.options[orderProductsSelectElement.selectedIndex];
		let productInfo = optionsProductsInfo.get(option);
		if (productInfo == undefined) {
			console.error("Can't find product info for option " + option);
			return;
		}

		let newCount = Number.parseInt(prompt("Enter new items count", productInfo.count));
		if (isNaN(newCount) || newCount <= 0) {
			alert("You entered incorrect number. Please enter integer less than zero.");
			return;
		}

		productInfo.count = newCount;
		updateOptionInnerHTML(option);
	}
}