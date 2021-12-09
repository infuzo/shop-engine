let categories = null;

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
	var list = JSON.parse(responce).categories;
	if (list != null) {
		for (category of list) {
			console.log(category);
		}
	}
	else {
		console.error("Can't initialize list of categories");
	}
}

function onLoadCategoriesFailed(responce) {
	console.error('Loading of categories error\n' + responce);
}