
define("page/wddx-form-agent-choose/wddx-form-agent-choose", function(require, exports, module){
    

    module.exports = function(opt) {
        
        var $ = require('zepto');
        
        require('libs/zepto.dialog');
        
        
        var $form = $('.ui-form'),
            $submitBtn = $('.btn-submit');
        
        
        /*
         * disable/enable提交按钮
         */
        $form.one('change', function(){
            $submitBtn.removeClass('disabled');
        })
        
        
        
        /*
         * 校验表单
         */
        $submitBtn.on('click', function(){
            
            if ($submitBtn.hasClass('disabled'))
                return false;
            
            asyncSubmitForm();
        });
        
        
        
        /*
         * 提交表单
         */
        function asyncSubmitForm() {
    
            // 提交请求，包含校验验证码及身份证号
            $.ajax({
                url: '/loan/org',
                type: 'post',
                data: $form.serialize(),
                dataType: 'json'
            })
            .done(function(data) {
                if (data && data.resultCode == 0) {
                    // 0是成功，其他都是失败
                    //WBAPP.loadPage("link","/page/wddx-form-agent-choose"," result");
                    location.href = '/page/wddx-form-agent-choose';
                    
                } else if (data && data.resultCode == 1) {
                    $.dialog({
                        type: "custom",
                        title: "机构已满",
                        message: "<p>该机构已满</p><p>请选择其他机构进行贷款申请</p>"
                    });
                }
            });
        }
    };
});

