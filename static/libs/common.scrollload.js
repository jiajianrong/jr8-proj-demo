/** 
 * @authors jiajianrong@58.com
 * @date    2015-12-17
 * 
 * 
 * scrollload js logic 
 * 仅处理下拉到底自动trigger事件
 * 限制只能使用在window上监听的scroll
 * 在window上trigger自定义事件
 * 
 * 
 * demo
 * 
 * 
 * 
 * var sl = require('libs/common.scrollload');
 * sl.kickoff();
 * 
 * 
 * 
 * $win.on('sl:loading.scrollload', function(e){
       $.ajax({
           onSuccess: function() {
               render...
               $win.trigger('sl:loadingfinished');
           },
           onFail: function() {
               $win.trigger('sl:end');
           }
       })
 * });
 * 
 * TODO: 单实例类化
 */

define( 'libs/common.scrollload', function(require, exports, module){
    
    
    var $ = require('zepto'),
        loading = false,
        buffer = 30,
        $win = $(window),
        $doc = $(document),
        winHeight = $win.height(),
        running = false,
        
        kickoff = function(settings) {
            
            if (running) {
                return;
            }
            running = true;
            
            
            settings = settings || {};
            
            buffer = settings.buffer || buffer;
            
            
            $win.on('scroll.scrollload', function() {
                var scrollHeight = $win.scrollTop(),
                    bodyHeight = $doc.height();
                
                if (loading) {
                    return; 
                }
                
                if (winHeight + scrollHeight + buffer > bodyHeight) {
                    loading = true; 
                    $win.trigger('sl:loading');
                }
            });
            
            
            
            $win.on('sl:loadingfinished.scrollload', function(e){
                loading = false;
            });
            
            
            $win.on('sl:end.scrollload', function(e){
                $win.off('.scrollload');
            });
        };
    
    
    
    
    
    
    
    module.exports = {
        kickoff: kickoff
    };
    
    
});



