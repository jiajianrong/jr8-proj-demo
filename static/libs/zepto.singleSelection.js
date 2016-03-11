define('libs/zepto.singleSelection', function(require, exports, module) {
    var $ = require('zepto');
    require('libs/zepto.modal');

    var tplFn = __inline('./zepto.singleSelection.tmpl');

    function Modal(obj) {
        this.opts = obj;
        var opts = $.extend({
            '$cont': $(tplFn(this.opts)),
            onShow: function() {
                this.$mask.on('click', '.singleSelection-option>li', function(e) {
                    var $li = $(e.target).closest('li'),
                        $select = _this.opts.$select;
                    if (!$li.hasClass('checked')) {
                        $li.addClass('checked').siblings('.checked').removeClass('checked');
                        var _selectText = $li.text();
                        var _selectValue = $li.data('value');
                        $select.text(_selectText).removeClass('placeholder').prev('.singleSelection-hidden').val(_selectValue || _selectText);
                        $select.next('.singleSelection-option-con').find('.singleSelection-option li').eq($li.index()).addClass('checked').siblings('.checked').removeClass('checked');
                    }
                    setTimeout(function() {
                        _this.modal.destroy();
                    }, 100);
                });
            }
        }, this.opts);
        this.modal = $.modal(opts);
        var $mask = this.modal.$mask,
            _this = this;
        $mask.find('.single-selection-content').append(this.opts.message);
        $mask.find('.single-selection-content').addClass("single-selection-height");
        $mask.on('click', '.selection-icon-close', function() {
            _this.modal.destroy();
        })
        this.modal.show();
    };


    $.fn.singleSelection = function(opts, param) {
        if (typeof opts == 'string')
            $.fn.singleSelection.methods[opts].call(this, param);
        else
            throw ('第一个参数必须为字符串！');
    };

    $.fn.singleSelection.methods = {
        init: function(options) {
            function creatSingleSelect(obj) {
                var maindiv;
                if (obj.id && obj.selections && obj.singleSelectTitle) {
                    var divBorder = $("<div class = 'singleSelection-border'></div>"),
                        label,
                        divcon = $("<div class='singleSelection-con'></div>"),
                        italic = $("<i class='icon icon-select'></i>"),
                        input,
                        divSelectValue,
                        divSelect,
                        singleSelection = $("<section class='singleSelection-option-con'></section>"),
                        ul = $("<ul class='singleSelection-option'></ul>");
                    maindiv = $("<div class = 'singleSelection-item' id = '" + obj.id + "'></div>");
                    if (obj.filedName)
                        label = $("<label>" + obj.filedName + "</label>");
                    if (Object.prototype.toString.call(obj.selections) === "[object Object]")
                        for (var p in obj.selections) {
                            if (p == obj.autoKey) {
                                ul.append($("<li data-value = '" + p + "' class = 'checked'><i class='icon icon-radio'></i>" + obj.selections[p] + "</li>"));
                                obj.autoValue = obj.selections[p];
                            } else
                                ul.append($("<li data-value = '" + p + "'><i class='icon icon-radio'></i>" + obj.selections[p] + "</li>"));
                        } else if (Object.prototype.toString.call(obj.selections) === "[object Array]") {
                            var objarray = obj.selections;
                            for (var i = 0, len = objarray.length; i < len; i++) {
                                if (objarray[i] == obj.autoValue)
                                    ul.append($("<li data-value = '" + objarray[i] + "' class = 'checked'><i class='icon icon-radio'></i>" + objarray[i] + "</li>"));
                                else
                                    ul.append($("<li data-value = '" + objarray[i] + "'><i class='icon icon-radio'></i>" + objarray[i] + "</li>"));
                            }
                        }

                    divSelectValue = obj.autoValue != undefined && obj.autoValue != null ? obj.autoValue : obj.singleSelectTitle,
                        divSelect = $("<div class = 'select placeholder placeholder-has' name = '" + obj.id + "' data-title = '" + obj.singleSelectTitle + "'>" + divSelectValue + "</div>");
                    singleSelection.append(ul);
                    var value = obj.autoKey == undefined ? (obj.autoValue == undefined ? "" : obj.autoValue) :  obj.autoKey;
                    if (obj.required)
                        input = $("<input type = 'hidden' class = 'singleSelection-hidden' required name = '" + obj.id + "'" + "value = '" + value + "'>");
                    else
                        input = $("<input type = 'hidden' class = 'singleSelection-hidden' name = '" + obj.id + "'" + "value = '" + value + "'>");
                    divcon.append(italic).append(input).append(divSelect).append(singleSelection);
                    divBorder.append(label).append(divcon);
                    maindiv.append(divBorder);
                }
                return maindiv ? maindiv : $("<div style = 'height:20px'>请输入正确的参数</div>");
            }
            this.append(creatSingleSelect(options));


            this.find("div#" + options.id + ".singleSelection-item").on('click', '.select, .icon-select', function(event) {
                var $select = null,
                    target = $(event.target);
                if (target.hasClass('select')) {
                    $select = target;
                } else {
                    $select = target.parent().find('.select');
                }
                Modal({
                    title: options.singleSelectTitle,
                    message: $select.next('.singleSelection-option-con').html(),
                    $select: $select
                })
            });
        },
        setValue: function(options) {
            //todo
        }
    }
});