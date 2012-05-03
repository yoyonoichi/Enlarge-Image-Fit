Visit [Demo Page](http://www.the8thocean.com/misc/jqueryplugins/Enlarged-Image-Fit/demo/)

## HTML side

		<img id="image" class="apply_enlarge_image_fit" src="thumbnail.jpg" largefile="large/image/file.jpg" 
		   title="image title (option)" description="image description (option)"/>

## JAVASCRIPT side

		$.enlargeImgFit({options});

#### Options

* loader: loader image ... {path: 'path/to/loader/image.gif', width:l oader image width (int), height: loader image height (int)} or false (default - false)
* applyClass: class name to trigger enlarge image plugin ... (string)(default - 'apply_enlarge_image')
* applyAttribute: attribute name for enlarge image plugin ... {img: 'largefile', title: 'title', description: 'description'}
* zIndex: z-index for enlarged image ... (int) (default - 100)