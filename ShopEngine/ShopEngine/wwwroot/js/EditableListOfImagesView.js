class EditableListOfImagesView {
	constructor(
		divId = String
	) {
		this.DivId = divId;

		this.Initialized = false;

		this.cssUrl = "/css/listOfImages.css";

		this.listStyleClass = "listOfImages";
		this.controllButtonsClass = this.listStyleClass + "ControllButtons";
		this.divImageParentClass = this.listStyleClass + "ImageParent";
		this.divAddNewImageClass = this.listStyleClass + "AddNewImage";

		this.maxImageSize = 150;

		this.confirmMessageText = "Do you want remove image from pictures list?";
		this.labelAddNewImageText = "Add new image: ";

		this.addNewImageButtonName = "newImage";
	}

	fileInput;
	filesToUpload = new Map();

	initialize() {
		this.divParent = document.getElementById(this.DivId);

		if (this.divParent == null) {
			errorDivParentDoesntExist();
			return;
		}

		this.loadCss();
		this.divParent.setAttribute("class", this.listStyleClass);
		this.createAddingNewImageDiv();

		this.Initialized = true;
	}

	loadCss() {
		var head = document.getElementsByTagName("head")[0];
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = this.cssUrl;

		head.appendChild(link);
	}

	updateImagesList(imagesUrl) {
		if (this.divParent == null) {
			errorDivParentDoesntExist();
			return;
		}

		while (this.divParent.firstChild != null) {
			this.divParent.removeChild(this.divParent.firstChild);
		}

		if (imagesUrl == null) {
			return;
		}

		this.currentImagesUrl = imagesUrl;

		for (let index = 0; index < this.currentImagesUrl.length; index++) {
			this.createImageItem(index);
		}

		this.createAddingNewImageDiv();
	}

	createImageItem(indexInUrls = Number) {
		let imageParent = document.createElement("div");
		imageParent.className = this.divImageParentClass;
		this.divParent.appendChild(imageParent);

		let url = this.currentImagesUrl[indexInUrls];

		let newImage = document.createElement("img");
		newImage.setAttribute("src", url);
		newImage.onclick = () => {
			window.open(url, "_blank");
		};
		imageParent.appendChild(newImage);

		this.setImageSize(url, newImage);

		let buttonsParent = document.createElement("div");
		buttonsParent.className = this.controllButtonsClass;
		imageParent.appendChild(buttonsParent);

		let closureIndex = indexInUrls;

		this.createItemButton("<", buttonsParent, indexInUrls == 0,
			() => this.onShiftElementLeft(closureIndex));
		this.createItemButton("X", buttonsParent, false, () => this.onDeleteElement(closureIndex));
		this.createItemButton(">", buttonsParent, indexInUrls + 1 == this.currentImagesUrl.length,
			() => this.onShiftElementRight(closureIndex));
	}

	createItemButton(innerText = String, parent = HTMLDivElement, hidden = Boolean, onClick) {
		let button = document.createElement("button");
		button.setAttribute("type", "submit");
		button.innerText = innerText;
		button.onclick = onClick;
		button.hidden = hidden;

		parent.appendChild(button);

	}

	createAddingNewImageDiv() {
		var newFileLabel = document.createElement("label");
		newFileLabel.setAttribute("for", this.addNewImageButtonName);
		newFileLabel.innerText = this.labelAddNewImageText;

		this.fileInput = document.createElement("input");
		this.fileInput.type = "file";
		this.fileInput.name = this.addNewImageButtonName;
		this.fileInput.setAttribute('multiple', '');
		this.fileInput.addEventListener('change', (event) => this.onNewImageInput());

		var addNewImageDiv = document.createElement("div");
		addNewImageDiv.className = this.divAddNewImageClass;

		addNewImageDiv.appendChild(newFileLabel);
		addNewImageDiv.appendChild(this.fileInput);
		
		this.divParent.appendChild(addNewImageDiv);
	}

	errorDivParentDoesntExist() {
		console.error("Element with id" + this.DivId + "doesn't exists.");
	}

	setImageSize(imageUrl = String, element = HTMLImageElement) {
		let image = new Image();
		let closureElement = element;
		image.onload = () => {
			let newWidth = this.maxImageSize, newHeight = this.maxImageSize;
			let newX = 0, newY = 0;
			if (image.width > image.height) {
				let factor = image.height / image.width;
				newHeight = this.maxImageSize * factor;
				newY = (this.maxImageSize * 0.5) - (newHeight * 0.5);
			}
			else {
				let factor = image.width / image.height;
				newWidth = this.maxImageSize * factor;
				newX = (this.maxImageSize * 0.5) - (newWidth * 0.5);
			}
			closureElement.width = newWidth;
			closureElement.height = newHeight;
			closureElement.style.left = newX + "px";
			closureElement.style.top = newY + "px";
			closureElement.style.opacity = 1;

		};
		image.src = imageUrl;
	}

	onShiftElementLeft(elementIndex = Number) {
		if (elementIndex == 0) { return; }

		let newIndex = elementIndex - 1;
		if (this.filesToUpload.has(elementIndex)) {
			this.swapFilesToUpload(elementIndex, newIndex);
		}

		let temp = this.currentImagesUrl[newIndex];
		this.currentImagesUrl[newIndex] = this.currentImagesUrl[elementIndex];
		this.currentImagesUrl[elementIndex] = temp;

		this.updateImagesList(this.currentImagesUrl);
	}

	onShiftElementRight(elementIndex = Number) {
		let newIndex = elementIndex + 1;
		if (newIndex == this.currentImagesUrl) { return; }

		if (this.filesToUpload.has(elementIndex)) {
			this.swapFilesToUpload(elementIndex, newIndex);
		}

		let temp = this.currentImagesUrl[newIndex];
		this.currentImagesUrl[newIndex] = this.currentImagesUrl[elementIndex];
		this.currentImagesUrl[elementIndex] = temp;

		this.updateImagesList(this.currentImagesUrl);
	}

	swapFilesToUpload(oldIndex, newIndex) {
		let oldIndexFile = this.filesToUpload.get(oldIndex);
		if (this.filesToUpload.has(newIndex)) {
			this.filesToUpload.set(oldIndex, this.filesToUpload.get(newIndex));
		}
		else {
			this.filesToUpload.delete(oldIndex);
		}
		this.filesToUpload.set(newIndex, oldIndexFile);
	}

	onDeleteElement(elementIndex = Number) {
		if (this.currentImagesUrl.length == 0 || elementIndex >= this.currentImagesUrl.length) {
			return;
		}

		if (confirm(this.confirmMessageText)) {
			this.currentImagesUrl.splice(elementIndex, 1);
			this.updateImagesList(this.currentImagesUrl);

			if (this.filesToUpload.has(elementIndex)) {
				this.filesToUpload.delete(elementIndex);
			}
		}
	}

	onNewImageInput() {
		for (let index = 0; index < this.fileInput.files.length; index++) {
			let file = this.fileInput.files[index];
			this.currentImagesUrl.push(URL.createObjectURL(file));
			this.filesToUpload.set(this.currentImagesUrl.length - 1, file);
		}

		this.updateImagesList(this.currentImagesUrl);
	}

	uploadNewImages(productGuid, onComplete, onFail) {
		let request = new XMLHttpRequest();
		request.open("POST", "/AdminPanel/UploadProductImages");
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');

		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					onComplete(request.responseText);
				}
				else {
					onFail();
					alert(`$upload images fail\n${request.status} - ${request.responseText}`);
				}
			}
		};

		let formData = new FormData();
		formData.append('productGuid', productGuid);
		formData.append('images', this.filesToUpload.values());

		request.send(formData);
		//todo: detect and upload new images - as promise. Detect and remove deleted images from the list
	}
}