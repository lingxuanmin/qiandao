var vipSn = vipSn || {};
var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;

// 幻灯效果
vipSn.Slide = function (container, options) {
    //应用配置
    this.opt = $.extend({
        event: 'click', //切换触发事件
        mouseOverDelay: 0, //event为mouseover时，切换发生的延迟时间
        auto: true, //是否开启自动切换
        delay: 5000, //自动切换间隔
        duration: 500, //动画持续时间
        showLabel: true, //若为自定义分页标签，则传入选择器
        onchange: function (page) {
        }, //每次切换完成后的回调函数
        onchangestart: function (page) {
        },
        oninitend: function (container) {
        }
    }, options);
    //相关元素
    this.container = $(container);
    this.items = this.container.find('.main>li');
    this.index = 0;
    this.pager = null;
    this.timer = null;
    this.animating = false;
    //初始化
    this._init();
};
vipSn.Slide.prototype = {
    _init: function () {
        var the = this;
        //生成标签并绑定事件
        this.opt.showLabel && this._createLabel();
        this.to(0);
        //自动切换
        if (this.opt.auto) {
            this.autoStart();
            this.container.hover(function () {
                the.autoPause();
            }, function () {
                the.autoStart();
            });
        }
        this.opt.oninitend.call(this, this.container);
    },
    _createLabel: function () {
        var the = this,
            dom = [],
            timer, i;
        dom.push('<div class="vip-banner-pager"><ul class="pager">');
        for (i = 1; i <= this.items.size(); i++) {
            dom.push('<li></li>');
        }
        dom.push('</ul></div>');
        this.pager = typeof this.opt.showLabel == 'string' ? this.container.find(this.opt.showLabel) : $(dom.join('')).appendTo(this.container);
        //绑定标签事件
        if (this.opt.mouseOverDelay) {
            this.pager.find('li').hover(function () {
                var index = $(this).index();
                timer = setTimeout(function () {
                    the.to(index);
                }, the.opt.mouseOverDelay);
            }, function () {
                clearTimeout(timer);
            });
        }
        else {
            this.pager.find('li').bind(this.opt.event, function () {
                the.to($(this).index());
            });
        }
    },
    autoStart: function () {
        var the = this;
        this.timer = setInterval(function () {
            the.next();
        }, this.opt.delay);
    },
    autoPause: function () {
        clearInterval(this.timer);
    },
    prev: function () {
        this.to(this.index == 0 ? this.items.size() - 1 : this.index - 1);
    },
    next: function () {
        this.to(this.index == this.items.size() - 1 ? 0 : this.index + 1);
    },
    to: function (index) {
        var the = this;
        if (this.animating) return false;
        this.opt.onchangestart.call(this, index);
        this.animating = true;
        this.items.stop().eq(index).fadeIn(this.opt.duration, function () {
            the.animating = false;
        }).siblings().fadeOut(this.opt.duration);
        this.pager && this.pager.find('li').eq(index).addClass('current').siblings().removeClass('current');

        this.items.eq(index).find('img[src3]').each(function () {
            var obj = $(this);
            obj.attr('src', obj.attr('src3')).removeAttr('src3');
        });
        this.index = index;
        this.opt.onchange.call(this, index);
    }
};

//二级页左侧菜单滑块效果和返回顶部
vipSn.leftMenuSlider = function () {
    var obj = $('.J-leftMenu'),
        list = obj.find('li'),
        slider = obj.find('.slider'),
        flag = true;
    //返回顶部
    var goTop = $('.go-top');

    function show() {
        var topHide = parseInt($(document).scrollTop());
        if (topHide > 200) {
            goTop.fadeIn();
        }
    }

    show();
    $(window).scroll(function () {
        show();
    });
    goTop.click(function () {
        flag = false;
        $('html, body').stop(true).animate({'scrollTop': 0}, 'fast', function () {
            flag = true;
        });
        list.removeClass('on');
        slider.hide();
    });

    //初始化滑块位置
    function initSlider() {
        list.each(function () {
            var _this = $(this);
            if (_this.hasClass('on')) {
                flag = false;
                var index = _this.index(),
                    t = index * 41;
                slider.animate({'top': t}, 'fast', function () {
                    slider.show();
                    flag = true;
                });
            }
        })
    }

    //初始化内容区位置
    function initCont() {
        list.each(function () {
            var _this = $(this);
            if (_this.hasClass('on')) {
                var target = _this.find('a').attr('tar'),
                    scrollT = 0;
                if ($(target).length > 0) {
                    if (isIE6) {
                        scrollT = $(target).offset().top + 'px';
                    } else {
                        scrollT = $(target).offset().top - 82 + 'px';
                    }
                }
                if (scrollT == 0) return;
                $('html, body').stop(true).animate({'scrollTop': scrollT}, 'fast');
            }
        })
    }

    initSlider();
    initCont();

    //滑块移动
    list.hover(function () {
        var t = $(this).index() * 41;
        slider.show().stop(true).animate({'top': t}, 'fast');
    }, function () {
        initSlider();
    });
    //滑块点击
    list.click(function () {
        flag = false;
        var _this = $(this),
            target = _this.find('a').attr('tar'),
            scrollT = 0;
        if ($(target).length > 0) {
            if (isIE6) {
                scrollT = $(target).offset().top + 'px';
            } else {
                scrollT = $(target).offset().top - 82 + 'px';
            }
        }
        _this.addClass('on').siblings().removeClass('on');
        initSlider();
        if (scrollT == 0) return;
        $('html, body').stop(true).animate({'scrollTop': scrollT}, 'fast', function () {
            flag = true;
        });
    });
    //控制哪个滑块被选中
    function getFloorTop(number) {
        var id = $('#floor_0' + number);
        if (id.length > 0) {
            if (isIE6) {
                return id.offset().top - $(document).scrollTop();
            } else {
                return id.offset().top - $(document).scrollTop() - 83;
            }
        } else {
            return 0;
        }

    }

    function floorInit() {
        var len = list.length,
            id = $('#floor_01');
        if (id.length == 0) return;
        if (getFloorTop(1) <= 0) {
            for (var i = 2; i <= len; i++) {
                if (getFloorTop(i) > 0) {
                    list.eq(i - 2).addClass('on').siblings().removeClass('on');
                    var t = (i - 2) * 41;
                    slider.show().stop(true).css({'top': t});
                    return;
                }
            }
            list.eq(len - 1).addClass('on').siblings().removeClass('on');
            var top = (len - 1) * 41;
            slider.show().stop(true).css({'top': top});
        } else {
            list.removeClass('on');
            slider.hide();
        }
    }

    //floorInit();
    $(window).scroll(function () {
        if (flag) {
            floorInit();
        }
    })
};
//商品聚合页排序
vipSn.proSort = function () {
    var obj = $('.product-list-hd .floor-sort li');
    obj.click(function () {
        var _this = $(this);
        _this.addClass('on').siblings().removeClass('on').find('.arrow').removeClass('arrow-up arrow-down');
    });
    obj.toggle(function () {
        $(this).find('.arrow').removeClass('arrow-up').addClass('arrow-down');
    }, function () {
        $(this).find('.arrow').removeClass('arrow-down').addClass('arrow-up');
    })
};
//商品聚合页商品hover效果
vipSn.proHover = function () {
    var obj = $('.product-list-box .pro-item');
    obj.on(
        'mouseenter', 'li', function () {
            $(this).find('img').stop(true).animate({'right': '4px'}, '200');
        });
    obj.on(
        'mouseleave', 'li', function () {
            $(this).find('img').stop(true).animate({'right': '-16px'}, '200');
        });
};
//顶部浮动导航
vipSn.topFixedNav = function () {
    if (isIE6) return;
    var obj = $('.J-leftMenu'),
        objBox = $('.J-left-side'),
        box = $('.J-fixed-nav');       
    if (obj.length > 0) {
        var top = obj.offset().top;
    }

    function init() {
        var scrollTop = $(document).scrollTop();
        if($(".product-list").length > 0){
	        var bottomTop = $(".product-list").offset().top + $(".product-list").height();
	    		
	        if (obj.length > 0) {
	            if (scrollTop + 113 >= top) {
	                box.show();
	                if (objBox.hasClass('left-side-mt')) {
	                    objBox.css({
	                    position:"fixed",
	                    top: 103,
	                    zIndex: 90
	                 });   
	                } else {
	                    objBox.css({
	                    position:"fixed",
	                    top: 141,
	                    zIndex: 90
	                 });   
	                }
	            }
	            if(scrollTop+objBox.height() + 103 >= bottomTop){
	                box.show();
	                objBox.css({
	                    position:"absolute",
	                    top: $(".product-list").height()-$(".second-wrapper .left-side").height()-54
	                 });    

	            } 
	            if(scrollTop<200) {
	                box.hide();
	                objBox.css({
	                    position:"static",
	                    top:0
	                 }); 
	            }
	        } else {
	            if (scrollTop >= 200) {
	                box.show();
	            } else {
	                box.hide();
	            }
	        }
    	}
    }
    init();
    $(window).scroll(function () {
        init();
    })
};
//banner
vipSn.movieBanner = function () {
    var slide = new vipSn.Slide('.vip-banner', {
        mouseOverDelay: 200,
        duration: 500,
        delay: 5000,
        oninitend: function (box) {
            var pager = box.find('.pager ul');
            pager.css('margin-left', -pager.outerWidth() / 2);
        }
    })
};
//电影明星二级页tab切
vipSn.movieTab = function () {
    var obj = $('.movie-video-tab .video-tab li'),
        box = $('.movie-video-box .video-box'),
        slider = $('.movie-video-tab .slider'),
        top = 0;
    obj.click(function () {
        var _this = $(this),
            index = _this.index(),
            top = 160 * index + 'px';
        box.eq(index).show().siblings().hide();
        slider.stop(true).animate({'top': top}, 200);
    })
};
//图书二维码
vipSn.readAppDownload = function () {
    var obj = $('.left-intro-hd .download-ewm');
    obj.hover(function () {
        $(this).addClass('download-ewm-on');
    }, function () {
        $(this).removeClass('download-ewm-on');
    })
};
//招商二级页左侧导航
vipSn.zhaoShangMenu = function () {
    var obj = $('.left-menu-zhaoshang li');
    obj.click(function () {
        $(this).addClass('on').siblings().removeClass('on');
    })
};

//商品聚合页价格范围筛选2014-09-15
vipSn.inputValidate = function(){
    var wraper = $(".floor-range") ;
    var rgwrapper= wraper.find(".rgwrapper")
    var ranges = wraper.find(".range");
    var btn = wraper.find(".btn-range");
    //价格范围框出现
    wraper.click(function(){
        var $this = $(this);
        $this.find(".rgwrapper").addClass("range-hover");
        $this.addClass("height88");
        $this.find(".rgwrapper .range").addClass("focus1")
    }) 
    //输入限制
    function clearNoNum(event,obj){ 
        if(event.keyCode == 37 | event.keyCode == 39){ 
            return; 
        } 
        //先把非数字的都替换掉，除了数字和. 
        obj.value = obj.value.replace(/[^\d.]/g,""); 
        //必须保证第一个为数字而不是. 
        obj.value = obj.value.replace(/^\./g,""); 
        //保证只有出现一个.而没有多个. 
        obj.value = obj.value.replace(/\.{2,}/g,"."); 
        //保证.只出现一次，而不能出现两次以上 
        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    } 
        
    function checkNum(obj){ 
        //为了去除最后一个. 
        obj.value = obj.value.replace(/\.$/g,""); 
    }

    $(".range").keyup(function(event){clearNoNum(event,this)});
    //获取焦点
    ranges.focus(function(){
        var $this = $(this);  
        $this.val("");      
        $this.addClass("focus2");
    })
    //失去焦点
    ranges.blur(function(){
        var $this = $(this);
        $this.removeClass("focus2");
        checkNum(this);
    })
    //确认筛选
    btn.click(function(e){
        e.stopPropagation();
        var $this = $(this);
        $this.parents(".rgwrapper").removeClass("range-hover");
        $this.parents(".floor-range").removeClass("height88");
        $this.parents(".rgwrapper").find(".range").removeClass("focus1 focus2");
        $this.parents(".floor-range").removeClass("on");

        var rag= $this.parents(".rgwrapper").find(".range");
        inputcont(rag);   
    })
    //鼠标移出
    wraper.mouseleave(function(){
        var $this =$(this);
        $this.find(".rgwrapper").removeClass("range-hover");
        $this.removeClass("height88");
        $this.find(".range").removeClass("focus1 focus2");

        var rag= $this.find(".range");
        inputcont(rag);
    })  
    function inputcont(rag){
        rag.each(function(){
             var $this = $(this);
             if($this.val()==""){
                 $this.val("0");
                 }
             if($this.val()=="云钻"){
                 $this.val("0");
                 }
            })
        var num1 =parseFloat(rag.eq(0).val());
        var num2 =parseFloat(rag.eq(1).val());
        rag.eq(0).val(num1);
        rag.eq(1).val(num2);        
        if(num1>num2){
             rag.eq(0).val(num2);
             rag.eq(1).val(num1);
            }
        if(rag.eq(0).val()==0 &&rag.eq(1).val()==0){
            rag.eq(0).val("云钻");
            rag.eq(1).val("云钻");
        }        
    }
}

vipSn.heightReset = function(){
    var hgt1=$(".vip-earnmore").height()-4;
    var hgt2=$(".product-list").height()-54;
    $(".fillbg").height(hgt1);
    $(".filllayer .layer").height(hgt2);
}


$(function () {
    vipSn.leftMenuSlider();
    vipSn.proSort();
    vipSn.proHover();
    vipSn.topFixedNav();
    vipSn.movieBanner();
    vipSn.movieTab();
    vipSn.readAppDownload();
    vipSn.zhaoShangMenu();
    vipSn.inputValidate();
    vipSn.heightReset();
});

