define("demo/scrollload-two/scrollload-two", function(require, exports, module) {


    module.exports = function(opt) {


        var $ = require('zepto'),
            ScrollLoad = require('libs/zepto.scrollload'),

            tplFnA = __inline('./scrollload-twoA.tmpl'),
            tplFnB = __inline('./scrollload-twoB.tmpl'),
            emptyFn = __inline('./empty.tmpl'),

            // callback
            onSuccess = function(obj, Scroll, el, tmpl) {

                if (obj && obj.rows && obj.rows.length) {

                    var $new = $(tmpl(obj));
                    el.append($new);

                } else {
                    Scroll.destroy();
                    // 判断 暂无记录 还是 无更多记录
                    el.append($(emptyFn({
                        type: obj.total ? 'nomore' : 'empty'
                    })));
                }
            },
            eventInit = function() {
                $('.titleA').on('click', function() {
                    if (!$(this).hasClass('on')) {
                        $(this).addClass('on').siblings().removeClass('on');
                        $('.listA').show();
                        $('.listB').hide();
                        s1.resume();
                        s2.pause();
                    }
                })
                $('.titleB').on('click', function() {
                    if (!$(this).hasClass('on')) {
                        $(this).addClass('on').siblings().removeClass('on');
                        $('.listB').show();
                        $('.listA').hide();
                        s2.resume();
                        s1.pause();
                    }
                })
            }
			
        var s1 = new ScrollLoad();
        var s2 = new ScrollLoad();

        // 初始化加载
        (function() {
            s1.init({
                url: '/demo/scrollload-two/list/data1',
                rows: 20,
                onSuccess: function(obj) {
                    onSuccess(obj, s1, $('#list-wrap1'), tplFnA);
                }
            });
            s1.start();

            s2.init({
                url: '/demo/scrollload-two/list/data2',
                rows: 20,
                onSuccess: function(obj) {
                    onSuccess(obj, s2, $('#list-wrap2'), tplFnB)
                }
            });
            s2.start();
            s2.pause();

            eventInit();
        })();
    };
});