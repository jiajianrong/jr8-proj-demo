/**
 * @authors jiajianrong@58.com
 * @date    2015-01-19
 * 使用
 * 
 * <p class="xxxxx">23天12时3分2秒</p>
 * $('.xxxxx').countdown();
 * 
 * <p class="xxxxx"></p>
 * $('.xxxxx').countdown({last:'30秒', finishTxt:'done', tickTxt:"请在{0}秒后重新获取"});
 * 
 * <p class="xxxxx"></p>
 * $('.xxxxx').countdown({last:'30秒', onStart:function(){}, onFinish:function(){}});
 * 
 * <a href="javascript:;" class="xxxxx">点击开始倒计时</a>
 * $('.xxxxx').countdown({last:'30秒', type:'button', ...});
 */

define( 'libs/zepto.countdown', function(require, exports, module){
    
    var $ = require('zepto'),
        CountDown = require('libs/common.countdown');
    
    
    $.fn.countdown = (function() {
    
        // 得到距现在的毫秒值
        // param: 4天5时1分58秒 或者 12时5分8秒  或者 44时45分54秒 或者 23分12秒 或者 12秒
        // return 毫秒值
        function getMilSeconds(val) {
            var valTmp = val.replace( /\D/g, "-" ),
                tms = 0;
            
            valTmp.split("-").reverse().splice(1).forEach(function(str, idx){
                var num = +str,
                    sec = idx==3 ? 60*60*24*num : Math.pow(60, idx)*num;
                tms += sec*1000;
            });
            
            return tms;
        }
        
        
        return function(options) {
            
            var _this = this,
                _running = false,
                
                _F = function(){
                    if (_running) return;
                    _running = true;

                    var _tms = ( options && options.last ) ? options.last : _this.text(),
                        tms = getMilSeconds(_tms),
                        now = (new Date()).getTime(),
                        
                        cd = new CountDown( tms+now );

                    cd.run({
                        onTick: function(ts) {
                            var d = ts.days ? (ts.days + "天") : "", 
                                h = ts.hours ? (ts.hours + "时") : "",
                                m = ts.minutes ? (ts.minutes + "分") : "",
                                s = ts.seconds ? (ts.seconds + "秒") : "0秒";
                            
                            if ( options && options.tickTxt ) {
                                _this.text( options.tickTxt.replace( /\{[^\}]*\}/, d+h+m+s ) );
                            } else {
                                _this.text( d+h+m+s );
                            }
                        },
                        onFinish: function() {
                            options && options.onFinish && options.onFinish.call(_this);
                            options && options.finishTxt && _this.text(options.finishTxt);
                            _running = false;
                        }
                    });
                
                    options && options.onStart && options.onStart.call(_this);
                    return _this;
                };

            // 区别是按钮还是普通文本倒计时
            if( options && options.type == 'button' ) {
                _this.click(_F);
            } else {
                _F();
            }
            
        }
    })();
    
    
    // zepto插件不需要return
    //return $;
    
} )


