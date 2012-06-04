(function($) {
	$.enlargeImgFit = function(userArgs) {
		var args = {
			loader:false,
			applyClass:'apply_enlarge_image',
			applyAttribute:{img:'largefile',title:'title',description:'description'},
			zIndex:100,
			group:true,
			prev:{
				size:80,
				color:'#fff',
				opacity:0.8
			},
			next:{
				size:80,
				color:'#fff',
				opacity:0.8
			}
		}
		
		$.extend(true, args, userArgs);
		
		var groupTotal = 0;
		var imgObject;
		var blackbox, contentTable, contentBox, closeBox, descBox, bodyH;
		var current, prev, next, pnSize, grouping;
		var imgLoaded = false;
		var hideTimer = null, hideTimerOff = false;
		
		args.applyClass = '.'+args.applyClass;
		var images = this.find(args.applyClass);
		groupTotal = images.length;
		if(groupTotal > 1) grouping = true;	
		
//INITIAL SETUP
		for(var i=0; i<groupTotal; i++) {
			if($(images[i]).parent().is('a')) $(images[i]).parent().click( function() { return false; });
			$(images[i]).data({id:i}).click( function() {
				imageEnlarge($(this).data().id, $(this).attr(args.applyAttribute.img), $(this).attr(args.applyAttribute.title), $(this).attr(args.applyAttribute.description));
			});
		}
		
		function imageEnlarge(id, img, title, desc) {
			current = id;
			var WW = $(window).width(), WH = $(window).height();
			var scrollTop = $(window).scrollTop(); 
		
   			bodyH = Math.max(
        		Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        		Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        		Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    		);
			
			if(bodyH == 0) bodyH = 10000;
			else if(bodyH < WH) bodyH = WH
						
//PREPARE BLACK BACKGROUND
			blackbox = $('<div></div>').attr('id','black_box_back_pane').css({position:'absolute',top:0,left:0,width:WW+'px',height:bodyH+'px',backgroundColor:'#000',opacity:0.85,zIndex:args.zIndex});
			if(args.loader) {
				$('<img src="'+args.loader.path+'"/>').css({position:'absolute',top:(WH-args.loader.height)*0.5+scrollTop+'px',left:(WW-args.loader.width)*0.5+'px',zIndex:args.zIndex}).appendTo(blackbox);
			}
			
//CONTENT TABLE AND CONTENT BOX
			contentTable = $('<table></table>').attr({id:'black_box_content_pane',cellPadding:0,cellSpacing:0}).css({position:'absolute',top:scrollTop+'px',left:0,textAlign:'center',width:WW+'px',height:WH+'px',zIndex:args.zIndex});
			if(grouping) {
				contentTable.bind('mousemove', function(e) {
					e.preventDefault();
					window.clearTimeout(hideTimer);
					prev.css({visibility:'visible'});
					next.css({visibility:'visible'});
					hideTimer = window.setTimeout(function() {
						timeout();
					}, 2000);
				});
			}
			contentBox = $('<div></div>').css({position:'relative',overflow:'hidden',margin:'0 auto'});
			var td = $('<td></td>').css({verticalAlign:'middle',width:'100%',height:'100%',textAlign:'center'}).append(contentBox);
			$('<tr></tr>').append(td).appendTo(contentTable);
			
//CLOSE BUTTON
			closeBox = $('<div></div>').attr('id','black_box_close_box').css({position:'absolute',top:scrollTop+'px',backgroundColor:'#000',opacity:0.8,zIndex:args.zIndex}).append($('<div>X</div>').css({padding:'9px 12px 5px 12px',fontSize:'30px',fontWeight:'bold',fontFamily:'sans-serif',color:'#fff',cursor:'pointer'})).bind('click', function(e) {
				e.preventDefault();
				closeHandler(imgObject);
				addition = null;
				return false;
			});
			
//PREV AND NEXT BUTTONS
			if(grouping) {
				prev = createPrevNext('prev',WH).appendTo(td).bind('click', function(e){
					e.preventDefault();
					changeImage(-1);
					return false;
				});
				next = createPrevNext('next',WH).appendTo(td).bind('click', function(e){
					e.preventDefault();
					changeImage(1);
					return false;
				});
			}
			td = null;
			
//MOUSE WHEEL FUNCTION DISABLED
			window.onmousewheel = document.onmousewheel = onMouseWheelHandler;
			if(window.addEventListener) {
				window.addEventListener('DOMMouseScroll', onMouseWheelHandler, false);
			}
			$('body').append(blackbox).append(contentTable).append(closeBox);	
			
//GO TO LOAD IMAGE FUNCTION
			loadImage(img, title, desc, WW, WH);
		
			return false;
		}
		
//LOAD LARGE IMAGE AND SET
		function loadImage(img, title, desc, WW, WH) {
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
				contentBox.empty().css({'width':sizes.w+'px', 'height':sizes.h+'px'}).append(this);
				
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
		}
		
//CREATE PREV NEXT BUTTONS	
		function createPrevNext(type,WH) {
			var obj, bw, bc;
			if(args[type] instanceof Object) {
				switch(type) {
					case 'prev':
						bw = args[type].size*0.5+'px '+args[type].size*0.6+'px '+args[type].size*0.5+'px 0';
						bc = 'transparent '+args[type].color+' transparent transparent';
						if(!window.XMLHttpRequest) 
							bc = 'pink '+args[type].color+' pink pink';
						break;
					case 'next':
						bw = args[type].size*0.5+'px 0 '+args[type].size*0.5+'px '+args[type].size*0.6+'px';
						bc = 'transparent transparent transparent '+args[type].color;
						if(!window.XMLHttpRequest)
							bc = 'pink pink pink '+args[type].color;
						break;
				}
				obj = $('<span></span>').css({position:'absolute',display:'block',borderStyle:'solid',borderWidth:bw,borderColor:bc,fontSize:'0px',width:0,height:0,opacity:args[type].opacity,cursor:'pointer',visibility:'hidden'}).bind('mouseenter', function(e) {
					e.preventDefault();
					hideTimerOff = true;
					return false;
				}).bind('mouseleave', function(e) {
					e.preventDefault();
					hideTimerOff = false;
					return false;
				});
				if(!window.XMLHttpRequest) {
					obj.css({filter:'chroma(color=pink)',zoom:1});	
				}
				switch(type) {
					case 'prev':
						obj.css({left:'10px'});
						break;
					case 'next':
						obj.css({right:'10px'});
						break;	
				}
				pnSize = args[type].size;
			}else if(args[type] instanceof String) {
				var pnIMG = new Image();
				pnIMG.src = args[type];
				pnIMG.onload = function() {
					obj = $(this);
					pnSize = this.height;	
				}
			}
			obj.css({top:(WH-pnSize)*0.5+'px'});
			return obj;
		}
		
//CHANGE IMAGE
		function changeImage(type) {
			var next = adjust(current+type);
			imgObject = null;
			loadImage($(images[next]).attr(args.applyAttribute.img), $(images[next]).attr(args.applyAttribute.title), $(images[next]).attr(args.applyAttribute.description), $(window).width(), $(window).height());
			current = next;
			return false;
		}
		
		function adjust(num) {
			if(num < 0) num = groupTotal-1;
			else if(num >= groupTotal) num = 0;
			return num;
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
			if(grouping) {
				prev.unbind('click').unbind('mouseenter').unbind('mouseleave');
				next.unbind('click').unbind('mouseenter').unbind('mouseleave');
				contentTable.unbind('mousemove')
			}
			closeBox.remove();
			contentTable.remove();
			blackbox.remove();
						
			blackbox = contentTable = closebtn = closeBox = contentBox = imgObject = bodyH = originW = originH = prev = next = null;
			imgLoaded = false;
			window.clearTimeout(hideTimer);
			hideTimer = null;
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
		
//WINDOW RESIZE FUNCTION
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
				prev.css({top:(wHgt-pnSize)*0.5+'px'});
				next.css({top:(wHgt-pnSize)*0.5+'px'});
				if(descBox) {
					descBox.css({top:sizes.h+'px',width:sizes.w+'px',height:sizes.h+'px'});
				}
			}
			return false;
		});
		
//MOUSE WHEEL DISABLE FUNCTION
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

//TIMER FUNCTION
		function timeout() {
			if(!hideTimerOff) {
				prev.css({visibility:'hidden'});
				next.css({visibility:'hidden'});
			}
			return false;	
		}
		
		return false;
	}
})(jQuery);