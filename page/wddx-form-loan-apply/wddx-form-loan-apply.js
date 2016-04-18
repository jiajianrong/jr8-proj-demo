
define("page/wddx-form-loan-apply/wddx-form-loan-apply", function(require, exports, module){
    

    module.exports = function(opt) {
        
        var $ = require('zepto'),
            CITIES = require('libs/common.constant.cities');
            
        require('libs/zepto.selectcity.single');
        require('libs/zepto.form');
        
        var formErrorRender = require('libs/zepto.form.error.render');
        
        
        
        var $form = $('.ui-form'),
            $submitBtn = $('.btn-submit');
        
        
        /*
         * 校验表单
         */
        $submitBtn.on('click', function(){
            
            if ($submitBtn.hasClass('disabled'))
                return false;
            
            
            $form.form('validate', [{
                    errmsg: '贷款金额',
                    name: "money",
                    rule: 'mustSelect'
                },{
                    errmsg: '贷款期限',
                    name: "month",
                    rule: 'mustSelect'
                },{
                    errmsg: '贷款用途',
                    name: "daikuanyt",
                    rule: 'mustSelect'
                },{
                    errmsg: "真实姓名",
                    name: 'name',
                    rule: 'isName'
                },{
                    errmsg: "手机号",
                    name: 'phone',
                    rule: 'telephone'
                },{
                    errmsg: '所在城市',
                    name: "applyCity",
                    rule: 'mustSelect'
                },{
                    errmsg: "出生年份",
                    name: 'chushengnian',
                    rule: 'isNonEmpty'
                },{
                    errmsg: "职业身份",
                    name: 'zhiye',
                    rule: 'mustSelect'
                },{
                    errmsg: "月收入",
                    name: 'yuexin',
                    rule: 'mustSelect'
                },{
                    errmsg: "发薪方式",
                    name: 'gongzixingshi',
                    rule: 'mustSelect'
                },{
                    errmsg: "信用卡",
                    name: 'xinyong',
                    rule: 'mustSelect'
                },{
                    errmsg: "车险或寿险",
                    name: 'shangyexian',
                    rule: 'mustSelect'
                },{
                    errmsg: "社保",
                    name: 'shebao',
                    rule: 'mustSelect'
                },{
                    errmsg: "是否有房",
                    name: 'hashouse',
                    rule: 'mustSelect'
                },{
                    errmsg: "是否有车",
                    name: 'hascar',
                    rule: 'mustSelect'
                }
            ]);
            
            
            $form.form('onvalidate', {
                success: function(){
                    asyncSubmitForm();
                },
                error: formErrorRender
            });
            
        });
        
        
        
        /*
         * disable/enable提交按钮
         */
        $form.one('change', function(){
            $submitBtn.removeClass('disabled');
        });
        
        
        
        /*
         * 提交表单
         */
        function asyncSubmitForm() {
            
            $.ajax({
                url: '/loan/apply',
                type: 'post',
                data: $form.serialize(),
                dataType: 'json'
            })
            .done(function(data) {
                if(data && data.resultCode == 0) {
                    // 0是成功，其他都是失败
                    //WBAPP.loadPage("link","/page/wddx-form-agent-choose"," result");
                    location.href = '/page/wddx-form-agent-choose';
                }
            });
            
        }
        
        
        
        
        
        /*
         * 城市选择
         */
        var scs = $.selectcitySingle({
            data: CITIES,
            onSelect: function (data) {
                var key = '',
                    val = '';
                for (key in data) {
                    val = data[key];
                }
                
                $('.select-city-single').text(key);
                $('input[name=applyCity]').val(val);
            }
        });

        $('.select-city-single').on('click', function(){
            scs.show();
        });
        
    };
});

