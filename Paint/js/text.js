function Text(tempCanvas, tempCtx, tempTextCtx, mouse, start_mouse, textarea, chosenColor, chosenSize) {
	
	this.init = function() {
		
		
		tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;
		tempCtx.lineWidth = chosenSize;
		
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

	this.onText = function(){

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
	
}