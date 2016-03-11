define('libs/zepto.radio', function(require, exports, module) {
    var $ = require('zepto');
    $.fn.radio = function(opts, param) {
        if (typeof opts == 'string')
            $.fn.radio.methods[opts].call(this, param);
        else
            throw ('第一个参数必须为字符串！');
    };

    $.fn.radio.methods = {
        init: function(options) {
            function creatRadio(obj) {
                var maindiv;
                if (obj.id && obj.radios) {
                    var divBorder = $("<div class = 'radio-border'></div>"),
                        label,
                        divcon = $("<div class='radio-con'></div>"),
                        anchor,
                        input;
                    maindiv = $("<div class = 'radio-item' id = '" + obj.id + "'></div>");
                    if (obj.filedName)
                        label = $("<label>" + obj.filedName + "</label>");

                    if (Object.prototype.toString.call(obj.radios) === "[object Object]")
                        for (var p in obj.radios) {
                            if (p == obj.autoKey)
                                divcon.append($("<a class = 'radio-user radio-user-checked'><input type = 'radio' name = '" + obj.id + "' value = '" + p + "'>" + obj.radios[p] + "</a>"));
                            else
                                divcon.append($("<a class = 'radio-user'><input type = 'radio' name = '" + obj.id + "' value = '" + p + "'>" + obj.radios[p] + "</a>"));
                        } else if (Object.prototype.toString.call(obj.radios) === "[object Array]") {
                            var objarray = obj.radios;
                            for (var i = 0, len = objarray.length; i < len; i++) {
                                if (objarray[i] == obj.autoValue)
                                    divcon.append($("<a class = 'radio-user radio-user-checked'><input type = 'radio' name = '" + obj.id + "' value = '" + objarray[i] + "'>" + objarray[i] + "</a>"));
                                else
                                    divcon.append($("<a class = 'radio-user'><input type = 'radio' name = '" + obj.id + "' value = '" + objarray[i] + "'>" + objarray[i] + "</a>"));
                            }
                        }
                    divBorder.append(label).append(divcon);
                    maindiv.append(divBorder);
                }
                return maindiv ? maindiv : $("<div style = 'height:20px'>请输入正确的参数</div>");
            }

            this.append(creatRadio(options));
            $(document).on('click', '.radio-user', function(e) {
                if (!$(e.target).hasClass('radio-user-checked')) {
                    $(e.target).addClass('radio-user-checked')
                        .find('input').prop('checked', true);
                    $(e.target).siblings('.radio-user-checked').removeClass('radio-user-checked')
                        .find('input').prop('checked', false);
                }
            });
        },
        setValue: function(options) {

        }
    }
});