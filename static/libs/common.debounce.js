/** 
 * @authors jiajianrong@58.com
 * @date    2016-04-19
 * 
 * 节流
 * 
 * Demo:
 * 
 * var fnc = debounce(   function(){console.log(this)},  3000,  {a:1}   );
 * setInterval(fnc, 500);
 */


define("libs/common.debounce", function(require, exports, module){


    function debounce(fn, delay, context) {
        
        var timer = null,
            last = 0;
        
        
        return function() {
            var args = arguments;
            
            var curr = +new Date();
            var diff = curr - last - delay;
            
            if (diff>=0) {
                last = curr;
                fn.apply( (context || null), args);
            }
        }
    }

    module.exports = debounce;

});