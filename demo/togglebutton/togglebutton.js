
define("demo/togglebutton/togglebutton", function(require, exports, module){

    module.exports = function(opt) {

        require('libs/zepto.togglebutton');

        var $ = require('zepto');
            
        $('.toggle-btn').togglebutton();
        
    }; 
});

