Visit [Demo Page](http://www.the8thocean.com/misc/jqueryplugins/Enlarged-Image-Fit/demo/)

## HTML side

		<img id="image" class="apply_enlarge_image_fit" src="thumbnail.jpg" largefile="large/image/file.jpg" 
		   title="image title (option)" description="image description (option)"/>

## JAVASCRIPT side

		$.enlargeImgFit({options});

#### Options

*	loader: loader image ... (object or boolean) (default - false)
		{
			path: 'path/to/loader/image.gif',
			width: loader image width (int),
			height: loader image height (int)
		}
*	applyClass: class name to trigger enlarge image plugin ... (string)(default - 'apply_enlarge_image')
*	applyAttribute: attribute name for enlarge image plugin ... (object)
		{
			img: 'largefile',
			title: 'title',
			description: 'description'
		}
*	zIndex: z-index for enlarged image ... (int) (default - 100)
*	prev: previous button style ... (object or string - image path url) (default - object)
		{
			size: 80,
			color:'#fff',
			opacity:0.8
		}
*	next: next button style ... (object or string - image path url) (default - object)
		{
			size: 80,
			color:'#fff',
			opacity:0.8
		}

### Change log

*	2.0 --- Add previous and next buttons