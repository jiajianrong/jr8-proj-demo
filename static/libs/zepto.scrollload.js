/**
 * @authors jiajianrong@58.com
 * @date    2016-01-05
 * 
 * 限制只能使用在window上监听 document的scroll
 * 
 * 
 * demo
 * 
 *  var Etpl = require('etpl');
    var tplFn = Etpl.compile(__inline('tpl/tpl-bought-list.html'));
    
    var ScrollLoad = require('scrollload');
    var sl = new ScrollLoad();
    sl.init({
        url: '/your/url',
        size: 20,
        aaa: 'aaa',
        bbb: 'bbb',
        onSuccess: function(obj) {
            if ( obj && obj.cfInvestVoList && obj.cfInvestVoList.length ) {
                $('ul').append(tplFn(obj));
            }
        }
    });
    sl.start();
 */
define( 'libs/zepto.scrollload', function(require, exports, module){
    'use strict';
    
    
    
    var $ = require('zepto'),
        sl = require('libs/common.scrollload'),
        $win = $(window),
        // helper - 因为可能会有reinit，所以不用单例
        stripReqParams = function(settings) {
            var rtnObj = {};
            
            for(var key in settings)
                if( (typeof settings[key]!='function') && (key!='url') )
                    rtnObj[key] = settings[key];
            
            return rtnObj;
        };
    
    
    // __status { "init": 0, "working": 1, "pause": 2, "destroyed": 3, "reinit": 4 };
    
    function ScrollLoad(settings) {}
    
    
    
    ScrollLoad.prototype.loadData = function() {
        
        var _this = this;
        
        $('.sl-loading').show();
        
        return $.ajax({
            url: _this.settings.url,
            type: 'get',
            data: $.extend( stripReqParams(_this.settings), {page:this.settings.page++} ),
            dataType: 'json'
        })
        
        .done(function(obj) {
            _this.settings.onSuccess(obj);
        })
        
        .fail(function(){
            _this.settings.onFail();
            _this.settings.page--;
        })
        
        .always(function(){
            // 结束本次load
            $win.trigger('sl:loadingfinished');
            
            $('.sl-loading').hide();
        });
        
    }
    
    
    
    ScrollLoad.prototype.init = function(settings) {
        
        settings.page = settings.page===0 ? 0 : ( settings.page || 1 );
        settings.size = settings.size || 20;
        
        $.each(['onInit','onReinit','onSuccess','onDestroy','onFail','onPause','onResume'], function(i,func){
            settings[func] = settings[func] || function(){}
        });
        
        this.settings = settings;
        
        this.settings.onInit();
        
        this.__status = "init"; // 内部变量
        
        return this;
    }
    
    
    
    ScrollLoad.prototype.start = function() {
    
        var _this = this;
        
        _this.__status = "working";
        
        _this.__hook = $.proxy(function() {
            // 不return false, 避免其他实例监听不到
            if( this.__status == "working" ) this.loadData();
            if( this.__status == "destroyed" ) $win.trigger('sl:loadingfinished');
        }, _this);
        
        this.loadData().then(function(){
            sl.kickoff();
            
            // 开始监听window scroll
            $win.on( 'sl:loading.scrollload', _this.__hook );
        });
    }
    
    
    ScrollLoad.prototype.pause = function() {
        this.__status = "pause";
        this.settings.onPause();
    }

    ScrollLoad.prototype.resume = function() {
        this.__status = "working";
        this.settings.onResume();
    }
    
    ScrollLoad.prototype.reinit = function() {
        this.__status = "reinit";
        this.settings.onReinit();
        
        $win.off( 'sl:loading.scrollload', this.__hook );
        
        this.init.apply( this, Array.prototype.slice.apply(arguments) );
    }
    
    ScrollLoad.prototype.destroy = function() {
        this.__status = "destroyed";
        this.settings.onDestroy();
        
        // 结束scrollload所有监听 --- 2016-01-11 不能trigger end，因为不确定是否还有其他SL实例在监听
        // $win.trigger('sl:end');
    }
    
    
    
    module.exports = ScrollLoad;
    
    
});