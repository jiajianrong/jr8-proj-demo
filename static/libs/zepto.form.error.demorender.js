/**
 * @authors jiajianrong@58.com
 * @date    2016-04-15
 * 用来在demo页显示err
 */

define( 'libs/zepto.form.error.demorender', function(require, exports, module){
    
    var $ = require('zepto');
    
    return function(msgMap) {
        
        
        
        $.each(msgMap, function(k,v){
            this.find('[name='+ k +']').parent().find('[data-err]').html(v);
        }.bind(this))
        
    }
} )