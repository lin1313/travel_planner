/**
 * Created by dell on 2016/10/9.
 */
function Templete(){}
//构建tripItems>item
Templete.prototype.create_trip_items =  function(d,item,info){
    function createItems(){
        var str = '';
        for(var i = 1;i <= item;i++){
            var len = info[d+i-1].type.length;

            str +=  '<div class="item">' +
                '<div>'+
                '<img src="' + info[d+i-1].url + '">' +
                '<h6>' + info[d+i-1].name +
                '</h6>' +
                '<div class="tripType">' +
                '<a href="#" id="tripTypeBtn" class="tripTypeBtn"></a>' +
                '<dl><dt class="tripTypeVal">' + info[d+i-1].type[0] + '</dt>';

            for(var j = 0; j < len;j++){
                str += '<dd class="tripTypes">' + info[d+i-1].type[j] + '</dd>'
            }

            str += '</dl>' +
                '</div>' +
                '<div class="setTime">' +
                '<input type="button" class="minus" value="-">' +
                '<p>' + '停留' + '<span id="times">'+ '1.0'+ '</span>' + '小时' + '</p>'+
                '<input type="button" class="add" value="+">' +
                '</div>' +
                '<div class="addTrip"><a href="#" class="addTripBtn">+加入行程</a></div>'+
                '<div class="love-btn love_btn"><i class="fa map-marker"></i></div></div>'+
                '</div>';
        }
        return str;
    }
    return createItems();
}
//构建tripItems>pagesItems
Templete.prototype.create_pages_items =  function(a,item){
    function createItems(){
        var str = '';
        for(var i = 1;i <= item;i++){
            str +=  '<li class="li normal">' + (a+i) + '</li>';
        }
        str += '<li class="more">' + '...' + '</li>';
        return str;
    }
    return createItems();
}

Templete.prototype.create_pages_items_other =  function(pageCount,pages,a,remainder){
    function createItems(){
        var str='';
        if(pages > pageCount){
            str += '<li class="more">' + '...' + '</li>';
            for(var j = 1;j <= remainder;j++){
                str += '<li class="li normal">' + (a+j) + '</li>';
            }
        }else if(pages <= pageCount){
            for(var k = 1;k <= remainder;k++){
                str += '<li class="li normal">' + (a+k) + '</li>';
            }
        }
        return str;
    }
    return createItems();
}

//构建days
Templete.prototype.create_days_items = function(num,len){
    function createItems(){
        var str='';
        for(var i = 0; i < num;i++){
            str += '<li draggable="true"><div class="day"> <p>D<span class="dayOrder">' + (i+len+1) + '</span></p></div></li>';
        }
        str += '<li draggable="true" style="opacity: 0;"><div class="day"></div></li>';
        return str;
    }
    return createItems();
}

//构建地图marker popup
Templete.prototype.create_maps_marker = function(image,name,address,distance,time,num){
    var str = '';
    str += '<div class="popupMarker">' +
        '<div class="spotNum">'+ num +'</div>' +
        '<div class="popupMark"></div>' +
        '<div class="popupImg">' +
        '<img src="' + image + '">' +
        '</div>' +
        '</div>' +
        '<div class="popupContent">' +
        '<div class="popupMain">' +
        '<div class="siteNotice">' +
        '<img src="' + image + '">' +
        '</div>' +
        '<div class="bodyContent">' +
        '<h1 class="firstHeading" title="' + name + '">' + name + '</h1>' +
        '<p class="addressTxt" title="' + address + '">' + address + '</p>' +
        '<div class="recommend">' +
        '<p class="recommendTxt">推荐等级:</p>' +
        '<span class="icons"></span>' +
        '</div>' +
        '<a class="searchHOTEL"><span></span>附近酒店</a>' +
        '<a class="searchRESTAURANT"><span></span>附近餐厅</a>' +
            //'<a class="searchROUTE"><span></span>路线查询</a>' +
            //'<div class="distance"><p>距离下一个行程</p><p><select id="trafficType"><option title="WALKING">步行</option><option title="TRANSIT">公交</option><option title="DRIVING">自驾</option></select><span id="distance">' + distance + '</span></p><p>预计时间:<span id="duration">' + time + '</span></p></div>' +
            ////'<span class="addDay overlay mapAddTrip">+加入行程</span>' +
        '</div>' +
        '<a class="closePopup">X</a>' +
        '</div>';
    return str;
}

//构建两地之间距离时间info弹窗
Templete.prototype.create_maps_info = function(distance,duration,name){
    var str = '';

    str = '<div style="width: 200px;height: 80px;padding-top: 5px;" class="nearSearchInfo">' +
        '<h6 style="width: 200px;line-height: 20px;color: #416587;font-size: 14px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="hotelName" title="'+ name +'">'+name +'</h6>' +
        '<p style="width: 200px;line-height: 20px;color: #999;">注:距离与时间均默认以步行计算</p>'+
        '<p class="distance01" style="width: 200px;line-height: 20px;">'+ '两地距离:' + '<span style="font-weight: bold;color: #416587;">'+ distance + '米' + '</span>' +'</p>' +
        '<p class="distance02" style="width: 200px;line-height: 20px;">'+ '预计时间:' + '<span style="font-weight: bold;color: #416587;">'+ duration +'</span>' +'</p>' +
        '<span class="mapAddTrip" style="position: absolute;bottom: 3px;right: 0;color: #40a3b0;cursor: pointer;">+加入行程</span>' +
        '</div>';
    return str;
}

//构建加入行程
Templete.prototype.create_maps_addTrip = function(stime,etime,imgurl,pname,tname,distance,dtime){
    var str = '';

    str = ' <div class="detail-item-wrap"><div class="time-line"><div class="time-wrap"><div class="time-item"><i class="fa fa-tree"></i><div class="time_start">'+ stime +
        '</div></div></div><div class="time-wrap end"><div class="time-item"><div class="time_end">'+ etime +'</div></div></div></div><div class="place-wrap"><div class="place-item">'+
        '<div class="place-img" style="background:url('+ imgurl +'"><div class="remove-btn"><i class="fa fa-trash"></i></div><div class="love-btn love_btn"><i class="fa fa-heart"></i>'+
        '</div></div><div class="place-summery"><h4 class="place-name">'+pname +'</h4><div class="event">'+tname+'</div><div class="setTime hide"></div></div></div>'+
        '<div class="time-change" ><div class="time-text" >'+
        ' <div class="time-text-contain"> <span class="sp-start" >从</span><input id="starHour" class="hour" name="starHour" type="text" >' +
        '<span class="sp-end">至</span><input id="endHour" class="hour" name="endHour" type="text" ></div> </div>'+
        '<div class="time-note"> <p >*时间格式为：hh:mm</p></div><div class="time-bt" ><div class="time-bt-contain">'+
        '<button class="save" >保存</button><button class="cancel">取消</button></div></div></div>'+
        '<div class="traffic-item"><div class="traffic-way">'+
        '<i class="fa fa-bus select_traffic_wary"></i></div><div class="distance">'+distance+ '</div><div class="time-spend"> <span class="time_show">'+ dtime +  '</span></div></div></div></div>'
    return str;
}

//拖拽时clone
Templete.prototype.create_maps_addTrip_clone = function(){
    var str = '';

    str += ' <div class="detail-item-wrap cloneTrip"><div class="time-line"><div class="time-wrap"><div class="time-item"><i class="fa fa-tree"></i><div class="time_start">'+ 0 +
        '</div></div></div><div class="time-wrap end"><div class="time-item"><div class="time_end">'+ 0 +'</div></div></div></div><div class="place-wrap"><div class="place-item" style="background-color: #4abdcc;">'+
        '<div class="place-img"><div class="remove-btn"><i class="fa fa-trash"></i></div><div><i></i>'+
        '</div></div><div class="place-summery"><h4 class="place-name">'+'' +'</h4><div class="event">'+''+'</div></div></div>'+'<div class="time-change" ><div class="time-text" >'+
        ' <div class="time-text-contain"> <span class="sp-start" >从</span><input id="starHour" class="hour" name="starHour" type="text" >' +
        '<span class="sp-end">至</span><input id="endHour" class="hour" name="endHour" type="text" ></div> </div>'+
        '<div class="time-note"> <p >*时间格式为：hh:mm</p></div><div class="time-bt" ><div class="time-bt-contain">'+
        '<button class="save" >保存</button><button class="cancel">取消</button></div></div></div>'+
        '<div class="traffic-item"><div class="traffic-way">'+
        '<i></i></div><div class="distance">'+''+ '</div><div class="time-spend"> <span class="time_show">'+ '' +  '</span></div></div></div></div>';

    return str;
}

//构建day 弹窗
Templete.prototype.create_days_popup = function(num,len,cc){
    function createItems(){
        var str='';
        var a='';
        for(var i = 0; i < num;i++){
            a=cc ? cc[i]["trip_name"]:'-';
            str += '<div class="day_details is-hidden" day-no="'+ (i+len+1) + '"><div class="day-details-header"><div class="day-btn pre-day-btn"> ' +
                '<i class="fa fa-chevron-left"></i> </div> <h3 class="now-day"><span>第</span><span class="day-show">'+ (i+len+1) +'</span>' +
                '<span>天(</span> <span class="pkg_num">0</span><span>)</span></h3><div class="day-btn next-day-btn"><i class="fa fa-chevron-right">' +
                '</i></div></div><div class="destinationTrip">'+ a +'</div><div class="trip-detail-wrap"><div class="tip "><i class="fa fa-info"></i>' +
                '<i class="tipTxt"></i></div><div class="trip-detail-list"></div></div></div>'
        }

        return str;
    }
    return createItems();
}
//构建玩法介绍li
Templete.prototype.create_plays=function()
{
return '<li>\
         <div class="event-title">玩法1：<span class="event-detail-btn">公园散步</span></div>\
         <div class="amount-wrap">\
             <div class="form-amount">\
                <input type="button" class="minus" value="-">\
                <p>停留<span id="times">1.0</span>小时</p>\
                <input type="button" class="add" value="+">\
             </div>\
             <div class="event-price">无参考售价</div>\
         </div>\
         <div class="detail-table ">\
            <div class="detail-row">\
                <div class="detail-title">\
                适用时间\
                </div>\
                <div class="detail-content">\
                08:30~18:00\
                </div>\
            </div>\
            <div class="detail-row">\
                <div class="detail-title">\
                玩法介紹\
                </div>\
                <div class="detail-content">\
                略.......\
                </div>\
            </div>\
            <div class="detail-row">\
                <div class="detail-title">\
                費用說明\
                </div>\
                <div class="detail-content">\
                略.......\
                </div>\
            </div>\
         </div>\
         <div class="fa fa-plus"></div>\
    </li>'
}






