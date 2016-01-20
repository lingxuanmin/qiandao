(function(me, win) {
    var lotteryDraw = function(_selector, options) {

        this._selector = _selector;

        this.__intervalTime = null;
        this.__isRun = false;

        //this.__beginNum = 1;
        this.__endNum = 0;
        this.__jumpNum = 1;

        this.__showBoxs = [0];

        this.__totalNum = 12;

        this.isRun = false;
        this.options = options || {};

        this.__startTime = null;
        this.__isDefault = false;

        this.__runTime = 3000; //默认超过此时间就使用谢谢惠顾
        this.__lose = 7; //默认谢谢惠顾位置
    }
    lotteryDraw.prototype.init = function(_value) {
        var self = this;
        if (!self.isRun) {
            self.isRun = true;
            self.__jumpNum = self.__totalNum * 4;
            this.run();
            return this;
        }
    }
    lotteryDraw.prototype.run = function() {
        var _self = this;

        var option = {
            method: "get",
            dataType: "jsonp",
            url: me._isObject(_self.options.url) ? _self.options.url() : _self.options.url,
            jsonp: "callback",
            jsonpCallback: "lotteryDrawCallback",
            timeout: _self.__runTime,
            success: function(res) {
                _self.__endNum = res.slotNo;
                _self.__msgJson = res;
                if (res.succ) {
                    if (_self.__isDefault) {
                        _self.__endNum = 1;
                    }
                } else {
                    _self.isRun = false;
                    _self.__beginNum = _self.__endNum;
                    if (_self.options.render) {
                        _self.options.render.call(_self, 'failure', _self.__endNum, _self.__msgJson);
                    }
                }
            },
            error: function() {
                //网络异常
                _self.isRun = false;
                _self.__beginNum = _self.__endNum;
                if (_self.options.render) {
                    _self.options.render.call(_self, 'error', _self.__endNum, _self.__msgJson);
                }
            }
        }
        $.ajax(option);




        _self.__startTime = new Date();
        var __interTime = 500;
        var _stepMax = this.__jumpNum;

        var _stepIndex = 0;
        this.__showBoxs = [0];

        function __do() {

            if (_self.isRun) {
                __interTime = _self.calculateTime(_stepIndex);
                _self.showBox(_self.__showBoxs);
                _stepIndex++;

                //当前时间-起始时间
                var i = new Date() - _self.__startTime;
                if (i >= _self.__runTime) {
                    if (!_self.__endNum) {
                        _self.__endNum = _self.__lose;
                        _self.isDefault = true;
                        //终止游戏
                        clearTimeout(__interTime);
                        if (_self.options.render) {
                            _self.options.render.call(_self, 'delay', _self.__endNum, _self.__msgJson);
                        }
                        return false;
                    }
                }

                if (_stepIndex >= _stepMax + _self.__endNum) {
                    clearTimeout(__interTime);
                    _self.isRun = false;
                    _self.__beginNum = _self.__endNum;
                    setTimeout(function() {
                        if (_self.options.render) {
                            _self.options.render.call(_self, 'sccuess', _self.__endNum, _self.__msgJson);
                        }
                    }, 400);
                } else {
                    __interTime = setTimeout(__do, __interTime);
                }
            } else {
                clearTimeout(__interTime);
            }
        }
        __do();
    }
    lotteryDraw.prototype.showBox = function(_showBoxs) {
        $("li", this._selector).removeClass("active1");

        if ($.isArray(_showBoxs) && _showBoxs.length > 0) {
            len = _showBoxs.length;
            for (i = 0; i < len; i++) {
                $(this._selector).find("[data=" + _showBoxs[len - i - 1] + "]").addClass("active" + (i + 1) + "");
            }
        }
    }
    lotteryDraw.prototype.calculateTime = function(_stepIndex) {
        var _stepMax = this.__jumpNum;
        var _endNum = this.__endNum;
        var _len = this.__showBoxs.length;
        var l = 8;
        var a = 50;

        //单个效果
        var v = this.__showBoxs[0] + 1;
        this.__showBoxs.length = 0;
        v = v > this.__totalNum ? v - this.__totalNum : v;
        this.__showBoxs[0] = v;

        //if (_stepIndex < _stepMax - l * 2) {
        //    return a * 2;
        //} else if (_stepMax - l * 2 <= _stepIndex && _stepIndex <= _stepMax + _endNum - l) {
        //    return a * 1;
        //} else {
        //    return a * 2;
        //}
        var T = _stepMax + _endNum;
        switch (_stepIndex) {
            case 0:
                a = 400;
                break;
            case 1:
                a = 350;
                break;
            case 2:
                a = 300;
                break;
            case 3:
                a = 200;
                break;
            case T - 1:
                a = 600;
                break;
            case T - 2:
                a = 450;
                break;
            case T - 3:
                a = 350;
                break;
            case T - 4:
                a = 280;
                break;
            case T - 5:
                a = 200;
                break;
            case T - 6:
                a = 140;
                break;
            case T - 7:
                a = 100;
                break;
            case T - 8:
                a = 80;
                break;
            default:
                a = 50;
                break;
        }
        return a;
    }
    me.lotteryDraw = lotteryDraw;
})(window.me = window.me || {}, window);
//切换
(function() {
    $("html,body").animate({
        scrollTop: 210
    }, 1000);
    var a = $('.lotterydraw-ad-banner a');
    var b = $(".lotterydraw-ad-pointer a");
    var length = a.length;
    var _index = parseInt($("#hidIndexValue").val()) || 0;
    a.eq(_index).addClass("current").show();
    b.eq(_index).addClass("current").show();

    //初始化插件
    var slide = new me.slide({
        length: length,
        loop: true,
        auto: true,
        timeout: 4,
        index: _index
    });

    //切换效果
    slide.on('change', function(data) {
        a.eq(data.to).siblings().stop(false, true).fadeOut(800);
        a.eq(data.to).stop(false, true).fadeIn(800);
        b.removeClass("current");
        b.eq(data.to).addClass("current");
    });
    var btimer;
    //点击触发
    b.hover(function() {
        var $this = $(this);
        clearTimeout(btimer);
        btimer = setTimeout(function() {
            slide.go($this.index());
        }, 400);
        slide.pause();
    }, function() {
        slide.resume();
    });
    a.hover(function() {
        slide.pause();
    }, function() {
        slide.resume();
    });
})();
//页面滚动
(function() {
    var length = $(".honor li").length;

    var _init = function() {
        var _h = 0;
        $(".honor li").each(function() {
            var total = 0;
            $(".honor li").slice(0, $(this).index()).each(function() {
                total += $(this).height();
            });
            _h += $(this).height();
            $(this).css({
                "top": total
            });
        });
        return _h;
    }
    var _h = _init();
    var slide = new me.slide({
        length: 2,
        loop: true,
        auto: true,
        timeout: 3,
        index: 0
    });

    _h > 70 ? slide.play() : slide.pause();
    slide.on('change', function(data) {
        $(".honor li").each(function() {
            var $this = $(this);
            $this.animate({
                "top": parseInt($this.css('top')) - parseInt($(".honor li").eq(0).height())
            }, function() {
                if (parseInt($this.css("top")) < 0) {
                    var self = $this.clone();
                    self.appendTo($(".honor ul"));
                    $this.remove();
                    _init();
                }
            });
        });
    });
    window.customeslide = slide;
    window.customeslideInit = _init;
})();
(function() {
    var a = $('.adsub-ad-banner a');
    var length = a.length;
    a.eq(0).addClass("current").show();

    var current = true;

    //初始化插件
    var slide = new me.slide({
        length: length,
        loop: true,
        auto: true,
        timeout: 5,
        index: 0
    });

    //切换效果
    slide.on('change', function(data) {
        if (current) {
            current = false;
        } else {
            return;
        }
        var _left = 275;

        a.eq(data.to).show().css({
            'left': _left * data.direction
        });
        a.eq(data.from).show().css({
            'left': 0
        });
        a.eq(data.from).stop().animate({
            'left': -_left * data.direction
        }, 600);
        a.eq(data.to).stop().animate({
            'left': 0
        }, 600, function() {
            current = true;
        });
    });
    //点击触发
    $(".adsub-ad-next").click(function() {
        slide.next();
    });
    $(".adsub-ad-prev").click(function() {
        slide.prev();
    });
})();
