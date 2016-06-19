
define("page/page-trace-usage/page-trace-usage", function(require, exports, module){
    
    // 注： 此demo中的手动打点均使用原生js实现，未依赖zepto类库
    
    module.exports = function(opt) {
        
        var coretrace = require('libs/core.trace'),
            $ = function(id) { return document.getElementById(id); },
            addClick = function( id, fn ) { $(id).addEventListener('click',fn); };
        
        
        
        
        addClick('manual-1', function(){
            coretrace.send(11);
        })
        
        
        
        addClick('manual-2', function(){
            coretrace.send({
                tid: 12,
                otherP: 'abcdefg'
            });
        })
        
        
        
        addClick('manual-3', function(){
            coretrace.send(13,'http://next.page');
        })
        
        
        
        addClick('manual-4', function(){
            coretrace.send({
                tid: 14,
                otherP: 'abcdefg'
            },'http://next.page');
        })
        
        
        
        addClick('manual-5', function(){
            coretrace.send({
                tid: 15,
                otherP: 'abcdefg',
                tgtUrl: 'http://next.page'
            });
        })
        
        
        
        addClick('manual-6', function(){
            coretrace.send({
                tid: 16,
                otherP: 'abcdefg',
                tgtUrl: 'http://next.page',
                callback: function() {
                    console.log("trace callback!");
                }
            });
        })
        
        
        
        addClick('manual-7', function(){
            coretrace.send(17, function() { console.log("trace callback!"); });
        })
        
        
        
        addClick('manual-8', function(){
            coretrace.send({
                tid: 18,
                otherP: "abcd"
            }, function() { console.log("trace callback!"); });
        })
        
        
        
        addClick('manual-9', function(){
            coretrace.send({
                tid: 19,
                otherP: 'abcdefg',
                tgtUrl: 'http://next.page'
            }, function() { console.log("trace callback!"); });
        })
        
        
        
        
        
        
        
        
        addClick('manual-10', function(){
            coretrace.send(20, function() { 
                console.log("trace callback!"); 
                location.href = 'http://next.page';
            });
        })
        
        
        
        addClick('manual-11', function(){
            coretrace.send({
                tid: 21,
                otherP: "abcd"
            }, function() { 
                console.log("trace callback!"); 
                location.href = 'http://next.page';
            });
        })
    };
});

