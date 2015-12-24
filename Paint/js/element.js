function Element(elementType) {
	this.element = document.createElement(elementType);

	this.appendTo = function(parentElement) {
		parentElement.appendChild(this.element);
	}

	this.addClass = function(className) {
		this.element.setAttribute("class", className);
	}

	this.addId = function(idName) {
		this.element.setAttribute("id", idName);
	}

	this.addValue = function(valueName) {
		this.element.value = valueName;
	}

	this.addName = function(name) {
		this.element.name(name);
	}

	this.innerHtml = function(innerValue) {
		this.element.innerHTML = innerValue;
	}

	this.addType = function(type) {
		this.element.type = type;
	}

	this.removeClass = function(className) {
		
	}

	
}