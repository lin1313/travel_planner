$(function(){
    (function(){
        //data发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
        getData("data/city/1.txt",'a=1&b=2','get',createNav);
        stateClick();
        initBread();//bread添加點擊事件
        destlistClick();//列表点击事件
        delTrip();//删除行程
        dayOpear();//天数加减
        NextStep();//下一步
        $('#start_date').click(function(ev){ev.stopPropagation();getDate(this)});
        stopSlect($('.Calendar'),true);
    })();

    //创建热门导航栏
    function createNav(data){
        var arr = JSON.parse(data);

        if(arr.length){
            var ul =  $('#continents_list');
            var list = $('<li class="continents"></li>');

            for(var i=0;i<arr.length;i++){
                var li = list.clone();
                var d = arr[i];

                li.html(d.AreaName);
                li.attr({"data-no":d.AreaNo,"data-type":d.Type,"data-latLng":[d.lat, d.lng]});

                if (arr[i].AreaNo == -1) {
                    li.addClass('is-acted');
                }

                ul.append(li);
            }
        }
    }

    //ajax访问数据
    function getData(url,data,method,callback,flag){
        $.ajax({
            "url": url,
            "data": data,
            "type": method
        }).done(
            function(str){
                callback(str)
            }
        ).fail(
            function(){
                alert('获取数据失败');
            }
        )
    }

    //导航栏添加点击事件
    function stateClick(){
        $(document).on('click','#continents_list .continents', function(e) {
            var no = $(this).attr('data-no');
            var type = $(this).attr('data-type');
            var latLng = $(this).attr('data-latLng');
            var text=$(this).html();
            var url='data/city/' + type + '/' + no + '.txt';

            //更新导航栏
            updateBread(type,no,text,latLng);
            //更新列表数据
            getData(url,'a=1&b=2','get',getAreaList)
        })
    }

    //更新导航栏
    function updateBread(type,no,text,latLng) {
        var bread = $('#dest_breadcrumb');
        var continent = bread.find('.continents');
        var country = bread.find('.country');
        var city = bread.find('.city');
        var temp;

        bread.find('.bread:not(.world)').addClass('is-hidden');
        bread.find('.bread:not(.world)').addClass('back-link');

        switch (type) {
            case '0': //世界
                break;
            case '1': //洲
                temp = continent;
                continent.removeClass('is-hidden');
                break;
            case '2': //國家
                temp = country;
                continent.removeClass('is-hidden');
                country.removeClass('is-hidden');
                break;
            case '3': //城市-關聯城市
                temp = city;
                continent.removeClass('is-hidden');
                country.removeClass('is-hidden');
                city.removeClass('is-hidden');
                break;
        }
        if (temp) {
            if (type == 3) {
                text = text + '-關聯城市';
            }
            temp.removeClass('back-link').text(text).attr({"data-no":no,"data-type":type,"data-latLng":latLng}).removeClass('is-hidden');;
        }
    }

    //bread的click事件
    function initBread() {
        var bread = $('#dest_breadcrumb');

        // click 世界
        bread.find('.world').on('click', function(e) {
            var t = $(this);
            updateBread('',0, '', '');
            getData("data/city/1.txt",'a=1&b=2','get',getAreaList)
        });

        //click 洲 & country
        bread.find('.continents,.country').on('click', function(e) {
            var t = $(this);
            var name = t.text();
            var no = t.attr('data-no');
            var type = t.attr('data-type');
            var latLng = t.attr('data-latLng');

            updateBread(type,no,name,latLng);
            //地圖平移代碼未價
            var url='data/city/'+type+'/'+no+'.txt';
            getData(url,'','get',getAreaList);
        });
    }

    //更新列表：#dest_list：get_Area_cb
    function getAreaList(str){
        //隐藏默认导航条
        $('#continents_list').addClass('is-hidden');
        //显示dest_breadcrumb导航条
        $('#dest_breadcrumb').removeClass('is-hidden');
        var copy=$('#dest_list_copy');
        var areaList = $('#dest_list');
        areaList.empty();
        var arr=JSON.parse(str);
        for (var i = 0; i < arr.length; i++) {
            var li = copy.clone();
            var dd = arr[i];

            if (dd.AreaNo == -1) {
                continue
            }

            li.find('.country-img').css('background-image', 'url(' + dd.img + ')');
            li.find('.country-name').html(dd.AreaName);
            li.find('.en-name').html(dd.en_name);
            li.attr({"data-no":dd.AreaNo,"data-type":dd.Type,"data-l1":dd.path.level1,"data-l2":dd.path.level2,"data-l3":dd.path.level3,"data-cityId":dd.CityId,"data-latLng":[dd.lat, dd.lng],"next":dd.next});
            li.removeClass('is-hidden');
            //列表按鈕圖形
            if (arr[i].Type != 3) {
                li.find('.add_country_btn').addClass('is-hidden');
                li.find('.fa-chevron-right').removeClass('is-hidden');
            } else {
                li.find('.fa-chevron-right').addClass('is-hidden');
                li.find('.add_country_btn').removeClass('is-hidden');
            }

            areaList.append(li);
        }
    }

    //列表項的click事件
    function destlistClick() {
        $('body').on('click', '#dest_list .country-item', function() {
            var t = $(this)
            var name = t.find('.country-name').text();
            var no = t.attr('data-no');
            var type = t.attr('data-type');
            var latLng = t.attr('data-latLng');
            var url='data/city/'+type+'/'+no+'.txt';
            var next= type==3?t.attr('next'):null;


            if(next)//级数等于3时
            {
                switch(next)
                {
                    case '0': //没有下级直接加到我的行程,
                        addMyTrip(t);
                        $('#my_trip_list').removeClass('is-hide');
                        break;
                    case '1': //
                        getData(url,'','get',function(str){getAreaList(str);updateBread(type,no,name,latLng);});
                        break;
                    default :break;
                }

            }
            else//级数小于3
            {
                getData(url,'','get',function(str){getAreaList(str);updateBread(type,no,name,latLng);});
            }


        });

    }
    //添加到我的行程
    function addMyTrip(t) {

        var planBox = $('#my_trip_list');
        var tripList = $('#my_trip_copy').clone();

        tripList.find('.country').html(t.find('.country-name').text());
        tripList.attr('data-no', t.attr('data-no'));
        tripList.attr('data-latLng',  t.attr('data-latLng'));
        planBox.find('#my_trip_plane').append(tripList);
        tripList.removeClass('is-hidden');
        tripList.removeAttr('id');


    }

    $(function(){
        orderBy();
    })

    //拖拽排序
    function orderBy()
    {

        var flag=true;
        var myPlane=$('#my_trip_plane');
        var offset=myPlane.offset();
        //var poffset=myPlane.offsetParent().offset();
        var poffset=$('#my_trip_list').offset()
        var disX,disY,left,top,width,height,that,trips;
        var hidden=$('<div class="my-trip-item-wrap"></div>')//#my_trip_plane .my-trip-item-wrap
        myPlane.on('mousedown','.my-trip-item-wrap',function(ev)
        {

            that=$(this);
            disX=ev.pageX-$(this).offset().left;
            disY=ev.pageY-$(this).offset().top;
            width=that.outerWidth();
            height=that.outerHeight();
            trips=$('#my_trip_plane .my-trip-item-wrap');
            stopSlect($('body'),true)
            $(document).on('mousemove.m',function(ev)
            {
                left=ev.pageX-poffset.left-disX;
                top=ev.pageY-poffset.top-disY;
                that.css({"position":"absolute","left":left,"top":top,"width":width,"height":height,"z-index":10})
                that.find('.traffic-item ').addClass('is-hidden')
                if(flag)
                {
                    that.before(hidden);
                    flag=false;
                }
                trips.not(that).each(function(i,elem)
                {
                    var mtop=ev.pageY-disY;
                    var et=$(elem).offset().top;
                    if(mtop>=et && mtop<=et+ height/2)
                    {
                        $(elem).before(hidden);
                    }
                    else if(mtop>et + height/2 && mtop<=et+ height)
                    {
                        $(elem).after(hidden);
                    }
                })
            })
            $(document).on('mouseup.u',function(ev)
            {
                $(document).off('mousemove.m').off('mouseup.u');
                hidden.replaceWith(that);that.removeAttr('style').find('.traffic-item ').removeClass('is-hidden');
                flag=true;
                stopSlect($('body'),false)
            })
        })
    }
    //阻止浏览器默认选中文字
    function stopSlect(elem,flag)
    {
        if(flag)
        {
            $(elem).attr('unselectable','on').addClass('stopSlect').on('selectstart.s', function(){ return false; });
        }
        else
        {
            $(elem).removeAttr('unselectable').removeClass('stopSlect').off('selectstart.s');
        }

    }
    //行程删除按钮
    function delTrip()
    {
        var myPlane=$('#my_trip_plane');
        myPlane.on('click',".delete_trip_btn",function(ev){
            var that=$(this);
            ev.stopPropagation();
            that.on('mousedown',function(ev){ev.stopPropagation();})
            if(myPlane.children().length==1)
            {
                myPlane.parents('#my_trip_list').addClass('is-hide');

            }
            that.parents('.my-trip-item-wrap').remove();
        })
    }
    //天数加减
    function dayOpear()
    {
        $('#my_trip_plane').on('click','.day_amount_minus,.day_amount_plus',function(ev){

            var day= $(this).parent().find('.day_amount_num');
            var daynow =day.html();
            ev.stopPropagation();
            $(this).on('mousedown',function(ev){ev.stopPropagation();})//down事件阻止冒泡，防止影响拖动
            if($(this).hasClass('day_amount_minus'))//减一天
            {
                if (daynow <= 1) {
                    daynow = 1;
                } else {
                    daynow--;
                }
            }
            else//加一天
            {
                if (daynow >= 20) {
                    daynow = 20;
                } else {
                    daynow++;
                }
            }
            day.html(daynow);
        })
    }

    //本地存储
    function localSave()
    {
        window.localStorage.clear();
        var trips=$('#my_trip_plane').children();
        var count=1;

        var m='{"dayNo":"{0}","trip_name":"{1}","trip_id":"{2}","stayDay":"{3}","addrInfo":"{4}","latLng":"{5}"}'
        var str='';
        for (var i = 0; i < trips.length; i++) {
            var tt = trips.eq(i);
            var days =parseInt(tt.find('.day_amount_num').html()) ;


            for (var j = 1; j <= days; j++) {
                var  name = tt.find('.country').text();
                var  id = tt.attr('data-no');
                var  latLng = tt.attr('data-latLng');
                var info = tt.attr('data-addrInfo');
                var mm=m;
                mm= mm.replace('{0}',count);
                mm= mm.replace('{1}',name);
                mm= mm.replace('{2}',id);
                mm= mm.replace('{3}',days);
                mm= mm.replace('{4}',info);
                mm= mm.replace('{5}',latLng);
                str=str + mm+',';
                count++;
            }
        }

        str=str.substring(0,str.length-1);
        str='['+str+']';
        window.localStorage.setItem('mytrip',str);
    }
    //下一步
    function NextStep() {
        $('.next-btn').on('click', function(ev){
            ev.stopPropagation();
            localSave();
        })
    }
    //日期
    function getDate(obj)
    {
        var offset=$(obj).offset();
        var h=$(obj).outerHeight();

        $('.Calendar').css({display:"block",position:"absolute",top:offset.top+h,left:offset.left,"z-index":99999}).attr('aimId','#'+$(obj).attr('id'))

    }
});