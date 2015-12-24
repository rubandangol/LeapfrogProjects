function Slider(){
		
	var active = 1;
	var slider = document.getElementsByClassName('slider-long-wrapper')[0];
	var sliderLong = slider.children[0];
	var totalSlides = sliderLong.children;

	var leftArrow = document.getElementsByClassName('slider-left-wrapper')[0];
	var rightArrow = document.getElementsByClassName('slider-right-wrapper')[0];

	var imageWidth = 1280; 
	var sliderLeftMargin = 0;
	var animator = new Animator(slider);

		var individualInterval = setInterval(slide,2000);
		arrowClick();
		pagerPanel();
		clickPager();
		highlightPager();
		changeSlideNumber();
	
		function slide(){
			
			

			if(active < 5) {
				sliderLeftMargin = active * (-imageWidth);
				active++;

				
			}else{
				sliderLeftMargin = 0;
				active = 1;
			}	 		

			
			animator.animate('margin-left', sliderLeftMargin, 1000);
			highlightPager();
			changeSlideNumber();
			
		}

		function arrowClick(){

			leftArrow.addEventListener('click', function (event) {
     				var currentLeftMargin = parseInt(slider.style.marginLeft);

     				if(active < 5){

     					if((currentLeftMargin%imageWidth)==0){
     						clearInterval(individualInterval);
     						sliderLeftMargin = active * (-imageWidth);
     						active++;
     						animator.animate('margin-left', sliderLeftMargin, 500);
     						individualInterval = setInterval(slide,2000);
     						highlightPager();
     						changeSlideNumber();
     					}
     					else{
     					/*	clearInterval(individualInterval);
     						var remainingLeftMargin = currentLeftMargin%imageWidth;
     						currentLeftMargin = currentLeftMargin + remainingLeftMargin;
     						animator.animate('margin-left', currentLeftMargin, 500);
     						individualInterval = setInterval(slide,2000);
     					*/
     					}
     				}
	 			});


			rightArrow.addEventListener('click', function (event) {
					var currentLeftMargin = parseInt(slider.style.marginLeft);

					if(active > 1){

     					if((currentLeftMargin%imageWidth)==0){
     						clearInterval(individualInterval);
     						sliderLeftMargin = (active-2) * (-imageWidth);
     						active--;
     						animator.animate('margin-left', sliderLeftMargin, 500);
     						individualInterval = setInterval(slide,2000);
     						highlightPager();
     						changeSlideNumber();	
     					}else{
     						/*
     						  animator.finish('margin-left', sliderLeftMargin, 1000);
     						  sliderLeftMargin = sliderLeftMargin + imageWidth;
     						  individualInterval = setInterval(slide,2000);

     						*/
     					}

     				}

	 			});

		}

		function pagerPanel(){

			var pagerWrapper = document.getElementsByClassName('pager-wrapper')[0];
			var ul = document.createElement('ul');
			ul.className = 'ulPager';
			for(var i=0; i<totalSlides.length; i++){
				var li = document.createElement('li');
				li.id = i;
				ul.appendChild(li);
			}
			
			pagerWrapper.appendChild(ul);


		}

		function highlightPager(){
			var liArray = document.getElementsByClassName('ulPager')[0].children;
			
			for(var i=0; i < liArray.length; i++){
				var unhighlightLi = document.getElementsByClassName('ulPager')[0].children[i];
				unhighlightLi.style.backgroundImage = "url('images/pager.png')";
			}

			var highlightLi = document.getElementsByClassName('ulPager')[0].children[active-1];
			highlightLi.style.backgroundImage = "url('images/pager-highlight.png')";
			
		}

		function clickPager(){
			var liArray = document.getElementsByClassName('ulPager')[0].children;
			
			for(var i=0; i < liArray.length; i++){
				var clickLi = document.getElementsByClassName('ulPager')[0].children[i];
				clickLi.id = i+1;
				clickLi.addEventListener('click', function (event) {
					var currentLeftMargin = parseInt(slider.style.marginLeft);
					if((currentLeftMargin%imageWidth)==0){
     					clearInterval(individualInterval);
     					active = this.id;
     					sliderLeftMargin = ((active-1) * (-imageWidth));	
     					animator.animate('margin-left', sliderLeftMargin, 500);
     					individualInterval = setInterval(slide,2000);
     					highlightPager();
     					changeSlideNumber();
     				}
					
	 			});
			} 
		}

		function changeSlideNumber(){

			var sliderLeftWrapper = document.getElementsByClassName('slider-left-wrapper')[0];
			var sliderRightWrapper = document.getElementsByClassName('slider-right-wrapper')[0];

			if(active>1){
				
				sliderLeftWrapper.style.visibility = "visible";
				var leftSlideNumber = sliderLeftWrapper.children[0];
				leftSlideNumber.innerHTML = active - 1;
				var leftSlideTotalNumber = sliderLeftWrapper.children[1];
				leftSlideTotalNumber.innerHTML = totalSlides.length;
			}else{
				sliderLeftWrapper.style.visibility = "hidden";
			}
			
			if(active<totalSlides.length){
				sliderRightWrapper.style.visibility = "visible";
				var rightSlideNumber = sliderRightWrapper.children[0];
				rightSlideNumber.innerHTML = Math.abs(-active - 1);
				var rightSlideTotalNumber = sliderRightWrapper.children[1];
				rightSlideTotalNumber.innerHTML = totalSlides.length;
			}else{
				sliderRightWrapper.style.visibility = "hidden";
			}
		}

}
