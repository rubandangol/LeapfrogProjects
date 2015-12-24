function Text(tempCanvas, tempCtx, mouse, start_mouse, textarea, chosenColor) {
	
	this.init = function() {
		
		
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;
		
		var x = Math.min(mouse.x, start_mouse.x);
		var y = Math.min(mouse.y, start_mouse.y);
		var width = Math.abs(mouse.x - start_mouse.x);
		var height = Math.abs(mouse.y - start_mouse.y);
		
		textarea.style.left = x + 'px';
		textarea.style.top = y + 'px';
		textarea.style.width = (width + 5) + 'px';
		textarea.style.height = (height + 5) + 'px';
		
		textarea.style.display = 'block';
	};
	
}