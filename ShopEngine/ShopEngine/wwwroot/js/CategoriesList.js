let categoriesForCategoriesList = null;
let loadedCategoriesList = null;

let categoriesListSelectElement = null;
let hasCategoriesListNullCategory;

const nullCategoryName = "- No Category -";

function getSelectedCategoryId() {
	if (categoriesForCategoriesList == null || categoriesListSelectElement == null) {
		console.error("Categories list wasn't initialized");
		return null;
	}

	let index = hasCategoriesListNullCategory ? categoriesListSelectElement.selectedIndex - 1 : categoriesListSelectElement.selectedIndex;

	if (index == -1) {
		return null;
	}
	else {
		return categoriesForCategoriesList[index].id;
	}
}

function selectCategoryById(guid = String) {
	if (categoriesForCategoriesList == null || categoriesListSelectElement == null) {
		console.error("Categories list wasn't initialized");
		return;
	}

	if (guid == null && hasCategoriesListNullCategory) {
		categoriesListSelectElement.options.selectedIndex = 0;
	}
	else {
		let index = guid == null ? 0 : categoriesForCategoriesList.findIndex(c => c.id == guid);
		if (hasCategoriesListNullCategory) {
			index++;
		}

		if (index >= 0) {
			categoriesListSelectElement.options.selectedIndex = index;
		}
		else {
			console.error("Can't find category with id " + guid);
		}
	}
}

function categoriesListLoadCategories(fromCache = Boolean, onComplete) {
	let request = new XMLHttpRequest();
	request.open("GET", "/AdminPanel/GetAllCategories?fromCache=" + fromCache);

	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			if (request.status == 200) {
				onLoadCategoriesListComplete(request.responseText);
				onComplete();
			}
			else {
				onLoadCategoriesListFailed(request.responseText);
			}
		}
	};

	request.send();
}

function onLoadCategoriesListComplete(responce) {
	loadedCategoriesList = JSON.parse(responce).categories;
	categoriesForCategoriesList = [];
	if (loadedCategoriesList != null) {
		var parentCategories = loadedCategoriesList.filter(c => c.subCategoryGuid == null);
		loadedCategoriesList = loadedCategoriesList.filter(c => c.subCategoryGuid != null);

		for (category of parentCategories) {
			processCategoryForCategoriesList(category, 0);
		}

		loadedCategoriesList = null;
	}
	else {
		console.error("Can't initialize list of categories");
	}
}

function processCategoryForCategoriesList(nowCategory, nestingCounter = Number) {
	nowCategory.nestingCounter = nestingCounter;
	categoriesForCategoriesList.push(nowCategory);
	loadedCategoriesList = loadedCategoriesList.filter(c => c.id != nowCategory.id);

	var children = loadedCategoriesList.filter(c => c.subCategoryGuid == nowCategory.id);
	nestingCounter++;
	for (child of children) {
		processCategoryForCategoriesList(child, nestingCounter);
	}
}

function onLoadCategoriesListFailed(responce) {
	console.error('Loading of categories error\n' + responce);
}

function createSelectElementForCategoriesList(htmlParent, createNullCategory = false) {
	if (categoriesForCategoriesList == null) {
		console.error("Can't create select element without loaded list of categories");
		return;
	}

	if (categoriesListSelectElement != null) {
		categoriesListSelectElement.remove();
	}

	categoriesListSelectElement = document.createElement("select");
	categoriesListSelectElement.setAttribute("size", "1");

	hasCategoriesListNullCategory = createNullCategory;
	if (createNullCategory) {
		categoriesListSelectElement.options.add(new Option(nullCategoryName));
	}

	for (category of categoriesForCategoriesList) {
		let prefix = '';
		for (let counter = 0; counter < category.nestingCounter; counter++) {
			prefix += '-';
		}
		if (category.nestingCounter > 0) {
			prefix += ' ';
		}

		let option = new Option(prefix + category.name);
		categoriesListSelectElement.add(option);
	}

	htmlParent.appendChild(categoriesListSelectElement);
}