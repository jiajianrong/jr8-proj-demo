/**
 * @require /static/scss/zepto.dialog.scss
 * 
 * @authors fuhebo@58ganji.com    jiajianrong@58.com
 * @date 2016-04-18
 * 
 */


define('libs/zepto.dialog', function(require, exports, module) {

    var $ = require('zepto');
    require('libs/zepto.modal');


    (function(window, $) {

        // 缓存
        var tplFn = __inline('./zepto.dialog.tmpl');


        // 插件
        $.dialog = function(opts) {
            var dialog = new Dialog(opts);
            dialog.start();
        };


        // 类
        function Dialog(opts) {
            
            opts = (typeof opts === 'string') ? { type: "alert", message: opts } : opts;
            opts['$cont'] = $(tplFn(opts));
            
            this.opts = opts;
        }



        Dialog.prototype = {
            
            start: function() {
                
                var _this = this;
                
                this.modal = $.modal(this.opts);
                
                var $mask = this.modal.$mask;
                    
                $mask.find('.wi-modal-dialog-content').append(this.opts.message);
                
                $mask.on('click', '.wi-double-btn-cancle', function() {
                    _this.modal.destroy();
                    _this.opts.onCancel && _this.opts.onCancel();
                })
                $mask.on('click', '.wi-double-btn-true, .wi-single-btn-true', function() {
                    _this.modal.destroy();
                    _this.opts.onOk && _this.opts.onOk();
                })

                this.modal.show();
            }
        };
    })(window, $);
})