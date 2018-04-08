/**
 * Created by dell on 2016/9/19.
 */
$(function(){
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    createCalendar(year,month)
    $('.yleft').on('click',function(ev){
        ev.stopPropagation();
        var year=parseInt($('.year').val())-1;
        var month=parseInt($('.month').val());
        $('.year').val(year+'年');
        createCalendar(year,month)
    })
    $('.yright').on('click',function(ev){
        ev.stopPropagation();
        var year=parseInt($('.year').val())+1;
        var month=parseInt($('.month').val());
        $('.year').val(year+'年');
        createCalendar(year,month)

    })
    $('.mleft').on('click',function(ev){
        ev.stopPropagation();
        var year=parseInt($('.year').val());
        var month=parseInt($('.month').val())-1;
        if(month==0)
        {year=year-1;month=12}
        $('.year').val(year+'年');
        $('.month').val(month+'月');
        createCalendar(year,month)
    })
    $('.mright').on('click',function(ev){
        ev.stopPropagation();
        var year=parseInt($('.year').val());
        var month=parseInt($('.month').val())+1;
        if(month==13)
        {year=year+1;month=1}
        $('.year').val(year+'年');
        $('.month').val(month+'月');
        createCalendar(year,month)
    })
    //显示月份下拉列表
    $('.mdown').on('click',function(ev)
    {
        ev.stopPropagation();
        $('.contain_ms').addClass('show');
        $('.contain_ys').removeClass('show');
        var index=parseInt($('.month').val())-1;
        var dls=$('.dd_ms dl');
        $(dls).removeClass('mark').eq(index).addClass('mark')
    })
    //显示年下拉列表
    $('.ydown').on('click',function(ev)
    {
        ev.stopPropagation();
        var year=parseInt($('.year').val());
        $('.contain_ys').addClass('show');
        $('.contain_ms').removeClass('show');
        createYear(year,true)
    })
    //年份向上翻页
    $('.ysup').on('click',function(ev)
    {
        ev.stopPropagation();
        var year=parseInt($('.dd_ys dl').eq(0).html())-14;
        createYear(year,false)
    })
    //年份向下翻页
    $('.ysdown').on('click',function(ev)
    {
        ev.stopPropagation();
        var year=parseInt($('.dd_ys dl').last().html())+1;
        createYear(year,false)
    })

    //年分下拉选项被点击时
    $('.dd_ys').on('click',function(ev)
    {
        ev.stopPropagation();
        //隐藏月份选择框
        $('.contain_ms').removeClass('show');
        //获取当前年份
        var year=parseInt($('.year').val())
        var month=parseInt($('.month').val())
        //获取被点击的dl
        var srcElem = ev.target;
        if($(srcElem).hasClass('void'))
        {
            //如果年份是灰色的，阻止冒泡到document
            ev.stopPropagation();
            createYear(year,true)
        }
        else
        {
            var newyear=$(srcElem).html();
            $('.year').val(newyear);
            $(this).parent().removeClass('show');
            createCalendar(parseInt(newyear),month)
        }
    })
    //月份下拉选项被点击时
    $('.dd_ms').on('click',function(ev)
    {
        ev.stopPropagation();
        //隐藏月份选择框
        $('.contain_ms').removeClass('show');
        //获取当前年份
        var year=parseInt($('.year').val());
        var index=parseInt($('.month').val())-1;
        //获取被点击的dl
        var srcElem = ev.target;
        var month=$(srcElem).html()
        $('.month').val(month)
        createCalendar(year,parseInt(month));

    })
    //今天
    $('.current').on('click',function(ev){
        ev.stopPropagation();
        var date=new Date();
        var year= year||date.getFullYear();
        var month=month ||date.getMonth()+1;
        createCalendar(year,month)
        $('.year').val(year+'年');
        $('.month').val(month+'月');
    })
    //确定按钮
    $('.datecomfirm').on('click',function(){
        $('.Calendar').attr('style','');
    })
    //隐藏年，月选择框
    $(document).on('click',function(ev)
    {
        $('.contain_ys').removeClass('show');
        $('.contain_ms').removeClass('show');
    })
    //td被点击时触发
    $('.Calendar td').on('click',function(ev){
        var year=$(this).attr('y');
        var month=$(this).attr('m');
        var date=$(this).attr('d');
        month=month<10?'0'+month:month;
        date=date<10?'0'+date:date;

        var newdate=new Date(year,month-1,date);
        var id=$('.Calendar').attr('aimId');
        $(id).val(year+'-'+month+'-'+date)
        $('.Calendar').attr('style','')

    })
})
var curDate = new Date();
var preDate = new Date(curDate.getTime() - 24*60*60*1000);  //前一天
var nextDate = new Date(curDate.getTime() + 24*60*60*1000);  //后一天
//获取每个月的天数
function getDays(year,month)
{
    return  new Date(year,month, 0).getDate()
}
//初始化日历
function createCalendar(year,month)
{
    var date=new Date();
    var days;//记录每个月的天数
    var year= year||date.getFullYear();
    var month=month ||date.getMonth()+1;
    var currentDay=date.getDate();
    //var month=12;
    //清空表格数据
    var tds=$('.Calendar').find('td').html('').removeClass('void').removeClass('currentDate');;
    //取得月份天数
    days=getDays(year,month);
    //创建一个新的日期，用来获取当月的第一天是一周中的第几天，星期天是0
    var dateNew=new Date();
    dateNew.setFullYear(year);
    dateNew.setMonth(month-1);
    dateNew.setDate(1);
    var day=dateNew.getDay();
    switch (day)
    {
        case 0:
            for(var i=0;i<days;i++){
                $(tds).eq(i).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i).addClass('currentDate'):null;
            }
            break;
        case 1:
            for(var i=0;i<days;i++){
                $(tds).eq(i+1).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+1).addClass('currentDate'):null;
            }
            break;
        case 2:
            for(var i=0;i<days;i++){
                $(tds).eq(i+2).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+2).addClass('currentDate'):null;
            }
            break;
        case 3:
            for(var i=0;i<days;i++){
                $(tds).eq(i+3).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+3).addClass('currentDate'):null;
            }
            break;
        case 4:
            for(var i=0;i<days;i++){
                $(tds).eq(i+4).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+4).addClass('currentDate'):null;
            }
            break;
        case 5:
            for(var i=0;i<days;i++){
                $(tds).eq(i+5).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+5).addClass('currentDate'):null;
            }
            break;
        case 6:
            for(var i=0;i<days;i++){
                $(tds).eq(i+6).html(i+1).attr({y:year,m:month,d:i+1});
                i+1==currentDay? $(tds).eq(i+6).addClass('currentDate'):null;
            }
            break;
        default :break;
    }
    //填充
    //填充上个月的数据
    for(var i=0;i<day;i++)
    {
        var preday=new Date(dateNew.getTime()-(day-i)* 24*60*60*1000);
        $(tds).eq(i).html(preday.getDate()).addClass('void').attr({y:preday.getFullYear(),m:preday.getMonth()+1,d:preday.getDate()});
    }
    //填充下个月的数据
    for(var i=days+day;i<42;i++)
    {
        var d=i-(days+day)+1
        var nextday=new Date(new Date(year,month-1,days).getTime()+d* 24*60*60*1000);
        $(tds).eq(i).html(nextday.getDate()).addClass('void').attr({y:nextday.getFullYear(),m:nextday.getMonth()+1,d:nextday.getDate()});
    }
}
//年选项
function createYear(year,flag)
{
    var lis=$('.dd_ys dl').removeClass('void')
    $(lis).eq(7).removeClass('mark')
    //var m=Math.floor($(lis).length/2);
    var newyear=0;
    if(flag)
    {

        for(var i=0;i<7;i++)
        {
            $(lis).eq(i).html((year-7+i)+'年')
        }
        for(var i=8;i<14;i++)
        {
            newyear=year +i-7;
            newyear < 1900 || newyear > 2100 ? $(lis).eq(i).html(newyear+'年').addClass('void'):$(lis).eq(i).html(newyear +'年');
        }
        $(lis).eq(7).html(year+'年')
    }
    else
    {
        for(var i=0;i<lis.length;i++)
        {
            var newyear=year +i
            newyear < 1900 || newyear > 2100 ?$(lis).eq(i).html(newyear +'年').addClass('void'):$(lis).eq(i).html(newyear +'年');
        }
    }

    if ($(lis).eq(7).html()==$('.year').val())
    {$(lis).eq(7).addClass('mark')}
}

