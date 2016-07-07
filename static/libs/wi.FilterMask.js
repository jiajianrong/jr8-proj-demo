/**
 * @require /static/scss/wi.FilterMask.scss
 * 
 * @authors jiajianrong@58.com
 * @date    2016-06-26
 * 
 * 遮罩层，禁止触摸滑屏
 * 
 **/ 
define( 'libs/wi.FilterMask', function(require, exports, module){
    //'use strict';
    
    var $ = require('zepto');
    var BaseWidget = require('libs/wi.BaseWidget');
    
    var singleton;
    
    
    function FilterMask(options) {
        if ( !singleton ) {
            BaseWidget.call(this, options);
            singleton = this;
        }
        return singleton;
    }
    
    FilterMask.prototype = new BaseWidget({})
    FilterMask.prototype.constructor = FilterMask
    
    FilterMask.prototype.init = function(options) {
        if ( !options )
            options = {};
        
        options.$el = __inline('wi.FilterMask.tmpl')(); //'.wi-filter-mask';
        
        BaseWidget.prototype.init.call(this,options);
        
        $('body').append(this.$el);
        return this;
    }
    
    
    FilterMask.prototype.defaults = {
        events: {
            'touchmove': function() {
                return false;
            }
        }
    }
    FilterMask.prototype.events = {}
    
    
    
    
    FilterMask.prototype.show = function(options) {
        this.$el.show();
    }
    
    
    FilterMask.prototype.hide = function(options) {
        this.$el.hide();
    }
    

    
    
    
    module.exports = FilterMask;
    
    
});