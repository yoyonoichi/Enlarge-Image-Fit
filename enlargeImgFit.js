(function($) {
	$.enlargeImgFit = function(userArgs) {
		var args = {
			loader:false,
			applyClass:'apply_enlarge_image',
			applyAttribute:{img:'largefile',title:'title',description:'description'},
			zIndex:100	
		}
		
		$.extend(true, args, userArgs);

		var blackbox, contentTable, contentBox, closeBox, descBox, imgObject, bodyH;
		var imgLoaded = false;
		
		args.applyClass = '.'+args.applyClass;
		var images = this.find(args.applyClass);
		for(var i=0,n=images.length; i<n; i++) {
			if($(images[i]).parent().is('a')) $(images[i]).parent().click( function() { return false; });
			$(images[i]).click( function() {
				imageEnlarge($(this).attr(args.applyAttribute.img), $(this).attr(args.applyAttribute.title), $(this).attr(args.applyAttribute.description));
			});
		}
		
		function imageEnlarge(img, title, desc) {
			var WW = $(window).width(), WH = $(window).height();
			var scrollTop = $(window).scrollTop(); 
		
   			bodyH = Math.max(
        		Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        		Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        		Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    		);
			
			if(bodyH == 0) bodyH = 10000;
			else if(bodyH < WH) bodyH = WH
			
//PREPARE BLACK BACKGROUND, CLOSE BUTTON AND CONTENT BOX
			blackbox = $('<div></div>').attr('id','black_box_back_pane').css({position:'absolute',top:0,left:0,width:WW+'px',height:bodyH+'px',backgroundColor:'#000',opacity:0.85,zIndex:args.zIndex});
			if(args.loader) {
				$('<img src="'+args.loader.path+'"/>').css({position:'absolute',top:(WH-args.loader.height)*0.5+scrollTop+'px',left:(WW-args.loader.width)*0.5+'px',zIndex:args.zIndex}).appendTo(blackbox);
			}
			contentTable = $('<table></table>').attr({id:'black_box_content_pane',cellPadding:0,cellSpacing:0}).css({position:'absolute',top:scrollTop+'px',left:0,textAlign:'center',width:WW+'px',height:WH+'px',zIndex:args.zIndex});
			contentBox = $('<div></div>').css({position:'relative',overflow:'hidden',margin:'0 auto'});
			var td = $('<td></td>').css({verticalAlign:'middle',width:'100%',height:'100%',textAlign:'center'}).append(contentBox);
			$('<tr></tr>').append(td).appendTo(contentTable);
			var closebtn = $('<div>X</div>').css({padding:'9px 12px 5px 12px',fontSize:'30px',fontWeight:'bold',fontFamily:'sans-serif',color:'#fff',cursor:'pointer'});	
			closeBox = $('<div></div>').attr('id','black_box_close_box').css({position:'absolute',top:scrollTop+'px',backgroundColor:'#000',opacity:0.8,zIndex:args.zIndex}).append(closebtn);
			td = closebtn = null;
			
			window.onmousewheel = document.onmousewheel = onMouseWheelHandler;
			if(window.addEventListener) {
				window.addEventListener('DOMMouseScroll', onMouseWheelHandler, false);
			}
			$('body').append(blackbox).append(contentTable).append(closeBox);	

//LOAD LARGE IMAGE AND SET
			imgObject = new Image();
			imgObject.src = img+'?r='+Math.random();
			imgObject.onload = function() {
				imgLoaded = true;
				blackbox.empty();
				originW = this.width;
				originH = this.height;
				var sizes = calculation(WW, WH, this.width, this.height); 
				this.width = sizes.w;
				this.height = sizes.h;
				contentBox.css({'width':sizes.w+'px', 'height':sizes.h+'px'}).append(this);
				
				if(title || desc) {
					var contenthtml = '<div style="padding:10px;">';
					if(title) contenthtml += '<h3>'+title+'</h3>';
					if(desc) contenthtml += '<div>'+desc+'</div>';
					contenthtml += '</div>';
					descBox = $('<div></div>').attr('id','black_box_desc_pane').css({position:'absolute',left:0,top:sizes.h+'px',width:sizes.w+'px',height:sizes.h+'px',backgroundColor:'#000',opacity:0.8,overflow:'auto',textAlign:'left',color:'#fff'}).html(contenthtml).appendTo(contentBox);
					contenthtml = null;

					$(this).bind('click', function() {
						descBox.stop(true,false).animate({'top':0},400);
					});
					descBox.bind('click', function() {
						$(this).stop(true,true).animate({'top':$(this).height()+'px'},400);
					});
				}
				WW = WH = scrollTop = sizes = null;
				return false;
			}
			
			closeBox.bind('click', function(e) {
				e.preventDefault();
				closeHandler(imgObject);
				addition = null;
			});
			return false;
		}
		
//CLOSE EVENT HANDLER
		function closeHandler(imgObject) {
			if(window.removeEventListener) {
				window.removeEventListener('DOMMouseScroll', onMouseWheelHandler);
			}
			window.onmousewheel = document.onmousewheel = null;
			
			closeBox.unbind('click');
			if(descBox) {
				$(imgObject).unbind('click');
				descBox.unbind('click');
			}
						
			closeBox.remove();
			contentTable.remove();
			blackbox.remove();
						
			blackbox = contentTable = closebtn = closeBox = contentBox = imgObject = bodyH = originW = originH = null;
			imgLoaded = false;
			return false;
		}
		
//IMAGE SIZE CALCULATION
		function calculation(ww, wh, curW, curH) {
			var W, H;
			if(ww/wh <= curW/curH) {
				W = parseInt(ww-parseInt(ww*0.05));
				if(W < curW) {
					H = curH/curW*W;
				}else{
					W = curW;
					H = curH;
				}
			}else{
				H = parseInt(wh-parseInt(wh*0.05));
				if(H < curH) {
					W = curW/curH*H;
				}else{
					W = curW;
					H = curH;
				}
			}
			return {w:W,h:H};
		}
		
		$(window).resize( function() {
			if(imgLoaded) {
				var wWid = $(this).width();
				var wHgt = $(this).height();
				var scrollTop = $(window).scrollTop();
				
				blackbox.css('width',wWid+'px');
				if(wHgt > bodyH) {
					blackbox.css('height',wHgt+'px');
					bodyH = wHgt;
				}
				
				contentTable.css({top:scrollTop+'px',width:wWid+'px',height:wHgt+'px'});
				var sizes = calculation(wWid, wHgt, originW, originH);
				imgObject.width = sizes.w;
				imgObject.height = sizes.h;
				contentBox.css({width:sizes.w+'px',height:sizes.h+'px'});
				closeBox.css({top:scrollTop+'px'});
				if(descBox) {
					descBox.css({top:sizes.h+'px',width:sizes.w+'px',height:sizes.h+'px'});
				}
			}
			return false;
		});
		
		function onMouseWheelHandler(e) {
			if(!e) e=window.event;
			if(e.preventDefault) {
				e.preventDefault();
			}else{
				e.returnValue = false;
				e.cancelBubble = true;
			}
			return false;
		}
		return false;
	}
})(jQuery);