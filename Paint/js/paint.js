function Paint(){

	var isSelected = false;
	var selectedDrawing;
	var isFillChecked;
	var counter = 0;
	var startCoordinatesArray = [];
	var finalCoordinatesArray = [];
	var drawings = [];
	var mouse = {x: 0, y: 0};
	var startCoordinates = {x: 0, y: 0};
	var finalCoordinates = {x: 0, y: 0};
	var lastMouse = {x: 0, y: 0};
	var mousePoints = [];
	var mousePointsArray = [];

	var chosenTool = 'brush';
	var chosenColor = 'black';
	var chosenSize;

	var tools = ['move', 'brush', 'eraser', 'bucket', 'text', 'line', 'rectangle', 'circle'];
	var colors = ['red', 'blue', 'green', 'yellow', 'black'];
	
	var canvas, ctx, tempCanvas, tempCtx;
	var textarea, tempTextCtx;
	var coordinatesDisplay;

	var firstIndex = 0;

	var text;

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
	var onTempCanvasClick = function(){

		tempCanvas.addEventListener('mousemove', function(e) {

			lastMouse.x = mouse.x;
			lastMouse.y = mouse.y;

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

			if(chosenTool == 'move' || chosenTool == 'bucket'){
				checkSelection();
			}

			if(chosenTool == 'bucket'){
				pourBucket();
			}

		}, false);

		tempCanvas.addEventListener('mouseup', function(e) {

			finalCoordinates.x = mouse.x;
			finalCoordinates.y = mouse.y;

			tempCanvas.removeEventListener('mousemove', onPaint, false);
			tempCanvas.removeEventListener('mousemove', showDrawCoordinates, false);

			if(chosenTool == 'text'){
				text.onText();
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

			isSelected = false;
		
			console.log('drawings length: ' + drawings.length);

			if(drawings.length > 0){
				if(drawings[0].constructor.name == 'Bucket'){
					console.log('Frst layer is a bucket');
					firstIndex = 1;
				}
				else{
					console.log('First layer is not a bucket');
					firstIndex = 0;
				}
			}

		}, false);

		tempCanvas.addEventListener('dblclick', function(){ 



			for(i=firstIndex; i<startCoordinatesArray.length; i++){

				if(drawings[i].constructor.name == 'Brush'){
					var minX = Math.min.apply(Math,mousePointsArray[i].map(function(o){return o.x;}));
					var minY = Math.min.apply(Math,mousePointsArray[i].map(function(o){return o.y;}));
					var maxX = Math.max.apply(Math,mousePointsArray[i].map(function(o){return o.x;}));
					var maxY = Math.max.apply(Math,mousePointsArray[i].map(function(o){return o.y;}));
				}else{
					var minX = Math.min(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
					var minY = Math.min(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
					var maxX = Math.max(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
					var maxY = Math.max(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
				}

				if((mouse.x >= minX && mouse.x <= maxX) && (mouse.y >= minY && mouse.y <= maxY)){
				
					console.log('DOUBLE CLICK!!');
					drawings.switchLayer(i, drawings.length-1);
					startCoordinatesArray.switchLayer(i, startCoordinatesArray.length-1);
					finalCoordinatesArray.switchLayer(i, finalCoordinatesArray.length-1);
					mousePointsArray.switchLayer(i, mousePointsArray.length-1);
					clearCanvas(ctx);
					reDraw();


				
				}
			
			}

			layerMenu();
  			
		});

	}


	var onPaint = function() {
		mousePoints.push({x: mouse.x, y: mouse.y});
		

		if(chosenTool == 'line'){
			var line = new Line(tempCanvas, tempCtx, mouse, startCoordinates, chosenColor, chosenSize);
			line.init();
		}
		else if(chosenTool == 'rectangle'){
		 	var rectangle = new Rectangle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor, chosenSize);
		 	rectangle.init();
		}
		else if(chosenTool == 'circle'){
		 	var circle = new Circle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor, chosenSize);
		 	circle.init();
		}
		else if(chosenTool == 'brush'){
		 	var brush = new Brush(tempCanvas, tempCtx, mousePoints, chosenColor, chosenSize);
		 	brush.init();
		}
		else if(chosenTool == 'eraser'){
			var eraser = new Eraser(canvas, ctx, mouse, startCoordinates, mousePoints, chosenSize);
			eraser.init();
		}
		else if(chosenTool == 'move'){
			onMoveDrawing();
		}
		else if(chosenTool == 'text'){
			text = new Text(tempCanvas, tempCtx, tempTextCtx, mouse, startCoordinates, textarea, chosenColor, chosenSize);
			text.init();
		}

	};

	var onStore = function(){

		if(chosenTool != 'eraser' && chosenTool != 'bucket'){

			startCoordinatesArray.push({x: startCoordinates.x, y: startCoordinates.y});
			finalCoordinatesArray.push({x: finalCoordinates.x, y: finalCoordinates.y});
			mousePointsArray.push(mousePoints);
		}

		if(chosenTool == 'line'){
			drawings.push(new Line(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], chosenColor, chosenSize));
		}
		else if(chosenTool == 'rectangle'){
		 	drawings.push(new Rectangle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor, chosenSize));
		}
		else if(chosenTool == 'circle'){
		 	drawings.push(new Circle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor, chosenSize));
		}
		else if(chosenTool == 'brush'){
		 	drawings.push(new Brush(tempCanvas, tempCtx, mousePointsArray[counter], chosenColor, chosenSize));
		}
		else if(chosenTool == 'text'){
		 	drawings.push(new Text(tempCanvas, tempCtx, tempTextCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], textarea, chosenColor, chosenSize));
		}
		else if(chosenTool == 'eraser'){
			//drawings.push(new Eraser(canvas, ctx, finalCoordinatesArray[counter], startCoordinatesArray[counter], mousePoints, chosenSize));
		}

		if(chosenTool != 'eraser' && chosenTool != 'bucket'){
			counter++;

			layerMenu();
		}

	}

	var checkSelection = function(){

		
			for(i=firstIndex; i<startCoordinatesArray.length; i++){

				if(drawings[i].constructor.name == 'Brush'){
					var minX = Math.min.apply(Math,mousePointsArray[i].map(function(o){return o.x;}));
					var minY = Math.min.apply(Math,mousePointsArray[i].map(function(o){return o.y;}));
					var maxX = Math.max.apply(Math,mousePointsArray[i].map(function(o){return o.x;}));
					var maxY = Math.max.apply(Math,mousePointsArray[i].map(function(o){return o.y;}));
				}else{
					var minX = Math.min(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
					var minY = Math.min(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
					var maxX = Math.max(startCoordinatesArray[i].x, finalCoordinatesArray[i].x);
					var maxY = Math.max(startCoordinatesArray[i].y, finalCoordinatesArray[i].y);
				}

				if((mouse.x >= minX && mouse.x <= maxX) && (mouse.y >= minY && mouse.y <= maxY)){
					
					selectedDrawing = i;
					
					isSelected = true;
					
				}
				
			}	

	}


	var onMoveDrawing = function(){


				if(isSelected){
										
					clearCanvas(ctx);
					var width = finalCoordinatesArray[selectedDrawing].x - startCoordinatesArray[selectedDrawing].x;
					var height = finalCoordinatesArray[selectedDrawing].y - startCoordinatesArray[selectedDrawing].y;

					startCoordinatesArray[selectedDrawing].x = mouse.x - (width/2);
					startCoordinatesArray[selectedDrawing].y = mouse.y - (height/2);
					finalCoordinatesArray[selectedDrawing].x = startCoordinatesArray[selectedDrawing].x + width;
					finalCoordinatesArray[selectedDrawing].y = startCoordinatesArray[selectedDrawing].y + height;


					//For Brush
					if(drawings[selectedDrawing].constructor.name == 'Brush'){
						var storedMousePoints = mousePointsArray[selectedDrawing];

						var mouseMoveDirection = {x: mouse.x - lastMouse.x, y: mouse.y - lastMouse.y};

						for(i=firstIndex; i<storedMousePoints.length; i++){
							mousePointsArray[selectedDrawing][i].x = mousePointsArray[selectedDrawing][i].x + mouseMoveDirection.x;
							mousePointsArray[selectedDrawing][i].y = mousePointsArray[selectedDrawing][i].y + mouseMoveDirection.y;
						}
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
		chosenSize = selectElement.options[selectElement.selectedIndex].value;
	}

	var showMoveCoordinates = function(){

		coordinatesDisplay.displayMoveCoordinates(mouse);
	}

	var showDrawCoordinates = function(){

		coordinatesDisplay.displayDrawCoordinates(mouse, startCoordinates);
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

	var onSaveButton = function(){

		var ua = window.navigator.userAgent;

			document.getElementById('save-button').addEventListener('click', function (event) {
				
				if (ua.indexOf("Chrome") > 0) {
 
                    // save image as png
                    var link = document.createElement('a');
                    link.download = "canvas.png";
                    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
                    link.click();
                }

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

		for(i=drawings.length-1; i>=firstIndex; i--){
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
		if(select.options.length > 0){
			var chosenLayer = select.options[select.selectedIndex].value;
			console.log('The chosen layer is: ' + chosenLayer);
			var chosenLayer = select.options[select.selectedIndex].value;
			drawings.switchLayer(chosenLayer, drawings.length-1);
			startCoordinatesArray.switchLayer(chosenLayer, startCoordinatesArray.length-1);
			finalCoordinatesArray.switchLayer(chosenLayer, finalCoordinatesArray.length-1);
			mousePointsArray.switchLayer(chosenLayer, mousePointsArray.length-1);
			clearCanvas(ctx);
			reDraw();
			
			layerMenu();	
		}
	}

	var pourBucket = function(){
		if(isSelected){
			console.log('Fill shape: ' + drawings[selectedDrawing].constructor.name);

			switch(drawings[selectedDrawing].constructor.name){

				case 'Line':
				console.log('It is a line!!!!!!!!');
				drawings[selectedDrawing] = new Line(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], chosenColor, chosenSize);
				break;

				case 'Rectangle':
				console.log('It is a rectangle!!!!!!!!');
				drawings[selectedDrawing] = new Rectangle(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], true, chosenColor, chosenSize);
				break;
			
				case 'Circle':
				console.log('It is a circle!!!!!!!!');
				drawings[selectedDrawing] = new Circle(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], true, chosenColor, chosenSize);
				break;

				case 'Brush':
				drawings[selectedDrawing] = new Brush(tempCanvas, tempCtx, mousePointsArray[selectedDrawing], chosenColor, chosenSize);
				break;

			}

			clearCanvas(ctx);
			reDraw();
		}

		else{

			//canvas.style.backgroundColor = chosenColor;
			if(drawings.length == 0){
				drawings.push(new Bucket(tempCanvas, tempCtx, chosenColor));
				startCoordinatesArray.push({x: 0, y: 0});
				finalCoordinatesArray.push({x: 0, y: 0});
				mousePointsArray.push({x: 0, y: 0});

				counter++;
			}
			else if(drawings[0].constructor.name == 'Bucket'){
				console.log('Bucket is already there.');
				drawings[0] = new Bucket(tempCanvas, tempCtx, chosenColor);
			}
			else if(drawings[0].constructor.name != 'Bucket'){
				console.log('Bucket is already there.');
				drawings.unshift(new Bucket(tempCanvas, tempCtx, chosenColor));
				startCoordinatesArray.unshift({x: 0, y: 0});
				finalCoordinatesArray.unshift({x: 0, y: 0});
				mousePointsArray.unshift({x: 0, y: 0});

				counter++;
			}			

			clearCanvas(ctx);
			reDraw();		
		}
	}

	init();
	onClearButton();
	onRedrawButton();
	onSaveButton();
	selectSize();
	checkFill();
	chooseColor();
	clickTool();
	onTempCanvasClick();
	onSelectLayer();
}