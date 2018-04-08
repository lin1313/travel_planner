/**
 * Created by dell on 2016/10/11.
 */
var Details = null;//获取天数列表弹窗
createDayLists();
function createDayLists(){
    var cc = getStorage('mytrip');
    var num = cc.length;
    var a = new Templete();
    var dayList = $('.dayList');
    var plannerDays = $(dayList).find('.plannerDays');
    var addDays = $(dayList).find('.addDays');
    var mainLeftBox = $('.mainLeftBox');

    $(plannerDays).empty().html(a.create_days_items(num,0));
    $(mainLeftBox).empty().html(a.create_days_popup(num,0,cc));
    Details = $(mainLeftBox).find('.day_details');
    $(Details).eq(0).removeClass('is-hidden');
    $(Details).eq(0).find('.tipTxt').html('第一天行程建議不要排的太緊湊');
    $(Details).eq(Details.length-1).find('.tipTxt').html('最后一天行程建議不要排的太緊湊');

    var li = $(plannerDays).children();
    var day = $(li).find('.day');
    var liLen = $(li).length;

    $(day).eq(0).addClass('dayCurrent');

    $(dayList).bind('click',function(event){
        var elem = event.target;
        var list = $(plannerDays).children();

        if($(elem).hasClass('day') || $(elem).parent().hasClass('day') || $(elem).hasClass('dayOrder')){
            var index = $(elem).parents('li').index();
            $(list).find('.day').removeClass('dayCurrent');
            $(elem).parents('li').children('.day').addClass('dayCurrent');
            $(Details).eq(index).removeClass('is-hidden').siblings().addClass('is-hidden');
            //清空地图上的marker
            $('.popupBox').remove();
            //清空存放景点经纬度的数组
            locationArr.length = 0;
            markArr.length = 0;
            //清空路线
            if(LatLngLine){
                LatLngLine.setMap(null);
            }
            //如果当天有景点就在地图上创建marker并画线
            var itemWrap = $(mainLeftBox).find('.day_details').not('.is-hidden').find('.trip-detail-list ').find('.detail-item-wrap');
            var distance = $(itemWrap).find('.distance');
            var duration = $(itemWrap).find('.time_show');
            var len = $(itemWrap).length;
            if(len > 0){
                for(var i = 0;i < len;i++){
                    var lat =  Number(itemWrap.eq(i).attr('lat'));
                    var lng =  Number(itemWrap.eq(i).attr('lng'));
                    var latLng = new google.maps.LatLng({lat:lat,lng:lng});
                    var title =  itemWrap.eq(i).attr('title');
                    var address =  itemWrap.eq(i).attr('address');
                    var img = itemWrap.eq(i).attr('img');
                    locationArr.push(latLng);
                    for(var j = 0;j < len;j++){
                        if(title == markArr[j]){
                            return
                        }
                    }
                    markArr.push(title);
                    var overlay = new MyOverlay(map,{lat:lat,lng:lng,latlng:latLng,image:img,name:title,address:address,distance:0,time:0,Num:locationArr.length});
                }
                if(locationArr.length > 1){
                    var copyArr = $.makeArray(locationArr);
                    var star = copyArr.shift();
                    var end = copyArr.pop();
                    getRoute(star,end,copyArr,'TRANSIT',distance,duration);
                }
            }

        }
        if($(elem).hasClass('addDays')){
            $(plannerDays).children().eq(list.length-1).remove();
            $(plannerDays).append(a.create_days_items(1,liLen-1));
            $(mainLeftBox).append(a.create_days_popup(1,Details.length));
            Details = $(mainLeftBox).find('.day_details');
            if(Details.length>2){
                $(Details).eq(list.length-1).find('.tipTxt').html('最后一天行程建議不要排的太緊湊');
                $(Details).eq(list.length-2).find('.tipTxt').empty();
            }else{
                $(Details).eq(list.length-1).find('.tipTxt').html('最后一天行程建議不要排的太緊湊');
            }
            $(Details).eq(list.length-1).removeClass('is-hidden').siblings().addClass('is-hidden');
            list = $(plannerDays).children();
            liLen = $(list).length;
            $(list).find('.day').removeClass('dayCurrent');
            $(list).find('.day').eq(liLen-2).addClass('dayCurrent');
            //清空地图上的marker
            $('.popupBox').remove();
            //清空存放景点经纬度的数组
            locationArr.length = 0;
            //清空路线
            if(LatLngLine){
                LatLngLine.setMap(null);
            }
        }
    });

    $(addDays).hover(function(){
        $(addDays).animate({
            "width": 30,
            "height": 30,
            "line-height": 30+'px'
        },200);
    },function(){
        $(addDays).animate({
            "width": 26,
            "height": 26,
            "line-height": 26+'px'
        },200);
    });
}
//获取html5本地数据
function getStorage(key)
{
    var str=window.localStorage.getItem(key);
    var obj=JSON.parse(str);
    return obj;
}