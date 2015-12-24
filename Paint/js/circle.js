function Circle(tempCanvas, tempCtx, mouse, start_mouse, fillCheck, chosenColor) {

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
		
		var kappa = .5522848,
		ox = (width / 2) * kappa, // control point offset horizontal
     	oy = (height / 2) * kappa, // control point offset vertical
      	xe = x + width,           // x-end
      	ye = y + height,           // y-end
      	xm = x + width / 2,       // x-middle
      	ym = y + height / 2;       // y-middle
		
		tempCtx.beginPath();
		tempCtx.moveTo(x, ym);
		tempCtx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		tempCtx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		tempCtx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		tempCtx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		tempCtx.closePath();
		
		if(fillCheck){
			tempCtx.fill();
		}else{
			tempCtx.stroke();	
		}
		
	};

}
