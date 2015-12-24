function Animator(element) {
	this.el = element;
	var that = this;
	this.intervalId;

	this.animate = function(cssProperty, value, duration) {
		var style = window.getComputedStyle(element);
		var initial = style.getPropertyValue(cssProperty);
		initial = parseInt(initial);

		var step = (value - initial) / (duration / 50);
		var counter = 0;
		intervalId = setInterval(function() {
			counter++;
			//var current = step * counter;
			// element.innerHTML = current;
			//element.style[cssProperty] = current + 'px';
			this.current = parseInt(style.getPropertyValue(cssProperty)) + step;
			element.style[cssProperty] = current + 'px';

			
			if (counter >= duration/50)
				clearInterval(intervalId);
		}, 50);
	}

	this.animateBatch = function(properties, duration) {
		for (var x in properties) {
			
		}
	}

	// should stop the animation in current position
	this.stop = function() {
		//clearInterval(stopInterval);
	}

	// should stop the animation and element's properties should be at "end" value
	this.finish = function(cssProperty, value, duration) {
		clearInterval(intervalId);
		var num = parseInt(parseInt(element.style[cssProp]) / 1280);
		element.style[cssProp] = (num) * 1280 + val + 'px';

	}

	this.hitTest = function(singleElement) {

	}

	this.hitTestBatch = function(elements) {

	}
}