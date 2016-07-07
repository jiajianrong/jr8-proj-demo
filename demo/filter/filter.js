define("demo/filter/filter", function(require, exports, module) {
	module.exports = function(opt) {
		var $ = require('zepto');
		var FilterBar = require('libs/wi.FilterBar');
		var Scrollload = require('libs/zepto.scrollload');
		var sl = new Scrollload();
		
		var tplempty=__inline('empty.html');
		var tplFn=__inline('filter.tmpl');
        
        
        var ajaxOpts = {
            url: '/async/page/list',
            buffer: 70,
            onSuccess: function(obj) {
                if(obj.rows.length == 0 && obj.pageNo ==1 ){
                    $('.page-body').append(tplempty);
                    sl.destroy();
                    $(".form-group").remove();
                }else if( obj && obj.rows && obj.rows.length ){
                    
                    $('.form-group').append(tplFn(obj));
                }else{
                    sl.destroy();
                }
            }
        };
        
        sl.init(ajaxOpts);
        sl.start();
    
    
    
    
        /**
         * 用户选择某项下拉列表时的回调 - 用来 异步刷新列表页
         * 
         * @param {Object} result
               $dditem:DropdownItem
               $opt:Array[1]
               qKey:"trantype"
               qVal:7
         */
        function retrieve(result) {
            $(".form-group").empty();
            
            ajaxOpts.page = 1;
            
            if (result.params) {
                for (var i=0; i<result.params.length; i++) {
                    var kvmap = result.params[i];
                    Object.defineProperty( ajaxOpts, kvmap.qKey, {value:kvmap.qVal, enumerable:true, writable: true, configurable: true} );
                }
            } else {
                Object.defineProperty( ajaxOpts, result.qKey, {value:result.qVal, enumerable:true, writable: true, configurable: true} );
            }
            
            sl.reinit(ajaxOpts);
            sl.start();
        }
		
		
		

        /*
         * 注释掉events对象里的事件监听
         * 如有需要可以随时开启
         */
        new FilterBar({
            
            $el: '.wi-filter-bar',
            
            /*
            events: {
                'click #trantype': function(e){
                    console.log("dd watch #trantype");
                },
                'click #trandate': function(){
                    console.log("dd watch #trandate");
                },
                'click button': function(){
                    console.log("dd watch tab");
                }
            },
            */
            
            menus: [{
                $el: '#trantype',
                listTpl: __inline('dropdown-item-trantype.html'),
                /*
                events: {
                    'click': function() {
                        console.log("dditem watch #trantype");
                    }
                },
                */
                optionOnSelect: retrieve
            }, {
                $el: '#trandate',
                listTpl: __inline('dropdown-item-trandate.html'),
                /*
                events: {
                    'click': function() {
                        console.log("dditem watch #trandate");
                    }
                },
                */
                optionOnSelect: retrieve
            }]
        })
        
        
        
        
	}
});