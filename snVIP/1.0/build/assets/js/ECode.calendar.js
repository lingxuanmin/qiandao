/**
 * Created by JetBrains WebStorm.
 * User: weiyouzhi
 * Date: 12-9-3
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
        var ECode = ECode||{};
        ECode.calendar = function(options){
            var def = {
                inputBox:null,//绑定的元素的id
                isSelect:false,//是否以下拉框显示(此项如果启用count会自动转为1)
                showbox:null,//显示日期的dom
                range:{mindate:new Date(),maxdate:"2020-12-31"},//限制可选日期
                count:1,//日历个数(如果isSelect为true此项无法设置只能为1，此项设置大于1的数字时时间轴自动消失);
                startdate:null,//出发日期
                flag:true,//是否标记选中日期前的日期
                pos:{right:0,top:0},//位置微调
                isWeek:true,//是否显示星期
                isTime:false,//是否显示时间轴
                startTime:[],//起始时间
                selectRange:{min:1971,max:2020},
                callback:function(){//回调函数
                }
            };
            var _dateName = {
                "today":"\u4eca\u5929",
                "yuandan":"\u5143\u65e6",
                "chuxi":"\u9664\u5915",
                "chunjie":"\u6625\u8282",
                "yuanxiao":"\u5143\u5bb5\u8282",
                "qingming":"\u6e05\u660e",
                "wuyi":"\u52b3\u52a8\u8282",
                "duanwu":"\u7aef\u5348\u8282",
                "zhongqiu":"\u4e2d\u79cb\u8282",
                "guoqing":"\u56fd\u5e86\u8282"
            };
            var _holidays = {//2012-2020所有节日
                today: [formatStrDate(new Date())],
                yuandan: ["2012-01-01", "2013-01-01", "2014-01-01", "2015-01-01", "2016-01-01", "2017-01-01", "2018-01-01", "2019-01-01", "2020-01-01"],
                chuxi: ["2012-01-22", "2013-02-09", "2014-01-30", "2015-02-18", "2016-02-07", "2017-01-27", "2018-02-15", "2019-02-04", "2020-01-24"],
                chunjie: ["2012-01-23", "2013-02-10", "2014-01-31", "2015-02-19", "2016-02-08", "2017-01-28", "2018-02-16", "2019-02-05", "2020-01-25"],
                yuanxiao: ["2012-02-06", "2013-02-24", "2014-2-14", "2015-03-05", "2016-02-22", "2017-02-11", "2018-03-02", "2019-02-19", "2020-02-8"],
                qingming: ["2012-04-04", "2013-04-04", "2014-04-05", "2015-04-05", "2016-04-04", "2017-04-04", "2018-04-05", "2019-04-05", "2020-04-04"],
                wuyi: ["2012-05-01", "2013-05-01", "2014-05-01", "2015-05-01", "2016-05-01", "2017-05-01", "2018-05-01", "2019-05-01", "2020-05-01"],
                duanwu: ["2012-06-23", "2013-06-12", "2014-06-02", "2015-06-20", "2016-06-09", "2017-05-30", "2018-06-18", "2019-06-07", "2020-06-25"],
                zhongqiu: ["2012-09-30", "2013-09-19", "2014-09-08", "2015-09-27", "2016-09-15", "2017-10-04", "2018-09-24", "2019-09-13", "2020-10-01"],
                guoqing: ["2012-10-01", "2013-10-01", "2014-10-01", "2015-10-01", "2016-10-01", "2017-10-01", "2018-10-01", "2019-10-01", "2020-10-01"]
            };
            function formatNum(num){//补0
                return num.toString().replace(/^(\d)$/, "0$1");
            };
            function delzero(num){
                return num.charAt(0)=="0"?num.substring(1,2):num;
            }
            function formatStrDate(vArg){//格式化日期
               switch(typeof vArg) {
                  case "string":
                     vArg = vArg.split(/-|\//g);
                     return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
                     break;
                  case "object":
                     return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
                     break;
		        }
            };
            function formatIntDate(sDate) {//转换成数字
	 	        return formatStrDate(sDate).replace(/-|\//g, "")
	        }
            if (arguments.length > 0 && typeof(arguments[0]) == 'object') {
		        $.extend(def, options);
	        } else {
		        return false;
	        }
            var input = $(def.inputBox);
            var showbox = def.showbox;
            var callfn = def.callback;
            var startdate = def.startdate;
            var isWeek = def.isWeek;
            var isTime = def.isTime;
            var starttime = def.startTime;
            var _min = def.selectRange.min;
            var _max = def.selectRange.max;
            var calendarfn = {
                init:function(){//初始化弹出框事件绑定
                    var that = this;
                    input.bind("click",function(e){
                        var val;
                        if(showbox==null){
                            $(this)[0].tagName.toUpperCase()==="INPUT"?val=$(this).val():val=$(this).text();
                        }else{
                            $(showbox)[0].tagName.toUpperCase()==="INPUT"?val=$(showbox).val():val=$(showbox).text();
                        }
                        e.stopPropagation();
                        $(".calendar").remove();
                        that.createContainer();
                        that._creade();
                        if(startdate!==null){
                            var sdate = startdate.split(/-|\//g);
                            that.render(new Date(sdate[0],sdate[1]-1,sdate[2]))
                        }
                        else if(new RegExp(/^\d{4}(\-|\/)\d{2}\1\d{2}$/).test(val)){
                            var odate = val.split(/-|\//g);
                            that.render(new Date(odate[0],odate[1]-1,odate[2]))
                        }else{
                            that.render(new Date())
                        }
                    })
                },
                _creade:function(){//创建日历外部框架
                    var aTmp = [],aTmpt=[],close='<span class="cal-close">close</span>',htmlp = '<span class="cal-prev">prev</span>',htmln='<span class="cal-next">next</span>';
                    this.dateWarp = $("<div></div>");
                    this.dateWarp.attr("class","calendar");
                    this.count = def.count;
                    if(def.isSelect){
                        this.count=1;
                    }
                    for(i = this.count; i--;) aTmp = aTmp.concat(this._template);
                    aTmpt = aTmpt.concat(this.timeTemp);
                    if(this.count>1){
                        def.isTime=false;
                    }
                    this.dateWarp.append($(htmlp+close+aTmp.join('')+htmln+(def.isTime&&aTmpt.join(''))))
                    this.container.append(this.dateWarp);
                    var ie6  = !!window.ActiveXObject && !window.XMLHttpRequest;
                    if(ie6) this.dateWarp.append($(this.createIframe()));
                },
                render:function(date){//传递多个日历参数
                    var date = date,
                        aCal = this.container.find(".cal-container"),
                        year, month,i,len;
                        year  = date.getFullYear();
			            month = date.getMonth() + 1;
                        this.year = year;
		                this.month = month;
                        for(i = 0, len = aCal.length; i < len; i++) {
                            year += (month + (i ? 1 : 0)) > 12 ? 1 : 0;
                            month = (month + (i ? 1 : 0)) % 12 || 12;
                            this.drawDate(aCal.eq(i), {year: year, month: month})
		                }
                    def.isSelect?this.selectChange():this.btnEvent();
                },
                _template :[//日历框架
                    '<div class="cal-container">',
                    '<dl>',
                    '<dt class="title-date">',
                    '</dt>',
                    '<dt><strong>日</strong></dt>',
                    '<dt>一</dt>',
                    '<dt>二</dt>',
                    '<dt>三</dt>',
                    '<dt>四</dt>',
                    '<dt>五</dt>',
                    '<dt><strong>六</strong></dt>',
                    '<dd></dd>',
                    '</dl>',
                    '</div>'],
                timeTemp:[
                    '<div class="calendar-time">',
                    '<div class="time-title">',
                    '时间 <strong><em class="hour"></em>:<em class="minute"></em></strong>',
                    '</div>',
                    '<div class="plan" id="plan-h">',
                    '<span>时</span><div class="barM"><div class="bar"></div></div>',
                    '</div>',
                    '<div class="plan" id="plan-m">',
                    '<span>分</span><div class="barM"><div class="bar"></div></div>',
                    '</div>',
                    '</div>'
                ],
                createContainer:function(){//创建日历最外层div
                    var odiv = $('#'+ input.attr("id") + '-date');
                    if(!!odiv) odiv.remove();
                    var inputPos = input.offset();
                    var container = this.container = $("<div></div>");
                    container.attr("id",input.attr("id")+"-date")
                    container.css({"position":"absolute","float":"left","zIndex":8002,"left":inputPos.left-def.pos.right,"top":inputPos.top+input.outerHeight()+def.pos.top});
                    container.bind("click",function(e){
                        e.stopPropagation();
                    })
                    $("body").append(container);
                },
                drawDate:function(oCal,odate){//绘制日历
                    var dateWarp, titleDate, dd, year, month, date, days, weekStart,i,l,ddHtml=[],arr=[],oA,sV,iCur;
                    var oFarg = document.createDocumentFragment();
                    year = odate.year;
                    month = odate.month;
                    dateWarp = this.dateWarp;
                    this.titleDate = titleDate = oCal.find(".title-date");
                    if(def.isSelect){
                        var selectHtmls = [];
                        selectHtmls.push('<select>');
                        for(var i = _max;i>_min;i--)i!=this.year?selectHtmls.push('<option value="'+i+'">'+i+'</option> '):selectHtmls.push('<option value="'+i+'" selected>'+i+'</option> ');
                        selectHtmls.push('</select>');
                        selectHtmls.push(' <b>年</b> ');
                        selectHtmls.push('<select>');
                        for(i = 1;i<13;i++)i!=this.month?selectHtmls.push('<option value ="'+i+'">'+i+'</option>'):selectHtmls.push('<option value ="'+i+'" selected>'+i+'</option>');
                        selectHtmls.push('</select>');
                        selectHtmls.push(' <b>月</b> ');
                        titleDate.html($(selectHtmls.join('')));
                        $(".cal-prev").remove();
                        $(".cal-next").remove();
                        this.dateWarp.css("padding","0 0 15px");
                    }else{
                        titleDate.html(year + '年' + month + '月');
                    }
                    this.dd = dd = oCal.find("dd");
                    days = new Date(year, month, 0).getDate();
                    weekStart = new Date(year, month-1,1).getDay();
                    for (i = 0; i < weekStart; i++)arr.push(0);
                    for(i=1;i<=days;i++)arr.push(i);
                    while(arr.length){
                        for(i=0;i<arr.length;i++){
                            if(arr.length){
                                oA = document.createElement("a");
                                sV = arr.shift();
                                if(!sV){
                                    oA.className="disabled";
                                    oA.innerHTML="&nbsp;";
                                }else{
                                    oA.href	= "javascript:;";
						            oA.innerHTML	= sV;
                                    oA["data-date"] = (year+"-"+formatNum(month)+"-"+formatNum(sV));
                                    if(oA["data-date"]==startdate){
                                        oA.className="startdate";
                                    };
                                    iCur = formatIntDate(oA["data-date"]);
                                }
                                if(def.range.mindate){
                                    iCur<formatIntDate(formatStrDate(def.range.mindate))&&(oA.className="disabled");
                                }
                                if(def.range.maxdate){
                                    iCur>formatIntDate(formatStrDate(def.range.maxdate))&&(oA.className="disabled");
                                }
                                if(def.flag){
                                    if(startdate!==null){
                                        iCur>formatIntDate(startdate)&&oA.className!=="disabled"&&(oA.className="hover");
                                    }
                                }
                                for(var className in _dateName){
                                    if(oA.className=="disabled")continue;
                                    if(new RegExp(oA["data-date"]).test(_holidays[className].join())){
                                        oA.className = className;
                                        oA.innerHTML = "<span>"+ oA.innerHTML.replace(/<[^>]+>/,"") +"</span>"
                                    }
                                }
                                oFarg.appendChild(oA);
                            }
                        }
                    }
                    dd.html($(oFarg));
                    this.removeDate();
                    this.container.html(dateWarp);
                    this.linkOn();
                    this.outClick();
                    this.eventClose();
                    if(def.isTime){
                        this.dragTime("#plan-h","hour");
                        this.dragTime("#plan-m","min");
                    }
                },
                dragTime:function(id,diff){//时间轴功能
                    var today=new Date(),h=today.getHours(),m=today.getMinutes();
                    var _id = $(id);
                    var unitH;
                    var diffs = diff;
                    var _handle = _id.find(".bar");
                    var oBarM = _id.find(".barM");
                    var maxL=oBarM.outerWidth()-_handle.outerWidth();
                    var disX=0;
                    diffs=="hour"?unitH = Math.ceil(maxL/23):unitH = parseFloat(maxL/59).toFixed(2);
                    var em_hour = $(".time-title").find(".hour");
                    var em_minute = $(".time-title").find(".minute");
                    if(starttime.length>1){
                        em_hour.text(starttime[0]);
                        em_minute.text(starttime[1]);
                    }else{
                        em_hour.text(formatNum(h));
                        em_minute.text(formatNum(m));
                    }
                    var inithour = parseInt(diffs=="hour"?delzero(em_hour.text()):delzero(em_minute.text()));
                    _handle.css("left",inithour*unitH);
                    _handle.click(function(e){
                        e.stopPropagation();
                    });
                    _handle.bind("mousedown",function(e){
                        var that = this;
                        disX = e.pageX-_handle.position().left;
                        $(document).bind("mousemove",function(e){
                            var iL=e.pageX-disX;
                            iL <= 0 && (iL = 0);
                            iL >= maxL && (iL = maxL);
                            _handle.css("left",iL);
                            diffs=="hour"?em_hour.text(formatNum(Math.ceil(iL/unitH))):em_minute.text(formatNum(Math.ceil(iL/unitH)));
                            return false
                        })
                        $(document).bind("mouseup",function(){
                            $(document).unbind("mousemove").unbind("mouseup");
                        });
                        return false;
                    })
                },
                createIframe:function(){//为兼容IE6创建框架
                    var myIframe =  document.createElement('iframe');
                    myIframe.src = 'about:blank';
                    myIframe.style.position = 'absolute';
                    myIframe.style.zIndex = -1;
                    myIframe.style.left = '-1px';
                    myIframe.style.top = 0;
                    myIframe.style.border = 0;
                    myIframe.style.filter = 'alpha(opacity= 0 )';
                    myIframe.style.width = this.container.width() + 'px';
                    myIframe.style.height = this.container.height() + 'px';
                    return myIframe;
                },
                removeDate:function(){//移除日历
                    var odiv = this.container.find(".calendar");
                    if(!!odiv) this.container.empty();
                },
                btnEvent:function(){//点击月份，点击年份事件
                    var prevmonth = this.container.find(".cal-prev"),nextmonth = this.container.find(".cal-next"),that = this;
                    prevmonth.click(function(){
                        var idate = new Date(that.year, that.month - 2,1);
                        that.render(idate);
                    });
                    nextmonth.click(function(){
                        var idate = new Date(that.year , that.month, 1);
                        that.render(idate);
                    })
                },
                selectChange:function(){//下拉框事件
                    var yearSelect,monthSelect,that = this;
                    yearSelect = this.container.find(".cal-container").find("select").eq(0);
                    monthSelect = this.container.find(".cal-container").find("select").eq(1);
                    yearSelect.change(function(){
                        var year = yearSelect.val();
                        var month = monthSelect.val();
                        that.render(new Date(year, month-1));
                    });
                    monthSelect.change(function(){
                        var year = yearSelect.val();
                        var month = monthSelect.val();
                        that.render(new Date(year, month-1));
                    })
                },
                linkOn:function(){//每个日期点击事件
                    var links = this.dateWarp.find("a").not(".disabled"),that=this;
                    links.each(function(a){
                        $(this).click(function(){
                            var hour = $(".time-title").find(".hour").text();
                            var min = $(".time-title").find(".minute").text();
                            var aDate = $(this)[0]["data-date"].split(/-|\//g);
                            var oDate = new Date(aDate[0],aDate[1]-1,aDate[2]);
                            var weeks = oDate.getDay();
                            switch(weeks){
                                case 1:
                                    weeks = "星期一";break;
                                case 2:
                                    weeks = "星期二";break;
                                case 3:
                                    weeks = "星期三";break;
                                case 4:
                                    weeks = "星期四";break;
                                case 5:
                                    weeks = "星期五";break;
                                case 6:
                                    weeks = "星期六";break;
                                case 0:
                                    weeks = "星期日";break;
                                default:
                                    break;
                            };
                            if(showbox==null){
                                input[0].tagName.toUpperCase()==="INPUT"?input.val($(this)[0]["data-date"]+" "+(isWeek?weeks:(isTime?hour+':'+min:''))):input.text($(this)[0]["data-date"]+" "+(isWeek?weeks:(isTime?hour+':'+min:'')))
                            }else{
                                $(showbox)[0].tagName.toUpperCase()==="INPUT"?$(showbox).val($(this)[0]["data-date"]+" "+(isWeek?weeks:(isTime?hour+':'+min:''))):$(showbox).text($(this)[0]["data-date"]+" "+(isWeek?weeks:(isTime?hour+':'+min:'')));
                            }
                            startdate = $(this)[0]["data-date"];
                            starttime = [hour,min]
                            that.removeDate();
                            if(callfn){
                                callfn();
                            }
                        })
                    })
                },
                eventClose:function(){
                    var that = this;
                    $(".cal-close").bind("click",function(){
                        that.removeDate();
                    });
                },
                outClick:function(){//在外面关闭日历
                    var that = this;
                    $(document).bind("click",function(){
                        that.removeDate();
                    })
                }
            }
            calendarfn.init();
        }