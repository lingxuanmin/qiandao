//日历插件
(function (me, win) {
    var Calendar = function (id, options) {
        var _html = "<table><thead><tr class='calendar-head'><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody></tbody></table>";
        $(id).append(_html);
        this.domTbody = $(id).find("tbody");
        this.options = options || { date: new Date() }
        var a = new me.date(options.date);
        this.run(a.grids);
    }
    var __renderCell = function (col, cell) {
        var g = this;
        var value = cell.value ? cell.value : cell.name;
        var content = "";
        if (col.render) {
            content = col.render.call(g, cell);
        } else {
            content = value;
        }
        return content;
    }
    Calendar.prototype.run = function (grid) {

        var _html = "", p = this.options;
        for (var i = 0; i < grid.length; i++) {
            _html += "<tr>";
            for (var j = 0; j < grid[i].length; j++) {
                _html += "<td>" +
                  __renderCell(p, grid[i][j]);
                + "</td>";
            }
            _html += "</tr>";
        }
        this.domTbody.html(_html);
    }
    Calendar.prototype.change = function (date) {
        var a = new me.date(date);
        this.run(a.grids);
    }
    me.Calendar = Calendar;
})(window.me = window.me || {}, window);



//签到打卡日历
var _d;
//打卡数据构造
var madeJson = function () {
    var items = [{ day: 1, content: '10云钻', linkUrl: "www.suning.com", linkName: "填写收货人信息" }, { day: 10, content: '10云钻', linkUrl: "www.suning.com", linkName: "填写收货人信息" }, { day: 21, content: '10云钻', linkUrl: "www.suning.com", linkName: "填写收货人信息" }];
    var data = {};
    for (var item in items) {
        data[items[item].day] = items[item];
    }
    return data;
};

//月份下拉框事件
var selectMonth = $(".sign-month-select");
selectMonth.change(function () {
    //获取选中的月份
    var year = $(this).find("option:selected").attr("year"),
		month = $(this).find("option:selected").attr("month");
    //刷新页面
    var datas = madeJson();
    //切换时间
    var date = new Date(year, parseInt(month) - 1, 1);
    //console.log(date);
    _d.change(date);
});
//页面加载执行
$(function () {
    //月份下拉框初始化
    var selBox = $(".sign-month-select"),
    	date = new Date(),
    	year = date.getFullYear(),
    	month = date.getMonth() + 1;
    for (var i = 0; i < 6; i++) {
        var option;
        if (i == 0) {
            option = "<option year='" + year + "' month='" + month + "' selected='selected'>" + month + "月份打卡记录</option>";
        } else {
            if ((month - i) == 0) {
                month = 12 + i;
                year = year - 1;
            }
            option = "<option year='" + year + "' month='" + (month - i) + "'>" + (month - i) + "月份打卡记录</option>"
        }
        selBox.append(option);
    }

    //日历
    var datas = madeJson();
    _d = new me.Calendar("#dataPicker", {
        date: new Date(), //切换时间
        //td填充
        render: function (row) {
            var date = "<span class='c-date'>" + row.value + "</span>",
            	signedDate = "<span class='c-date c-date-signed'>" + row.value + "</span>";
            if (row.state == 0) {
                if (datas[row.name]) {
                    return "<div class='m'>" + signedDate + "<p class='award-content'>" + datas[row.name].content + "</p><a href='" + datas[row.name].linkUrl + "' class='c-link'>" + datas[row.name].linkName + "</a></div>";
                } else {
                    return "<div class='m'>" + date + "</div>";
                }

            } else if (row.state == -1) {
                return "<div class='m m-pre'><span class='c-date'>" + row.value + "</span></div>";
            } else {
                return "<div class='m m-next'><span class='c-date'>" + row.value + "</span></div>";
            }
        }
    });
});