/**
 * @authors jiajianrong@58.com
 * @date    2015-01-19
 * 
 * 渲染date控件 - 默认样式
 */


define( 'libs/common.render.dateYear', function(require, exports, module) {
    //'use strict';

    
    require('libs/common.prototype.date');
    

    
    var render = (function(){
        
        
        var DAY_MS = 86400000,
            MIN=null,
            MAX=null,
            _week=["日","一","二","三","四","五","六"],
            yStart=null,
            yEnd=null,
            tplFn = __inline('./common.render.dateYear.tmpl');


        return function(date,selected,min,max,yStartYear,yEndYear){
            if(true){
                MIN=new Date(new Date(min||"1900-01-01").format("{yyyy}/{MM}/{dd}")).getTime();
                MAX=new Date(new Date(max||"2100-01-01").format("{yyyy}/{MM}/{dd}")).getTime();
                yStart = yStartYear || 1950;
                yEnd= yEndYear || 2020;
            }
            date=new Date(date);
            
            var res_week=[]
            for(var i=0;i<_week.length;i++){
                res_week.push("<li>"+_week[i]+"</li>");
            }
            
            var y=date.getFullYear(),M=date.getMonth(),d=date.getDate();
            var _t=new Date(y+"/"+(M+1)+"/1");
            _t=_t.getTime()-_t.getDay()*DAY_MS;
            
            var res=[];
            for(var i=0;i<42;i++,_t+=DAY_MS){
                var _date=new Date(_t),_M=_date.getMonth(),_d=_date.getDate(),_w=_date.getDay();
                var dis=_t<MIN||_t>MAX?true:false;
                if(i%7 == 0) res.push("<ul>");
                res.push("<li "+(_t==selected?"class='current'":"")+">"+(M==_M?(dis?("<span>"+_d+"</span>"):("<a href ='javascript:;' data-v='"+_t+"'>"+_d+"</a>")):"<span></span>")+"</li>");
                if(i%7 == 6) res.push("</ul>");
            }
            
            var _min=new Date(MIN),_max=new Date(MAX);
            
            //装配年月选择select
            var fullDateYear='';
            var fullDateMonth='';
            var endYear=yEnd < _max.getFullYear() ? yEnd : _max.getFullYear();//取最小年份
            
            return tplFn({
                baseTime: date.getTime(),
                yStart:yStart,
                yEnd:yEnd,
                thisYear:y,
                thisMonth:M+1,
                disablePrev: (y<=_min.getFullYear()&&M<=_min.getMonth()?"disable":""),
                disableNext: (y>=_max.getFullYear()&&M>=_max.getMonth()?"disable":""),
                baseWeek: res_week.join(""),
                baseContent: res.join("")
            });
            
            
        };
    })();



    return render;
});


