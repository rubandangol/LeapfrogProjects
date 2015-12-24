function Paint(){

	var minMax = [];
	var isMoving = false;
	var selectedDrawing;
	var isFillChecked;
	var counter = 0;
	var startCoordinatesArray = [];
	var finalCoordinatesArray = [];
	var drawings = [];
	var mouse = {x: 0, y: 0};
	var startCoordinates = {x: 0, y: 0};
	var finalCoordinates = {x: 0, y: 0};	
	var mousePoints = [];

	var chosenTool = 'brush';
	var chosenColor = 'black';

	var tools = ['move', 'brush', 'eraser', 'text', 'line', 'rectangle', 'circle'];
	var colors = ['red', 'blue', 'green', 'yellow', 'black'];
	
	var canvas, ctx, tempCanvas, tempCtx;
	var textarea, tempTextCtx;
	var coordinatesDisplay;

	var init = function(){

		canvas = document.querySelector('#canvas');
		ctx = canvas.getContext('2d');
		var canvasWrapper = document.querySelector('.canvas-wrapper');
		var canvasWrapperStyle = getComputedStyle(canvasWrapper);
		canvas.width = parseInt(canvasWrapperStyle.getPropertyValue('width'));
		canvas.height = parseInt(canvasWrapperStyle.getPropertyValue('height'));

		// Creating a tmp canvas
		tempCanvas = document.createElement('canvas');
		tempCtx = tempCanvas.getContext('2d');
		tempCanvas.id = 'tempCanvas';
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;
	
		canvasWrapper.appendChild(tempCanvas);

		tempCtx.lineJoin = 'round';
		tempCtx.lineCap = 'round';

//////////////////////////////////////////////
	
		textarea = document.createElement('textarea');
		textarea.id = 'text_tool';
		canvasWrapper.appendChild(textarea);
	
		// Text tool's text container for calculating
		// lines/chars
		tempTextCtx = document.createElement('div');
		tempTextCtx.style.display = 'none';
		canvasWrapper.appendChild(tempTextCtx);
	
	
		textarea.addEventListener('mouseup', function(e) {
			tempCanvas.removeEventListener('mousemove', onPaint, false);
		}, false);


		coordinatesDisplay = new CoordinatesDisplay();

	}

	
//////////////////////////////////////////////


	/* TEMPORARY CANVAS Event Listener */
	this.onTempCanvasClick = function(){

		tempCanvas.addEventListener('mousemove', function(e) {

			mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
			mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

			showMoveCoordinates();

		}, false);

		tempCanvas.addEventListener('mousedown', function(e) {

			tempCanvas.addEventListener('mousemove', onPaint, false);
			tempCanvas.addEventListener('mousemove', showDrawCoordinates, false);

			mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
			mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

			startCoordinates.x = mouse.x;
			startCoordinates.y = mouse.y;

			checkSelection();

		}, false);

		tempCanvas.addEventListener('mouseup', function(e) {

			finalCoordinates.x = mouse.x;
			finalCoordinates.y = mouse.y;

			tempCanvas.removeEventListener('mousemove', onPaint, false);
			tempCanvas.removeEventListener('mousemove', showDrawCoordinates, false);

			if(chosenTool == 'text'){
				onText();
			}

			if(chosenTool != 'move'){
				onStore();	
			}
			
			
			ctx.globalCompositeOperation = 'source-over';

			// Writing down to real canvas now
			ctx.drawImage(tempCanvas, 0, 0);
			// Clearing tmp canvas
			clearCanvas(tempCtx);
			// Emptying up Pencil Points
			mousePoints = [];

			isMoving = false;
		
		}, false);

		tempCanvas.addEventListener('dblclick', function(){ 

			for(i=0; i<startCoordinatesArray.length; i++){

				var minX = Math.min(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
				var minY = Math.min(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
				var maxX = Math.max(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
				var maxY = Math.max(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);

				if((mouse.x >= minX && mouse.x <= maxX) && (mouse.y >= minY && mouse.y <= maxY)){
				
					console.log('DOUBLE CLICK!!');
					drawings.switchLayer(i, drawings.length-1);
					startCoordinatesArray.switchLayer(i, drawings.length-1);
					finalCoordinatesArray.switchLayer(i, drawings.length-1);
					clearCanvas(ctx);
					reDraw();


				
				}
			
			}

			layerMenu();
  			
		});

	}


	var onPaint = function() {
		

		if(chosenTool == 'line'){
			var line = new Line(tempCanvas, tempCtx, mouse, startCoordinates, chosenColor);
			line.init();
		}
		else if(chosenTool == 'rectangle'){
		 	var rectangle = new Rectangle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor);
		 	rectangle.init();
		}
		else if(chosenTool == 'circle'){
		 	var circle = new Circle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor);
		 	circle.init();
		}
		else if(chosenTool == 'brush'){
			mousePoints.push({x: mouse.x, y: mouse.y});
			console.log(mousePoints.length);
		 	var brush = new Brush(tempCanvas, tempCtx, mouse, startCoordinates, mousePoints, chosenColor);
		 	brush.init();
		}
		else if(chosenTool == 'eraser'){
			var eraser = new Eraser(canvas, ctx, mouse, startCoordinates, mousePoints);
			eraser.init();
		}
		else if(chosenTool == 'move'){
			onMoveDrawing();
		}
		else if(chosenTool == 'text'){
			var text = new Text(tempCanvas, tempCtx, mouse, startCoordinates, textarea, chosenColor);
			text.init();
		}

	};

	var onStore = function(){

		if(chosenTool != 'eraser'){

			startCoordinatesArray.push({x: startCoordinates.x, y: startCoordinates.y});
			finalCoordinatesArray.push({x: finalCoordinates.x, y: finalCoordinates.y});

		}

		if(chosenTool == 'line'){
			drawings.push(new Line(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], chosenColor));

			
		}
		else if(chosenTool == 'rectangle'){
		 	drawings.push(new Rectangle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor));
		 	
		}
		else if(chosenTool == 'circle'){
		 	drawings.push(new Circle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor));

		}
		else if(chosenTool == 'brush'){
		 	drawings.push(new Brush(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], mousePoints, chosenColor));
		}
		else if(chosenTool == 'text'){
		 	drawings.push(new Text(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], textarea, chosenColor));
		}
		else if(chosenTool == 'eraser'){
			//drawings.push(new Eraser(canvas, ctx, finalCoordinatesArray[counter], startCoordinatesArray[counter], mousePoints));
		}



		counter++;

		layerMenu();

	}

	var checkSelection = function(){

		if(chosenTool == 'move'){
			minMax.splice(0,minMax.length);
			for(i=0; i<startCoordinatesArray.length; i++){

				var minX = Math.min(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
				var minY = Math.min(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
				var maxX = Math.max(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
				var maxY = Math.max(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);


				minMax.push({minX: minX, minY: minY, maxX: maxX, maxY: maxY});

				if((mouse.x >= minX && mouse.x <= maxX) && (mouse.y >= minY && mouse.y <= maxY)){
					
					selectedDrawing = i;
					
					console.log('SELECTED!!');
					isMoving = true;
					
				}
			}
		}

	}


	var onMoveDrawing = function(){


				if(isMoving){
					
					if(startCoordinatesArray[selectedDrawing].x < finalCoordinatesArray[selectedDrawing].x){
						console.log('START IS LESSER THAN FINAL');

					}
					else if(startCoordinatesArray[selectedDrawing].x > finalCoordinatesArray[selectedDrawing].x){
						console.log('FINAL IS LESSER THAN START');
					}
					
					clearCanvas(ctx);
					var width = finalCoordinatesArray[selectedDrawing].x - startCoordinatesArray[selectedDrawing].x;
					var height = finalCoordinatesArray[selectedDrawing].y - startCoordinatesArray[selectedDrawing].y;

					startCoordinatesArray[selectedDrawing].x = mouse.x - (width/2);
					startCoordinatesArray[selectedDrawing].y = mouse.y - (height/2);
					finalCoordinatesArray[selectedDrawing].x = startCoordinatesArray[selectedDrawing].x + width;
					finalCoordinatesArray[selectedDrawing].y = startCoordinatesArray[selectedDrawing].y + height;

					for(i=0; i<mousePoints.length; i++){
						mousePoints[i].x = mousePoints[i].x + 20;
						mousePoints[i].y = mousePoints[i].x + 20;
					}


					reDraw();						
				}		
	}

	var clearCanvas = function(context){
    	context.clearRect(0, 0, canvas.width, canvas.height);
    }


	var clickTool = function(){
		
		var element = [];

		for(i=0; i<tools.length; i++){
			element[i] = document.getElementById(tools[i]);
			element[i].addEventListener('click', function (event) {
     			chosenTool = this.id;
     			console.log(chosenTool);
	 		});
		}

	}

	var chooseColor = function(){

		var colorElement = [];

		for(i=0; i<colors.length; i++){
			colorElement[i] = document.getElementById(colors[i]);
			colorElement[i].addEventListener('click', function (event) {
     			chosenColor = this.id;
     			console.log(chosenColor);
	 		});
		}

	

	}

	var checkFill = function(){

		var fillCheck = document.getElementById('fill-check');
		isFillChecked = fillCheck.checked;
		fillCheck.onchange = checkFill;
	}

	var selectSize = function(){

		var selectElement = document.getElementsByClassName('select-size')[0];
		selectElement.onchange = selectSize;
		var chosenSize = selectElement.options[selectElement.selectedIndex].value;
		ctx.lineWidth = chosenSize;
		tempCtx.lineWidth = chosenSize;
	}

	var showMoveCoordinates = function(){

		coordinatesDisplay.displayMoveCoordinates(mouse);
	}

	var showDrawCoordinates = function(){

		coordinatesDisplay.displayDrawCoordinates(mouse, startCoordinates);
	}

	var onText = function(){

		var lines = textarea.value.split('\n');
		var processedLines = [];
		
		for (var i = 0; i < lines.length; i++) {
			var chars = lines[i].length;
			
			for (var j = 0; j < chars; j++) {
				var text_node = document.createTextNode(lines[i][j]);
				tempTextCtx.appendChild(text_node);
			
				tempTextCtx.style.position   = 'absolute';
				tempTextCtx.style.visibility = 'hidden';
				tempTextCtx.style.display    = 'block';
				
				var width = tempTextCtx.offsetWidth;
				var height = tempTextCtx.offsetHeight;
				
				tempTextCtx.style.position   = '';
				tempTextCtx.style.visibility = '';
				tempTextCtx.style.display    = 'none';
				
				// Logix
				if (width > parseInt(textarea.style.width)) {
					break;
				}
			}
			
			processedLines.push(tempTextCtx.textContent);
			tempTextCtx.innerHTML = '';
		}
		
		var textAreaStyle = getComputedStyle(textarea);
		var fSize = textAreaStyle.getPropertyValue('font-size');
		var fFamily = textAreaStyle.getPropertyValue('font-family');
		
		tempCtx.font = fSize + ' ' + fFamily;
		tempCtx.textBaseline = 'top';
		
		for (var n = 0; n < processedLines.length; n++) {
			var processed_line = processedLines[n];
			
			tempCtx.fillText(
				processed_line,
				parseInt(textarea.style.left),
				parseInt(textarea.style.top) + n*parseInt(fSize)
			);
		}
		
		// clearInterval(sprayIntervalID);
		textarea.style.display = 'none';
		textarea.value = '';

	}

	var onClearButton = function(){
		document.getElementById('clear-button').addEventListener('click', function (event) {
     			
			console.log('CLEAR THE CANVAS!');
			clearCanvas(ctx);

	 	});
	}

	var onRedrawButton = function(){

		document.getElementById('redraw-button').addEventListener('click', function (event) {
			reDraw();
	 	});

	}

	var reDraw = function(){

		for(i=0; i<drawings.length; i++){
				drawings[i];
				drawings[i].init();
				ctx.globalCompositeOperation = 'source-over';

				// Writing down to real canvas now
				ctx.drawImage(tempCanvas, 0, 0);
				// Clearing tmp canvas
				clearCanvas(tempCtx);
			}

	}

	Array.prototype.switchLayer = function (old_index, new_index) {
    	if (new_index >= this.length) {
        	var k = new_index - this.length;
        	while ((k--) + 1) {
            	this.push(undefined);
        	}
    	}
    	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	};

	var layerMenu = function(){

		var select = document.querySelector('.select-layer');
		var selectLength = select.options.length;
		for (i = 0; i < selectLength; i++) {
  			select.remove(select.selectedIndex);
		}

		for(i=drawings.length-1; i>=0; i--){
			var layerName = drawings[i].constructor.name;

			var layer = new Element('option');
			layer.addValue(i);
			layer.innerHtml(layerName + ' ' + i);
			layer.appendTo(document.querySelector('.select-layer'));
			//document.querySelector('.select-layer').value=counter;
		}
		

	}

	var onSelectLayer = function(){

		var select = document.querySelector('.select-layer');
		select.onchange = onSelectLayer;
		if (select.options.length == 0){
			console.log('select is empty!!!');
			
		}else{
			var chosenLayer = select.options[select.selectedIndex].value;
			console.log('The chosen layer is: ' + chosenLayer);
			var chosenLayer = select.options[select.selectedIndex].value;
			drawings.switchLayer(chosenLayer, drawings.length-1);
			startCoordinatesArray.switchLayer(chosenLayer, startCoordinatesArray.length-1);
			finalCoordinatesArray.switchLayer(chosenLayer, finalCoordinatesArray.length-1);
			clearCanvas(ctx);
			reDraw();
			
			layerMenu();	
		}
		
				
	
	}

	init();
	onClearButton();
	onRedrawButton();
	selectSize();
	checkFill();
	chooseColor();
	clickTool();
	this.onTempCanvasClick();
	onSelectLayer();
}