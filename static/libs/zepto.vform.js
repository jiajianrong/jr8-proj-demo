/**
 * @authors jiajianrong@58.com
 * @date    2016-03-24
 */

define( 'libs/zepto.vform', function(require, exports, module){
    
    var $ = require('zepto');
    
    require('libs/zepto.form');
    
    
    
    
    
	// copy constructor
	$.fn.vform = (new Function( 'return ' + $.fn.form.toString().replace(/\$\.fn\.form/, '$.fn.vform') ))();
	
	
	// copy prototype
	$.extend(true, $.fn.vform.methods = {}, $.fn.form.methods);
    
    
    // override prototype
    $.fn.vform.methods.onvalidate = function(options){
            
        if ( !options || !(typeof options == 'object') )
            return;
        
        if ( this._result.isValid && options.success )
            options.success.call(this);
            
        if ( !this._result.isValid ) {
            
            var messages = this._result.messages;
            
            options.error && options.error.call(this, messages);
            
            for(var key in messages) { // key ==> value
                var msg = messages[key];
                this.find('[name='+ key +']').parent().find('[data-err]').html(msg);
            }
        }
            
            
            
            
            
            
            
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    // zepto插件不需要return
    //return $;
} )