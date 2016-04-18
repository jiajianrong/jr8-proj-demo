/**
 * @require /static/scss/zepto.info.scss
 * 
 * @authors jiajianrong@58.com
 * @date    2015-12-04    2016-04-18
 * 
 * demo
 * $.info({ message:"请输入用户名和密码" });
 * 
 * $.info({ message:"请输入用户名和密码", 
 *          onDestroy: function(){},
 *          ...
 *       });
 */

define( 'libs/zepto.info', function(require, exports, module){

    var $ = require('zepto');
    require('libs/zepto.modal');
        
    
    (function(window, $) {
        
        // 缓存
        var tplFn = __inline('./zepto.info.tmpl');
        
        
        // 插件
        $.info = function(opts) {
            var info = new Info(opts);
            info.start();
        };
        
        
        // 类
        function Info(opts) {
            
            opts = (typeof opts === 'string') ? { message: opts } : opts;
            
            $.extend(opts, {
                '$cont': $( tplFn(opts) ),
                isTouchDestroy: true
            });
                
            this.opts = opts;
        }
        
        
        
        
        Info.prototype = {
            
            destroy: function(){
                this.modal.destroy();
            },
            
            start: function(){
                this.modal = $.modal(this.opts);
                this.modal.show();
            }
        };
        
    
    
    })(window, $);

    // zepto插件不需要return
    //return $;
} )