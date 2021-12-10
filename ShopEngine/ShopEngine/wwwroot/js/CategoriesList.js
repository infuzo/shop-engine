﻿let categories = null;
let loadedCategoriesList = null;

function addCategoriesDropDown(fromCache = Boolean) {
	loadCategories(fromCache);
}

function loadCategories(fromCache = Boolean) {
	if (categories == null) {
		let request = new XMLHttpRequest();
		request.open("GET", "/AdminPanel/GetAllCategories?fromCache=" + fromCache);

		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					onLoadCategoriesComplete(request.responseText);
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
			processCategory(category);
		}

		console.log(categories);
		loadedCategoriesList = null;
	}
	else {
		console.error("Can't initialize list of categories");
	}
}

function processCategory(nowCategory) {
	categories.push(nowCategory);
	loadedCategoriesList = loadedCategoriesList.filter(c => c.id != nowCategory.id);

	var children = loadedCategoriesList.filter(c => c.subCategoryGuid == nowCategory.id);
	for (child of children) {
		processCategory(child);
	}
}

function onLoadCategoriesFailed(responce) {
	console.error('Loading of categories error\n' + responce);
}