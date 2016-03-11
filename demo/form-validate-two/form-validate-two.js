define("demo/form-validate-two/form-validate-two", function(require, exports, module){

    module.exports = function(opt) {
        
        var $ = require('zepto'),
            $form = $("#form");
            
        require('libs/zepto.info');
        require('libs/zepto.form');
        
        $(".btn-validate", $form).on("click",function(e){
            var result = $form.form('validate', [{
                errmsg: "不允许为空",
                name: "UserName",
                rule:"isNonEmpty"

            },{
                errmsg: "身份证不正确",
                name: "CardNum",
                regexp: "/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/"
            },{
                errmsg: '请输入正确的手机号',
                name: "PhoneNum",
                vfunc: function(value)  {
                    if(value){
                        return ( /^1[3|4|5|7|8][0-9]\d{8}$/ ).test(value);
                    } else {
                        return false;
                    }
                }
            } ]);

            if ( !result.isValid ) {
                var str = '';

                for(var i in result.messages) {
                    str += result.messages[i] + '<br />';
                }

                $.info(str);

                return false;
            }

            $.info("验证通过");
        });
        
    };
});