function Line(tempCanvas, tempCtx, mouse, start_mouse, chosenColor) {
	
	this.init = function() {
		
		// Tmp canvas is always cleared up before drawing.
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;
		
		tempCtx.beginPath();
		tempCtx.moveTo(start_mouse.x, start_mouse.y);
		tempCtx.lineTo(mouse.x, mouse.y);
		tempCtx.stroke();
		tempCtx.closePath();
	};

}
