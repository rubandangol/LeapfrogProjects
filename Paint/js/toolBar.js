function ToolBar(){
	
	this.createToolWrapper = function(){
		var toolsWrapper = new Element('div');
		toolsWrapper.addClass('tools-wrapper clearfix');
		toolsWrapper.appendTo(document.querySelector('.main-wrapper'));

		this.createItems();
		this.createShapes();
		this.createColorPalette();
		this.createSizes();
		this.createMouseCoordinates();
		this.otherTools();
	}
		
	this.createItems = function(){
		var itemsWrapper = new Element('div');
		itemsWrapper.addClass('items-wrapper tool');
		itemsWrapper.appendTo(document.querySelector('.tools-wrapper'));

		var itemsList = new Element('ul');
		itemsList.addClass('items-list');
		itemsList.appendTo(document.querySelector('.items-wrapper'));

		var move = new Element('li');
		move.addClass('item');
		move.addId('move');
		move.appendTo(document.querySelector('.items-list'));

		var brush = new Element('li');
		brush.addClass('item');
		brush.addId('brush');
		brush.appendTo(document.querySelector('.items-list'));

		var eraser = new Element('li');
		eraser.addClass('item');
		eraser.addId('eraser');
		eraser.appendTo(document.querySelector('.items-list'));

		var bucket = new Element('li');
		bucket.addClass('item');
		bucket.addId('bucket');
		bucket.appendTo(document.querySelector('.items-list'));

		var textArea = new Element('li');
		textArea.addClass('item');
		textArea.addId('text');
		textArea.appendTo(document.querySelector('.items-list'));
	}

	this.createShapes = function(){
		var shapesWrapper = new Element('div');
		shapesWrapper.addClass('shapes-wrapper tool');
		shapesWrapper.appendTo(document.querySelector('.tools-wrapper'));

		var shapesList = new Element('ul');
		shapesList.addClass('shapes-list');
		shapesList.appendTo(document.querySelector('.shapes-wrapper'));

		var line = new Element('li');
		line.addClass('shape');
		line.addId('line');
		line.appendTo(document.querySelector('.shapes-list'));

		var rectangle = new Element('li');
		rectangle.addClass('shape');
		rectangle.addId('rectangle');
		rectangle.appendTo(document.querySelector('.shapes-list'));

		var circle = new Element('li');
		circle.addClass('shape');
		circle.addId('circle');
		circle.appendTo(document.querySelector('.shapes-list'));

		var fillWrapper = new Element('div');
		fillWrapper.addClass('fill-wrapper');
		fillWrapper.appendTo(document.querySelector('.shapes-wrapper'));

		var fillText = new Element('span');
		fillText.innerHtml('Fill: ');
		fillText.appendTo(document.querySelector('.fill-wrapper'));

		var fillShapes = new Element('input');
		fillShapes.addId('fill-check');
		fillShapes.addType('checkbox');
		fillShapes.appendTo(document.querySelector('.fill-wrapper'));
	}

	this.createColorPalette = function(){
		var colorPaletteWrapper = new Element('div');
		colorPaletteWrapper.addClass('color-palette-wrapper tool');
		colorPaletteWrapper.appendTo(document.querySelector('.tools-wrapper'));

		var colorList = new Element('ul');
		colorList.addClass('color-list');
		colorList.appendTo(document.querySelector('.color-palette-wrapper'));

		var redColor = new Element('li');
		redColor.addClass('color');
		redColor.addId('red');
		redColor.appendTo(document.querySelector('.color-list'));

		var blueColor = new Element('li');
		blueColor.addClass('color');
		blueColor.addId('blue');
		blueColor.appendTo(document.querySelector('.color-list'));

		var greenColor = new Element('li');
		greenColor.addClass('color');
		greenColor.addId('green');
		greenColor.appendTo(document.querySelector('.color-list'));

		var yellowColor = new Element('li');
		yellowColor.addClass('color');
		yellowColor.addId('yellow');
		yellowColor.appendTo(document.querySelector('.color-list'));

		var blackColor = new Element('li');
		blackColor.addClass('color');
		blackColor.addId('black');
		blackColor.appendTo(document.querySelector('.color-list'));
	}

	this.createSizes = function(){
		var sizesWrapper = new Element('div');
		sizesWrapper.addClass('sizes-wrapper tool');
		sizesWrapper.appendTo(document.querySelector('.tools-wrapper'));

		var select = new Element('select');
		select.addClass('select-size');
		select.appendTo(document.querySelector('.sizes-wrapper'));

		var option1 = new Element('option');
		option1.addValue('1');
		option1.innerHtml('1');
		option1.appendTo(document.querySelector('.select-size'));

		var option2 = new Element('option');
		option2.addValue('2');
		option2.innerHtml('2');
		option2.appendTo(document.querySelector('.select-size'));

		var option3 = new Element('option');
		option3.addValue('3');
		option3.innerHtml('3');
		option3.appendTo(document.querySelector('.select-size'));

		var option4 = new Element('option');
		option4.addValue('4');
		option4.innerHtml('4');
		option4.appendTo(document.querySelector('.select-size'));

		var option5 = new Element('option');
		option5.addValue('5');
		option5.innerHtml('5');
		option5.appendTo(document.querySelector('.select-size'));
	}

	this.createMouseCoordinates = function(){

		var mouseCoordinatesWrapper = new Element('div');
		mouseCoordinatesWrapper.addClass('mouse-coordinates-wrapper tool');
		mouseCoordinatesWrapper.appendTo(document.querySelector('.tools-wrapper'));		

		var moveCoordinatesWrapper = new Element('div');
		moveCoordinatesWrapper.addClass('move-coordinates-wrapper');
		moveCoordinatesWrapper.appendTo(document.querySelector('.mouse-coordinates-wrapper'));

		var moveX = new Element('span');
		moveX.innerHtml('moveX: ');
		moveX.appendTo(document.querySelector('.move-coordinates-wrapper'));

		var xMoveCoordinate = new Element('span');
		xMoveCoordinate.addId('x-move-coordinate');
		xMoveCoordinate.addClass('x-coordinate');
		xMoveCoordinate.appendTo(document.querySelector('.move-coordinates-wrapper'));

		var moveY = new Element('span');
		moveY.innerHtml('moveY: ');
		moveY.appendTo(document.querySelector('.move-coordinates-wrapper'));

		var yMoveCoordinate = new Element('span');
		yMoveCoordinate.addId('y-move-coordinate');
		yMoveCoordinate.appendTo(document.querySelector('.move-coordinates-wrapper'));


		var drawCoordinatesWrapper = new Element('div');
		drawCoordinatesWrapper.addClass('draw-coordinates-wrapper');
		drawCoordinatesWrapper.appendTo(document.querySelector('.mouse-coordinates-wrapper'));

		var drawX = new Element('span');
		drawX.innerHtml('drawX: ');
		drawX.appendTo(document.querySelector('.draw-coordinates-wrapper'));

		var xDrawCoordinate = new Element('span');
		xDrawCoordinate.addId('x-draw-coordinate');
		xDrawCoordinate.addClass('x-coordinate');
		xDrawCoordinate.appendTo(document.querySelector('.draw-coordinates-wrapper'));

		var drawY = new Element('span');
		drawY.innerHtml('drawY: ');
		drawY.appendTo(document.querySelector('.draw-coordinates-wrapper'));

		var yDrawCoordinate = new Element('span');
		yDrawCoordinate.addId('y-draw-coordinate');
		yDrawCoordinate.appendTo(document.querySelector('.draw-coordinates-wrapper'));
			
	}

	this.otherTools = function(){

		var otherToolsWrapper = new Element('div');
		otherToolsWrapper.addClass('other-tools-wrapper tool');
		otherToolsWrapper.appendTo(document.querySelector('.tools-wrapper'));

		var clearButton = new Element('button');
		clearButton.addId('clear-button');
		clearButton.innerHtml('Clear All');
		clearButton.appendTo(document.querySelector('.other-tools-wrapper'));

		var redraw = new Element('button');
		redraw.addId('redraw-button');
		redraw.innerHtml('Redraw');
		redraw.appendTo(document.querySelector('.other-tools-wrapper'));

		var save = new Element('button');
		save.addId('save-button');
		save.innerHtml('Save');
		save.appendTo(document.querySelector('.other-tools-wrapper'));

		var selectLayer = new Element('select');
		selectLayer.addClass('select-layer');
		selectLayer.appendTo(document.querySelector('.other-tools-wrapper'));

		

	}

	this.createToolWrapper();	
}

