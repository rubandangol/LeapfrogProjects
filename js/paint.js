function Paint(){

	var isSelected = false;
	var isFillChecked;

	var startCoordinatesArray = [];
	var finalCoordinatesArray = [];
	var layers = [];
	var mouse = {x: 0, y: 0};
	var startCoordinates = {x: 0, y: 0};
	var finalCoordinates = {x: 0, y: 0};
	var lastMouse = {x: 0, y: 0};
	var mousePoints = [];
	var mousePointsArray = [];

	var chosenTool = 'brush';
	var chosenColor = 'black';
	var chosenSize;
	var selectedDrawing;

	var tools = ['move', 'brush', 'eraser', 'bucket', 'line', 'rectangle', 'circle'];
	var colors = ['red', 'blue', 'green', 'yellow', 'black'];
	
	var canvas, ctx, tempCanvas, tempCtx;
	var coordinates;

	var counter = 0;
	var firstIndex = 0;

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

		coordinates = new Coordinates();

		selectSize();
		checkFill();
		selectColor();
		selectTool();
		onTempCanvasClick();
		changeLayer();
		deleteLayer();
		onButtonsClick();
	}

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

			if(chosenTool != 'move'){
				//condition for a layer to be created i.e. the drawn object has to have at least 1px height or width
				if((finalCoordinates.x - startCoordinates.x) >= 1 || (finalCoordinates.y - startCoordinates.y) >= 1){
					storeLayer();
				}	
			}			
			
			ctx.globalCompositeOperation = 'source-over';

			// Writing down to real canvas from temporary canvas
			ctx.drawImage(tempCanvas, 0, 0);
			// Clearing tmp canvas
			clearCanvas(tempCtx);
			// Emptying up mouse points
			mousePoints = [];

			isSelected = false;
		
			console.log('layers length: ' + layers.length);

			if(layers.length > 0){
				if(layers[0].constructor.name == 'Bucket'){
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

				if(layers[i].constructor.name == 'Brush'){
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
					layers.switchLayer(i, layers.length-1);
					startCoordinatesArray.switchLayer(i, startCoordinatesArray.length-1);
					finalCoordinatesArray.switchLayer(i, finalCoordinatesArray.length-1);
					mousePointsArray.switchLayer(i, mousePointsArray.length-1);
					clearCanvas(ctx);
					reDraw();


				
				}
			
			}

			showLayerMenu();
  			
		});

	}


	var onPaint = function() {
		mousePoints.push({x: mouse.x, y: mouse.y});
		
		switch(chosenTool){

			case 'line':
				var line = new Line(tempCanvas, tempCtx, mouse, startCoordinates, chosenColor, chosenSize);
				line.init();
				break;
		
			case 'rectangle':
		 		var rectangle = new Rectangle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor, chosenSize);
		 		rectangle.init();
				break;

			case 'circle':
		 		var circle = new Circle(tempCanvas, tempCtx, mouse, startCoordinates, isFillChecked, chosenColor, chosenSize);
		 		circle.init();
		 		break;
		
			case 'brush':
		 		var brush = new Brush(tempCanvas, tempCtx, mousePoints, chosenColor, chosenSize);
		 		brush.init();
		 		break;
		
			case 'eraser':
				var eraser = new Eraser(canvas, ctx, mouse, startCoordinates, mousePoints, chosenSize);
				eraser.init();
				break;
		
			case 'move':
				dragLayer();
				break;
		}

	}

	var storeLayer = function(){

		if(chosenTool != 'eraser' && chosenTool != 'bucket'){

			startCoordinatesArray.push({x: startCoordinates.x, y: startCoordinates.y});
			finalCoordinatesArray.push({x: finalCoordinates.x, y: finalCoordinates.y});
			mousePointsArray.push(mousePoints);
		}

		switch(chosenTool){

			case 'line':
				layers.push(new Line(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], chosenColor, chosenSize));
				break;

			case 'rectangle':
		 		layers.push(new Rectangle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor, chosenSize));
				break;

			case 'circle':
		 		layers.push(new Circle(tempCanvas, tempCtx, finalCoordinatesArray[counter], startCoordinatesArray[counter], isFillChecked, chosenColor, chosenSize));
				break;

			case 'brush':
		 		layers.push(new Brush(tempCanvas, tempCtx, mousePointsArray[counter], chosenColor, chosenSize));
				break;

			case 'eraser':
				//layers.push(new Eraser(canvas, ctx, finalCoordinatesArray[counter], startCoordinatesArray[counter], mousePoints, chosenSize));
				break;
		

		}

		if(chosenTool != 'eraser' && chosenTool != 'bucket'){
			counter++;

			showLayerMenu();
		}

	}

	var checkSelection = function(){

		
			for(i=firstIndex; i<startCoordinatesArray.length; i++){

				if(layers[i].constructor.name == 'Brush'){
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


	var dragLayer = function(){


				if(isSelected){
										
					clearCanvas(ctx);
					var width = finalCoordinatesArray[selectedDrawing].x - startCoordinatesArray[selectedDrawing].x;
					var height = finalCoordinatesArray[selectedDrawing].y - startCoordinatesArray[selectedDrawing].y;

					startCoordinatesArray[selectedDrawing].x = mouse.x - (width/2);
					startCoordinatesArray[selectedDrawing].y = mouse.y - (height/2);
					finalCoordinatesArray[selectedDrawing].x = startCoordinatesArray[selectedDrawing].x + width;
					finalCoordinatesArray[selectedDrawing].y = startCoordinatesArray[selectedDrawing].y + height;


					//For Brush
					if(layers[selectedDrawing].constructor.name == 'Brush'){
						var storedMousePoints = mousePointsArray[selectedDrawing];

						var mouseMoveDirection = {x: mouse.x - lastMouse.x, y: mouse.y - lastMouse.y};

						for(i=0; i<storedMousePoints.length; i++){
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


	var selectTool = function(){
		
		var element = [];

		for(i=0; i<tools.length; i++){
			element[i] = document.getElementById(tools[i]);
			element[i].addEventListener('click', function (event) {
     			chosenTool = this.id;
     			console.log(chosenTool);
	 		});
		}

	}

	var selectColor = function(){

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

		coordinates.displayMoveCoordinates(mouse);
	}

	var showDrawCoordinates = function(){

		coordinates.displayDrawCoordinates(mouse, startCoordinates);
	}

	var onButtonsClick = function(){

		//New Button event listener
		document.getElementById('new-button').addEventListener('click', function (event) {
     		
			clearCanvas(ctx);
			layers.splice(0, layers.length);
			startCoordinatesArray.splice(0, startCoordinatesArray.length);
			finalCoordinatesArray.splice(0, finalCoordinatesArray.length);
			mousePointsArray.splice(0, mousePointsArray.length);
		
			counter = 0;

			var select = document.querySelector('.select-layer');
			var selectLength = select.options.length;
			for (i = 0; i < selectLength; i++) {
  				select.remove(select.selectedIndex);
			}

			reDraw();

	 	});

		//Clear All button event listener
	 	document.getElementById('clear-button').addEventListener('click', function (event) {
     			
			console.log('CLEAR THE CANVAS!');
			clearCanvas(ctx);

	 	});

	 	//Redraw button event listener
	 	document.getElementById('redraw-button').addEventListener('click', function (event) {
			reDraw();
	 	});

	 	//User Agent for saving image
	 	var userAgent = window.navigator.userAgent;

	 	//Save button event listener
		document.getElementById('save-button').addEventListener('click', function (event) {
				
			if (userAgent.indexOf("Chrome") > 0) {
 
                // save image as png
                var link = document.createElement('a');
                link.download = "canvas.png";
                link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
                link.click();
            }

	 	});
/*
		//Open button event listener
		document.getElementById('open-button').addEventListener('change', openImage, false);	 	
*/
	}

	var reDraw = function(){

		for(i=0; i<layers.length; i++){
				layers[i];
				layers[i].init();
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


	var showLayerMenu = function(){

		var select = document.querySelector('.select-layer');
		var selectLength = select.options.length;
		for (i = 0; i < selectLength; i++) {
  			select.remove(select.selectedIndex);
		}

		for(i=layers.length-1; i>=firstIndex; i--){
			var layerName = layers[i].constructor.name;

			var layer = new Element('option');
			layer.addValue(i);
			layer.innerHtml('Layer ' + i + ': ' + layerName);
			layer.appendTo(document.querySelector('.select-layer'));
			//document.querySelector('.select-layer').value=counter;
		}
		

	}

	var changeLayer = function(){

		var select = document.querySelector('.select-layer');
		select.onchange = changeLayer;
		if(select.options.length > 0){
			var chosenLayer = select.options[select.selectedIndex].value;
			console.log('The chosen layer is: ' + chosenLayer);
			var chosenLayer = select.options[select.selectedIndex].value;
			layers.switchLayer(chosenLayer, layers.length-1);
			startCoordinatesArray.switchLayer(chosenLayer, startCoordinatesArray.length-1);
			finalCoordinatesArray.switchLayer(chosenLayer, finalCoordinatesArray.length-1);
			mousePointsArray.switchLayer(chosenLayer, mousePointsArray.length-1);
			clearCanvas(ctx);
			reDraw();
			
			showLayerMenu();	
		}
	}

	var deleteLayer = function(){

		var deleteLayer = document.querySelector('.delete-layer');		
		deleteLayer.addEventListener('click', function (event) {
     			console.log('Delete Layer!!');

     			layers.splice(layers.length - 1, 1);
				startCoordinatesArray.splice(startCoordinatesArray.length - 1, 1);
				finalCoordinatesArray.splice(finalCoordinatesArray.length - 1, 1);
				mousePointsArray.splice(mousePointsArray.length - 1, 1);

				counter--;

				var select = document.querySelector('.select-layer');				
  				select.remove(select.selectedIndex);
				

				clearCanvas(ctx);
				reDraw();
	 		});
	}

	var pourBucket = function(){
		if(isSelected){
			console.log('Fill shape: ' + layers[selectedDrawing].constructor.name);

			switch(layers[selectedDrawing].constructor.name){

				case 'Line':
				console.log('It is a line!!!!!!!!');
				layers[selectedDrawing] = new Line(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], chosenColor, chosenSize);
				break;

				case 'Rectangle':
				console.log('It is a rectangle!!!!!!!!');
				layers[selectedDrawing] = new Rectangle(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], true, chosenColor, chosenSize);
				break;
			
				case 'Circle':
				console.log('It is a circle!!!!!!!!');
				layers[selectedDrawing] = new Circle(tempCanvas, tempCtx, finalCoordinatesArray[selectedDrawing], startCoordinatesArray[selectedDrawing], true, chosenColor, chosenSize);
				break;

				case 'Brush':
				layers[selectedDrawing] = new Brush(tempCanvas, tempCtx, mousePointsArray[selectedDrawing], chosenColor, chosenSize);
				break;

			}

			clearCanvas(ctx);
			reDraw();
		}

		else{

			if(layers.length == 0){
				layers.push(new Bucket(tempCanvas, tempCtx, chosenColor));
				startCoordinatesArray.push({x: 0, y: 0});
				finalCoordinatesArray.push({x: 0, y: 0});
				mousePointsArray.push({x: 0, y: 0});

				counter++;
			}
			else if(layers[0].constructor.name == 'Bucket'){
				console.log('Bucket is already there.');
				layers[0] = new Bucket(tempCanvas, tempCtx, chosenColor);
			}
			else if(layers[0].constructor.name != 'Bucket'){
				console.log('Bucket is already there.');
				layers.unshift(new Bucket(tempCanvas, tempCtx, chosenColor));
				startCoordinatesArray.unshift({x: 0, y: 0});
				finalCoordinatesArray.unshift({x: 0, y: 0});
				mousePointsArray.unshift({x: 0, y: 0});

				counter++;
			}			

			clearCanvas(ctx);
			reDraw();		
		}
	}

	var imageHandler = function(e2){ 
  		          
  		var image = new Image();
  		image.src = e2.target.result;
  		image.onload = function(){
    		ctx.drawImage(image, 0, 0);
  		}          
  		//store.innerHTML='<img src="' + e2.target.result +'">';
	}

	var openImage = function(e1){
  		var filename = e1.target.files[0]; 
  		var fr = new FileReader();
  		fr.onload = imageHandler;  
  		fr.readAsDataURL(filename); 
	}



	init();
}