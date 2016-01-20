/*
*member会员前端js
*pliffy垫子
*me方法集
*slide插件
*date插件
*slowm插件
*toast插件
*/
;(function (win) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
        win.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame'];
        win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!win.requestAnimationFrame) win.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = win.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!win.cancelAnimationFrame) win.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}(window));
/*基本通用方法*/
;(function (win) {
    var classtype = {
        "[object Array]": "array",
        "[object Boolean]": "boolean",
        "[object Date]": "date",
        "[object Function]": "function",
        "[object Number]": "number",
        "[object Object]": "object",
        "[object RegExp]": "regexp",
        "[object String]": "string"
    };
    var me = {
        __Index: 0,
        list: new Array(),
        get: function (id) {
            return id === undefined
            ? this.list
            : this.list[id];
        },
        fn: new Function(),
        inherit: function (childClass, parentClass) {
            var Constructor = new Function();
            Constructor.prototype = parentClass.prototype;
            childClass.prototype = new Constructor();
            childClass.prototype.constructor = childClass;
            childClass.superclass = parentClass.prototype;

            if (childClass.prototype.constructor == Object.prototype.constructor) {
                childClass.prototype.constructor = parentClass;
            }
        },
        extend: function (obj, newProperties) {
            var key;
            for (key in newProperties) {
                if (newProperties.hasOwnProperty(key)) {
                    obj[key] = newProperties[key];
                }
            }
            return obj;
        },
        copy: function (targetClass, obj, newProperties) {
            if (typeof obj !== 'object') {
                return obj;
            }

            var value = obj.valueOf();
            if (obj != value) {
                return new obj.constructor(value);
            }

            var o;
            if (obj instanceof obj.constructor && obj.constructor !== Object) {
                if (targetClass) {
                    o = new targetClass();
                } else {
                    o = me.clone(obj.constructor.prototype);
                }

                for (var key in obj) {
                    if (targetClass || obj.hasOwnProperty(key)) {
                        o[key] = obj[key];
                    }
                }
            } else {
                o = {};
                for (var key in obj) {
                    o[key] = obj[key];
                }
            }

            if (newProperties) {
                for (var key in newProperties) {
                    o[key] = newProperties[key];
                }
            }

            return o;
        },
        clone: function (obj) {
            me.__cloneFunc.prototype = obj;
            return new me.__cloneFunc();
        },
        __cloneFunc: function () {
        },
        delegate: function (func, scope) {
            scope = scope || window;
            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);
                return function () {
                    return func.apply(scope, args);
                }
            } else {
                return function () {
                    return func.call(scope);
                }
            }
        },
        dom: function ($select, classCss) {
            var wrap = $select;
            var name, DOM = {
                wrap: $(wrap)
            },
                els = wrap[0].getElementsByTagName("*"),
                elsLen = els.length;
            for (var i = 0; i < elsLen; i++) {
                name = els[i].className;
                if (name.indexOf(classCss) > -1) {
                    name = name.split(classCss)[1];
                }
                if (name) {
                    DOM[name] = $(els[i], wrap)
                }
            }
            return DOM
        },
        //模板引擎
        template: function () {
            var args = arguments, result;
            if (args.length > 0) {
                if (me.isString(args[0])) {
                    result = args[0];
                    if (args.length == 2 && me.isObject(args[1])) {
                        for (var key in args[1]) {
                            if (args[1][key] != undefined) {
                                var reg = new RegExp("({" + key + "})", "g");
                                result = result.replace(reg, args[1][key]);
                            }
                        }
                    } else {
                        for (var i = 1; i < args.length; i++) {
                            if (args[i] != undefined) {
                                var reg = new RegExp("({[" + (i - 1) + "]})", "g");
                                result = result.replace(reg, args[i]);
                            }
                        }
                    }
                }
            }
            return result;
        },
        __type: function (obj) {
            return obj == null ? String(obj) : classtype[Object.prototype.toString.call(obj)] || "object";
        },
        isObject: function (obj) {
            return this.isFunction(obj) || !!(obj && 'object' === typeof obj);
        },
        isFunction: function (obj) {
            return this.__type(obj) === "function";
        },
        isArray: Array.isArray || function (obj) {
            return this.__type(obj) === "array";
        },
        isNum: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        isString: function (obj) {
            return this.__type(obj) === "string";
        },
        each: function (data, callback, args) {
            var i, len;
            if (me.isArray(data)) {
                for (i = 0, len = data.length; i < len; i++) {
                    if (callback.call(data[i], i, data[i], args) === false) {
                        break;
                    }
                }
            } else {
                for (i in data) {
                    if (callback.call(data[i], i, data[i], args) === false) {
                        break;
                    }
                }
            }
        },
        funManager: {
            __loadList: {},
            __loadFun: function (item, callback, win) {
                if (item.methord && me.isFunction(item.methord())) {
                    win = win || window;
                    item.methord()(item, function () {
                        callback();
                    }, win);
                }
            },
            load: function (fns, statechange, win, __index) {
                __index = __index || 0;
                if (fns[__index]) {
                    me.funManager.__loadFun(fns[__index], function () {
                        me.funManager.load(fns, statechange, win, __index + 1);
                    }, win);
                }
                statechange(__index, win);
            },
            get: function (id) {
                return this.__loadList[id];
            }
        },
        log: function (msg) {
            var console = window.console || { log: function () { } };
            console.log(msg);
        },
        Event: {
            mousewheel: function (e) {
                var _eoe = e.originalEvent;
                var _de = _eoe.detail ? _eoe.detail * -1 : _eoe.wheelDelta / 40;
                var _direction = _de < 0 ? -1 : 1;
                return {
                    direction: _direction,
                    unit: _de
                }
            },
            __: function (_e, el, event, handle) {
                for (var key in _e) {
                    if (win[_e[key].validator]) {
                        el[_e[key].validator](_e[key].prefix + event, handle, false);
                        break;
                    }
                }
            },
            add: function (el, event, handle) {
                var _e = [
                    { validator: 'addEventListener', prefix: '' },
                    { validator: 'attachEvent', prefix: 'on' }
                ];
                this.__(_e, el, event, handle);
            },
            remove: function (el, event, handle) {
                var _e = [
                    { validator: 'removeEventListener', prefix: '' },
                    { validator: 'detachEvent', prefix: 'on' }
                ];
                this.__(_e, el, event, handle);
            }
        },
        getUid: function (_name) {
            return me.template("me-{0}{1}-{2}", _name, new Date().getTime(), me.__Index++)
        },
        Browser: {
            isTouch: function () {
                var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture;
                return (("ontouchstart" in window) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) ? true : false;
            },
            Prefix: function () {
                var props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                var obj = document.createElement('div');
                for (var i in props) {
                    if (obj.style[props[i]] !== undefined) {
                        return me.template("-{0}-", props[i].replace('Perspective', '').toLowerCase());
                    }
                }
            },
            parseURL: function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function () {
                        var ret = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length, i = 0, s;
                        for (; i < len; i++) {
                            if (!seg[i]) { continue; }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    })(),
                    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: a.pathname.replace(/^\//, '').split('/')
                };
            }
        },
        Array: {
            indexOf: function (array, val) {
                for (var i = 0; i < array.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            },
            remove: function (array, val) {
                var index = this.indexOf(array, val);
                if (index > -1) {
                    array.splice(index, 1);
                }
                return array;
            }
        }
    }
    win.me = me;
})(window);
/*组件基类，所有组件继承assembly,assembly用于统一生产组件编号，目前是用于组件进行监控*/
; (function (me, win) {
    var assembly = function (options) {
        this.initialized = false;
        this.registerEvent = {
            before: [],
            change: [],
            after: []
        };
        

        this.init(options);
        me.log("me.base.js运行中...");
    }
    assembly.output = function () {
        me.log(me.list);
    }
    assembly.prototype.oninit = me.fn;
    assembly.prototype.init = function (cfg) {
        this.initialized = true;

        function _getClassName(_constructor, _constr) {
            var _constr = _constr || "";
            if (_constructor.superclass) {
                var args = /(\w+)\.superclass/.exec(_constructor.arguments.callee);
                if (args != null) {
                    _constr += args[1] + "-";
                    return _getClassName(_constructor.superclass.constructor, _constr);
                }
            }
            return _constr;
        }
        this.__Uid = me.getUid(_getClassName(this.constructor));
        this.oninit(cfg);
        me.list[this.__Uid] = this;
    };
    assembly.prototype.destory = function () {
        this.initialized = false;
        delete me.list[this.__Uid];
    };
    assembly.prototype.getUid = function () {
        return this.__Uid;
    }
    assembly.prototype.getOptions = function () {
        return this.options;
    }
    assembly.prototype.config = function () {
        if (arguments.length > 0) {
            if (typeof (arguments[0]) === "string") {
                if (arguments.length > 1) {
                    this.options[arguments[0]] = arguments[1];
                } else {
                    return this.options[name];
                }
            }
        } else {
            return this.options;
        }
    };
    assembly.prototype.on = function (name, callback) {
        var __self = this;
        var _e = __self.registerEvent[name];
        if (_e) {
            _e.push(callback);
        }
        return _e;
    };
    assembly.prototype.off = function (name, callback) {
        var __self = this;
        var _e = __self.registerEvent[name];
        var e = [];
        me.each(_e, function (name, _callback) {
            if (_callback === callback) {
                e.push(name);
            }
        });
        me.each(e.reverse(), function (name, _callback) {
            _e.splice(_callback, 1);
        });
    };
    me.assembly = assembly;
})(window.me = window.me || {}, window);
/*切换组件*/
; (function (me, win) {
    var slide = function (option) {
        this.__lastTime = null;
        this.__isStop = false;
        this.options= me.copy({},this.defaults, option);
        slide.superclass.constructor.call(this, this.options);
    }
    me.inherit(slide, me.assembly);
    slide.prototype.oninit = function () {
        var __self = this, _o = __self.options;
        if (_o.auto) {
            __self.play();
        }
        __self.go(_o.index);
        return this;
    }
    slide.prototype.go = function (_to, _from) {
        var __self = this, _o = __self.options;
        if (__self.__lastTime) {
            clearTimeout(__self.__lastTime);
            __self.__lastTime = null;
        }
        _from = "undefined" == typeof _from ? _o.index : _from;
        var _direction = _to === _from ? 0 : _to > _from ? 1 : -1;
        var _loop = _o.loop, _index = _o.length - 1, _originalto = _to;
        if (_loop) {
            if (_to > _index) {
                _to = _to - _index - 1;
            } else {
                if (0 > _to) {
                    _to = _to + _index + 1;
                } else {
                    _to = _to;
                }
            }
        } else {
            if (_to > _index) {
                _to = _index;
            } else {
                if (0 > _to) {
                    _to = 0;
                } else {
                    _to = _to;
                }
            }
        }
        var _current = _o.index = _to;

        var o = {
            from: _from,
            to: _to,
            originalto: _originalto,
            direction: _direction,
            uid:__self.getUid()
        }

        for (var key in __self.registerEvent) {
            if (__self.registerEvent[key].length > 0) {
                for (_e in __self.registerEvent[key]) {
                    __self.registerEvent[key][_e](o);
                }
            }
        }

        if (_current !== _index || _to) {
            if (!__self.__isStop && _o.auto) {
                __self.play();
            }
        } else {
            if (__self.__lastTime) {
                clearTimeout(__self.__lastTime);
            }
        }
    },
    slide.prototype.play = function () {
        var __self = this, _o = __self.options;
        __self.__lastTime = setTimeout(function () {
            __self.next();
        }, 1000 * _o.timeout);
        return this;
    },
    slide.prototype.next = function () {
        var __self = this, _o = __self.options;
        var _from = _o.index;
        var _to = _from + _o.step;
        __self.go(_to, _from);
    }
    slide.prototype.prev = function () {
        var __self = this, _o = __self.options;
        var _from = _o.index;
        var _to = _from - _o.step;
        __self.go(_to, _from);
    };
    slide.prototype.pause = function () {
        var __self = this, _o = __self.options;
        if (__self.__lastTime) {
            clearTimeout(__self.__lastTime);
        }
        __self.__isStop = true;
    };
    slide.prototype.resume = function () {
        var __self = this, _o = __self.options;
        __self.__isStop = false;
        __self.play();
    };
    slide.prototype.defaults = {
        index: 0,
        timeout: 5,
        step: 1,
        per: 1,
        auto: false,
        loop: false
    }
    me.slide = slide;
})(window.me = window.me || {}, window);
/*日期组件*/
; (function (me, win) {
    var date = function (dateTime) {
        this.grids = [];
        date.superclass.constructor.call(this, dateTime);
    }
    me.inherit(date, me.assembly);
    date.prototype.oninit = function (dateTime) {
        this.grids = [];
        var __date = dateTime || new Date();
        this.dateTime = __date;
        this.year = (dateTime || __date).getFullYear();
        this.month = false ? __date.getMonth() : (__date.getMonth() + 1);
        this.date = (dateTime || __date).getDate();
        this._buildData();
    }
    date.prototype.format = function (format) {
        var o = {
            "M+": this.dateTime.getMonth() + 1, //month
            "d+": this.dateTime.getDate(),    //day
            "h+": this.dateTime.getHours(),   //hour
            "m+": this.dateTime.getMinutes(), //minute
            "s+": this.dateTime.getSeconds(), //second
            "q+": Math.floor((this.dateTime.getMonth() + 3) / 3),  //quarter
            "S": this.dateTime.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    },
    date.prototype._buildData = function () {
        //渲染数据
        var _gdBw = this._getDayByWeek(this.year, this.month);
        var _gdBm = this._getDaysByMouth(this.year, this.month);
        var _gpdBm = this._getPrevDaysByMouth(this.year, this.month);
        var _index = 1;

        this.grids[0] = [];
        if (_gdBw > 0) {
            for (var i = 0; i < _gdBw ; i++) {
                this.grids[0].push({ state: -1, name: 0, value: (_gpdBm - _gdBw + 1 + i) });
            }
            for (var i = 0; i < (7 - _gdBw) ; i++) {
                this.grids[0].push({ state: 0, name: _index, value: _index, isNow: this.date == _index ? true : false });
                _index++;
            }
        } else {
            for (var i = 0; i < 7 ; i++) {
                this.grids[0].push({ state: -1, name: 0, value: (_gpdBm - 7 + 1 + i) });
            }
        }
        var _rows = _gdBm;
        if (_gdBw != 0) {
            _rows = _gdBm + _gdBw - 7;
        }
        _rows = parseInt(_rows / 7);
        for (var i = 0; i < _rows; i++) {
            var len = this.grids.length;
            this.grids[len] = [];
            for (var j = 0; j < 7; j++) {
                this.grids[len].push({ state: 0, name: _index, value: _index, isNow: this.date == _index ? true : false });
                _index++;
            }
        }
        if (_gdBm >= _index) {
            var _lastrow = _gdBm - _index + 1;
            var len = this.grids.length;
            this.grids[len] = [];
            for (var i = 0; i < _lastrow; i++) {
                this.grids[len].push({ state: 0, name: _index, value: _index, isNow: this.date == _index ? true : false });
                _index++;
            }
            for (var i = 0; i < (7 - _lastrow) ; i++) {
                this.grids[len].push({ state: 1, name: 0, value: (i + 1) });
                _index++;
            }
        }
        //补白
        var filler = [];
        if (this.grids.length > 6) {
            me.log("数组超出索引");
        } else {
            if (this.grids.length == 5) {
                if (this.grids[0][0].name == 0) {
                    var _s = 0;
                    if (this.grids[4][6].state == 1) {
                        _s = this.grids[4][6].value;
                    }
                    for (var i = 0; i < 7; i++) {
                        filler.push({ state: 1, name: 0, value: (_s + i + 1) });
                    }
                    this.grids.push(filler);
                } else {
                    for (var i = 0; i < 7; i++) {
                        filler.push({ state: 1, name: 0, value: (_gpdBm - 7 + i + 1) });
                    }
                    this.grids.unshift(filler);
                }
            }
        }

        return this.grids;

    }
    date.prototype._getDaysByMouth = function (_Year, _Month) {
        var isLeap = false;
        if (_Year % 400 == 0 || (_Year % 4 == 0 && _Year % 100 != 0)) {
            isLeap = true
        }
        switch (_Month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                return isLeap ? 29 : 28
        }
    };
    date.prototype._getDayByWeek = function (_Year, _Month) {
        return new Date(_Year, _Month - 1, 1).getDay();
    };
    date.prototype._getPrevDaysByMouth = function (_Year, _Month) {
        if (_Month > 1) {
            return this._getDaysByMouth(_Year, _Month - 1);
        } else {
            return 31;
        }
    }
    me.date = date;
})(window.me = window.me || {}, window);
/*缓动组件*/
; (function (me, win) {
    var slowm = function (options) {
        this.currentdot = 0;
        this.direction = 0;
        this.todot = 0;
        this.fromdot = 0;
        this.movedot = 0;
        this.__isStop = false;

        options = me.extend(this.defaults, options);
        slowm.superclass.constructor.call(this, options);
    }
    me.inherit(slowm, me.assembly);
    slowm.prototype.oninit = function () {
        var __self = this, _o = __self.options;
        if (!__self.__isStop) {
            __self.__isStop = true;
            __self.play();
        }
        return this;
    }
    slowm.prototype.play = function () {
        var __self = this, _o = __self.options;
        if (__self.__isStop) {
            __self.loop();
        }
    }
    slowm.prototype.loop = function () {
        var __self = this, _o = __self.options;
        if (!__self.__isStop) {
            return;
        }
        __self.render();
        win.requestAnimationFrame(function () {
            __self.loop();
        });
    }
    slowm.prototype.render = function () {
        var __self = this, _o = __self.options;
        if (Math.abs(__self.movedot) < _o.buffer) {
            return;
        }
        __self.currentdot += __self.movedot;

        if (__self.currentdot < _o.range[0]) {
            __self.movedot = 0;
            __self.currentdot = _o.range[0];
        }
        else if (__self.currentdot > _o.range[1]) {
            __self.movedot = 0;
            __self.currentdot = 0;
        }
        var o = {
            to: -__self.currentdot
        }
        for (var key in __self.registerEvent) {
            if (__self.registerEvent[key].length > 0) {
                for (_e in __self.registerEvent[key]) {
                    __self.registerEvent[key][_e](o);
                }
            }
        }
        __self.movedot *= _o.per;
    }
    slowm.prototype.go = function (_direction, _de) {
        var __self = this, _o = __self.options;
        if (_direction != __self.direction) {
            __self.predot = 0;
            _o.movedot = _direction;
        }
        __self.run(_de);
    }
    slowm.prototype.run = function (_de) {
        var __self = this, _o = __self.options;
        __self.todot += _de;
        __self.movedot += (__self.todot - __self.fromdot) * _o.speed;
        __self.fromdot = __self.todot;
    }
    slowm.prototype.pause = function () {
        var __self = this, _o = __self.options;
        if (__self.__isStop) {
            __self.__isStop = false;
        }
    }
    slowm.prototype.defaults = {
        buffer: 0.1,
        range: [0, 0],
        speed: 1,
        per: 0.95
    }
    me.slowm = slowm;
})(window.me = window.me || {}, window);
/*弹出层组件*/
;(function (me, win) {
    var toast = function (options, ok, cancel) {
        options = options || {};
        if (me.isString(options)) {
            options = { content: options };
        }
        options = me.copy({}, toast.defaults, options);
        if (!me.isArray(options.button)) {
            options.button = [];
        }
        if (ok !== undefined) {
            options.ok = ok;
        }
        if (options.ok) {
            options.button.push({
                id: 'ok',
                value: options.okValue,
                callback: options.ok
            });
        }
        if (cancel !== undefined) {
            options.cancel = cancel;
        }
        if (options.cancel) {
            options.button.push({
                id: 'cancel',
                value: options.cancelValue,
                callback: options.cancel
            });
        }
        toast.superclass.constructor.call(this, options);
        return this;
    }
    toast.list = {};
    me.inherit(toast, me.assembly);
    toast.prototype.closed = true;
    toast.prototype.destroyed = true;
    toast.prototype.current = true;
    toast.prototype.oninit = function () {
        var __self = this, _o = __self.options;
        __self.closed = false;
        __self.destroyed = false;

        var wrap = $('<div />')
           .css({
               display: 'none',
               position: 'absolute',
               left: 0,
               top: 0,
               bottom: 'auto',
               right: 'auto',
               margin: 0,
               padding: 0,
               outline: 0,
               border: '0 none',
               background: 'transparent'
           })
           .html(_o.template)
           .appendTo('body');
        __self.dom = __self.dom || me.dom(wrap, _o.className);
        var backdrop = $('<div />');
        __self.dom.backdrop = backdrop;
        __self.button(_o.button).title(_o.title).content(_o.content).size(_o.width, _o.height).time(_o.time).addclass(_o.addClass).zIndex().focus().show().reset();
        __self.dom.close[_o.show === false ? 'hide' : 'show']().attr('title', _o.cancelValue)
            .on('click', function (event) {
                __self._trigger('cancel');
                event.preventDefault();
            });
        __self.dom.wrap.on('click', '[data-id]', function (event) {
            var $this = $(this);
            if (!$this.attr('disabled')) {
                __self._trigger($this.data('id'));
            }
            event.preventDefault();
        });
        _o.init && _o.init(__self);
        __self.resize();
        return __self;
    },
    toast.prototype.addclass = function (css) {
        var __self = this, _o = __self.options;
        __self.dom.toast.addClass(css);
        return __self;
    },
    toast.prototype.resize = function () {
        var __self = this, _o = __self.options;
        $(window).resize(function () {
            __self.reset();
        });
        return __self;
    },
    toast.prototype.reset = function () {
        var __self = this, _o = __self.options;
        var pos = __self._center();
        var style = __self.dom.wrap[0].style;
        style.left = pos.left + 'px';
        style.top = pos.top + 'px';
        return __self;
    },
    toast.prototype.size = function (width, height) {
        var __self = this, _o = __self.options;
        __self.dom.content.css('width', width);
        __self.dom.content.css('height', height);
        __self.dom.content.animate({
            'width': width,
            'height': height
        });
        return __self;
    },
    toast.prototype.setsize = function (width, height) {
        var __self = this, _o = __self.options;

        __self.dom.content.animate({
            'width': width,
            'height': height
        });
        var pos = __self._center(width, height);
        __self.dom.wrap.animate({
            'left': pos.left,
            'top': pos.top
        });
        return __self;
    },
    toast.prototype.content = function (html) {
        var __self = this, _o = __self.options;
        if (!__self.dom.content) {
            return __self;
        }
        __self.dom.content.empty('')[typeof html === 'object' ? 'append' : 'html']((_o.icon ? '<i class=' + _o.icon + '></i>' : "") + html);

        return __self;
    },
    toast.prototype.title = function (text) {
        var __self = this, _o = __self.options;
        if (!__self.dom.title) {
            return __self;
        }
        __self.dom.title.html(text);
        __self.dom.title[text ? 'show' : 'hide']();
        return __self;
    },
    toast.prototype.button = function () {
        var __self = this, _o = __self.options;
        var html = '', args = _o.button;
        __self.callbacks = {};
        if (!__self.dom.button) {
            return this;
        }
        if (typeof args === 'string') {
            html = args;
        } else {
            $.each(args, function (i, val) {
                val.id = val.id || val.value;
                __self.callbacks[val.id] = val.callback;
                html +=
                  '<button'
                + ' type="button"'
                + ' data-id="' + val.id + '"'
                + ' class="' + (_o.className + val.id) + '"'
                + (val.disabled ? ' disabled' : '')
                + '>'
                + val.value
                + '</button>';
            });
        }
        if ($.trim(html) == "")
            __self.dom.button.hide();
        else
            __self.dom.button.html(html).show();
        return __self;
    },
    toast.prototype.zIndex = function () {
        var __self = this, _o = __self.options;
        var index = _o.zIndex++;
        __self.dom.wrap.css('zIndex', index);
        __self.dom.backdrop.css('zIndex', index - 1);
        _o.zIndex = index;
        return __self;
    },
    toast.prototype.time = function (second) {
        var __self = this, _o = __self.options;
        var cancel = _o.cancelValue, timer = __self._timer;
        timer && clearTimeout(timer);
        if (second) {
            __self._timer = setTimeout(function () {
                __self._click(cancel);
            }, 1000 * second);
        };
        return __self;
    },
    toast.prototype.focus = function () {
        var __self = this, _o = __self.options;
        return __self;
    },
    toast.prototype.show = function () {
        var __self = this, _o = __self.options;
        if (__self.destroyed) {
            return this;
        }
        __self.dom.wrap.css('position', 'absolute').show().addClass(_o.className + "show");
        if (_o.lock) __self.lock();
        __self.dom.backdrop.show();
        __self.open = true;
        return __self;
    },
    toast.prototype.lock = function () {
        var __self = this, _o = __self.options;
        var backdropCss = {
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            userSelect: 'none',
            opacity: 0.2,
            background: "#000"
        };
        backdropCss = $.extend(backdropCss, __self.options.css.lock);
        __self.dom.wrap.addClass(_o.className + 'lock');
        _o.zIndex = _o.zIndex + 2;
        __self.zIndex();

        var _isIE6 = !('minWidth' in $('html')[0].style);
        var _isFixed = !_isIE6;
        if (!_isFixed) {
            $.extend(backdropCss, {
                position: 'absolute',
                width: $(window).width() + 'px',
                height: $(document).height() + 'px'
            });
        }
        __self.dom.backdrop
            .css(backdropCss)
            .insertAfter(__self.dom.wrap)
            .on('focus', function () {
                __self.focus();
            });

    },
    toast.prototype.close = function () {
        var __self = this, _o = __self.options;
        if (!__self.destroyed && __self.open) {
            __self.dom.wrap.removeClass(_o.className + 'show');
            setTimeout(function () {
                __self.dom.wrap.hide();
                __self.dom.backdrop.hide();
                __self.remove();
                __self.open = false;
            }, 200);
        }
        return this;
    },
    toast.prototype.remove = function () {
        var __self = this, _o = __self.options;
        if (__self.destroyed) {
            return g;
        }
        if (__self.current === this)
            __self.current = null;
        __self.dom.wrap.remove();
        __self.dom.backdrop.remove();
        for (var i in __self) {
            delete this[i];
        }
        return this;
    },
    toast.prototype.position = function (target, pos) {
        var __self = this, _o = __self.options;
        target = target || $(window);
        pos = $.extend({}, { x: 0, y: 0, position: '50%' }, pos);
        var ww = target.width();
        var wh = target.height();
        var ow = __self.dom.wrap.width();
        var oh = __self.dom.wrap.height();
        var left = 0, top = 0;
        if (/^(\d+(%?)\s*){1,2}$/.test(pos.position)) {
            var items = pos.position.match(/\d+%?\s*/g);
            var _rel = {
                vertical: items[0],
                horizontal: items.length > 1 ? items[1] : items[0]
            }
            left = (_rel.horizontal.indexOf('%') > -1 ? (ww - ow) * parseFloat(_rel.horizontal) / 100 : _rel.horizontal) + target.offset().left + pos.x;
            top = (_rel.vertical.indexOf('%') > -1 ? (wh - oh) * parseFloat(_rel.vertical) / 100 : _rel.vertical) + target.offset().top + pos.y;
        }
        var style = __self.dom.wrap[0].style;
        style.left = Math.max(parseInt(left), 0) + 'px';
        style.top = Math.max(parseInt(top), 0) + 'px';
        return __self;
    }
    toast.prototype._center = function (width, height) {
        var __self = this, _o = __self.options;
        var $window = $(window);
        var $document = $(document);
        var fixed = __self.fixed;
        var dl = fixed ? 0 : $document.scrollLeft();
        var dt = fixed ? 0 : $document.scrollTop();
        var ww = $window.width();
        var wh = $window.height();
        var ow = width || __self.dom.wrap.width();
        var oh = height || __self.dom.wrap.height();
        var left = (ww - ow) / 2 + dl;
        var top = (wh - oh) * 382 / 1000 + dt;
        return {
            left: Math.max(parseInt(left), dl),
            top: Math.max(parseInt(top), dt)
        }

    },
    toast.prototype._trigger = function (id) {
        var __self = this, _o = __self.options;
        var fn = __self.callbacks[id];
        return typeof fn !== 'function' || fn.call(__self) !== false ?
            __self.close() : __self;
    },
    toast.prototype._click = function (name) {
        var __self = this, _o = __self.options;
        var fn = __self.callbacks[name];
        return typeof fn !== 'function' || fn.call(__self, window) !== false ?
            __self.close() : __self;
    },


    toast.top = function () {
        var top = win,
            test = function (name) {
                try {
                    var doc = window[name].document;
                } catch (e) {
                    return false;
                }
                return window[name].me.toast && doc.getElementsByTagName('frameset').length === 0;
            }
        if (test('top')) {
            top = window.top;
        } else if (test('parent')) {
            top = window.parent;
        };
        return top;
    }
    toast._through = function () {
        var __self = this, _o = __self.options;
        __self._frame();
        var api = new _topDialog(arguments[0]);
        return api;
    }
    toast._frame = function () {
        var __self = this, _o = __self.options;
        _top = __self.top();
        _topDialog = _top.me.toast;
    },
    toast.alert = function (content, callback) {
        var __self = this, _o = __self.options;
        return __self._through({
            title: '提示',
            addClass: 'alert',
            icon: 'alert',
            width: 440,
            lock: true,
            content: content,
            ok: callback || true
        });
    }
    toast.confirm = function (content, yes, no) {
        var __self = this, _o = __self.options;
        return __self._through({
            //title: '确认',
            icon: 'confirm',
            addClass: 'confirm',
            lock: true,
            show: false,
            css: {
                lock: { 'opacity': 0.2, 'background': '#fff' }
            },
            content: content,
            ok: function (here) {
                return yes.call(this, here);
            },
            cancel: function (here) {
                return no && no.call(this, here);
            }
        });
    };
    toast.tip = function (content, time) {
        var __self = this, _o = __self.options;
        return __self._through({
            icon: 'tip',
            addClass: 'tip',
            content: content,
            show: false,
            lock: true,
            css: {
                lock: { 'opacity': 0.2, 'background': '#fff' }
            },
            time: time || 2
        });
    }
    toast.open = function (url, options) {
        var __self = this, _o = __self.options;
        var $iframe = $('<iframe />')
                .attr({
                    src: url,
                    width: '100%',
                    height: '100%',
                    allowtransparency: 'yes',
                    frameborder: 'no',
                    scrolling: 'no'
                }).on('load', function () {

                });
        var config = {
            init: function (api) {
                $iframe.attr("name", api.getUid());
                api.dom.content.html('').append($iframe);
            }
        }
        $.extend(config, options);
        return __self._through(config);
    }
    toast.close = function () {
        var __self = this, _o = __self.options;
        var _api = __self.top().me.get(window.frameElement.name);
        _api.close();
    }
    toast.resize = function (width, height) {
        var __self = this, _o = __self.options;
        var _api = __self.top().me.get(window.frameElement.name);
        _api.setsize(width, height);
    }


    toast.defaults = {
        init: null,
        zIndex: 1024,
        lock: true,
        content: 'Loading...',
        title: '',
        show: true,
        button: null,
        ok: null,
        cancel: null,
        okValue: '确定',
        cancelValue: '取消',
        className: 'ui-me-',
        template: '<div class="ui-me-toast"><div class="ui-me-head"><div class="ui-me-title"></div><div class="ui-me-close"></div></div><div class="ui-me-content"></div><div class="ui-me-foot"><div class="ui-me-button"></div></div></div>',
        css: {
            lock: { 'opacity': 0.2, 'background': '#000' }
        }
    }
    me.toast = toast;
})(window.me = window.me || {}, window);


