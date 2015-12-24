function Brush(tempCanvas, tempCtx, mouse, start_mouse, mousePoints, chosenColor) {
	
	this.init = function() {
		
		// Tmp canvas is always cleared up before drawing.
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;
		
		
		if (mousePoints.length < 3) {
			var b = mousePoints[0];
			tempCtx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tempCtx.arc(b.x, b.y, tempCtx.lineWidth / 2, 0, Math.PI * 2, !0);
			tempCtx.fill();
			tempCtx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		
		tempCtx.beginPath();
		tempCtx.moveTo(mousePoints[0].x, mousePoints[0].y);
		
		for (var i = 1; i < mousePoints.length - 2; i++) {
			var c = (mousePoints[i].x + mousePoints[i + 1].x) / 2;
			var d = (mousePoints[i].y + mousePoints[i + 1].y) / 2;
			
			tempCtx.quadraticCurveTo(mousePoints[i].x, mousePoints[i].y, c, d);
		}
		
		// For the last 2 points
		tempCtx.quadraticCurveTo(
			mousePoints[i].x,
			mousePoints[i].y,
			mousePoints[i + 1].x,
			mousePoints[i + 1].y
		);
		tempCtx.stroke();
	};

}
