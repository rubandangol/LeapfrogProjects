function Bucket(tempCanvas, tempCtx, chosenColor){

	this.init = function(){
    	tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    	tempCtx.strokeStyle = chosenColor;
		tempCtx.fillStyle = chosenColor;
    	tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

}