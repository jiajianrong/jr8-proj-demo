define("page/page-form/page-form", function(require, exports, module){
    
    
    module.exports = function(opt) {
    
        var $ = require('zepto');
        require('libs/zepto.info');
        require('libs/zepto.form');
        require('libs/zepto.togglebutton');
    
        var $form = $("#form"),
            userId = $("#userId",$form).val(),
            editFlag = $(".editFlag",$form).data("value");


        // toggle开关赋值 
        $('.toggle-btn', $form).togglebutton();


        // 如果 readOnly 是1的话，只读
        editFlag != 1  && $("input,select",$form).attr("disabled",true);
        editFlag != 1  && $(".toggle-btn").off();

        
        $(".btn-next-step", $form).on("click",function(e){
    
            var $this = $(this);
            
            if($this.hasClass('disabled')) 
                return;


            

            // 禁用按钮
            $this.text('提交中...').addClass('disabled');

            if(editFlag === 1) {

                // 校验
                var result = $form.form('validate', [{
                    errmsg: "20000-1000000, 且要",
                    name: "carDealPrice",
                    vfunc: function(value){
                        var financeAmount = $("[name=financeAmount]",$form).val();
                        return value>=20000 && value<=1000000 && (parseFloat(financeAmount) < value);
                    }
                },{
                    errmsg: "金额:10000-500000",
                    name: "financeAmount",
                    vfunc: function(value){
                        return value>=10000 && value<=500000;
                    }
                },{
                    errmsg: "不能为空",
                    name: "firstPayRatio",
                    rule: "isNumber"
                },{
                    errmsg: "2-8个汉字",
                    name: "repayAccount",
                    regexp: "^[\\u4e00-\\u9fa5]{2,8}$"
                },{
                    errmsg: "请输入正确的身份证号",
                    name: "idCard",
                    vfunc: function(value) {
                        var contractTypeValue = $('#contractType', $form).val();
                        if (contractTypeValue == 2){
                            return validateCard(value);
                        } else {
                            return true;
                        }
                    }
                },{
                    errmsg: "请输入正确的身份证号",
                    name: "repayIdCardNo",
                    vfunc: function(value) {
                            return validateCard(value);
                    }
                },{
                    errmsg: "至少12位数字",
                    name: "dealerBankCardNo",
                    regexp: "^[1-9]\\d{11,}$"
                },{
                    errmsg: "不能为空",
                    name: "dealerOpenBank",
                    rule: "mustSelect"
                },{
                    errmsg: "不能为空",
                    name: "repayOpenBank",
                    rule: "mustSelect"
                },{
                    errmsg: "至少12位数字",
                    name: "repayBankCardNo",
                    regexp: "^[1-9]\\d{11,}$"
                },{
                    errmsg: '2-8个汉字',
                    name: "indicator",
                    // 上牌地联动回调： 牌照为：京，沪，粤B 时，指标人必填
                    vfunc: function(value) {
                        var cardNoValue = $('#cardNo', $form).val();
                        if( cardNoValue.indexOf("京") == 0 ||
                            cardNoValue.indexOf("沪") == 0 ||
                            cardNoValue.indexOf("粤B") == 0 ){
                            return ( /^[\u4e00-\u9fa5]{2,8}$/ ).test(value);
                        } else {
                            return true;
                        }
                    }
                }, {
                    errmsg: "长度不超过10个字符",
                    name: "firstCardDate",
                    vfunc: function(value){
                        return value != "" && value.length<=10;
                    }
                },{
                    errmsg: "不能为空",
                    name: "frameNo",
                    rule: "isNonEmpty"
                }, {
                    errmsg: "不能为空",
                    name: "brand",
                    rule: "isNonEmpty"
                }, {
                    errmsg: "不能为空",
                    name: "models",
                    rule: "isNonEmpty"
                }, {
                    errmsg: "不能为空",
                    name: "color",
                    rule: "isNonEmpty"
                },  {
                    errmsg: "不能为空",
                    name: "dealerName",
                    rule: "isNonEmpty"
                }, {
                    errmsg: "不能为空",
                    name: "dealerOpenPartBank",
                    rule: "isNonEmpty"
                }, {
                    errmsg: "不能为空",
                    name: "dealerOpenBranchBank",
                    rule: "isNonEmpty"
                },{
                    errmsg: '邮箱：如 abc@g.com',
                    name: "mail",
                    vfunc: function(value) {
                        if(value){
                            return ( /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ ).test(value);
                        } else {
                            return true;
                        }
                    }
                },{
                    errmsg: '正确的手机号',
                    name: "reservedPhone",
                    vfunc: function(value) {
                        if(value){
                            return ( /^1[3|4|5|7|8][0-9]\d{8}$/ ).test(value);
                        } else {
                            return true;
                        }
                    }
                }

                ]);


                if ( !result.isValid ) {
                    var str = '';

                    for(var i in result.messages) {
                        str += result.messages[i] + '<br />';
                    }

                    $.info(str);

                    $this.text('下一步').removeClass('disabled');

                    return;
                }

                $.ajax({
                    url: '/market/customer/loan/apply/submit',
                    type: 'post',
                    data: $form.serialize(),
                    dataType: 'json',
                    success: function (data) {
                        if (data.resultCode == 0) {
                            location.href = "/market/customer/loan/apply2?userId=" + userId;
                        } else {
                            $.info(data.detail);
                        }
                        $this.text('下一步').removeClass('disabled');
                    },
                    error: function (data) {
                        $.info(data.detail);
                        $this.text('下一步').removeClass('disabled');
                    }
                });
            }else {
                $this.text('下一步').removeClass('disabled');
                window.location = "/market/customer/loan/apply2?userId=" + userId;
            }

        });

        // 校验身份证号码
        var validateCard = function(cardNum) {
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
        };


    
    }
});
