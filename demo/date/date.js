define("demo/date/date", function(require, exports, module){

    
    module.exports = function(opt) {
        
        var $ = require('zepto');
        
        
        
        require('libs/zepto.date');
        
        
        
//      $('[name=start_date]').date({defaultTime:'2010-01-10'});
//      $('[name=end_date]').date();
        
        $('[name=start_date],[name=end_date]').date();
        
        
        

    };
});