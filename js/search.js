/**
 * Created by dell on 2016/11/2.
 */
//搜索框
var infoArr = [];//搜索结果数组
var searchClick = false;//上一页下一页获取信息
$(function(){
    var search = $('.searchInput');
    var tripList = $('.tripList');
    var filterData = $('.filterData');
    var searchBtn = $('.searchBtn');
    var isData = true;//判断采取谷歌搜索还是对接数据库
    $(search).focus(function(){
        var that = this;
        var filter = $(this).val();
        $(filterData).css({'display':'block'});
        if(filter != ''){
            $.ajax({"url": 'txt/all.txt'}).done(
                function (Info) {
                    var info = JSON.parse(Info);
                    var len = info.length;
                    var str = '';

                    infoArr.length = 0;
                    for(var i = 0;i < len;i++){
                        if(info[i].name.indexOf(filter) != -1){
                            str += '<span>' + info[i].name + '</span>';
                            infoArr.push(info[i]);
                        }
                    }
                    $(filterData).empty().append(str);
                    if(str == ''){
                        //str = '<span>' + '抱歉，未搜索相关结果' + '</span>';
                        //谷歌搜索
                        var val = $(search).val();
                        var addressOptions = {
                            address: val
                        };
                        var geocoder = new google.maps.Geocoder();
                        var service = new google.maps.places.PlacesService(map);

                        geocoder.geocode(addressOptions,function(results,status){
                            console.log('status',status);
                            if(status == google.maps.GeocoderStatus.OK){
                                service.getDetails({placeId:results[0].place_id}, function (result, status) {
                                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                                        //console.error(status);
                                        //return;
                                    }else{
                                        str += '<span>' + result.name + '</span>';
                                        var info = {'name': result.name,'type':[result.types[0]],'address':result.adr_address,'url':'images/120.jpg','lat':result.geometry.location.lat(),'lng':result.geometry.location.lng()};
                                        infoArr.push(info);
                                        $(filterData).empty().append(str);
                                    }
                                });
                            }else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
                                str = '<span>' + '抱歉，未搜索相关结果' + '</span>';
                                $(filterData).empty().append(str);
                            }
                        });
                    }
                    $(filterData).empty().append(str);
                }
            );
        }else{
            $(filterData).empty().css({'display':'none'});
        }
    }).keyup(function(event){
        console.log(event.keyCode);
        //if(event.keyCode == 13 || event.keyCode == 32){
            $(this).focus();
        //}
    });

    //失去焦点
    $(document).click(function (event) {
        var elem = event.target;
        if(!$(elem).hasClass('searchInput')){
            $(filterData).empty().css({'display':'none'});
        }
    });

    //点击list
    $(filterData).bind('click',function(event){
        event.stopPropagation();
        var elem = event.target;
        if($(elem).parent().hasClass('filterData')){
            var c = new Templete();
            var index = $(elem).index();
            var currList = $(c.create_pages_items_other(1,1,0,1)).removeClass('normal').addClass('current');
            searchClick = true;
            infoArr = infoArr.slice(index,index+1);
            $('.items').empty().append(c.create_trip_items(0,1,infoArr));
            $('.pagesItems').empty().append(currList);
            $(filterData).empty().css({'display':'none'});
            setData(infoArr, 0);
        }
    });

    //点击放大镜
    $(searchBtn).bind('click',function(){
        var filter = $(search).val();
        $.ajax({"url": 'txt/all.txt'}).done(
            function (Info) {
                var info = JSON.parse(Info);
                var len = info.length;
                var item = 10;
                var list = $('.tripList');
                var btn = $(list).find('.pagesBtn');
                var left = $(btn).find('.prev');
                var right = $(btn).find('.next');
                var objList = $(btn).find('.pagesItems');
                var items = $(list).find('.tripItems .items');
                var t = new GetPages({listCount: item, pageCount: 6, times: 0, currentPage: 0, currentList: 0});

                infoArr.length = 0;
                searchClick = true;

                for(var i = 0;i < len;i++){
                    if(info[i].name.indexOf(filter) != -1){
                        infoArr.push(info[i]);
                    }
                }
                var num = infoArr.length;
                t.createTripList(num, items, infoArr);
                t.createPageList(num, right, left, objList, right);
                setData(infoArr, 0);
            }
        );
    });
});

