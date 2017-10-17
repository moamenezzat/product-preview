"use strict";

var customizeContainer = $("#product-details__change-preview"),
  customizeContainerWidth = customizeContainer.width(),
  customizeContainerHeight = customizeContainer.innerHeight(),
  originalImage = $("#original-image"),
  originalImageOriginalWidth = originalImage[0].naturalWidth,
  originalImagerenderedWidth = originalImage.width(),
  originalImagerenderedHeight = originalImage.height(),
  imageDragged = false,
  imageResizeHandle = $("#handle"),
  imageResizeTrack = $("#track"),
  siblings = $(".outer-border,.inner-border"),
  imagePositonAfterDraging = {
    x: parseInt(originalImage.css("left")),
    y: parseInt(originalImage.css("top"))
  },
  chooseBackgroundColor = $(".product-details__bg-color"),
  showBackgroundPicker = false,
  backgroundColorSquares = $(".colorSquare"),
  displaySelectedColorName = $(".product-details__bg-color .current-selected .color-text"),
  displaySelectedColor = $(".product-details__bg-color .current-selected .color"),
  toggleColorPickers = $(".more-color"),
  colorWheel = $(".farbtastic"),
  colorWheelOutputField = $("#big-color-picker-field");

// convert HEX to RGB color
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? "R(" + parseInt(result[1], 16) + ") G(" + parseInt(result[2], 16) + ") B(" + parseInt(result[3], 16) + ")" : null;
};
backgroundColorSquares.on("click", function() {
  backgroundColorSquares.removeClass("selected");
  var $this = $(this),
    colorName = $this.data("name"),
    colorValue = $this.data("value");
  displaySelectedColor.css("background-color", "#" + colorValue);
  displaySelectedColorName.html(colorName);
  $this.addClass("selected");
});

toggleColorPickers.on("click", function() {
  chooseBackgroundColor.toggleClass("toggle-color");
});
chooseBackgroundColor.on("click", ".farbtastic", function() {
  var $this = $(this),
    colorCode = colorWheelOutputField[0].value,
    rgbCode = hexToRgb(colorCode);
  displaySelectedColor.css("background-color", "" + colorCode);
  displaySelectedColorName.html(rgbCode);
});
//

$(document).ready(function() {
  $("#big-color-picker").farbtastic("#big-color-picker-field");

  if (originalImagerenderedHeight > customizeContainerHeight) {
    TweenLite.set(originalImage, {
      top: -(originalImagerenderedHeight - customizeContainerHeight) / 2,
      left: -(originalImagerenderedWidth - customizeContainerWidth) / 2
    });
  }

  Draggable.create(originalImage, {
    type: "top,left",
    bounds: customizeContainer,
    zIndexBoost: false,
    onPress: function onPress() {
      var $this = $(this);
      customizeContainer.css({
        opacity: "1",
        "z-index": "1002"
      });
      siblings.css("z-index", "1001");
    },
    onDragStart: function onDragStart() {
      if ($(this.target).width() < customizeContainerWidth - 5) {
        this.endDrag();
      }
    },
    onDrag: function onDrag() {
      imagePositonAfterDraging = {
        x: this.endX,
        y: this.endY
      };
      imageDragged = true;
    },
    onRelease: function onRelease() {
      // this.startDrag();
      customizeContainer.css({
        opacity: "0",
        "z-index": "999"
      });
      siblings.css("z-index", "1000");
    }
  });
  Draggable.create(imageResizeHandle, {
    type: "x",
    zIndexBoost: false,
    bounds: imageResizeTrack,
    onPress: function onPress() {
      customizeContainer.css({
        opacity: "1",
        "z-index": "1002"
      });
      siblings.css("z-index", "1001");
    },
    onDrag: function onDrag() {
      var limitDown = this.minX,
        limitUp = this.maxX,
        currentValue,
        percentage,
        currentresizeValue,
        currentPosition = originalImage.position(),
        leftSidePosition = currentPosition.left,
        topSidePosition = currentPosition.top,
        rightSidePosition,
        bottomSidePosition;

        console.log(originalImage);
      // if (0 > this.x && this.x > -8) {
      //   currentValue = 0;
      // } else if (0 < this.x && this.x < 8) {
      //   currentValue = 0;
      // } else {
        currentValue = this.x;
      // }
      if (currentValue >= 0) {
        showBackgroundPicker = false;
        percentage = currentValue / limitUp;
        var oldWidth = originalImage.width(),
          newWidth = originalImagerenderedWidth + originalImagerenderedWidth * percentage,
          oldHeight = originalImage.height();
        TweenLite.set(originalImage, {
          width: newWidth
        });
        var newHeight = originalImage.height();
        rightSidePosition = newWidth - -leftSidePosition - customizeContainerWidth;
        bottomSidePosition = newHeight - -topSidePosition - customizeContainerHeight;
        var left, top;
        if (imageDragged) {
          if (topSidePosition >= 0) {
            top = 0;
          } else if (bottomSidePosition <= 0) {
            top = -newHeight + customizeContainerHeight;
          } else {
            top = imagePositonAfterDraging.y + (oldHeight - newHeight) / 2;
          }
          if (leftSidePosition >= 0) {
            left = 0;
          } else if (rightSidePosition <= 0) {
            left = -newWidth + customizeContainerWidth;
          } else {
            left = imagePositonAfterDraging.x + (oldWidth - newWidth) / 2;
          }
        } else {
          top = -((newHeight - customizeContainerHeight) / 2);
          left = -((newWidth - customizeContainerWidth) / 2);
        }
        TweenLite.set(originalImage, {
          top: top,
          left: left,
          force3D: true
        });
      } else if (currentValue < 0) {
        showBackgroundPicker = true;
        percentage = currentValue / limitDown;
        TweenLite.set(originalImage, {
          width: originalImagerenderedWidth - originalImagerenderedWidth * percentage,
          top: (customizeContainerHeight - originalImage.height()) / 2,
          left: (customizeContainerWidth - originalImage.width()) / 2,
          force3D: true
        });
      }
    },
    onDragEnd: function onDragEnd() {
      customizeContainer.css({
        opacity: "0",
        "z-index": "999"
      });
      siblings.css("z-index", "1000");
      imageDragged = false;
      if (showBackgroundPicker) {
        chooseBackgroundColor.removeClass("hidden");
      } else {
        chooseBackgroundColor.addClass("hidden");
      }
    },
    onRelease: function onRelease() {
      customizeContainer.css({
        opacity: "0",
        "z-index": "999"
      });
      siblings.css("z-index", "1000");
    }
  });
});
