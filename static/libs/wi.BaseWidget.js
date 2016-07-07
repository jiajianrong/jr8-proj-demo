/**
 * 
 * @authors jiajianrong@58.com
 * @date    2016-06-26
 * 
 * 自定义widget基类
 * 
 * 
 */
define( 'libs/wi.BaseWidget', function(require, exports, module){
    'use strict';
    
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;


    
    function BaseWidget(options) {
        this.init(options);
        return this;
    }
    
    BaseWidget.prototype.defaults = {}
    BaseWidget.prototype.events = {}
    
    BaseWidget.prototype.init = function(options) {
        this.options = $.extend( {}, this.defaults, options);
        this.render();
        this.bind();
        return this;
    }
    
    
    
    BaseWidget.prototype.render = function() {
        var options = this.options;
        
        if (options && options.$el)
            this.$el = $(options.$el);
        
        return this;
    }
    
    
    
    BaseWidget.prototype.bind = function() {
        
        var events = this.options.events;
        
        if(!events){
            return this;
        }
        
        this.unbind();
        
        for(var key in events) {
            var method = events[key];
            if(!$.isFunction(method)) {
                method = this[events[key]];
            }
            if(!method) {
                continue;
            }
            
            var match = key.match(delegateEventSplitter),
                eventName = match[1],
                selector = match[2];
            
            method = method.bind(this);
            
            if(selector.length)
                this.$el.on(eventName,selector,method);
            else
                this.$el.on(eventName,method);
        }
        
        return this;
    }
    
    BaseWidget.prototype.unbind = function() {
        this.$el.off();
        return this;
    }
    
    BaseWidget.prototype.destroy = function() {
        this.unbind();
        this.$el.remove();
    }
    

    
    
    
    module.exports = BaseWidget;
    
    
});