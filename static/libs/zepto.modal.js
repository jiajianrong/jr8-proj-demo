/**
 * @authors jiajianrong@58.com
 * @date    2015-12-19
 * 
 * demo
 * 
    require('libs/zepto.modal');
    
    var modal = $.modal({
        '$cont': $dialog,
        isTouchHide: true,
        onInit: function(){},
        onShow: function(){},
        onHide: function(){},
        onDestroy: function(){}
    });
    
    modal.show();
 */

define( 'libs/zepto.modal', function(require, exports, module){
    
    var $ = require('zepto'),
        tplFnModal = __inline('./zepto.modal.tmpl'),
        $body = $('body');
    
    
    function Modal(opts) {
        this.$mask = $( tplFnModal() );
        this.$cont = opts.$cont;
        this.isTouchHide = opts.isTouchHide;
        this.isTouchDestroy = opts.isTouchDestroy;
        
        // mixin callback
        ['onInit','onShow','onHide','onDestroy'].forEach( $.proxy( function(item){
            this[item] = opts[item] || function(){};
        }, this) );
        
        
        this.init();
    }
    
    
    Modal.prototype = {
        
        init: function() {
            this.$mask.append(this.$cont);
            
            $body.append(this.$mask);
            
            var _this = this;
            
            if (this.isTouchHide) {
                this.$mask.on( 'click', function(){
                    _this.hide();
                } );
            }
            if (this.isTouchDestroy) {
                this.$mask.on( 'click', function(){
                    _this.destroy();
                } );
            }
            
            // 处理菜单展开时，切换屏的问题
            window.onorientationchange=function(){
                _this.hide();
            }
            
            this.onInit();
        },
        
        
        show: function() {
            this.$mask.show();
            this.onShow();
        },
        
        
        hide: function() {
            this.$mask.hide();
            this.onHide();
        },
        
        
        destroy: function() {
            this.$mask.off().remove();
            this.onDestroy();
        }
    };
    
    
    
    $.modal = function(opts) {
        
        var modal = new Modal(opts);
        
        return modal;
    }

    // zepto插件不需要return
    //return $;
} )