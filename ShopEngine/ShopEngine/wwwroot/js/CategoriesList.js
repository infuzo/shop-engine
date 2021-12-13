let categories = null;
let loadedCategoriesList = null;

let currentCategoryIndex = Number(null);
let selectElement;

function getSelectedCategoryId() {
	if (categories == null || currentCategoryIndex == null) {
		console.error("Categories list wasn't initialized");
		return null;
	}

	return categories[currentCategoryIndex].id;
}

function selectCategoryById(guid = String) {
	if (categories == null || currentCategoryIndex == null) {
		console.error("Categories list wasn't initialized");
	}

	let index = categories.findIndex(c => c.id == guid);
	if (index >= 0) {
		currentCategoryIndex = index;
	}
	else {
		console.error("Can't find category with id " + guid);
	}
}

function loadCategories(fromCache = Boolean, onComplete) {
	if (categories == null) {
		let request = new XMLHttpRequest();
		request.open("GET", "/AdminPanel/GetAllCategories?fromCache=" + fromCache);

		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					onLoadCategoriesComplete(request.responseText);
					onComplete();
				}
				else {
					onLoadCategoriesFailed(request.responseText);
				}
			}
		};

		request.send();
	}
}

function onLoadCategoriesComplete(responce) {
	loadedCategoriesList = JSON.parse(responce).categories;
	categories = [];
	if (loadedCategoriesList != null) {
		var parentCategories = loadedCategoriesList.filter(c => c.subCategoryGuid == null);
		loadedCategoriesList = loadedCategoriesList.filter(c => c.subCategoryGuid != null);

		for (category of parentCategories) {
			processCategory(category, 0);
		}

		console.log(categories);
		loadedCategoriesList = null;
	}
	else {
		console.error("Can't initialize list of categories");
	}
}

function processCategory(nowCategory, nestingCounter = Number) {
	nowCategory.nestingCounter = nestingCounter;
	categories.push(nowCategory);
	loadedCategoriesList = loadedCategoriesList.filter(c => c.id != nowCategory.id);

	var children = loadedCategoriesList.filter(c => c.subCategoryGuid == nowCategory.id);
	nestingCounter++;
	for (child of children) {
		processCategory(child, nestingCounter);
	}
}

function onLoadCategoriesFailed(responce) {
	console.error('Loading of categories error\n' + responce);
}

function createSelectElement(htmlParent) {
	if (categories == null) {
		console.error("Can't create select element without loaded list of categories");
		return;
	}

	if (selectElement != null) {
		selectElement.remove();
	}

	selectElement = document.createElement("select");
	selectElement.setAttribute("size", "1");
	for (category of categories) {
		let prefix = '';

		let option = new Option(prefix + category.name);
		selectElement.add(option);
	}

	htmlParent.appendChild(selectElement);
}