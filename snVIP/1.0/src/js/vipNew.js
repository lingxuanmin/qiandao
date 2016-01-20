var vipNew = vipNew || {};

vipNew.fnMemberLevel = function () {
    var sNav = ".member-level .menu-item li",
        sModules = ".member-level .ml-content",
        sGdTab = ".member-level .gd-tab li",
        sGdCont = ".member-level .gd-cont",
        oFloat = $(".J-left-side"),
        nFloatStart = oFloat.offset().top,
        bFlag = true;
        
    if (!(navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i))) {
        $(document).on("mouseenter", sNav, function () {
            var _this = $(this);
            _this.addClass("li-hover");
        }).on("mouseleave", sNav, function () {
            var _this = $(this);
            _this.removeClass("li-hover");
        });
    }
    $(document).on("click", sNav, function () {
        bFlag = false;
        var _this = $(this),
            _nIndex = _this.index(),
            _sOffsetTop = $(sModules).eq(_nIndex).offset().top;
        _this.siblings(sNav).removeClass("on");
        _this.addClass("on");
        $("body, html").stop().animate({scrollTop: _sOffsetTop}, function () {
            setTimeout(function () {
                bFlag = true;
            }, 300);
        });
    }).on("click", sGdTab, function () {
        var _this = $(this),
            _nIndex = _this.index();
        $(sGdTab).removeClass("gd-selected");
        _this.addClass("gd-selected");
        $(sGdCont).hide();
        $(sGdCont).eq(_nIndex).show();
    }).on("click", ".J-value", function () {
        $("body, html").stop().animate({scrollTop: $(sModules).eq(3).offset().top});
    });
    var aOffsetTop = [];
    for (var i = 0; i < $(sModules).size() ; i++) {
        aOffsetTop[i] = $(sModules).eq(i).offset().top;
    }
    $(window).scroll(function () {
        var sScrollTop = $(window).scrollTop(),
            nCount = 0;

        for (var k = 0; k < $(sModules).size(); k++) {
            if (sScrollTop >= aOffsetTop[k]) {
                nCount += 1;
            }
        }
        if (nCount == 0) {
            nCount = 1;
        }
        if (bFlag) {
            $(sNav).removeClass("on");
            $(sNav).eq(nCount - 1).addClass("on");
        }
        if (sScrollTop >= nFloatStart) {
            oFloat.addClass("let-side-float");
            if (/MSIE 6.0/.test(navigator.userAgent)) {
                oFloat.css({position: "absolute", top: $(window).scrollTop() - 330});
            } 
        } else {
            oFloat.removeClass("let-side-float");
            if (/MSIE 6.0/.test(navigator.userAgent)) {
                oFloat.css({position: "static", top: 0});
            }
        }
    });
    function fnProInit(process) {
        var _sProcess = $(process),
            _sPop = _sProcess.siblings(".J-pop"),
            _sCircle = _sProcess.find("i"),
            _sPopPoint = _sPop.find("i"),
            _sDone = _sProcess.find(".J-done"),
            _sValue = _sProcess.attr("data-value"),
            _sPopWidth = _sPop.width() + 22;

        _sPopPoint.css({left: _sPopWidth/2 - _sPopPoint.width()/2});
        _sDone.animate({width: _sValue}, 1000, function () {
            _sPop.css({left: _sValue - 7 - _sPopWidth/2, opacity: 0}).show().stop().animate({opacity: 1});
            if (_sPop.length > 0) {
                var _sW1 = _sPop.offset().left + _sPop.width() + 22,
                    _sW2 = $(".grow-graph").offset().left + $(".grow-graph").width();
                if ( _sW1 > _sW2) {
                    var _sDiff = _sW1 - _sW2;
                    _sPop.css({left: "-=" + _sDiff});
                    _sPopPoint.css({left: "+=" + _sDiff});
                } else if (_sPop.offset().left < $(".grow-graph").offset().left) {
                    var _sDiff = $(".grow-graph").offset().left - _sPop.offset().left;
                    _sPop.css({left: "+=" + _sDiff});
                    _sPopPoint.css({left: "-=" + _sDiff});
                }
            }
            for (var i = 0; i < _sCircle.size(); i++) {
                if (_sCircle.eq(i).offset().left < _sDone.offset().left + _sDone.width()) {
                    _sCircle.eq(i).addClass("done");
                }
            }
        });
    }
    fnProInit(".value-process");
    fnProInit(".days-process");
}

vipNew.fnAppoint = function() {
    $(document).on("click", ".ap-active-intro", function (event) {
        var _this = $(this);
        _this.stop().animate({width: 450}, function () {
            _this.stop().animate({height: 500}, function () {
                _this.removeClass("J-ap-active");
            });
        });
        event.stopPropagation();
    }).on("click", ".pf-city-more", function () {
        var _this = $(this);
        if (_this.hasClass("J-city-all")) {
            $(".pf-city-list").css({height: 34});
            _this.removeClass("J-city-all");
        } else {
            $(".pf-city-list").css({height: "auto"});
            _this.addClass("J-city-all");
        }
        
    });
    $(".ap-text").each(function () {
        var _this = $(this);
        var attr = "placeholder";
        var input = document.createElement("input");
        if (attr in input) {
            return;
        } else {
            $("<span class='cover-words'>" + _this.attr("placeholder") + "</span>").insertAfter(_this);
            _this.siblings("span").css({
                "position": "absolute",
                left: 10,
                top: 0,
                width: _this.outerWidth(),
                height: _this.outerHeight(),
                font: "14px Microsoft YaHei",
                color: "#999",
                "line-height": _this.outerHeight() + "px"
            })
        }
    });
    $(document).on("focus", ".ap-text", function () {
        var _this = $(this);
        var attr = "placeholder";
        var input = document.createElement("input");
        _this.addClass("ap-control-focus");
        if (attr in input) {
            return false;
        } else {
            var words = _this.siblings("span");
            if (_this.val() === "") {
                words.hide();
            }
        }
    }).on("blur", ".ap-text", function () {
        var _this = $(this);
        var attr = "placeholder";
        var input = document.createElement("input");
        _this.removeClass("ap-control-focus");
        if (attr in input) {
            return false;
        } else {
            var words = _this.siblings("span");
            if (_this.val() === _this.attr("placeholder") || _this.val() === "") {
                words.show();
            }
        }
    }).on("click", ".cover-words", function () {
        $(this).siblings("input,textarea").focus();
    });
    $(document).click(function () {
        fnApIntroClose();
    });
    function fnApIntroClose() {
        var _this = $(".ap-active-intro");
        _this.animate({height: 51}, function () {
            _this.stop().animate({width: 100});
            _this.addClass("J-ap-active");
        });
    }
}