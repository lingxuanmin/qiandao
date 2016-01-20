var snVipHome = snVipHome || {};

snVipHome = {

	flag:false,

	proHover:function(){
		var _pLeft;
		$('.floor').find('.pro-list').find('li').hover(function(){
			if($(this).find('a.pro-img').length){
				_pLeft = $(this).find('a.pro-img').position().left;
			}
			$(this).find('a.pro-img').stop(false,true).animate({'left':'-=15px'},500);
		},function(){
			$(this).find('a.pro-img').stop(true,false).animate({'left':_pLeft},500);
		});
	},
	buyCate:function(){
		$('.floor').find('.cate').find('a').click(function(){
			var curColor = $(this).parent('.cate').find('a.cur').attr('style');
			if(!$(this).hasClass('cur')){
				$(this).addClass('cur').attr('style','color:#0e70c6;').siblings('a').removeClass('cur').attr('style','');
				var _index = $(this).index();
				$(this).parents('.floor').find('.pro-list').animate({'top':-_index*484},400);
			}
		});
	},
	birthday:function(){
		$('a.switch-btn').click(function(){
			$(this).toggleClass('switch-btn-c');
			$(this).siblings('div.pic').removeAttr('style').toggleClass('hide');
		});
		var w = $('.header').width();
		var birthW = w - 290;
		$('div.pic').mouseover(function(){
			$(this).parents('.birthday').css('zIndex','101')
			$(this).stop().animate({width:320},300,function(){
				$(this).siblings('div.birth-bar').animate({
					'width':birthW,
					'right':'290px'
				},500,function(){
					//$('div.person').removeAttr('style');
					snVipHome.FadeIn('div.person','down',800,40);
				});
			});
		});
		$('.birthday').mouseleave(function(){
			$(this).find('div.pic').stop().animate({width:290},300,function(){
				$(this).parents('.birthday').css('zIndex','99');
/*				$(this).fadeOut(500,function(){$(this).removeAttr('style').addClass('hide');})
				$(this).siblings('a.switch-btn').removeClass('switch-btn-c');	*/
				$(this).siblings('div.birth-bar').animate({
				'width':'290px',
				'right':'0px'
				},500);
			});
		});
		$('a.askfor').find('input.name').focus(function(e){
			e.stopPropagation();
		});
		$('a.askfor').toggle(function(e){
			$(this).siblings('div.my-info').animate({'height':'90px'},200);
		},function(e){
			$(this).siblings('div.my-info').animate({'height':'0px'},200);
		});
		$('.more-ask-way').hover(function(){
			$('.more-ask-way').animate({'width':'245px'},300);
		},function(){
			$('.more-ask-way').animate({'width':'100px'},300);
		});
	},
	FadeIn:function(div,dir,time,h,fun){
		/*
			div , 主体
			dir , 移动方向
			time , 耗时
			h , 偏移距离
			fun , callback
		*/
		var div = $(div);
		if(!div.attr('style')){
			switch(dir){
				case 'down':
				div.animate({'opacity':'1','top':'+='+h},time,fun);
				break;
				case 'up':
				div.animate({'opacity':'1','bottom':'+='+h},time,fun);
				break;
				case 'left':
				div.animate({'opacity':'1','right':'+='+h},time,fun);
				break;
				case 'right':
				div.animate({'opacity':'1','left':'+='+h},time,fun);
				break;
			}
		}
	},
	/*输入框获取焦点*/
	inputFocus:function(){
		$('input.focusClear').focus(function(){
			var ref = $(this).attr('ref');
			if($(this).val() == ref){
				$(this).val('').css('color','#2a2a2a');
			}
		});
		$('input.focusClear').blur(function(){
			var ref = $(this).attr('ref'),
				blurColor = $(this).attr('blurColor');
			if($(this).val() == '' ||$(this).val() == ref){
				$(this).val(ref);
				if(blurColor){$(this).css('color',blurColor)}
			}
		});
	},
	picSlide:function(b,box,u){
		 var b = $(b), box = $(box), u = $(u);
		 var index = 0;
		 //u.find('li').eq(0).css('display','block');
		 var adTimer;
		 b.mouseover(function(){
			index = b.index(this);
			slide(index);
		 }).eq(0).mouseover();

		 box.hover(function(){
				 clearInterval(adTimer);
			 },function(){
				 adTimer = setInterval(function(){
					index++;
					if(index == b.length ){index=0;}
				   	slide(index);
				  },5000);
		 }).trigger('mouseleave');
		 function slide(i){
			var show_i = u.find('li').eq(i);
			show_i.siblings().stop(false,true).fadeOut(800);
			if(show_i.find('img').attr('src3')){
				var _src = 	show_i.find('img').attr('src3');
				show_i.find('img').attr('src',_src).removeAttr('src3');
			}
			u.find('li').eq(i).stop(false,true).fadeIn(800);
			b.removeClass("cur").eq(i).addClass('cur');
		}
	},
	check:function(){
		var t;//延时
		$('.check').mouseover(function(){
			var ref = $(this);
			t = setTimeout(function(){
				ref.find('a.earn').addClass('earn-hover');
			    ref.find('.check-slide').slideDown(200);
			},200)
		}).mouseout(function(){
			 clearTimeout(t);
		});
		$('.check').mouseleave(function(){
			$(this).find('.check-slide').slideUp(200);
			$(this).find('a.earn').removeClass('earn-hover');
		});
		$('.qiandao').click(function(){
			snVipHome.winPop('.check-alert');
		});
	},
	/*弹出窗口*/
	winPop:function(w){
		var wind = $(w);
		var W = $(window).width(),
			H = $(window).height(),
			T = $(window).scrollTop()
			DH = $(document).height()
			ST = $(window).scrollTop();
		var _w = wind.innerWidth(), _h = wind.innerHeight();
		$('.grayLayer').css({
		 	'display':'block',
			'height':DH,
			'width':W
		})
		wind.show();
		wind.css('top',H/2- _h/2 + ST);
		wind.css('left',W/2-_w/2);
		//取消&关闭
		wind.find('a.closeWind').click(function(){
		   $(this).parents(w).hide();
		   $('.grayLayer').hide();
		});
	},
	navMsg:function(){
		$('.m-btn').find('a.btn').click(function(){
			var H;
			$(this).parents('.m-btn').hasClass('wallet-btn')?H=320: H = 280;
			$(this).addClass('cur');
			$(this).siblings('.news-box').animate({'width':'460px'},200,function(){
				$(this).animate({'height':H},300);
			});
			$(this).siblings('em.num').hide();
			$(this).parents('.m-btn').mouseleave(function(){
				$(this).find('.news-box').removeAttr('style').siblings('a.btn').removeClass('cur');
			});
		});
		/*斑马li*/
		$('ul.news-list').find('li').each(function(){
			var _index = $(this).index();
            if((_index%2) == 0){
				$(this).css('backgroundColor','#f6f6f6');
			}
        });
		$('li.friend-bir-info').hover(function(){
			$(this).css('background','#fffdca');
		},function(){
			$(this).css('background','#f6f6f6');
		})
		/*存起来*/
		$('ul.news-list').find('li').find('a.save-btn').click(function(){
			$(this).parent('.btn').hide().siblings('div.icon , div.news-detail').hide().siblings('.saved-tip').show();
		});
		/*忽略*/
		$('ul.news-list').find('li').find('a.ignore').click(function(){
			$(this).parent('.btn').hide().siblings('div.icon , div.news-detail').hide().siblings('.ignored-tip').show();
		});
		/*撤销忽略*/
		$('.ignored-tip').find('a.revoke').click(function(){
			$(this).parents('.ignored-tip').hide().siblings('div.icon , div.news-detail ,div.btn').show();
		});
		$('ul.jifen-list').find('li.friend-bir-info').hover(function(){
			$(this).find('a.detail-more').css('display','block');
		},function(){
			$(this).find('a.detail-more').css('display','none');
		});
	},
	userPanel:function(){
		var delay;
		if(	(navigator.userAgent.indexOf("MSIE 6.0")>0)
		||(navigator.userAgent.indexOf("MSIE 7.0")>0)
		||(navigator.userAgent.indexOf("MSIE 9.0")>0)
		||(navigator.userAgent.indexOf("MSIE 8.0")>0)){

			$('.user-avt').hover(function(){
				var ref = $(this);
				
				clearTimeout(delay);
				if(ref.hasClass("js-login-justice")){
					delay = setTimeout(function(){
						ref.addClass('user-avt-hover');
						ref.siblings('.user-panel').stop(false,true).show();
					},100);
				}
			},function(){
				var ref = $(this);
				
				clearTimeout(delay);
				if(ref.hasClass("js-login-justice")){
					delay = setTimeout(function(){
						ref.removeClass('user-avt-hover');
						ref.siblings('.user-panel').stop(false,true).hide();
					},100);
				}
			});
			$(".user-panel").hover(function(){
				clearTimeout(delay);
			},function(){
				var ref = $(this);
				
				if(snVipHome.flag){
					return;
				}else{

					delay = setTimeout(function(){
						ref.siblings(".user-avt").removeClass('user-avt-hover');
						ref.stop(false,true).hide();
					},100);

				}
				
			});

		}else{
			$('.user-avt').hover(function(){
				var ref = $(this);
				
				clearTimeout(delay);
				if(ref.hasClass("js-login-justice")){
					delay = setTimeout(function(){
						ref.addClass('user-avt-hover');
						ref.siblings('.user-panel').stop(false,true).removeClass("dialog-ready-show").addClass('dialog-show');
					},100);
				}
			},function(){
				var ref = $(this);
				
				clearTimeout(delay);
				if(ref.hasClass("js-login-justice")){
					delay = setTimeout(function(){
						ref.removeClass('user-avt-hover');
						ref.siblings('.user-panel').stop(false,true).removeClass('dialog-show').addClass("dialog-ready-show");
					},100);
				}
			});
			$(".user-panel").hover(function(){
				clearTimeout(delay);
			},function(){
				var ref = $(this);
				
				if(snVipHome.flag){
					return;
				}else{

					delay = setTimeout(function(){
						ref.siblings(".user-avt").removeClass('user-avt-hover');
						ref.stop(false,true).removeClass('dialog-show').addClass("dialog-ready-show");
					},100);

				}
				
			});
		}

		$(".hot-area").on("focus",function(){

			var _this = $(this);

			_this.blur();

		});
		
	},
	windowScroll:function(){
		var isIE = !!window.ActiveXObject;
		var isIE6 = isIE && !window.XMLHttpRequest;
		if(isIE6) return;
		if($('.slide').length > 0){
			var st = $('.slide').offset().top;//悬浮导航出现高度
		}
		if($('.floor').length > 0){
			var gt = $('.floor').eq(0).offset().top - 280; //楼层导航出现的高度
		}
        
        var ft = $('.vip-wrapper').offset().top + $('.vip-wrapper').height();
       
		var fnH = $('.floor-guide').height();

		var delay;

		var WH =$(window).height();
		var WW =$(window).width();

		var pt = [];//每个楼层的距离
		$('.floor').each(function(index) {
			pt[index] = $(this).position().top;
		});
		$(window).scroll(function(){
			$(this).scrollTop()>st?$('#home-fixed-nav').fadeIn(300):$('#home-fixed-nav').fadeOut(300);
			$(this).scrollTop()>gt?$('.floor-guide').fadeIn(300):$('.floor-guide').fadeOut(300);
			// WW<1080?$('.floor-guide').css('marginLeft','455px'):'';

			/*滚动到底部*/
			if($(this).scrollTop() >= ft - 30 - fnH - 200){
				$('.floor-guide').css({
					'position':'absolute',
					'top':ft - fnH - 30 + 1
				});
			}else{
				$('.floor-guide').css({
					'position':'fixed',
					'top':'200px'
				});
				WH<768?$('.floor-guide').css('top','170px'):'';
			}
			clearTimeout(delay);
			delay = setTimeout(function(){
				/*滚动时右侧楼层切换*/
				var st = $(this).scrollTop();
					for(var i = 0;i < pt.length;i++){
						if(st > pt[i]-280 && st<pt[i]+310){
							$('.floor-guide').find('a').eq(i).addClass('cur-floor').siblings('a').removeClass('cur-floor');
						}
					}
			},20);
		});
		$('a.go-back-top').click(function(e){
			e.stopPropagation();
			$("html, body").animate({scrollTop:0},200);
		});
		$('a.floor-num').click(function(){
			var index = $(this).index();
			if($('.floor').eq(index).length>0){
				var st = $('.floor').eq(index).position().top - 250;
				$("html, body").animate({scrollTop:st},200);
			}
		});
	},
	/*弹框优化*/

	dialogProv:function(){

		var _dialogGoods = $(".p-list-img li");

		_dialogGoods.on("mouseenter",function(){

			var _this = $(this);

			_this.find(".show-goods-wrap").addClass("img-border");

		}).on("mouseleave",function(){

			var _this = $(this);

			_this.find(".show-goods-wrap").removeClass("img-border");

		});

	},
	/*遮罩层*/
	maskLayer:function(){
		snVipHome.flag = true;
		var _left = $(".head").offset().left;
		
		$('.user')
			.find('.user-avt')
			.addClass('user-avt-hover');
		if(	(navigator.userAgent.indexOf("MSIE 6.0")>0)
		||(navigator.userAgent.indexOf("MSIE 7.0")>0)
		||(navigator.userAgent.indexOf("MSIE 9.0")>0)
		||(navigator.userAgent.indexOf("MSIE 8.0")>0)){

			$('.user')
				.find('.user-panel')
				.stop(false,true)
				.show();

		}else{

			$('.user')
				.find('.user-panel')
				.stop(false,true)
				.removeClass("dialog-ready-show")
				.addClass('dialog-show');

		}
		$(".mask-layer")
			.width(document.body.clientWidth)
			.height(document.body.clientHeight)
			.css({left:-_left});
		//遮罩层点击事件
		$(".mask-layer").on("click",function(){

			panelDisappear();

		});
		//浏览器大小变化遮罩大小重置
		$(window).resize(function(){
			var _lefts = $(".head").offset().left;
			$(".mask-layer")
				.width(document.body.clientWidth)
				.height(document.body.clientHeight)
				.css({left:-_lefts});

		});

	},
	//页面载入判断浏览器
	addShow:function(){

		if(	(navigator.userAgent.indexOf("MSIE 6.0")>0)
		||(navigator.userAgent.indexOf("MSIE 7.0")>0)
		||(navigator.userAgent.indexOf("MSIE 9.0")>0)
		||(navigator.userAgent.indexOf("MSIE 8.0")>0)){
			$(".user-panel").addClass('js-hide');
		}else{

			$(".user-panel").addClass('dialog-ready-show');

		}	

	},
	//点击图片弹框消失
	topImg:function(){

		$(".active-icon img").on("click",function(){

			panelDisappear();

		});

	},
	//电子书楼层gif图的实现
	eBookGif:function(){

		var _normal = $(".book-gif .normal-img"),
			_light = $(".book-gif .light-img"),
			t = '';

		t = setInterval(function(){

			if(_normal.is(":visible")){

				_normal.removeClass("img-show");
				_light.addClass("img-show");

			}else{

				_normal.addClass("img-show");
				_light.removeClass("img-show");

			}

		},1000);

	},
	//关闭按钮点击调用关闭面板方法
	closeBtn:function(){

		$(".panel-close").on("click",function(){

			if($(".mask-layer").length>0){

				panelDisappear();
				
			}else{

				var ref = $(this).parents(".user-panel");
				
				ref.siblings(".user-avt").removeClass('user-avt-hover');
				ref.stop(false,true).removeClass('dialog-show').addClass("dialog-ready-show");

			}

		});

	}
}
$(function(){
	snVipHome.addShow();
	snVipHome.proHover();
	snVipHome.buyCate();
	snVipHome.birthday();
	snVipHome.inputFocus();
	snVipHome.picSlide('.slide p.btn b','.ad-slide','.ad-slide ul.simg');
	snVipHome.check();
	snVipHome.navMsg();
	snVipHome.userPanel();
	snVipHome.windowScroll();
	snVipHome.dialogProv();
	snVipHome.maskLayer();
	snVipHome.topImg();
	snVipHome.eBookGif();
	snVipHome.closeBtn();
	$("img[src2]").Jlazyload({type: "image", placeholderClass: "err-product"});
})
//面板消失方法
function panelDisappear(){

	var _this = $(".mask-layer");

	_this.fadeOut(100,function(){

	 	if(	(navigator.userAgent.indexOf("MSIE 6.0")>0)
		||(navigator.userAgent.indexOf("MSIE 7.0")>0)
		||(navigator.userAgent.indexOf("MSIE 9.0")>0)
		||(navigator.userAgent.indexOf("MSIE 8.0")>0)){

	 		_this
				.siblings('.user-panel')
				.stop(false,true)
				.hide();

	 	}else{

			_this
				.siblings('.user-panel')
				.stop(false,true)
				.removeClass('dialog-show')
				.addClass("dialog-ready-show");	

		}
		_this
			.siblings(".user-avt")
			.removeClass('user-avt-hover');

		_this
			.remove();

		snVipHome.flag = false;

		$(".header").css({zIndex:101});

	});

}
