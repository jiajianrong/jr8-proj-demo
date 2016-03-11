/**
 * @authors jiajianrong@58.com
 * @date    2015-12-08
 * 
 * 用法
 * <div class="toggle-btn">
        <span class="off" data-alternative="on">off</span>
        <input type="hidden" name="mortgage" value="0" data-alternative="1" />
    </div>
    
    $('.toggle-btn', $form).togglebutton();
 */

define( 'libs/zepto.togglebutton', function(require, exports, module){

    var $ = require('zepto');
    
    (function(window, $) {
        
        // 插件
        $.fn.togglebutton = function(opts) {
            this.each(function(){
                var btn = new ToggleButton(opts);
                btn.start.call($(this));
            });
        };
        
        
        // 类
        function ToggleButton(opts) {
            this.opts = opts;
        }
        
        
        ToggleButton.prototype = {
            
            start: function(){
                
                var $span = this.find('span'),
                    $input = this.find('input'),
                    
                    labelDef = $span.text(),
                    labelAlt = $span.data('alternative'),
                    
                    valueDef = $input.val(),
                    valueAlt = $input.data('alternative'),
                    
                    flag = !0;
                
                
                this.on("click", function() {
                    
                    $(this).toggleClass('toggle-off toggle-on');
                    
                    flag = !flag;
                    
                    $span.text( flag ? labelDef : labelAlt );
                    $input.val( flag ? valueDef : valueAlt );
                    
                    return false;
                });
                
            }
        };
        
    
    
    })(window, $);

    // zepto插件不需要return
    //return $;
} )