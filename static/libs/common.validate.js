/** 
 * @authors jiajianrong@58.com
 * @date    2015-12-04
 * demo
 * TODO: 类化

var rtn = validator.validateForm([
    {
        errmsg: "融资金额必须为数字10000-500000",
        name: "financeAmount",
        regexp: "^([1-9]\d{4}|[1-5]\d{5}|6[0]{5})$",
        value: "afas"
    },
    
    {
        errmsg: "首付比例必须为数字",
        name: "firstPayRatio",
        rule: "isNumber",
        value: "222222"
    },
    
    {
        errmsg: "必须是100到10000之间的数字",
        name: "dealerOpenBank",
        vfunc: function(){
            return value>100 && value<10000;
        },
        value: "2222"
    }
]);

rtn.isValid
rtn.messages

*/



define('libs/common.validate', function(require, exports, module) {



    /*
     * helper
     */
    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    /*
     *身份证验证
     */
    function isCardNumber(value) {
        //省份证号校验
        var aCity = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            },
            iSum = 0;
        if (!cardNum) {
            return false;
        }
        if (!(cardNum.length == 15 || cardNum.length == 18)) {
            return false;
        }
        if (!/^\d{15}|\d{17}(\d|x)$/i.test(cardNum)) {
            return false;
        }
        cardNum = cardNum.replace(/x$/i, "a");
        if (aCity[parseInt(cardNum.substr(0, 2))] == null) {
            return false;
        }
        var sBirthday = cardNum.substr(6, 4) + "/" + Number(cardNum.substr(10, 2)) + "/" + Number(cardNum.substr(12, 2));
        var d = new Date(sBirthday);
        if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
            return false;
        }
        for (var i = 17; i >= 0; i--) {
            iSum += (Math.pow(2, i) % 11) * parseInt(cardNum.charAt(17 - i), 11);
        }
        if (iSum % 11 != 1) {
            return false;
        }
        return true;
    }


    var validator = {

        // 所有可以的验证规则处理类存放的地方，后面会单独定义
        rules: {
            // 验证给定的值不为空
            isNonEmpty: function(value) {
                return !!value && (value.trim()!='');
            },
            // 姓名，可以包含 .·
            isName: function(value) {
                return !!value && (value.trim()!='') && /^[\.·\u4e00-\u9fa5]{2,20}$/.test(value);
            },
            // 验证给定的值是否是数字
            isNumber: function(value) {
                return !!value && (value.trim()!='') && !isNaN(value);
            },
            // 验证给定的值是否只是字母或数字
            isAlphaNum: function(value) {
                return !/[^a-z0-9]/i.test(value);
            },
            // 下拉框值不能为-1,'',null,undefined
            mustSelect: function(value) {
                return (!!value&&value!=0) && (value.trim() != '') && (value != '-1');
            },
            cardNumber: function(value) {
                return isCardNumber(value);
            },
            email: function(value) {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            },
            currency: function(value) {
                return /^(?:[1-9]\d{0,16}(\.\d{1,2})?|0\.\d{1,2})$/.test(value);
            },
            bankCard: function(value) {
                return /^[1-9]\d{15,20}$/.test(value);
            },
            telephone: function(value) {
                return /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0|5|6|7|8|9])\d{8}$/.test(value);
            }
        },



        // 验证类型所对应的错误消息
        messages: {},



        // ------------------
        // 暴露的公开验证方法(表单组件使用)
        // ------------------
        validateForm: function(datas) {

            var data, regExp, checker, result_ok;

            // 清空所有的错误信息
            this.messages = {};

            for (var i = 0; i < datas.length; i++) {

                data = datas[i];

                if (data.regexp) {
                    regExp = new RegExp(data.regexp);
                    result_ok = regExp.test(data.value);

                } else if (data.rule) {
                    checker = this.rules[data.rule];
                    result_ok = checker(data.value);

                } else if (data.vfunc) {
                    result_ok = data.vfunc(data.value);
                }

                if (!result_ok) {
                    this.messages[data.name] = data.errmsg;
                }

            }

            return {
                isValid: isEmptyObject(this.messages),
                messages: this.messages
            }
        }
    };



    module.exports = validator;


});