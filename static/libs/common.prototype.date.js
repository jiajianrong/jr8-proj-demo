/**
 * @authors jiajianrong@58.com
 * @date    2015-01-21
 * 
 */


define( 'libs/common.prototype.date', function(require, exports, module) {
    'use strict';

    
    
    Date.prototype.format=function(){
        var _0=function(){
            return this<10?("0"+this):this;
        };
        return function(s){
            var map={
                y:this.getFullYear(),
                M:_0.call(this.getMonth()+1),
                d:_0.call(this.getDate()),
                H:_0.call(this.getHours()),
                m:_0.call(this.getMinutes()),
                s:_0.call(this.getSeconds())};
            return (s||"{y}-{M}-{d} {H}:{m}:{s}").replace( /{(y|M|d|H|m|s)+}/g, function(s,t){
                return map[t];
            });
        };
    }();
    
    
    Date.prototype.ago=function(long,ago){
        if(!long)return this;
        ago=!/day|week|month|year/i.test(ago)?"day":ago.toLowerCase();
        if(ago=="day")return new Date(this.getTime()-long*86400000);
        if(ago=="week")return new Date(this.getTime()-long*7*86400000);
        
        var y=this.getFullYear(),
            M=this.getMonth()+1,
            d=this.getDate(),
            time=this.getHours()+":"+this.getMinutes()+":"+this.getSeconds();
            
        if(ago=="month"){
            M-=long;
            y+=parseInt(M/12);
            M=M%12;
            if(M<=0){
                M=12+M;
                y--;
            }
        }else if(ago=="year"){
            y-=long;
        }
        var date=new Date(M+"/"+d+"/"+y+" "+time);
        
        
        return date.getDate()!=d ? 
            new Date((M+1)+"/1/"+y+" "+time).ago(1) : date;
    };



    
});


