
define("page/login/login", function(require, exports, module){
    

    module.exports = function(opt) {
        
        var $ = require('zepto');
        require('libs/zepto.info');
        
        
        var $form = $("#form"),
            $username = $('#username', $form),
            $password = $('#password', $form),
            $btnSubmit = $('.btn-submit', $form);
        
        
        $btnSubmit.on('click', function(){
            
            var $this = $(this);
            
            // 表单提交验证
            if ( $username.val()=='' || $password.val()=='' ) {
                $.info({message:"请输入用户名和密码"});
                return false;
            }
            
            
            $form[0].submit();
            return;
            
    
//          // 禁用按钮
//          $this.text('登录中...').addClass('disabled');
//  
//          // 提交请求，包含校验验证码及身份证号
//          $.ajax({
//              url: '/login/submit',
//              type: 'post',
//              data: $form.serialize(),
//              dataType: 'json'
//          })
//          .done(function(data) {
//              if(data) {
//                  // 0是成功，其他都是失败; detail 原因描述
//                  if(data.resultCode == 0) {
//                      location.href = '/customer-list';
//                  }else {
//                      $.info(data.detail);
//                  }
//              }else {
//                  $.info('登录失败，请重试！');
//              }
//              $this.text('登录').removeClass('disabled');
//          })
//          .fail(function() {
//              $.info('请求失败，请重试！');
//              $this.text('登录').removeClass('disabled');
//          });
        
        });
    };
});

