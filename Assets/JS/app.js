"use strict";
// convert HEX to RGB color
function hexToRgb(hex, name) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (name) {
    return result
      ? `(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
          result[3],
          16
        )})`
      : null;
  } else {
    return result
      ? `R(${parseInt(result[1], 16)}) G(${parseInt(
          result[2],
          16
        )}) B(${parseInt(result[3], 16)})`
      : null;
  }
}

function createProduct(element) {
  var container = $(element),
    customizeContainer = container.find(".product-details__change-preview"),
    customizeContainerWidth,
    originalImage = container.find(".original-image"),
    originalImageOriginalWidth = originalImage[0].naturalWidth,
    originalImageOriginalHeight = originalImage[0].naturalHeight,
    originalRatio = originalImageOriginalWidth / originalImageOriginalHeight,
    originalImagerenderedWidth = originalImage.width(),
    originalImagerenderedHeight = originalImage.height(),
    imageDragged = false,
    imageResizeHandle = container.find(".handle"),
    imageResizeTrack = container.find(".track"),
    siblings = container.find(".outer-border,.inner-border"),
    imagePositonAfterDraging = {
      x: parseInt(originalImage.css("left")),
      y: parseInt(originalImage.css("top"))
    },
    chooseBackgroundColor = container.find(".product-details__bg-color"),
    showBackgroundPicker = false,
    backgroundColorSquares = container.find(".colorSquare"),
    displaySelectedColorName = container.find(
      ".product-details__bg-color .current-selected .color-text"
    ),
    displaySelectedColor = container.find(
      ".product-details__bg-color .current-selected .color"
    ),
    toggleColorPickers = container.find(".more-color"),
    colorWheel = container.find(".farbtastic"),
    colorWheelOutputField = container.find(".big-color-picker-field").length
      ? container.find(".big-color-picker-field")
      : container.find("#big-color-picker-field"),
    modalControls = $(".modal__control"),
    mainContainer = container.find(".product-details__preview"),
    image = container.find(".product-details__preview > img"),
    loading = $("<img/>")
      .attr("src", "Assets/Images/loader.gif")
      .css({
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        width: "auto",
        height: "auto"
      }),
    data = {},
    getNewImage = function() {
      mainContainer.append($(loading));
      //simulate server request
      setTimeout(function() {
        $(loading).remove();
      }, 2000);
    },
    mainContainerWidth = mainContainer.data("width"), //get render width from HTML
    mainContainerHeight = mainContainer.data("height"), //get render height from HTML
    mainContainerWidthActual,
    mainContainerHeightActual,
    mainContainerRatio = mainContainerWidth / mainContainerHeight;

  if ($(window).width() > 800) {
    mainContainer.css({
      width: mainContainerWidth,
      height: mainContainerHeight
    });
    image.css({ width: mainContainerWidth, height: mainContainerHeight });
    mainContainerWidthActual = mainContainer.width();
    mainContainerHeightActual = mainContainer.height();
  }

  backgroundColorSquares.on("click", function() {
    backgroundColorSquares.removeClass("selected");
    var $this = $(this),
      colorName = $this.data("name"),
      colorValue = $this.data("value");
    displaySelectedColor.css("background-color", `#${colorValue}`);
    displaySelectedColor.attr("data-value", `${hexToRgb(colorValue, true)}`);
    displaySelectedColorName.html(hexToRgb(colorValue));
    $this.addClass("selected");
    data.BGcolor = displaySelectedColor.attr("data-value");
    customizeContainer.css("background-color", `#${colorValue}`);
    getNewImage();
  });
  toggleColorPickers.on("click", function(e) {
    e.preventDefault();
    chooseBackgroundColor.toggleClass("toggle-color");
  });
  chooseBackgroundColor.on("click", ".farbtastic", function() {
    var $this = $(this),
      colorCode = colorWheelOutputField[0].value,
      rgbCode = hexToRgb(colorCode);
    displaySelectedColor.css("background-color", `${colorCode}`);
    displaySelectedColorName.html(rgbCode);
    customizeContainer.css("background-color", `${colorCode}`);
    getNewImage();
  });

  if ($("#big-color-picker").length) {
    $("#big-color-picker").farbtastic("#big-color-picker-field");
  } else {
    container
      .find(".big-color-picker")
      .farbtastic(container.find(".big-color-picker-field"));
  }

  // Set original Image dimensions and positions depending on the intials options from the HTML
  if (originalImage.hasClass("height")) {
    // then the original image will take the height of the container and the width will be rendered accordingly
    originalImage.css("height", `${mainContainerHeightActual}px`);
    originalImage.css(
      "width",
      `${mainContainerHeightActual * originalRatio}px`
    );
    originalImagerenderedWidth = originalImage.width();
    originalImagerenderedHeight = originalImage.height();

    if (originalImagerenderedWidth >= mainContainerWidthActual) {
      TweenLite.set(originalImage, {
        left: -(originalImagerenderedWidth - mainContainerWidthActual) / 2
      });
    } else {
      TweenLite.set(originalImage, {
        left: -(originalImagerenderedWidth - mainContainerWidthActual) / 2
      });
    }
    customizeContainerWidth = customizeContainer.width();
  }

  if (originalImage.hasClass("width")) {
    // then the original image will take the width of the container and the height will be rendered accordingly
    originalImage.css("width", `${mainContainerWidthActual}px`);
    originalImage.css(
      "height",
      `${mainContainerWidthActual / originalRatio}px`
    );
    originalImagerenderedWidth = originalImage.width();
    originalImagerenderedHeight = originalImage.height();

    if (originalImagerenderedHeight >= mainContainerHeightActual) {
      TweenLite.set(originalImage, {
        top: -(originalImagerenderedHeight - mainContainerHeightActual) / 2
      });
    } else {
      TweenLite.set(originalImage, {
        top: (mainContainerHeightActual - originalImagerenderedHeight) / 2
      });
    }
    customizeContainerWidth = customizeContainer.width();
  }

  function createDragable(a, b) {
    if ($(window).width() > 800) {
      Draggable.create(a, {
        type: "top,left",
        bounds: customizeContainer,
        zIndexBoost: false,
        onPress: function() {
          // show customize view
          var $this = $(this);
          customizeContainer.css({
            opacity: "1",
            "z-index": "1002",
            overflow: "visible"
          });
          siblings.css("z-index", "1001");
        },
        onDragStart: function() {
          if ($(this.target).width() < customizeContainerWidth - 5) {
            // stop dragging if the image is smaller than the border
            this.endDrag();
          }
        },
        onDrag: function() {
          imagePositonAfterDraging = { x: this.endX, y: this.endY };
          imageDragged = true;
          data = {
            x: originalImage.position().left,
            y: originalImage.position().top,
            width: originalImage.width(),
            height: originalImage.height(),
            BGcolor: displaySelectedColor.attr("data-value")
              ? displaySelectedColor.attr("data-value")
              : "(255,255,255)",
            img: originalImage.attr("src"),
            types: image.attr("data"),
            size: image.attr("size"),
            orient: image.attr("ori")
          };
        },
        onRelease: function() {
          // hide customize view
          customizeContainer.css({
            opacity: "0",
            "z-index": "999",
            overflow: "hidden"
          });
          siblings.css("z-index", "1000");
          data = {
            x: originalImage.position().left,
            y: originalImage.position().top,
            width: originalImage.width(),
            height: originalImage.height(),
            BGcolor: displaySelectedColor.attr("data-value")
              ? displaySelectedColor.attr("data-value")
              : "(255,255,255)",
            img: originalImage.attr("src"),
            types: image.attr("data"),
            size: image.attr("size"),
            orient: image.attr("ori")
          };
          getNewImage();
        }
      });
    }
    Draggable.create(b, {
      type: "x",
      zIndexBoost: false,
      bounds: imageResizeTrack,
      onPress: function() {
        // show customize view
        customizeContainer.css({
          opacity: "1",
          "z-index": "1002",
          overflow: "visible"
        });
        siblings.css("z-index", "1001");
      },
      onDrag: function() {
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

        // snap image to border value
        if (0 > this.x && this.x > -8) {
          currentValue = 0;
        } else if (0 < this.x && this.x < 8) {
          currentValue = 0;
        } else {
          currentValue = this.x;
        }

        if (currentValue >= 0) {
          showBackgroundPicker = false;
          percentage = currentValue / limitUp * 2;
          var oldWidth = originalImage.width(),
            newWidth =
              originalImagerenderedWidth +
              originalImagerenderedWidth * percentage,
            oldHeight = originalImage.height(),
            newHeight =
              originalImagerenderedHeight +
              originalImagerenderedHeight * percentage;
          if (originalImage.hasClass("height")) {
            TweenLite.set(originalImage, { height: newHeight, width: "auto" });
          } else {
            TweenLite.set(originalImage, { width: newWidth, height: "auto" });
          }
          var rightSidePosition =
            newWidth - -leftSidePosition - mainContainerWidthActual;
          bottomSidePosition =
            newHeight - -topSidePosition - mainContainerHeightActual;
          var left, top;
          if (imageDragged && percentage === 0) {
            imageDragged = false;
          }
          if (imageDragged) {
            if (topSidePosition >= 0) {
              top = 0;
            } else if (bottomSidePosition <= 0) {
              top = -newHeight + mainContainerHeightActual;
            } else {
              top = imagePositonAfterDraging.y + (oldHeight - newHeight) / 2;
            }
            if (leftSidePosition >= 0) {
              if (originalImage.width() < mainContainerWidthActual) {
                left = (mainContainerWidthActual - originalImage.width()) / 2;
              } else {
                left = 0;
              }
            } else if (rightSidePosition <= 0) {
              left = -newWidth + mainContainerWidthActual;
            } else {
              left = imagePositonAfterDraging.x + (oldWidth - newWidth) / 2;
            }
          } else {
            top = -((newHeight - mainContainerHeightActual) / 2);
            left = -((newWidth - mainContainerWidthActual) / 2);
          }
          TweenLite.set(originalImage, {
            top: top,
            left: left,
            force3D: true
          });
        } else if (currentValue < 0) {
          showBackgroundPicker = true;
          percentage = currentValue / limitDown / 1.5;
          if (originalImage.hasClass("height")) {
            TweenLite.set(originalImage, {
              height:
                originalImagerenderedHeight -
                originalImagerenderedHeight * percentage,
              width: "auto",
              top: (mainContainerHeightActual - originalImage.height()) / 2,
              left: (mainContainerWidthActual - originalImage.width()) / 2,
              force3D: true
            });
          } else {
            TweenLite.set(originalImage, {
              width:
                originalImagerenderedWidth -
                originalImagerenderedWidth * percentage,
              height: "auto",
              top: (mainContainerHeightActual - originalImage.height()) / 2,
              left: (mainContainerWidthActual - originalImage.width()) / 2,
              force3D: true
            });
          }
        }
        data = {
          x: originalImage.position().left,
          y: originalImage.position().top,
          width: originalImage.width(),
          height: originalImage.height(),
          BGcolor: displaySelectedColor.attr("data-value")
            ? displaySelectedColor.attr("data-value")
            : "(255,255,255)",
          img: originalImage.attr("src"),
          types: image.attr("data"),
          size: image.attr("size"),
          orient: image.attr("ori")
        };
      },
      onDragEnd: function() {
        // hide customize view
        customizeContainer.css({
          opacity: "0",
          "z-index": "999",
          overflow: "hidden"
        });
        siblings.css("z-index", "1000");
        imageDragged = false;
        if (showBackgroundPicker) {
          chooseBackgroundColor.removeClass("hidden");
        } else {
          chooseBackgroundColor.addClass("hidden");
        }
      },
      onRelease: function() {
        customizeContainer.css({
          opacity: "0",
          "z-index": "999"
        });
        siblings.css("z-index", "1000");
        getNewImage();
      }
    });
  }

  createDragable(originalImage[0], imageResizeHandle[0]);
}

$(".product-details").each(function(index, el) {
  createProduct(el);
});
