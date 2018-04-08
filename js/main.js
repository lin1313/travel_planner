/**
 * Created by dell on 2016/10/9.
 */
//主页面交互动作
var markArr = [];//记录创建的marker
var type = 'txt/all.txt';//异步请求数据
var lastTime = "2016-10-17 08:30:00";//存储上次旅行的时间
$(function () {
    var item = 10;
    var category = $('.tripCategory').find('.category');
    var list = $('.tripList');
    var items = $(list).find('.tripItems .items');
    var btn = $(list).find('.pagesBtn');
    var objList = $(btn).find('.pagesItems');
    var left = $(btn).find('.prev');
    var right = $(btn).find('.next');
    var tools = $('.tools');
    var save = $(tools).find('.save');
    var del = $(tools).find('.del');
    var sent = $(tools).find('.sent');
    var savePopup = $('.savePopup');
    var cancel = $('#cancel');
    var confirmed = $('#confirmed');
    var hpBtn = $('.hidePopup');
    var hpBtnLeft = $('.hideLeftPopup');
    var currType = $('#currType');
    var allType = $('#allType');
    var len = 0;//记录marker数组的长度
    var t = new GetPages({listCount: item, pageCount: 6, times: 0, currentPage: 0, currentList: 0});
    //var lastTime = "2016-10-17 08:30:00";//存储上次旅行的时间
    var tripItems = $('.tripItems');

    //页面加载
    $.ajax({"url": type}).done(
        function (Info) {
            var info = JSON.parse(Info);
            var num = info.length;

            t.createTripList(num, items, info);
            t.createPageList(num, right, left, objList, right);
            setData(info, 0);
        }
    );

    $(category).each(function () {
        $(this).bind('click', function () {
            searchClick = false;
            var index = $(this).index();

            switch (index) {
                case 0:
                    type = 'txt/all.txt';
                    break;
                case 1:
                    type = 'txt/trip.txt';
                    break;
                case 2:
                    type = 'txt/hotel.txt';
                    break;
                case 3:
                    type = 'txt/traffic.txt';
                    break;
                case 4:
                    type = 'txt/food.txt';
                    break;
                case 5:
                    type = 'txt/shopping.txt';
                    break;
            }
            $.ajax({"url": type}).done(
                function (Info) {
                    var info = JSON.parse(Info);
                    var num = info.length;
                    t = new GetPages({listCount: item, pageCount: 6, times: 0, currentPage: 0, currentList: 0});

                    t.createTripList(num, items, info);
                    t.createPageList(num, right, left, objList, right);
                    setData(info, 0);
                });
            $(this).addClass('current').siblings().removeClass('current');
        });
    });

    //显示当前查询的项目
    $(currType).bind('click', function () {
        searchClick = false;
        $.ajax({"url": type}).done(
            function (Info) {
                var info = JSON.parse(Info);
                var num = 1;
                t = new GetPages({listCount: item, pageCount: 6, times: 0, currentPage: 0, currentList: 0});

                t.createTripList(num, items, info);
                t.createPageList(num, right, left, objList, right);
                setData(info, 0);
            });
        $(this).addClass('current');
        $(allType).removeClass('current');
    });

    //显示全部结果
    $(allType).bind('click', function () {
        searchClick = false;
        $.ajax({"url": type}).done(
            function (Info) {
                var info = JSON.parse(Info);
                var num = info.length;
                t = new GetPages({listCount: item, pageCount: 6, times: 0, currentPage: 0, currentList: 0});

                t.createTripList(num, items, info);
                t.createPageList(num, right, left, objList, right);
                setData(info, 0);
            });
        $(this).addClass('current');
        $(currType).removeClass('current');
    });

    //下一页
    $(right).bind('click', function (event) {
        event.stopPropagation();
        if(searchClick){
            var num = infoArr.length;

            t.goNext(num, items, infoArr, left, left, objList, right);
            var elem = $('.pagesItems');
            //算当前的数据
            var Num = Number($(elem).find('.current').html()) * 10  - 10;
            setData(infoArr, Num);
        }else{
            $.ajax({"url": type}).done(
                function (Info) {
                    var info = JSON.parse(Info);
                    var num = info.length;

                    t.goNext(num, items, info, left, left, objList, right);
                    var elem = $('.pagesItems');
                    //算当前的数据
                    var Num = Number($(elem).find('.current').html()) * 10  - 10;
                    setData(info, Num);
                });
        }
    });

    //上一页
    $(left).bind('click', function (event) {
        event.stopPropagation();
        if(searchClick){
            var num = infoArr.length;

            t.goPrev(num, items, infoArr, right, left, objList, left);
            var elem = $('.pagesItems');
            //算当前的数据
            var Num = Number($(elem).find('.current').html()) * 10 - 10;
            setData(infoArr, Num);
        }else{
            $.ajax({"url": type}).done(
                function (Info) {
                    var info = JSON.parse(Info);
                    var num = info.length;

                    t.goPrev(num, items, info, right, left, objList, left);
                    var elem = $('.pagesItems');
                    //算当前的数据
                    var Num = Number($(elem).find('.current').html()) * 10 - 10;
                    setData(info, Num);
                });
        }
    });

    //点击页数
    $(btn).bind('click', function (event) {
        if(searchClick){
            var num = infoArr.length;
            var elem = event.target;
            if($(elem).hasClass('li')){
                t.pageClick(num, elem, items, infoArr);
                //算当前的数据
                var Num = Number($(elem).html()) * 10 - 10;
                setData(infoArr, Num);
            }

        }else{
            $.ajax({"url": type}).done(
                function (Info) {
                    var info = JSON.parse(Info);
                    var num = info.length;

                    var elem = event.target;
                    if($(elem).hasClass('li')){
                        t.pageClick(num, elem, items, info);
                        //算当前的数据
                        var Num = Number($(elem).html()) * 10 - 10;
                        setData(info, Num);
                    }
                }
            );
        }
    });

    //隐藏弹窗
    $(hpBtn).bind('click', function () {
        hidePopup(list, hpBtn, 'right');
    });

    //隐藏弹窗
    $(hpBtnLeft).bind('click', function () {
        var obj = $('.mainLeftBox').find('.day_details').not('is-hidden');
        hidePopup(obj, hpBtnLeft, 'left');
    });

    //隐藏弹窗
    function hidePopup(obj1, obj2, direction) {
        var objWidth = $(obj1).width();
        var winWidth = $(document).width();

        if (direction == 'right') {
            if ($(obj1).is(":visible")) {
                $(obj1).animate({
                    "right": objWidth * -1
                }, function () {
                    $(obj1).css({"display": "none"});
                });
                $(obj2).animate({
                    "right": 0
                }).addClass('changBDC');
            } else {
                $(obj1).animate({
                    "right": 20
                }).css({"display": "block"});
                $(obj2).animate({
                    "right": 370
                }).removeClass('changBDC');
            }
        } else if (direction == 'left') {
            if ($(obj1).is(":visible")) {
                $(obj1).animate({
                    "left": objWidth * -1
                }, function () {
                    $(obj1).css({"display": "none"});
                });
                $(obj2).animate({
                    "left": 70
                }).addClass('changH');
            } else {
                $(obj1).animate({
                    "left": 20
                }).css({"display": "block"});
                $(obj2).animate({
                    "left": 489
                }).removeClass('changH');
            }
        }
    }

    //save button
    $(save).bind('click', function () {
        showSavePopup();
        $(this).addClass('toolsCurrent');
    });

    //取消行程保存
    $(cancel).bind('click', function () {
        closeSavePopup();
        $(save).removeClass('toolsCurrent')
    });

    //确认保存行程
    $(confirmed).bind('click', function () {
        closeSavePopup();
        $(save).removeClass('toolsCurrent')
    });

    //清空行程
    $(del).bind('click', function () {
        alert('是否要删除当前行程？');
    });

    //发送
    $(sent).bind('click', function () {
        alert('发送成功！');
    });

    //显示保存行程弹窗
    function showSavePopup() {
        $(savePopup).css({'display': 'block'})
    }

    //关闭保存行程弹窗
    function closeSavePopup() {
        $(savePopup).css({'display': 'none'})
    }

    $(document).bind('click', function (event) {
        var elem = event.target;
        var dds = $('.item').find('dd');
        $(dds).hide();
    });
});

//gaowy
$(function () {
    drag();
    daychange();
    droptrip();
    setTime();
    //给每一天设定默认出发时间
    $('.day_details').attr('beginTime', '2016-10-17 08:30:00');
})
function stopSlect(elem, flag) {
    if (flag) {
        $(elem).attr('unselectable', 'on').addClass('stopSlect').on('selectstart.s', function () {
            return false;
        });
    }
    else {
        $(elem).removeAttr('unselectable').removeClass('stopSlect').off('selectstart.s');
    }

}
function drag() {

    var flag = true, index;
    var myPlane = $('.mainLeftBox');
    var offset, poffset;
    var disX, disY, left, top, width, height, that, trips;
    var a = new Templete();
    var hidden = $(a.create_maps_addTrip_clone());//#my_trip_plane .my-trip-item-wrap
    var p;//找出滚动容器
    var pt;//容器的最大滚动高度
    var ph;//容器的高度
    var pdh;//容器的内容高度
    var sflag;//容器是否有滚动条
    var mint,maxt;
    myPlane.on('mousedown.d', '.detail-item-wrap', function (ev) {

        that = $(this);
        index = that.index();
        p=that.parents('.trip-detail-wrap');
        offset = that.parents('.trip-detail-list').offset();
        poffset = that.parents('.trip-detail-wrap').offset();
        disX = ev.pageX - $(this).offset().left - 50;
        disY = ev.pageY - $(this).offset().top;
        width = that.outerWidth();
        height = that.outerHeight();
        trips = that.parents('.trip-detail-list').find('.detail-item-wrap');

        ph= p.outerHeight();
        pdh=p[0].scrollHeight;
        pt=pdh-ph;
        sflag=pt==0?false:true;
        mint=poffset.top;
        maxt=mint+ph;
        stopSlect($('body'), true)
        that.find('.time-change').animate({height:'0px'});//gaowy
        that.find('.setTime').addClass('hide');//gaowy
        $(document).on('mousemove.m', function (ev) {
            ev.preventDefault();
            left = ev.pageX - poffset.left - disX;
            top = ev.pageY - poffset.top - disY;
            that.css({
                "position": "absolute",
                "left": left,
                "top": top,
                "width": width,
                "height": height,
                "z-index": 10
            })
            that.find('.traffic-item ').addClass('is-hidden');
            that.find('.time-line').addClass('is-hidden')
            if (flag) {
                that.before(hidden);
                that.find('.traffic-item').addClass('is-hidden');
                that.find('.time-wrap:odd').css('height', 'auto');
                flag = false;
            }
            trips.not(that).each(function (i, elem) {
                var mtop = ev.pageY - disY;
                var et = $(elem).offset().top;
                if (mtop >= et && mtop <= et + height / 2) {
                    $(elem).before(hidden);
                }
                else if (mtop > et + height / 2 && mtop <= et + height) {
                    $(elem).after(hidden);
                }
            })
            //处理滚动条
            if(sflag && ev.clientY > maxt )
            {
                if(p.scrollTop()<pt)
                {
                    var top=p.scrollTop()+10 > pt? pt:p.scrollTop()+10;
                    p.scrollTop(top);
                }
            }
            else if(sflag && ev.clientY < mint)
            {
                var top=p.scrollTop()-10 < 0? 0:p.scrollTop()-10
                p.scrollTop(top)
            }
        })
        $(document).on('mouseup.u', function (ev) {
            console.log('??')
            $(document).off('mousemove.m').off('mouseup.u');
            hidden.replaceWith(that);
            that.removeAttr('style').find('.traffic-item ').removeClass('is-hidden');
            that.find('.time-line').removeClass('is-hidden');
            that.find('.time-wrap:odd').css('height', '');
            flag = true;
            stopSlect($('body'), false);
            if (that.index() != index) {
                //清除附近搜索创建的marker
                for (var m = 0; m < nearbyMarkers.length; m++) {
                    nearbyMarkers[m].setMap(null);
                }

                locationArr.length = 0;//清空数组
                markArr.length = 0;//清空数组

                //重新获取经纬度链接
                var dayDetails = $('.day_details').not('.is-hidden');
                var daysLists = $(dayDetails).find('.trip-detail-list');
                var itemWrap = $(daysLists).find('.detail-item-wrap');
                var distance = $(itemWrap).find('.distance');
                var duration = $(itemWrap).find('.time_show');
                var lastTime = $(dayDetails).attr('begintime');//存储上次旅行的时间

                for (var i = 0; i < itemWrap.length; i++) {
                    var lat = Number($(itemWrap).eq(i).attr('lat'));
                    var lng = Number($(itemWrap).eq(i).attr('lng'));
                    var latLng = new google.maps.LatLng({lat: lat, lng: lng});
                    var img = $(itemWrap).eq(i).attr('img');
                    var title = $(itemWrap).eq(i).attr('title');
                    var Address = $(itemWrap).eq(i).attr('address');
                    locationArr.push(latLng);
                    markArr.push(title);
                    $('.popupBox').remove();
                    var overlay = new MyOverlay(map, {
                        lat: lat,
                        lng: lng,
                        latlng: latLng,
                        image: img,
                        name: title,
                        address: Address,
                        distance: 0,
                        time: 0,
                        Num: locationArr.length
                    });
                }

                if (locationArr.length > 1) {
                    var copyRoutArr = $.makeArray(locationArr);
                    var starLatLng = copyRoutArr.shift();
                    var endLatLng = copyRoutArr.pop();
                    getRoute(starLatLng, endLatLng, copyRoutArr, 'TRANSIT', distance, duration);
                }
                //更改时间
                setTimeout(function () {
                    var reg = /[^0-9]+/g;
                    var Index = $(this).index();
                    var c;
                    var d;
                    var durTime;
                    c = Number($(itemWrap).eq(0).attr('time'));
                    d = addTime(lastTime, c, 0);
                    $(itemWrap).eq(0).find('.time_start').html(d.startTime);
                    $(itemWrap).eq(0).find('.time_end').html(d.endTime);
                    lastTime = d.lastTime;

                    for (var i = 1; i < duration.length; i++) {
                        c = Number($(itemWrap).eq(i).attr('time'));
                        durTime = Number(($(daysLists).children().eq(i - 1).find('.time_show').html()).replace(reg, ''));

                        d = addTime(lastTime, c, durTime);
                        $(itemWrap).eq(i).find('.time_start').html(d.startTime);
                        $(itemWrap).eq(i).find('.time_end').html(d.endTime);
                        lastTime = d.lastTime;
                    }
                }, 1000);
            }
        })
    })
}
function daychange() {
    $('.day-details-header').on('click', '.day-btn', function (ev) {
        ev.stopPropagation();
        var that = $(this);
        var details = that.parents('.day_details');
        if (that.hasClass('pre-day-btn'))//前一天
        {
            var pre = details.prev();
            if (pre.length) {
                details.addClass('is-hidden')
                pre.removeClass('is-hidden')
            }
        }
        else {
            var next = details.next();
            if (next.length) {
                details.addClass('is-hidden')
                next.removeClass('is-hidden')
            }
        }
    })
}

//更改时间
function setTime() {
    $('.mainLeftBox').on('mousedown','.time-change',function(ev){ev.stopPropagation();})

    var obj;
    var that,timechange,timeend,tparent,endlast;
    var tripsL;

    //replaceTime();
    $('.mainLeftBox').on('mousedown.ddd', '.setTime', function (ev) {
        ev.stopPropagation();
        obj = $(this).parents('.detail-item-wrap');//gaowy
        timechange=obj.find('.time-change');
        timeend=obj.find('.time-wrap.end');
        that=$(this);
        tparent=$(this).parents('.trip-detail-list')
        endlast=tparent.children().last().find('.time-wrap.end');
        tripsL=tparent.children().length-1;
        if($(this).hasClass('hide'))
        {
        var starHour = obj.find('#starHour');//gaowy
        var endHour = obj.find('#endHour');//gaowy

        $('.time-change').not(timechange).animate({height:'0px'});
        $('.time-wrap.end').not(timeend).not(endlast).animate({height:'65px'});
        $('.setTime').not(that).addClass('hide');


        $(starHour).val(obj.find('.time_start').html());//gaowy
        $(endHour).val(obj.find('.time_end').html());
        obj.find('.time-change').animate({height:'100px'});
            if(obj.index()!=tripsL)
            {
                obj.find('.time-wrap').eq(1).animate({height:'165px'});
            }


        //hide('true');
        replaceTime(starHour,endHour);
            $(this).removeClass('hide')
        }
        else{
            obj.find('.time-change').animate({height:'0px'});
            if(obj.index()!=tripsL)
            {
                obj.find('.time-wrap').eq(1).animate({height:'65px'});
            }

            $(this).addClass('hide')
        }
    });

    $('.close').bind('click', function () {
        hide('false');
    });

    $('.mainLeftBox').on('click', '.save',function () {
        that.addClass('hide');//gaowy
        var reg = /[^0-9]+/g;
        var starHours = obj.find('#starHour');//gaowy
        var startTime = $(starHours).val();
        var endTime = obj.find('#endHour').val();
        console.log('1',startTime,'2',endTime);
        var s = startTime.replace(reg, '');
        var e = endTime.replace(reg, '');

        if (s.length < 1) {
            startTime = obj.find('.time_start').html();
        }
        if (e.length < 1) {
            endTime = obj.find('.time_end').html();
        }
        if (s.length < 1 && e.length < 1) {
            alert('请输入正确的时间');
            return
        }

        var sA = startTime.replace(reg, '');
        var eA = endTime.replace(reg, '');
        var sT = timeFormat(sA);
        var eT = timeFormat(eA);
        var c, endT;

        var d = Math.abs(eT - sT);
        var begintime = "2016-10-17" + ' ' + startTime + ':00';

        //如果更改第一个景点就更改当天的默认出发时间
        if (obj.index() == 0) {
            if (eT < sT) {
                alert('请输入正确的时间');
                return
            }
            //判断输入框的值是否为数字型
            if (s.length > 0 && e.length <= 0) {
                obj.find('.time_start').html(startTime);
                c = Number(obj.attr('time'));
                endT = addTime(begintime, c, 0);
                obj.find('.time_end').html(endT.endTime);
                endTime = endT.endTime;
            }
            if (e.length > 0 && s.length <= 0) {
                obj.find('.time_end').html(endTime);
            }
            if(s.length > 0 && e.length > 0){
                obj.find('.time_start').html(startTime);
                obj.find('.time_end').html(endTime);
            }
            obj.attr('time', d);
            obj.parents('.day_details').attr('begintime', begintime);
            hide('false');
        }
        else {
            var val = obj.prev().find('.time_end').html();
            var replaceVal = val.replace(reg, '');
            var v = timeFormat(replaceVal);

            //判断输入框的值是否为数字型
            if (s.length > 0 && e.length <= 0) {
                if (sT < v) {
                    alert('当前行程的时间与上一个行程的时间重叠，请输入正确的时间！');
                    return
                } else {
                    c = Number(obj.attr('time'));
                    endT = addTime(begintime, c, 0);
                    obj.find('.time_end').html(endT.endTime);
                    obj.find('.time_start').html(startTime);
                    obj.attr('time', d);
                    hide('false');
                    endTime = endT.endTime;
                }
            }
            if (e.length > 0 && s.length <= 0) {
                if (eT < v) {
                    alert('当前行程的时间与上一个行程的时间重叠，请输入正确的时间！');
                    return
                } else {
                    obj.find('.time_end').html(endTime);
                    obj.attr('time', d);
                    hide('false');
                }
            }
            if(s.length > 0 && e.length > 0){
                obj.find('.time_start').html(startTime);
                obj.find('.time_end').html(endTime);
                obj.attr('time', d);
            }
        }

        //更改所有时间
        //重新获取经纬度链接
        var dayDetails = $('.day_details').not('.is-hidden');
        var daysLists = $(dayDetails).find('.trip-detail-list');
        var itemWrap = $(daysLists).find('.detail-item-wrap');
        console.log(itemWrap);//gaowy
        var distance = $(itemWrap).find('.distance');
        var duration = $(itemWrap).find('.time_show');
        var lastTime = "2016-10-17" + ' ' + endTime + ':00';//存储上次旅行的时间

        setTimeout(function () {
            var reg = /[^0-9]+/g;
            var Index = obj.index();
            var c;
            var d;
            var durTime;
            c = ($(itemWrap).eq(0).attr('time')) * 60;
            d = addTime(lastTime, c, 0);

            for (var i = Index + 1; i < duration.length; i++) {
                c = Number($(itemWrap).eq(i).attr('time'));
                durTime = Number(($(daysLists).children().eq(i - 1).find('.time_show').html()).replace(reg, ''));

                d = addTime(lastTime, c, durTime);
                $(itemWrap).eq(i).find('.time_start').html(d.startTime);
                $(itemWrap).eq(i).find('.time_end').html(d.endTime);
                lastTime = d.lastTime;
            }
        }, 1000);
        obj.find('.time-change').animate({height:'0px'});//gaowy
        obj.find('.time-wrap').eq(1).animate({height:'65px'});//gaowy
    });

    //转换时间格式//转换成分钟
    function timeFormat(time) {
        var eT = 0;
        if (time[0] != 0) {
            eT = Number(time[0] + time[1]) * 60 + Number(time[2] + time[3]);
        } else {
            eT = Number(time[1]) * 60 + Number(time[2] + time[3]);
        }
        return eT;
    }


     $('.mainLeftBox').on('click', '.cancel',function () {
        // hide('false');
         that.addClass('hide');//gaowy
         obj.find('.time-change').animate({height:'0px'});//gaowy
         if(obj.index()!=tripsL)
         {
             obj.find('.time-wrap').eq(1).animate({height:'65px'});
         }
         obj.find('#starHour').off('focus').off('blur');
         obj.find('#endHour').off('focus').off('blur');
    });

    //隐藏
    function hide(type) {
        if (type == 'true') {
            $('.trafficInfo').show();
            $('#mark').show();
        } else {
            $('.trafficInfo').hide();
            $('#mark').hide();
        }
    }
}

//时间格式化
function replaceTime(starHour,endHour) {
    //var starHour = $('#starHour');
    //var endHour = $('#endHour');

    //$(starHour).val('请输时间');
    //$(endHour).val('请输时间');

    //选中
    //$(starHour).focus(function () {
    //    var reg = /[^0-9]+/g;
    //    var time = $(starHour).val();
    //    var a = time.replace(reg, '');
    //    //判断是否为汉字 如果为汉字则清空
    //    if (time.length > 0 && a == 0) {
    //        $(starHour).val('');
    //    }
    //});

    //$(endHour).focus(function () {
    //    var reg = /[^0-9]+/g;
    //    var time = $(endHour).val();
    //    var a = time.replace(reg, '');
    //    if (time.length > 0 && a == 0) {
    //        $(endHour).val('');
    //    }
    //});

    //失去焦点
    $(starHour).blur(function () {
        resetTime(starHour)
    });

    $(endHour).blur(function () {
        var reg = /[^0-9]+/g;
        var a = Number($(starHour).val().replace(reg, ''));
        var b = Number($(endHour).val().replace(reg, ''));
        if (a > b && b != 0) {
            alert('请输入正确的时间格式');
            $(endHour).val('');
        } else {
            resetTime(endHour)
        }
    });

    function resetTime(obj) {
        var reg = /[^0-9]+/g;
        var time = $(obj).val();
        var a = time.replace(reg, '');
        var str_ = '';

        if (time.length > 0 && a == 0) {
            alert('请输入正确的时间格式');
            $(obj).val('');
        } else if (time.length == 0) {
            return
        }
        if (a.length > 0) {
            var len = a.length;
            if (len > 4 || len < 3) {
                alert('请输入正确的时间格式');
                $(obj).val('');
            } else if (len == 3) {
                str_ = 0 + a[0] + ':' + a[1] + a[2];
                $(obj).val(str_);
            } else if (len == 4) {
                var b = a[0] + a[1];
                var c = a[2] + a[3];
                if (b > 23 || c > 59) {
                    alert('请输入正确的时间格式');
                    $(obj).val('');
                } else {
                    str_ = a[0] + a[1] + ':' + a[2] + a[3];
                    $(obj).val(str_);
                }
            }
        }
    }
}

//20161021
function droptrip() {
    $('.mainLeftBox').on('mousedown.dd', '.remove-btn', function (ev) {

        var that = $(this);
        ev.stopPropagation();
        var contain = that.parents('.day_details');
        that.parents('.detail-item-wrap').remove();
        //判断左边景点列表个数 如果为0就清除路线
        var len = $('.trip-detail-list').not('.is-hidden').find('.detail-item-wrap').length;
        if (len == 1) {
            if (LatLngLine) {
                LatLngLine.setMap(null);
            }
        }
        var num = contain.find('.trip-detail-list').children().length;
        contain.find('.pkg_num').html(num);
        //清除附近搜索创建的marker
        for (var m = 0; m < nearbyMarkers.length; m++) {
            nearbyMarkers[m].setMap(null);
        }
        locationArr.length = 0;//清空数组
        markArr.length = 0;
        $('.popupBox').remove();
        //重新获取经纬度链接
        var dayDetails = $('.day_details').not('.is-hidden');
        var daysLists = $(dayDetails).find('.trip-detail-list');
        var itemWrap = $(daysLists).find('.detail-item-wrap');
        var distance = $(itemWrap).find('.distance');
        var duration = $(itemWrap).find('.time_show');
        var lastTime = $(dayDetails).attr('begintime');//存储上次旅行的时间

        for (var i = 0; i < itemWrap.length; i++) {
            var lat = Number($(itemWrap).eq(i).attr('lat'));
            var lng = Number($(itemWrap).eq(i).attr('lng'));
            var latLng = new google.maps.LatLng({lat: lat, lng: lng});
            var img = $(itemWrap).eq(i).attr('img');
            var title = $(itemWrap).eq(i).attr('title');
            var Address = $(itemWrap).eq(i).attr('address');
            locationArr.push(latLng);
            markArr.push(title);
            var overlay = new MyOverlay(map, {
                lat: lat,
                lng: lng,
                latlng: latLng,
                image: img,
                name: title,
                address: Address,
                distance: 0,
                time: 0,
                Num: locationArr.length
            });
        }
        if (locationArr.length > 1) {
            var copyRoutArr = $.makeArray(locationArr);
            var starLatLng = copyRoutArr.shift();
            var endLatLng = copyRoutArr.pop();
            getRoute(starLatLng, endLatLng, copyRoutArr, 'TRANSIT', distance, duration);
        }
        //更改时间
        setTimeout(function () {
            var reg = /[^0-9]+/g;
            var Index = $(this).index();
            var c;
            var d;
            var durTime;
            c = Number($(itemWrap).eq(0).attr('time'));
            d = addTime(lastTime, c, 0);
            $(itemWrap).eq(0).find('.time_start').html(d.startTime);
            $(itemWrap).eq(0).find('.time_end').html(d.endTime);
            lastTime = d.lastTime;

            for (var i = 1; i < duration.length; i++) {
                c = Number($(itemWrap).eq(i).attr('time'));
                durTime = Number(($(daysLists).children().eq(i - 1).find('.time_show').html()).replace(reg, ''));

                d = addTime(lastTime, c, durTime);
                $(itemWrap).eq(i).find('.time_start').html(d.startTime);
                $(itemWrap).eq(i).find('.time_end').html(d.endTime);
                lastTime = d.lastTime;
            }
        }, 1000);

    })
}

//时间设置
function addTime(lastTimes, stopTime, dur) {
    var e = new Date(lastTimes.replace(/-/g, "/"));
    var time = new Date(lastTimes.replace(/-/g, "/"));
    var h = 0;
    var m = 0;
    var sh = 0;
    var sm = 0;

    e.setMinutes(e.getMinutes() + dur, e.getSeconds(), 0);
    time.setMinutes(time.getMinutes() + stopTime + dur, time.getSeconds(), 0);

    if (Number(e.getHours()) < 10) {
        sh = '0' + e.getHours();
    } else {
        sh = e.getHours();
    }
    if (Number(e.getMinutes()) < 10) {
        sm = '0' + e.getMinutes();
    } else {
        sm = e.getMinutes();
    }
    if (Number(time.getHours()) < 10) {
        h = '0' + time.getHours();
    } else {
        h = time.getHours();
    }
    if (Number(time.getMinutes()) < 10) {
        m = '0' + time.getMinutes();
    } else {
        m = time.getMinutes();
    }
    var startTime = sh + ':' + sm;
    var endTime = h + ':' + m;
    var saveTime = time.getFullYear() + '-' + time.getMonth() + '-' + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes();
    return {
        startTime: startTime,
        endTime: endTime,
        lastTime: saveTime
    }
}

$(function () {
    var timer = setInterval(clearlay, 500);

    function clearlay() {
        if ($.type(map) == 'object') {
            $('#overlay').addClass('is-hidden');
            clearInterval(timer);
        }
    }
});

//创建景点marker
function addTripLists(elem, replace) {

    var dayDetails, daysLists, index, items, lat, lng, latLng, img, title, Address, b, Item, typeVal, stopTime, len, beginTime;
    dayDetails = $('.day_details').not('.is-hidden');
    daysLists = $(dayDetails).find('.trip-detail-list');
    len = $(daysLists).children().length;
    b = new Templete();

    if ($(elem).hasClass('mapAddTrip')) {
        lat = Number($(elem).attr('lat'));
        lng = Number($(elem).attr('lng'));
        latLng = new google.maps.LatLng({lat: lat, lng: lng});
        img = $(elem).attr('img');
        title = $(elem).attr('title');
        Address = $(elem).attr('address');
        stopTime = 60;
        typeVal = $(elem).attr('typeVal');
    }
    else {
        index = $(elem).parents('.item').index();
        items = $('.tripItems').find('.item').eq(index);
        lat = Number(items.attr('lat'));
        lng = Number(items.attr('lng'));
        latLng = new google.maps.LatLng({lat: lat, lng: lng});
        img = items.attr('img');
        title = items.attr('title');
        Address = items.attr('address');
        Item = $(elem).parents('.item');
        typeVal = $(Item).find('.tripTypeVal').html();
        stopTime = Number($(Item).find('#times').html().replace(/[^0-9]+/g, '')) * 6;
    }

    for (var i = 0; i < len; i++) {
        if (title == markArr[i]) {
            $('.cloneTrip').remove();
            alert('您已添加该景点！');
            return
        }
    }

    //创建景点列表以及计算时间
    var div = $(b.create_maps_addTrip(0, 0, img, title, typeVal, 0, 0));
    if (replace == 'true') {
        $('.cloneTrip').replaceWith(div);
    } else {
        $(daysLists).append(div);
    }
    var listLen = $(daysLists).find('.detail-item-wrap').length;
    $(dayDetails).find('.pkg_num').html(listLen);
    $(div).attr('lat', lat).attr('lng', lng).attr('title', title).attr('address', Address).attr('img', img).attr('time', stopTime);

    //清除附近搜索创建的marker
    for (var m = 0; m < nearbyMarkers.length; m++) {
        nearbyMarkers[m].setMap(null);
    }

    locationArr.length = 0;//清空数组
    markArr.length = 0;//清空数组
    $('.popupBox').remove();

    //重新获取经纬度链接
    var dayDetailss = $('.day_details').not('.is-hidden');
    var daysListss = $(dayDetailss).find('.trip-detail-list');
    var itemWrap = $(daysListss).find('.detail-item-wrap');
    var distance = $(itemWrap).find('.distance');
    var duration = $(itemWrap).find('.time_show');
    var lastTime = $(dayDetailss).attr('begintime');//存储上次旅行的时间

    for (var j = 0; j < itemWrap.length; j++) {
        var Lat = Number($(itemWrap).eq(j).attr('lat'));
        var Lng = Number($(itemWrap).eq(j).attr('lng'));
        var LatLng = new google.maps.LatLng({lat: Lat, lng: Lng});
        var Img = $(itemWrap).eq(j).attr('img');
        var Title = $(itemWrap).eq(j).attr('title');
        var address = $(itemWrap).eq(j).attr('address');
        markArr.push(Title);
        locationArr.push(LatLng);
        var overlay = new MyOverlay(map, {
            lat: Lat,
            lng: Lng,
            latlng: LatLng,
            image: Img,
            name: Title,
            address: address,
            distance: 0,
            time: 0,
            Num: locationArr.length
        });
    }

    if (locationArr.length > 1) {
        var copyRoutArr = $.makeArray(locationArr);
        var starLatLng = copyRoutArr.shift();
        var endLatLng = copyRoutArr.pop();
        getRoute(starLatLng, endLatLng, copyRoutArr, 'TRANSIT', distance, duration);
    }
    //更改时间
    setTimeout(function () {
        var reg = /[^0-9]+/g;
        var Index = $(this).index();
        var c;
        var d;
        var durTime;
        c = Number($(itemWrap).eq(0).attr('time'));
        d = addTime(lastTime, c, 0);
        $(itemWrap).eq(0).find('.time_start').html(d.startTime);
        $(itemWrap).eq(0).find('.time_end').html(d.endTime);
        lastTime = d.lastTime;

        for (var i = 1; i < duration.length; i++) {
            c = Number($(itemWrap).eq(i).attr('time'));
            durTime = Number(($(daysLists).children().eq(i - 1).find('.time_show').html()).replace(reg, ''));

            d = addTime(lastTime, c, durTime);
            $(itemWrap).eq(i).find('.time_start').html(d.startTime);
            $(itemWrap).eq(i).find('.time_end').html(d.endTime);
            lastTime = d.lastTime;
        }
    }, 1000);

    ////重置中心点和缩放
    //map.setCenter(latLng);
    //map.setOptions({zoom: 17});
    setMapBounds(locationArr);
}

//选择旅游类型
function chooseTripType(elem) {
    var dds = $('.item').find('dd');

    if ($(elem).hasClass('tripTypeBtn')) {
        var dl = $(elem).siblings('dl');
        var dt = $(dl).find('dt');
        var dd = $(dl).find('dd');
        $(dds).hide();
        $(dd).show();
    } else {
        $(dds).hide();
    }
}

//dd点击事件
function clickDD(elem) {
    var dt = $(elem).siblings('dt');
    var dd = $(elem).parent().children('dd');
    $(dd).each(function () {
        $(this).bind('click', function () {
            $(dt).html($(this).text());
            $(dd).hide();
        });
    });
}

//减少停留时间
function minusStopTime(elem) {
    var minusTime = $(elem).siblings('p').find('#times');
    var val = Number($(minusTime).html());
    var minusNum = 0;
    if (val > 0.5) {
        minusNum = val - 0.5;
    } else {
        minusNum = val;
    }
    var addT = $(minusTime).html().replace(/[1-9][0-9]*/g, '');

    //当时间等于整数时加上.0
    if (addT.length == 1) {
        minusNum = minusNum + '.0';
    }
    $(minusTime).html(minusNum);
}

//增加停留时间
function addStopTime(elem) {
    var setTime = $(elem).siblings('p').find('#times');
    var num = Number($(setTime).html()) + 0.5;
    var addT = $(setTime).html().replace(/[1-9][0-9]*/g, '');

    //当时间等于整数时加上.0
    if (addT.length == 1 || $(setTime).html() == '0.5') {
        num = num + '.0';
    }

    $(setTime).html(num);
}

//添加数据
function setData(info, num) {
    var items = $('.items');
    var item = $(items).find('.item');
    var len = $(item).length;
    var infoLen = 0;

    for (var i = 0; i < len; i++) {
        $(item).eq(i).attr('lat', info[i + num].lat).attr('lng', info[i + num].lng).attr('title', info[i + num].name).attr('address', info[i + num].address).attr('img', info[i + num].url);
    }
}

//重置边界以显示所有的marker
function setMapBounds(markers) {
    var i = markers.length;
    var bounds = new google.maps.LatLngBounds();//获取地理坐标
    while (i--) {
        bounds.extend(markers[i]);//扩展边界范围以包含指定的点
    }
    map.fitBounds(bounds);//重置边界
}

$(function(){
    var obj,next,index,ulImg;
    var pelem = $('.tripDetails');
    var flag = false;
    var smallImgs;
    $('.tripDetails').on('click', '.bt-left', function (ev) {

        obj=pelem.find('.nowLi') ;
        ulImg=pelem.find('.ulImg') ;
        if (ulImg.children().length <= 1 || flag) { return; }
        flag = !flag;
        next = obj.prev();
        next = next.length > 0 ? next : ulImg.children().last();
        next.css({display:"block",left:-373}).animate({left:0},500,function(){$(this).addClass('nowLi')})
        obj.animate({ left: 373 }, 500, function () { $(this).css({ 'display': 'none' }).removeClass('nowLi'); flag = !flag; })
        smallimg(next.index())
    })

    $('.tripDetails').on('click', '.bt-right', function (ev) {

        obj=pelem.find('.nowLi') ;
        ulImg=pelem.find('.ulImg') ;
        if (ulImg.children().length <= 1 || flag) { return; }
        flag = !flag;
        next = obj.next();
        next = next.length > 0 ? next : ulImg.children().first();
        next.css({display:"block",left:373}).animate({left:0},500,function(){$(this).addClass('nowLi')})
        obj.animate({ left: -373 }, 500, function () { $(this).css({ 'display': 'none' }).removeClass('nowLi'); flag = !flag; });
        smallimg(next.index())
    })
    function smallimg(index)
    {
        smallImgs = $('.trip-imgs-samll').find('li');
        smallImgs.css({ outline: 0 }).eq(index).css({ outline: '1px red solid' });
    }
})
//景点介绍相关操作
$(function(){
    //时间减少
    $('.tripDetails').on('click','.minus',function(){
        minusStopTime(this);
    })
    //时间增加
    $('.tripDetails').on('click','.add',function(){
        addStopTime(this);
    })
    //关闭按钮
    $('.tripDetails').on('click','.btClose',function(){
        $(this).parents('.tripDetails').css({"display":"none"});
        $('#mark').css({"display":"none"});
    })
    //玩法介绍
    $('.tripDetails').on('click','.event-detail-btn',function(){
        var parent=$(this).parents('li');
        if($(this).hasClass('open'))
        {

            $(this).removeClass('open');
            parent.find('.detail-table ').slideUp();
        }
        else
        {
            $(this).addClass('open');
            parent.find('.detail-table ').slideDown();
        }

    })
    //添加到行程
    $('.tripDetails').on('click','.fa-plus',function(){
        var li=$(this).parents('li');
        $(tripElem).find('dt').html(li.find('.event-detail-btn').html());
        $(tripElem).find('#times').html(li.find('#times').html());

        addTripLists(lovebt,'false');
        $(this).parents('.tripDetails').css({"display":"none"});
        $('#mark').css({"display":"none"});
    })
})