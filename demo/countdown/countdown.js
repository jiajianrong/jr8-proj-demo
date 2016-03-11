
define("demo/countdown/countdown", function(require, exports, module){

    module.exports = function(opt) {
        
        var $ = require('zepto');
        
        require('libs/zepto.countdown');
        
        var $clickBtn1 = $('.clickBtn1'),
            $clickBtn2 = $('.clickBtn2');
            
        /*
        * 样式1
        * <a href="javascript:;" class="clickBtn1">23天12时3分2秒</a>
        */
        $clickBtn1.countdown();
        
        

        /*
        * 样式2
        * <a href="javascript:;" class="clickBtn2">点击开始倒计时</a>
        });*/

        $clickBtn2.countdown({
            type: 'button',
            last: '15秒',
            finishTxt: '重新获取',
            tickTxt: '请在{0}后重新获取',
            onStart: function(){
                $clickBtn2.removeClass('clickBtn').addClass('unclickBtn');
                // make ajax request to send validation message to phone
            },
            onFinish: function(){
                $clickBtn2.removeClass('unclickBtn').addClass('clickBtn');
            }
        });
        
    };
});

