define("demo/form-validate-one/form-validate-one", function(require, exports, module){

    module.exports = function(opt) {
        
        var $ = require('zepto'), 
            $form = $("#form");
            
        require('libs/zepto.info');
        require('libs/zepto.form');
        
        $(".btn-validate", $form).on("click",function(e){
            var result = $form.form('validate');

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