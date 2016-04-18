/**
 * @authors jiajianrong@58.com
 * @date    2016-04-15
 * 
 * 仅限于处理导流组form出错的情形
 * 依赖ui-form结构
 */

define( 'libs/zepto.form.error.render', function(require, exports, module){
    
    var $ = require('zepto');
    
    return function(msgMap) {
        
        
        var arr = [],
            str = '请先填选：';
        
        $.each(msgMap, function(k,v){
            arr.push(v);
        })
        
        str += arr.slice(0,3).join('、');
        
        
        
        var $info = $('.ui-form-btmbtn .info-wrap');
        
        $info.text(str);
        $info.show();
        
        
    }
} )