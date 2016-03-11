/**
 * @authors jiajianrong@58.com
 * @date    2015-12-04
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
            opts = (typeof opts === 'string') ? { message: opts } : opts;
            
            var info = new Info(opts);
            info.start();
        };
        
        
        // 类
        function Info(opts) {
            this.opts = opts;
        }
        
        Info.prototype = {
            
            destroy: function(){
                this.modal.destroy();
            },
            
            start: function(){
                
                var opts = $.extend( {
                    '$cont': $( tplFn({message: this.opts.message}) ),
                    isTouchDestroy: true
                }, this.opts);
                
                this.modal = $.modal(opts);
                
                this.modal.show();
                
            }
        };
        
    
    
    })(window, $);

    // zepto插件不需要return
    //return $;
} )