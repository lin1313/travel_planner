/**
 * Created by gaowy on 2016/9/9.
 */
//直线
function draw(p1,p2,map)
{
    var p1={lat:p1.lat(),lng:p1.lng()},
        p2={lat:p2.lat(),lng:p2.lng()};
    var LatLngLine=new google.maps.Polyline({
        path:[p1,p2],
        strokeColor:"red",
        strokeOpacity:0.4,
        strokeWeight:4
    });
    LatLngLine.setMap(map);//画线
    return LatLngLine;
}
//曲线
function draw1(p1,p2,map)
{


    var p1={x:lngToPixx(p1.lng(),map.getZoom()),y:latToPixy(p1.lat(),map.getZoom())},
        p2={x:lngToPixx(p2.lng(),map.getZoom()),y:latToPixy(p2.lat(),map.getZoom())};

    var arr=[];
    var GArray=[];
    var k;//斜率
    var o;//圆心
    var m=getM(p1,p2);//p1,p2 中点坐标
    var d=getD(p1,p2);//p1,p2两点间的距离
    if( Math.abs(p1.x-p2.x)<2 )//如果这两点间的直线垂直x轴
    {
        o={x: m.x+d,y: m.y};
    }
    else if( Math.abs(p1.y-p2.y)<2)//如果这两点间的直线垂直y轴
    {
        o={x: m.x,y: m.y+d};
    }
    else //不垂直
    {
         k=getK(p1,p2);
         o=getO(m,k,d,1);
    }
    arr.push(p1,p2) ;


    var r=parseFloat(Math.sqrt(Math.pow(d/2,2)+Math.pow(d,2)).toFixed(2))
    var maxX=Math.max(p1.x,p2.x);
    var maxY=Math.max(p1.y,p2.y);
    var minY=Math.min(p1.y,p2.y);

    for (var i=0;i<360;i+=3)
    {
        var x= o.x+r*Math.sin(i*Math.PI/180)
        var y= o.y+r*Math.cos(i*Math.PI/180)
       // if(x<=maxX && y>=minY && y<=maxY)
       //{arr.push({x:x,y:y})};


       if( Math.abs(p1.y-p2.y)<2)//如果这两点间的直线垂直Y轴
        {
            if(x<=maxX && y<=minY )
            {arr.push({x:x,y:y})};
        }
        else
        {
            if((p1.y>p2.y && p1.x>p2.x)||(p1.y<p2.y && p1.x<p2.x))
            {
                if(x<=maxX &&  y>=minY )
                {arr.push({x:x,y:y})}
            }
            else if((p1.x<p2.x && p1.y>p2.y)||(p1.x>p2.x && p1.y<p2.y))
            {
                if(x<=maxX && y<=maxY)
                {arr.push({x:x,y:y})}
            }
        }


    }


    for(var s= 0;s<arr.length;s++)
    {
        GArray.push({lat:pixyToLat(arr[s].y,map.getZoom()),lng:pixxToLng(arr[s].x,map.getZoom())})
    }


    if(Math.abs(p1.x-p2.x)>Math.abs(p1.y-p2.y))
    {
        GArray.sort(function(a,b){return a.lng- b.lng})
    }
    else
    {
        GArray.sort(function(a,b){return a.lat- b.lat})
    }
    //console.log('GArray,length',GArray)
    var LatLngLine=new google.maps.Polyline({
        path:GArray,
        strokeColor:"green",
        strokeOpacity:1,
        strokeWeight:5
    });
    LatLngLine.setMap(map);//画线
    return LatLngLine;
}

//求经过a,b两点直线的斜率
function getK(p1,p2)
{
    return ((p2.y-p1.y)/(p2.x-p1.x)).toFixed(2);
}
//求a,b中心点坐标
function getM(p1,p2)
{
    return{x:parseFloat(((p1.x+p2.x)/2.0).toFixed(2)),y:parseFloat(((p1.y+p2.y)/2.0).toFixed(2))};
}
//求半径
function getD(p1,p2,rate)
{
    return Math.floor(Math.sqrt(Math.pow((p2.y-p1.y),2)+Math.pow((p2.x-p1.x),2)));
}


//求圆心
function getO(m,k,r,flag)
{
    // console.log('flag',m,k,r);

    var sqrt=Math.sqrt((r*r*k*k)/(1+k*k));
    var x,y;
    if(flag)
    {
        x= m.x +parseFloat(sqrt.toFixed(2));
        y=parseFloat((-(x- m.x)/k+ m.y).toFixed(2));
    }
    else
    {
        x= m.x -parseFloat(sqrt.toFixed(2));
        y=parseFloat((-(x- m.x)/k+ m.y).toFixed(2));
    }
    return{x:x,y:y};
}


//-------------------------------------------------------------------------------

//经度转坐标x
function lngToPixx(lng,zoom){
    return(lng+180)*(256<<zoom)/360;
}
//纬度转坐标Y
function latToPixy(lat,zoom)
{
    var siny=Math.sin(lat*Math.PI/180);
    var y=Math.log((1+siny)/(1-siny));
    return(128<<zoom)*(1-y/(2*Math.PI))
}

//像素坐标x转成经度
function pixxToLng(pixx,zoom)
{
    return pixx*360/(256<<zoom)-180
}
//像素坐标y转成纬度
function pixyToLat(pixy,zoom){
    var y=2*Math.PI*(1-pixy/(128<<zoom));
    var z=Math.pow(Math.E,y);
    var siny=(z-1)/(z+1);
    return Math.asin(siny)*180/Math.PI

}

//路线连接距离时间查询
var LatLngLine;
function getRoute(star,end,middle,mode,distance,duration)
{
    var directionsService = new google.maps.DirectionsService();
    var render;
    var request={optimizeWaypoints: true},waypoints=[] ;
    if(mode=='WALKING') //步行
    {
        request.travelMode=google.maps.DirectionsTravelMode.WALKING;
    }
    else if(mode=='BICYCLING')//骑车
    {
        request.travelMode=google.maps.DirectionsTravelMode.DRIVING;
    }
    else if(mode=='DRIVING')//驾车
    {
        request.travelMode=google.maps.DirectionsTravelMode.DRIVING;
    }
    else (mode=='TRANSIT')//公交
    {
        request.travelMode=google.maps.DirectionsTravelMode.DRIVING;
    }
    if(middle.length)
    {
        for (var i = 0; i < middle.length; i++) {
            waypoints.push({
                location: middle[i],
                stopover: true
            });
        }
        request.waypoints= waypoints;
    }
    request.origin=star;
    request.destination=end;
    directionsService.route(request,function(response,status){
        if (status == google.maps.DirectionsStatus.OK) {
            var route = response.routes[0];
            var len = distance.length-1;
            for(var i = 0;i<distance.length-1;i++){
                distance.eq(i).html(route.legs[i].distance.value + '米');
                duration.eq(i).html(route.legs[i].duration.text);
            }
            distance.eq(len).html(0);
            duration.eq(len).html(0);

            //清空路线
            if(LatLngLine){
                LatLngLine.setMap(null);
            }
            LatLngLine = new google.maps.Polyline({
                path:response.routes[0].overview_path,
                strokeColor:"#fb4f54",
                strokeWeight:5
            });
            LatLngLine.setMap(map);
        }
    });
    return render
}
