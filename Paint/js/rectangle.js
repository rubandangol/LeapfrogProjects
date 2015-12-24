function Rectangle(tempCanvas, tempCtx, mouse, start_mouse, fillCheck, chosenColor) {

	var x, y, width, height;
	
	this.init = function() {
		
		// Tmp canvas is always cleared up before drawing.
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;

		x = Math.min(mouse.x, start_mouse.x);
		y = Math.min(mouse.y, start_mouse.y);
		width = Math.abs(mouse.x - start_mouse.x);
		height = Math.abs(mouse.y - start_mouse.y);
		
		if(fillCheck){
			tempCtx.fillRect(x, y, width, height);	
		}else{
			tempCtx.strokeRect(x, y, width, height);
		}
	};

}
