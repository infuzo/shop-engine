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

		this.maxImageSize = 150;
	}

	initialize() {
		this.divParent = document.getElementById(this.DivId);

		if (this.divParent == null) {
			errorDivParentDoesntExist();
			return;
		}

		this.loadCss();
		this.divParent.setAttribute("class", this.listStyleClass);

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

		for (let index = 0; index < imagesUrl.length; index++) {
			let imageParent = document.createElement("div");
			imageParent.className = this.divImageParentClass;
			this.divParent.appendChild(imageParent);

			let url = imagesUrl[index];

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

			this.createButton("<", buttonsParent);
			this.createButton("X", buttonsParent);
			this.createButton(">", buttonsParent);
		}
	}

	errorDivParentDoesntExist() {
		console.error("Element with id" + this.DivId + "doesn't exists.");
	}

	setImageSize(imageUrl = String, element = HTMLImageElement) {
		let image = new Image();
		let closureElement = element;
		image.onload = () => {
			let newWidth = this.maxImageSize, newHeight = this.maxImageSize;
			if (image.width > image.height) {
				let factor = image.height / image.width;
				newHeight = this.maxImageSize * factor;
			}
			else {
				let factor = image.width / image.height;
				newWidth = this.maxImageSize * factor;
			}
			closureElement.width = newWidth;
			closureElement.height = newHeight;

		};
		image.src = imageUrl;
	}

	createButton(innerText = String, parent = HTMLDivElement) {
		let button = document.createElement("button");
		button.setAttribute("type", "submit");
		button.innerText = innerText;
		
		parent.appendChild(button);

	}
}