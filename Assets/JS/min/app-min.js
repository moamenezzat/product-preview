"use strict";function hexToRgb(e){var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return i?"R("+parseInt(i[1],16)+") G("+parseInt(i[2],16)+") B("+parseInt(i[3],16)+")":null}var customizeContainer=$("#product-details__change-preview"),customizeContainerWidth=customizeContainer.width(),customizeContainerHeight=customizeContainer.innerHeight(),originalImage=$("#original-image"),originalImageOriginalWidth=originalImage[0].naturalWidth,originalImagerenderedWidth=originalImage.width(),originalImagerenderedHeight=originalImage.height(),imageDragged=!1,imageResizeHandle=$("#handle"),imageResizeTrack=$("#track"),siblings=$(".outer-border,.inner-border"),imagePositonAfterDraging={x:parseInt(originalImage.css("left")),y:parseInt(originalImage.css("top"))},chooseBackgroundColor=$(".product-details__bg-color"),showBackgroundPicker=!1,backgroundColorSquares=$(".colorSquare"),displaySelectedColorName=$(".product-details__bg-color .current-selected .color-text"),displaySelectedColor=$(".product-details__bg-color .current-selected .color"),toggleColorPickers=$(".more-color"),colorWheel=$(".farbtastic"),colorWheelOutputField=$("#big-color-picker-field");backgroundColorSquares.on("click",function(){backgroundColorSquares.removeClass("selected");var e=$(this),i=e.data("name"),o=e.data("value");displaySelectedColor.css("background-color","#"+o),displaySelectedColorName.html(i),e.addClass("selected")}),toggleColorPickers.on("click",function(){chooseBackgroundColor.toggleClass("toggle-color")}),chooseBackgroundColor.on("click",".farbtastic",function(){var e=($(this),colorWheelOutputField[0].value),i=hexToRgb(e);displaySelectedColor.css("background-color",""+e),displaySelectedColorName.html(i)}),$(document).ready(function(){$("#big-color-picker").farbtastic("#big-color-picker-field"),originalImagerenderedHeight>customizeContainerHeight&&TweenLite.set(originalImage,{top:-(originalImagerenderedHeight-customizeContainerHeight)/2,left:-(originalImagerenderedWidth-customizeContainerWidth)/2}),Draggable.create(originalImage,{type:"top,left",bounds:customizeContainer,zIndexBoost:!1,onPress:function(){$(this);customizeContainer.css({opacity:"1","z-index":"1002"}),siblings.css("z-index","1001")},onDragStart:function(){$(this.target).width()<customizeContainerWidth-5&&this.endDrag()},onDrag:function(){imagePositonAfterDraging={x:this.endX,y:this.endY},imageDragged=!0},onRelease:function(){customizeContainer.css({opacity:"0","z-index":"999"}),siblings.css("z-index","1000")}}),Draggable.create(imageResizeHandle,{type:"x",zIndexBoost:!1,bounds:imageResizeTrack,onPress:function(){customizeContainer.css({opacity:"1","z-index":"1002"}),siblings.css("z-index","1001")},onDrag:function(){var e,i,o,t,a=this.minX,r=this.maxX,n=originalImage.position(),g=n.left,s=n.top;if(console.log(originalImage),e=this.x,e>=0){showBackgroundPicker=!1,i=e/r;var c=originalImage.width(),l=originalImagerenderedWidth+originalImagerenderedWidth*i,d=originalImage.height();TweenLite.set(originalImage,{width:l});var m=originalImage.height();o=l- -g-customizeContainerWidth,t=m- -s-customizeContainerHeight;var u,h;imageDragged?(h=s>=0?0:0>=t?-m+customizeContainerHeight:imagePositonAfterDraging.y+(d-m)/2,u=g>=0?0:0>=o?-l+customizeContainerWidth:imagePositonAfterDraging.x+(c-l)/2):(h=-((m-customizeContainerHeight)/2),u=-((l-customizeContainerWidth)/2)),TweenLite.set(originalImage,{top:h,left:u,force3D:!0})}else 0>e&&(showBackgroundPicker=!0,i=e/a,TweenLite.set(originalImage,{width:originalImagerenderedWidth-originalImagerenderedWidth*i,top:(customizeContainerHeight-originalImage.height())/2,left:(customizeContainerWidth-originalImage.width())/2,force3D:!0}))},onDragEnd:function(){customizeContainer.css({opacity:"0","z-index":"999"}),siblings.css("z-index","1000"),imageDragged=!1,showBackgroundPicker?chooseBackgroundColor.removeClass("hidden"):chooseBackgroundColor.addClass("hidden")},onRelease:function(){customizeContainer.css({opacity:"0","z-index":"999"}),siblings.css("z-index","1000")}})});