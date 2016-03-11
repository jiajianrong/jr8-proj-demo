/**
 * @authors jiajianrong@58.com
 * @date    2015-01-19
 * 
 * 渲染date控件 - 默认样式
 */


define( 'libs/common.render.date', function(require, exports, module) {
    //'use strict';

    
    require('libs/common.prototype.date');
    

    
    var render = (function(){
        
        
        var DAY_MS = 86400000,
            MIN=null,
            MAX=null,
            _week=["日","一","二","三","四","五","六"],
            
            tplFn = __inline('./common.render.date.tmpl');

        return function(date,selected,min,max){
            if(true){
                MIN=new Date(new Date(min||"1900-01-01").format("{yyyy}/{MM}/{dd}")).getTime();
                MAX=new Date(new Date(max||"2100-01-01").format("{yyyy}/{MM}/{dd}")).getTime();
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
            
            
            return tplFn({
                baseTime: date.getTime(),
                baseTitle: date.format("{yyyy}年{MM}月"),
                disablePrev: (y<=_min.getFullYear()&&M<=_min.getMonth()?"disable":""),
                disableNext: (y>=_max.getFullYear()&&M>=_max.getMonth()?"disable":""),
                baseWeek: res_week.join(""),
                baseContent: res.join("")
            });
            
            
            // comment on 2016-01-23 jiajianrong
            // 使用tmpl代替
//          return  
//          
//          "<div data-v="+date.getTime()+" class='widget-date' data-date>"+
//              "<div class='widget-date-head'>"+
//                  "<a data-date-prev class='widget-date-prev "+ (y<=_min.getFullYear()&&M<=_min.getMonth()?"disable":"") +"' href='javascript:;'></a><span>"+
//                  date.format("{yyyy}年{MM}月")+
//                  "</span><a data-date-next class='widget-date-next "+ (y>=_max.getFullYear()&&M>=_max.getMonth()?"disable":"") +"' href='javascript:;'></a></div>"+
//              "<ul class='widget-date-week'>"+res_week.join("")+"</ul>"+
//              "<div class='widget-date-day'>"+res.join("")+"</div>"+
//          "</div>";
        };
    })();



    return render;
});


