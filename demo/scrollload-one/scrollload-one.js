
define("demo/scrollload-one/scrollload-one", function(require, exports, module){


    module.exports = function(opt) {
        

        var $ = require('zepto'),
            ScrollLoad = require('libs/zepto.scrollload'),
            
            tplFn = __inline('./scrollload-one.tmpl'),
            emptyFn = __inline('./empty.tmpl'),
            
            // callback
            onSuccess = function(obj) {
                
                if ( obj && obj.rows && obj.rows.length ) {
                    
                    var $new = $( tplFn(obj) );
                    $('#list-wrap').append($new);
                    
                } else {
                    sl.destroy();
                    // 判断 暂无记录 还是 无更多记录
                    $('#list-wrap').append( $(emptyFn({ type: obj.total ? 'nomore' : 'empty' })) );
                }
            
            };
            
        
        
        var sl = new ScrollLoad();
        
        
        // 初始化加载
        (function() {
            sl.init({
                url: '/market/customer/list/data',
                rows: 20,
                onSuccess: onSuccess
            });
            sl.start();
        })();

        
        // 按名字搜索
        $('.search-btn').click( function(){
            
            $('#list-wrap').empty();
            
            sl.reinit({
                url: '/market/customer/list/data',
                rows: 20,
                username: 'usususus',
                onSuccess: onSuccess
            });
            sl.start();
        });
        
        
        // 按状态筛选
        $('.search-btn-2').click( function(){
            
            $('#list-wrap').empty();
            
            sl.reinit({
                url: '/market/customer/list/data',
                rows: 20,
                status: 'susususususu',
                onSuccess: onSuccess
            });
            sl.start();
        } );
    };
});

