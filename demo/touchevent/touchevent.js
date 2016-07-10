
define("demo/touchevent/touchevent", function(require, exports, module){

    module.exports = function(opt) {
        
        var $ = require('zepto');
        
        var div = $('#div')[0];
        
        document.body.addEventListener('touchmove', function(e){   
            var ct = e.changedTouches[0];
            var tt = e.targetTouches[0];
            
            
            div.innerText = (div.innerText || '') + '\n' + 
            
                     parseInt(ct.screenY) + ', ' + 
                     parseInt(ct.clientY) + ', ' + 
                     parseInt(ct.pageY) + '\n' + 
                     
                     parseInt(tt.screenY) + ', ' + 
                     parseInt(tt.clientY) + ', ' + 
                     parseInt(tt.pageY);
         })
        
    };
});

