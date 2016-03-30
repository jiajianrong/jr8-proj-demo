/**
 * @require /static/scss/zepto.dialog.scss
 * 
 * @authors fuhebo@58ganji.com
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
            opts = (typeof opts === 'string') ? {
                type: "alert",
                message: opts
            } : opts;

            var dialog = new Dialog(opts);
            dialog.start();
        };


        // 类
        function Dialog(opts) {
            this.opts = opts;
        }

        Dialog.prototype = {
            start: function() {
                var _this = this;
                var opts = $.extend({
                    '$cont': $(tplFn(this.opts))
                }, this.opts);
                this.modal = $.modal(opts);
                var $mask = this.modal.$mask,
                    _this = this;
                $mask.find('.dialog-box-content').append(this.opts.message);

                if (this.opts.type && this.opts.type == "custom") {
                    var dialogSingle = $mask.find('.dialog-box-single'),
                        dialogDouble = $mask.find('.dialog-box-double');
                    dialogSingle.addClass('hidden'), dialogDouble.addClass('hidden');
                    $mask.find('.dialog-box-content').addClass("auto-min-height");
   
                } else if (this.opts.type && this.opts.type == "confirm") {
                    var dialogTitle = $mask.find('.dialog-box-title'),
                        dialogSingle = $mask.find('.dialog-box-single');
                    dialogSingle.addClass('hidden'), dialogTitle.addClass('hidden');
                    $mask.find('.dialog-box-content').addClass("auto-min-height");
                } else {
                    var dialogClose = $mask.find('.icon-close'),
                        dialogDouble = $mask.find('.dialog-box-double');
                    dialogClose.addClass('hidden'), dialogDouble.addClass('hidden');
                    $mask.find('.dialog-box-content').addClass("alert-min-height");
                }
                $mask.on('click', '.icon-close, .single-btn-true, .double-btn-cancle', function() {
                        _this.modal.destroy();
                    })
                $mask.on('click', '.double-btn-true', function() {
                        _this.modal.destroy();
                        typeof _this.opts.onConfirm === "function" ? _this.opts.onConfirm() : function() {};
                    })
                this.modal.show();
            }
        };
    })(window, $);
})