define('libs/zepto.fileupload', function(require, exports, module) {
    //'use strict';
    var $ = require('zepto'),
        file = require('libs/common.fileupload');

    $.fn.fileupload = function(opts, param) {
        if (typeof opts == 'string')
            $.fn.fileupload.methods[opts].call(this, param);
        else
            throw ('第一个参数必须为字符串！');
    };

    /**
     * 直接挂在方法form上 --- easyui写法
     */
    $.fn.fileupload.methods = {
        setState: function(options) {
            options = Object.prototype.toString.call(options) === "[object Array]" ? options : Array.prototype.slice.call(arguments);
            var setAllState,
                state;
            for (var i = 0, len = options.length; i < len; i++) {
                if (options[i] && options[i].state != undefined) {
                    if (options[i].id == undefined) {
                        setAllState = true;
                        state = options[i].state;
                        break;
                    }
                } else
                    throw ("请传入参数不正确!");
            }
            if (!!setAllState)
                $(this).find('div.m-list').attr('data-state', state);
            else {
                for (i = 0; i < len; i++) {
                    if (options[i] && options[i].state != undefined && options[i].id != undefined)
                        $(this).find('input[id=' + options[i].id + ']').closest('div.m-list').attr('data-state', options[i].state);
                    else
                        throw ("请传入参数不正确!");
                }
            }
        },

        initFileUpLoad: function(options) {
            options = Object.prototype.toString.call(options) === "[object Array]" ? options : Array.prototype.slice.call(arguments);
            for (var j = 0, len = options.length; j < len; j++) {
                (function(i, _this) {
                    _this.append(file.fileUpLoadView(options[i].id, options[i].title, options[i].maxuploadnum, options[i].datarequire, options[i].imgarray));

                    var item = $(_this).find('input[id=' + options[i].id + ']').closest('div.m-list');
                    item.on('change', 'input[type="file"]', function() {
                        file.selectFile(this, options[i].userparams, options[i].uploadurl, options[i].filesize, options[i].fileparams);
                    });
                    item.on('focus', 'input[type="file"]', function() {
                        var __this = $(this),
                            state = __this.closest('div.m-list').data('state'),
                            disabled = __this.attr('disabled');
                        if ((state != '0' || state != 0) && !disabled)
                            __this.attr('disabled', 'disabled');
                        else
                            __this.removeAttr('disabled');
                    });
                    item.on('click', 'div.m-list div.m-item', function(ev) {
                        file.doReview(this, ev, $(this).data('src'), options[i].userparams, options[i].deleteurl);
                    });
                })(j, this);
            }
        }
    }
});