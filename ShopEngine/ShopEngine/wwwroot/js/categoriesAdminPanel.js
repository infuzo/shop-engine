const idCategoriesListParent = "listItemsParent";
const idSelectedCategoryHeader = "selectedCategoryHeader";
const idSelectedCategoryName = "selectedCategoryName";
const idSelectedCategoryDescription = "selectedCategoryDescription";
const idSelectedCategoryGuid = "selectedCategoryGuid";
const idSelectedCategoryButtonAdd = "selectedCategoryAdd";
const idSelectedCategoryButtonRemove = "selectedCategoryRemove";
const idSelectedProductCategoryContainer = "selectedCategorySubcategoryContainter";

//TODO: from localization
const textDefault = "Select the category or add new one";
const textEditHeader = "Editing the ";
const textAddHeader = "Adding the new category";
const textIncorrectNameOrDesc = "Name and description should have values.";
const textIncorrectSubcategory = "You can't use same category as subcategory";
const textAddingModelProcess = "Category is adding... Please wait";
const textAddingFailed = "Adding the new category failed.";
const textDeleteCategoryConfirmation = "Do you want to delete categery ";
const textDeletingCategoryProcess = "Category is deleting. Please wait";
const textCategoryDeletedSuccessfully = "Category was deleted successfully";
const textDeletingFailed = "Deleting the category failed.";
const textEditWaiting = "Category is editing... Please wait";
const textEditFailed = "Edit the category failed.";

let lastSelectedCategory = null;
let categories = [];

class Category {
	constructor(guid = "", subCatGuid = "", name = "", desc = "") {
		this.Id = guid;
		this.SubCategoryGuid = subCatGuid;
		this.Name = name;
		this.Description = desc;
	}

	setFromJson(jsonString) {
		let json = JSON.parse(jsonString);

		this.Id = json.id;
		this.SubCategoryGuid = json.subCategoryGuid;
		this.Name = json.name;
		this.Description = json.description;
	}

	getFormData() {
		let formData = "Id=" + (this.Id == "" ? undefinedGuid : encodeURIComponent(this.Id)) +
			"&Name=" + encodeURIComponent(this.Name) +
			"&Description=" + encodeURIComponent(this.Description);
		if (this.SubCategoryGuid != null) {
			formData += "&SubCategoryGuid=" + encodeURIComponent(this.SubCategoryGuid);
		}
		return formData;
	}

	getValidationError() {
		if (this.Name == null || this.Name.length == 0
			&& this.Description == null || this.Description.length == 0) {
			return textIncorrectNameOrDesc;
		}

		if (this.SubCategoryGuid == this.Id) {
			return textIncorrectSubcategory;
		}

		return null;
	}
}

function addCategoryToList(guid, subCatGuid, name, description) {
	let category = new Category(guid, subCatGuid, name, description);
	categories.push(category);
	return category;
}

function removeCategoryFromList(category = Category) {
	var elementIndex = categories.indexOf(category);
	if (elementIndex != -1) {
		categories.splice(elementIndex, 1);
	}
}

function renderCategoryList() {
	categoriesListLoadCategories(false, () => {
		var categoriesParent = document.getElementById(idCategoriesListParent);
		while (categoriesParent.firstChild != null) {
			categoriesParent.removeChild(categoriesParent.firstChild);
		}

		var roots = categories.filter(cat => cat.SubCategoryGuid == "" || cat.SubCategoryGuid == undefined);
		var broken = categories.filter(cat => cat.SubCategoryGuid != "" && cat.SubCategoryGuid != undefined
			&& !categories.some(cat2 => cat2.Id == cat.SubCategoryGuid));
		for (var rootCat of roots) {
			addCategoriesWithNesting(categoriesParent, rootCat, 0);
		}
		for (var brokenCat of broken) {
			addCategoriesWithNesting(categoriesParent, brokenCat, 0, true);
		}

		if (lastSelectedCategory != null) {
			selectCategory(null, categories.find(c => c.Id == lastSelectedCategory));
		}
	});
}

function updateCategoriesArray(onComplete) {
	let request = new XMLHttpRequest();
	request.open("GET", "/AdminPanel/GetAllCategories?fromCache=false");

	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			if (request.status == 200) {
				categories = [];
				var jsonCategories = JSON.parse(request.response).categories;
				for (category of jsonCategories) {
					addCategoryToList(category.id, category.subCategoryGuid, category.name, category.description);
				}

				onComplete();
			}
			else {
				console.error(`${textEditFailed}\n${request.status} - ${request.responseText}`);
				onComplete();
			}
		}
	};

	request.send();
}

function addCategoriesWithNesting(parent = HTMLElement, rootCategory = Category, nestingLevel = 0, broken = false) {
	createCategoryLink(parent, rootCategory, nestingLevel, broken);
	var childs = categories.filter(cat => cat.SubCategoryGuid == rootCategory.Id);
	nestingLevel++;
	for (child of childs) {
		addCategoriesWithNesting(parent, child, nestingLevel, broken);
	}
}

function createCategoryLink(parent = HTMLElement, category = Category, nestingLevel = 0, broken = false) {
	let newCategoryLink = document.createElement("a");
	newCategoryLink.href = "#";
	let innerText = "";
	for (var index = 0; index < nestingLevel; index++) { innerText += "-"; }
	if (innerText.length > 0) { innerText += " "; }
	newCategoryLink.innerText = innerText + category.Name;
	if (broken) {
		newCategoryLink.style = "color: red;";
	}

	newCategoryLink.addEventListener("click", (event) => selectCategory(event, category));

	parent.appendChild(newCategoryLink);
	parent.appendChild(document.createElement("br"));
}

function setWaitingSelectedContent(header, value) {
	document.getElementById(idSelectedCategoryHeader).innerText = header;

	let currentStyleValue = value ? "display: none;" : "display: inline-block;";

	document.getElementById(idSelectedCategoryName).style = currentStyleValue;
	document.getElementById(idSelectedCategoryDescription).style = currentStyleValue;
	document.getElementById(idSelectedProductCategoryContainer).style = currentStyleValue;
	document.getElementById(idSelectedCategoryGuid).style = currentStyleValue;
	document.getElementById(idSelectedCategoryButtonAdd).style = currentStyleValue;
	document.getElementById(idSelectedCategoryButtonRemove).style = currentStyleValue;
}

function selectCategory(event, selectedCategory) {
	setWaitingSelectedContent(textEditHeader + selectedCategory.Name, false);

	document.getElementById(idSelectedCategoryName).value = selectedCategory.Name;
	document.getElementById(idSelectedCategoryDescription).value = selectedCategory.Description;
	createSelectElementForCategoriesList(document.getElementById(idSelectedProductCategoryContainer), true);
	selectCategoryById(selectedCategory.SubCategoryGuid);
	document.getElementById(idSelectedCategoryGuid).value = selectedCategory.Id;

	document.getElementById(idSelectedCategoryButtonAdd).innerText = "Save";
	document.getElementById(idSelectedCategoryButtonAdd).onclick = (e) => onEditCategory(e, selectedCategory);
	document.getElementById(idSelectedCategoryButtonRemove).innerText = "Delete";
	document.getElementById(idSelectedCategoryButtonRemove).onclick = (e) => deleteSelectedCategory(e, selectedCategory);

	lastSelectedCategory = selectedCategory.Id;

	if (event != null) {
		event.stopPropagation();
	}
}

function onEditCategory(event, category = Category) {
	if (event != null) {
		event.stopPropagation();
	}

	category.Name = document.getElementById(idSelectedCategoryName).value;
	category.Description = document.getElementById(idSelectedCategoryDescription).value;
	category.SubCategoryGuid = getSelectedCategoryId();

	if (category == null) {
		return;
	}
	var validationError = category.getValidationError();
	if (validationError != null) {
		alert(validationError);
		return;
	}

	let request = new XMLHttpRequest();
	request.open("POST", "/AdminPanel/EditCategory");
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');

	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			if (request.status == 200) {
				updateCategoriesArray(() => {
					setWaitingSelectedContent("", false);
					renderCategoryList();
				});
			}
			else {
				alert(`${textEditFailed}\n${request.status} - ${request.responseText}`);
				setWaitingSelectedContent("", false);
				selectCategory(null, category);
			}
		}
	};

	setWaitingSelectedContent(textEditWaiting, true);
	request.send(category.getFormData());
}

function deleteSelectedCategory(event, category = Category) {
	let result = confirm(textDeleteCategoryConfirmation + "\"" + category.Name + "\"?");
	if (result) {
		let request = new XMLHttpRequest();
		request.open("POST", "/AdminPanel/RemoveCategory");
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');

		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					setWaitingSelectedContent(textCategoryDeletedSuccessfully, true);
					removeCategoryFromList(category);
					lastSelectedCategory = null;
					renderCategoryList();
				}
				else {
					setWaitingSelectedContent("", false);
					alert(`${textDeletingFailed}\n${request.status} - ${request.responseText}`);
					selectCategory(null, category);
				}
			}
		};

		setWaitingSelectedContent(textDeletingCategoryProcess, true);
		request.send("guid=" + category.Id);
	}

	event.stopPropagation();
}

function addCategory(event, subCatGuid = null, name = "", desc = "") {
	setWaitingSelectedContent(textAddHeader, false);
	document.getElementById(idSelectedCategoryButtonRemove).style = "display: none;";

	document.getElementById(idSelectedCategoryName).value = name;
	document.getElementById(idSelectedCategoryDescription).value = desc;
	createSelectElementForCategoriesList(document.getElementById(idSelectedProductCategoryContainer), true);
	selectCategoryById(null);
	document.getElementById(idSelectedCategoryGuid).value = "";

	document.getElementById(idSelectedCategoryButtonAdd).innerText = "Add";
	document.getElementById(idSelectedCategoryButtonAdd).onclick =
		(e) => {
			let category = new Category("",
				getSelectedCategoryId(),
				document.getElementById(idSelectedCategoryName).value,
				document.getElementById(idSelectedCategoryDescription).value);
			onAddCategory(e, category);
		};

	if (event != null) {
		event.stopPropagation();
	}
}

function onAddCategory(event, category = new Category()) {
	event.stopPropagation();

	if (category == null) {
		return;
	}
	var validationError = category.getValidationError();
	if (validationError != null) {
		alert(validationError);
		return;
	}

	setWaitingSelectedContent(textAddingModelProcess, true);

	let request = new XMLHttpRequest();
	request.open("POST", "/AdminPanel/AddCategory");
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var addedObject = new Category();
				addedObject.setFromJson(request.responseText);
				addedObject = addCategoryToList(addedObject.Id, addedObject.SubCategoryGuid, addedObject.Name, addedObject.Description);
				lastSelectedCategory = addedObject.Id;
				renderCategoryList();
			}
			else {
				alert(`${textAddingFailed}\n${request.status} - ${request.responseText}`);
				setWaitingSelectedContent("", false);
				addCategory(null, category.SubCategoryGuid, category.Name, category.Description);
			}
		}
	};

	request.send(category.getFormData());
}