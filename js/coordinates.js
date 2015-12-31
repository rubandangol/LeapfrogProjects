function Coordinates(){

	this.displayMoveCoordinates = function(mouse){

		var xMoveCoordinate = document.getElementById('x-move-coordinate');
		xMoveCoordinate.innerHTML = mouse.x;

		var yMoveCoordinate = document.getElementById('y-move-coordinate');
		yMoveCoordinate.innerHTML = mouse.y;
	}

	this.displayDrawCoordinates = function(mouse, startCoordinates){

		var xDrawCoordinate = document.getElementById('x-draw-coordinate');
		xDrawCoordinate.innerHTML = Math.abs(mouse.x - startCoordinates.x);

		var yDrawCoordinate = document.getElementById('y-draw-coordinate');
		yDrawCoordinate.innerHTML = Math.abs(mouse.y - startCoordinates.y);
	}

}