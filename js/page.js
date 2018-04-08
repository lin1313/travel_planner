/**
 * Created by dell on 2016/10/10.
 */
function GetPages(options){
    //this.num = options.num;//景点总个数
    this.listCount = options.listCount;//每一页显示多少个景点
    this.pageCount = options.pageCount;//每一行显示多少页
    this.times = options.times;//鼠标点击几次箭头
    this.currentPage = options.currentPage;//当前行第一个页数是多少
    this.currentList = options.currentList;//记录当前页第一个景点的序号
}

//下一页
GetPages.prototype.goNext = function(num,obj1,info,obj2,obj3,obj4,obj5){
    if(this.times < Math.floor((num/this.listCount)/this.pageCount)){
        this.times++;
    }
    if(this.currentPage + this.pageCount <= Math.ceil(num/this.listCount)){
        this.currentPage += this.pageCount;
    }
    if(this.currentList < num){
        this.currentList = this.listCount * this.pageCount * this.times;//当前显示的景点序号 count每页景点数 pageCount页数 e页数翻了几页
    }
    this.createTripList(num,obj1,info);
    this.createPageList(num,obj2,obj3,obj4,obj5);
}

//上一页
GetPages.prototype.goPrev = function(num,obj1,info,obj2,obj3,obj4,obj5){
    if(this.times > 0){
        this.times--;
    }
    if(this.currentPage > 0){
        this.currentPage -= this.pageCount;
    }
    if(this.currentList > 0 && this.currentList < num){
        this.currentList = this.listCount * this.pageCount * this.times;//当前显示的景点序号 count每页景点数 pageCount页数 e页数翻了几页
    }
    this.createTripList(num,obj1,info);
    this.createPageList(num,obj2,obj3,obj4,obj5);
}

//构建景点列表
GetPages.prototype.createTripList = function(num,obj1,info){
    var c = new Templete();
    var remainder = num % this.listCount;

    if(this.currentList + remainder != num){
        if(this.currentList - remainder < num){//当前的景点的序号加上余数是否小于景点总数
            $(obj1).empty().append(c.create_trip_items(this.currentList,this.listCount,info));
        }else if(this.currentList + remainder > num){
            $(obj1).empty().append(c.create_trip_items(this.currentList,remainder,info));
        }
    }else if(this.currentList + remainder == num){
        $(obj1).empty().append(c.create_trip_items(this.currentList,remainder,info));
    }
}

//构建页数列表
GetPages.prototype.createPageList = function(num,obj2,obj3,obj4,obj5){
    var pages = Math.ceil(num / this.listCount);//向上取整数
    var remainder  = pages % this.pageCount;
    var c = new Templete();

    $(obj2).removeAttr('disabled');
    if(this.times == 0){
        $(obj3).attr('disabled',true);
    }

    if(remainder > 0){
        if(this.currentPage + remainder < pages){//当前的页数加上余数是否小于总页数
            $(obj4).empty().append(c.create_pages_items(this.currentPage,this.pageCount));
            $(obj4).find('.li').eq(0).addClass('current').removeClass('normal').siblings().addClass('normal');

        }
        if(this.currentPage + remainder > pages || this.currentPage + remainder == pages){
            $(obj4).empty().append(c.create_pages_items_other(this.pageCount,pages,this.currentPage,remainder));
            $(obj5).attr('disabled',true);
            $(obj4).find('.li').eq(0).addClass('current').removeClass('normal').siblings().addClass('normal');
        }
    }

    if(remainder == 0){
        if(this.currentPage + this.pageCount < pages){//当前的页数加上余数是否小于总页数
            $(obj4).empty().append(c.create_pages_items(this.currentPage,this.pageCount));
            $(obj4).find('.li').eq(0).addClass('current').removeClass('normal').siblings().addClass('normal');

        }else if(this.currentPage + this.pageCount > pages){
            $(obj4).empty().append(c.create_pages_items_other(this.pageCount,pages,this.currentPage,this.pageCount));
            $(obj5).attr('disabled',true);
            $(obj4).find('.li').eq(0).addClass('current').removeClass('normal').siblings().addClass('normal');
        }
    }
}

//页数点击事件操作
GetPages.prototype.pageClick = function(num,elem,obj7,info){
    //var elem = event.target;
    var index = 0;

    if($(elem).hasClass('li')){
        var liFirst = $(elem).parents('ul').find('li').eq(0);
        if($(liFirst).hasClass('more')){
            index = $(elem).index()-1;
        }else{
            index = $(elem).index();
        }

        $(elem).addClass('current').removeClass('normal').siblings().removeClass('current').addClass('normal');

        if(index + this.times * this.pageCount == 0){
            this.currentList = 0;
        }else{
            this.currentList = this.listCount * (index + this.times * this.pageCount);
        }
        this.createTripList(num,obj7,info);
    }
}