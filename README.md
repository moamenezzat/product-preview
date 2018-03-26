# Product Customizer


I came a cross the product prview in [Fine Art America](https://fineartamerica.com/) and i really liked how they handle it and decided to try and do it myself.

here is an  [example](https://fineartamerica.com/products/the-hiding-place-joshua-smith-iphone-case-cover.html?phoneCaseType=iphone8)  to show the fine art america version.

The code is built using **GSAP** dragabble library and it depends on 3 variables to be avaiable in the HTML template:

 - on the `.product-details__preview` div:
	 - `data-width` : used to set the preview image width.
	 - `data-height`: used to set the preview image height.
 - on `.original-image` img:  eigther class `height` or `width` to decide the first render of the original image. if for example `width` is added then the image will take the width of the container and the image height will be rendered depending on the image aspect ration. 


There are 3 demo examples:
 1. [pillow](https://moamenezzat.github.io/product-preview/)  
 2. [Mobile Case Horizontal](https://moamenezzat.github.io/product-preview/mobile-hor.html)
 3. [Mobile Case Vertical](https://moamenezzat.github.io/product-preview/mobile-vert.html)
