/**
 * Created by dell on 2016/10/13.
 */
//天数拖拽
(function () {
    var dd = null;
    var obj = null;
    var li = document.querySelectorAll('#plannerDays li');
    var plannerDays = $('#plannerDays');
    Details = $('.mainLeftBox').find('.day_details');
    var plannerDay = document.getElementById('plannerDays');
    plannerDay.addEventListener('dragstart', handleDragStart, false);
    plannerDay.addEventListener('dragenter', handleEnter, false);
    plannerDay.addEventListener('dragend', handleDrop, false);
    plannerDay.addEventListener('drop', Drop, false);

    function handleDragStart(evt) {
        evt = window.event ? window.event : evt;
        //拖动只支持copy操作
        evt.effectAllowed = 'copy';
        //设置该属性兼容火狐
        evt.dataTransfer.setData("Text", evt.target);
        var elem = evt.target;
        //if($(elem).hasClass('day') || $(elem).parent().hasClass('day') || $(elem).hasClass('dayOrder')){
        //    var index = $(elem).parents('li').index();
        var index = $(elem).index();
        var len = $(plannerDays).children().length - 1;
        var day = $(plannerDays).find('.dayOrder');
        obj = $(Details).eq(index);

        if (index == len) {
            $(plannerDays).children().eq(0).remove();
        } else {
            $(plannerDays).children().eq(len).css({"opacity": "0"});
        }
        $(day).each(function () {
            for (var i = 0; i < len; i++) {
                $(day).eq(index + i).html(index + i + 1);
            }
        });
        //}
    }

    function handleEnter(evt) {
        evt = window.event ? window.event : evt;
        var elem = evt.target;
        evt.effectAllowed = 'copy';
        if ($(elem).hasClass('day') || $(elem).parent().hasClass('day') || $(elem).hasClass('dayOrder')) {
            dd = $(elem).parents('li');
            //ll = $(elem).parents('.plannerDays').find();
            $(plannerDays).find('.drag').remove();
            $(elem).parents('li').before('<li class="drag" style="width: 38px;height: 20px;"></li> ');
        }
    }

    function handleDrop(evt) {
        evt = window.event ? window.event : evt;
        evt.effectAllowed = 'copy';
        $(plannerDays).find('.drag').remove();
        var list2 = $(plannerDays).children();
        var len = $(list2).length;
        $(plannerDays).find('.day').removeClass('dayCurrent');
        if (dd) {
            if (dd.index() <= len - 2) {
                $(list2).eq(dd.index()).find('.day').addClass('dayCurrent');
            } else if (dd.index() >= len - 1) {
                $(list2).eq(dd.index() - 1).find('.day').addClass('dayCurrent');

            }
            $(Details).addClass('is-hidden');
            obj.removeClass('is-hidden');
            if (dd.index() == 0) {
                $(Details).eq(dd.index()).before(obj);
            } else if (dd.index() == $(Details).length - 1) {
                $(Details).eq(dd.index()).after(obj);
            } else {
                $(Details).eq(dd.index() - 1).after(obj);
            }
            Details = $('.mainLeftBox').find('.day_details');
            $(Details).find('.tipTxt').empty();
            $(Details).eq(0).find('.tipTxt').html('第一天行程建議不要排的太緊湊');
            $(Details).eq(Details.length - 1).find('.tipTxt').html('最后一天行程建議不要排的太緊湊');
            for (var j = 0; j < Details.length; j++) {
                $(Details).eq(j).find('.day-show').html(j + 1);
            }
        }
        for (var i = 0; i < len; i++) {
            $(list2).eq(i).find('.dayOrder').html(i + 1);
        }
    }

    function Drop(evt) {
        evt = window.event ? window.event : evt;
        evt.effectAllowed = 'copy';
        $(plannerDays).find('.drag').remove();
        var days = $(plannerDays).children().hasClass('dayCurrent');
    }
}());
//点击爱心时取得父级元素
var tripElem,lovebt;//gaowy
//景点拖拽
$(function () {

    //拖拽
    function Drag() {
        this.disX = 0;
        this.disY = 0;
    }

    Drag.prototype.init = function () {
        var boxes = $('.items');
        var target = $('.day_details').not('.is-hidden');
        var list = $(target).find('.trip-detail-list');
        var m = this;

        var li=$(new Templete().create_plays());//gaowy
        $(boxes).bind('mousedown', function (evt) {

            evt.preventDefault();
            var elem = evt.target;

            var e = evt || event;
            var oPosition;
            var curr;
            var index;
            var currP;
            if ($(elem).hasClass('addTripBtn')) {
                addTripLists(elem, 'false');
            }


            else if ($(elem).hasClass('tripTypeBtn')) {
                evt.stopPropagation();
                $(elem).on('click', function (ev) {
                    ev.stopPropagation();
                });
                chooseTripType(elem);
            }
            else if ($(elem).hasClass('minus')) {
                minusStopTime(elem);
            }
            else if ($(elem).hasClass('add')) {
                addStopTime(elem);
            }
            else if ($(elem).hasClass('tripTypes')) {
                clickDD(elem);
            }
            //gaowy,点击爱心时弹窗
            else if ($(elem).hasClass('love-btn') || $(elem).parent().hasClass('love-btn')) {
                console.log('gaowy');
                var tripDetails=$('.tripDetails');
                var playsUl=tripDetails.find('.playsUl').html('');
                lovebt=$(elem);
                tripElem=$(elem).parents('.item');
                var df=document.createDocumentFragment();
                var dd=tripElem.find('dd');
                for(var i=0;i<dd.length;i++)
                {
                    var playli=li.clone();
                    playli.find('.event-title').html('玩法'+(i+1)+'：<span class="event-detail-btn">'+dd.eq(i).html()+'</span>')
                    $(df).append(playli);
                }
                playsUl.append(df);

                tripDetails.find('.trip-name').html(tripElem.find('h6').html());//修改标题
                tripDetails.css({"display":"block"});
                $('#mark').css({"display":"block"});

            }
            else if ($(elem).parents('.item')) {
                oPosition = $(elem).parents('.item').position();
                index = $(elem).parents('.item').index();
                //currP = $(elem).parents('.item');
                curr = $(elem).parents('.item').clone().addClass('clone').css({
                    'position': 'absolute',
                    'width': 144,
                    'top': oPosition.top,
                    'left': oPosition.left,
                    'z-index': 999
                });
                $(boxes).append(curr);
                m.mouseDown(evt, curr, boxes, index, target, list, $(elem));
            } else if ($(elem).hasClass('.item')) {
                index = $(elem).index();
                //currP = $(elem);
                curr = $(elem).clone().addClass('clone').css({
                    'position': 'absolute',
                    'width': 144,
                    'top': oPosition.top,
                    'left': oPosition.left,
                    'z-index': 999
                });
                $(boxes).append(curr);
                m.mouseDown(evt, curr, boxes, index, target, list, $(elem).find('h6'));
            }


        });
    }
    Drag.prototype.mouseDown = function (e, o, obj, index, target, list, elem) {
        var offsetL = $(o).offset();
        var m = this;
        if (index % 2 == 0) {
            this.disX = offsetL.left + $(o).width() / 2;
            this.disY = ($(o).height()) / 2;
        } else {
            this.disX = offsetL.left - $(o).width() / 2;
            this.disY = ($(o).height()) / 2;
        }

        $(document).bind('mousemove', function (e) {
            m.mouseMove(o, target, e, list, 'over', elem);
        });

        $(document).bind('mouseup', function () {
            $(obj).find('.clone').remove();
            m.mouseUp(o, target, e, list, 'up', elem);
        });
    };
    Drag.prototype.mouseMove = function (o, target, e, list, type, elem) {
        var m = this;
        var offsetL = $(o).offset();
        var left = e.pageX - this.disX;
        var top = e.pageY - this.disY;
        $(o).css({'top': top, 'left': left});
        m.mouseOverTarget(o, target, e, list, type, elem);
    };
    Drag.prototype.mouseUp = function (o, target, e, list, type, elem) {
        var m = this;
        m.mouseOverTarget(o, target, e, list, type, elem);
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
    };

//判断鼠标经过目标区域
    Drag.prototype.mouseOverTarget = function (curr, target, evt, list, type, elem) {
        //判断目标区域的边界
        target = $('.day_details').not('.is-hidden');
        list = $(target).find('.trip-detail-list');
        var left = target.offset().left;
        var right = left + target.width();
        var top = target.offset().top;
        var bottom = top + target.height();
        var mouseX;
        var mouseY;
        var a = new Templete();
        var title = $(curr).find('h6').html();
        var typeVal = $(curr).find('.tripTypeVal').html();
        var len = list.children().length;
        if (type == 'over') {
            mouseX = evt.clientX;
            mouseY = evt.pageY;
            if (mouseX + 200 >= left && mouseX <= right - 50 && mouseY >= top && mouseY <= bottom) {
                var items = $('.trip-detail-list ').not('.is-hidden').find('.detail-item-wrap');
                var hidden = $(a.create_maps_addTrip_clone());
                //var hidden = $('<div class="detail-item-wrap cloneTrip" style="background-color: #d0d0d0;border-radius: 3px;"></div>');
                $(items).each(function (i, elem) {
                    var mTop = evt.pageY;
                    var eTop = $(elem).offset().top;
                    var height = $(elem).height();
                    //$(elem).parents('.trip-detail-list ').find('.cloneTrip').remove();
                    if (mTop >= eTop && mTop <= eTop + height / 2) {
                        $(elem).parents('.trip-detail-list ').find('.cloneTrip').remove();
                        $(elem).before(hidden);
                    } else if (mTop > eTop + height / 2 && mTop <= eTop + height + 100) {
                        $(elem).parents('.trip-detail-list ').find('.cloneTrip').remove();
                        $(elem).after(hidden);
                    }
                });
            } else {
                $('.trip-detail-list ').not('.is-hidden').find('.cloneTrip').remove();
            }
        }
        if (type == 'up') {
            mouseX = evt.clientX - Number($(curr).css('left').replace(/[^0-9]+/g, '')) - 100;
            mouseY = evt.pageY;
            var cloneTripLen = $('.trip-detail-list ').not('.is-hidden').find('.cloneTrip').length;

            if (len == 0) {
                if (mouseX + 200 >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                    addTripLists(elem, 'false');
                }
            } else {
                if (cloneTripLen > 0) {
                    if (mouseX + 50 >= left && mouseX <= right + 100 && mouseY >= top && mouseY <= bottom) {
                        addTripLists(elem, 'true');
                    }
                }
            }
        }
    };

    var drag = new Drag();
    drag.init();
});