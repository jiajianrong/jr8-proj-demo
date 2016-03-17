/** 
 * @authors qianlu@58ganji.com   jiajianrong@58.com
 * @date    2016-03-17
 * 
 * 节流
 * 
 * Demo:
 * 
 * var fnc = throttle(   function(){console.log(this)},  3000,  {a:1}   );
 * fnc();
 * fnc();
 * fnc();
 * fnc();
 * fnc();
 */


define("libs/common.throttle", function(require, exports, module){


    function throttle(fn, delay, context) {
        var timer = null;
        
        
        return function() {
            var args = arguments;
            
            clearTimeout(timer);
            
            timer = setTimeout(function() {
                fn.apply( (context || null), args);
            }, delay);
        }
    }

    module.exports = throttle;

});