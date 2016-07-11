
define("demo/swipecon/swipecon", function(require, exports, module){

    module.exports = function(opt) {
        
        var $ = require('zepto');
        require('libs/zepto.swipe.con');
        
        $('.wrap').swipecon();
        
    };
});

