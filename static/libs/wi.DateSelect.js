/**
 * @require /static/scss/wi.DateSelect.scss
 * 
 * @authors jiajianrong@58.com
 * @date    2016-06-30
 * 
 * 日期选择，禁止触摸滑屏
 * 
 **/ 
define( 'libs/wi.DateSelect', function(require, exports, module){
    //'use strict';  -  utc模板使用了with
    
    var $ = require('zepto');
    var BaseWidget = require('libs/wi.BaseWidget');
    
    
    function DateSelect(options) {
        BaseWidget.call(this, options);
        return this;
    }
    
    DateSelect.prototype = new BaseWidget({})
    DateSelect.prototype.constructor = DateSelect
    
    
    DateSelect.prototype.defaults = {
        events: {
            'touchmove': function() {
                return false;
            }
        }
    }
    DateSelect.prototype.events = {}
    
    
    /**
     * override
     * @param {Object} options
     */
    DateSelect.prototype.init = function(options) {
        
        this.$el = $(__inline('wi.DateSelect.tmpl')());
        
        this.$dateStart = this.$el.find('[data-start-key]');
        this.$dateEnd = this.$el.find('[data-end-key]');
        
        this.$btnConfirm = this.$el.find('.btn-date-confirm');
        this.$btnCancel = this.$el.find('.btn-date-cancel');
        
        this.startKey = this.$dateStart.data('start-key');
        this.endKey = this.$dateEnd.data('end-key');
        
        $('body').append(this.$el);
        
        this.options = $.extend({},this.defaults,options);
        this.bind();
        
        // BaseWidget.prototype.init.call(this,options);
        return this;
    }
    
    
    
    
    DateSelect.prototype.bind = function(options) {
        
        this.$dateStart.on('input', this.dateInputHandler.bind(this));
        this.$dateEnd.on('input', this.dateInputHandler.bind(this));
        
        this.$btnConfirm.on('click', this.confirmHandler.bind(this));
        this.$btnCancel.on('click', this.cancelHandler.bind(this));
        
        BaseWidget.prototype.bind.call(this,options);
        return this;
    }
    
    
    
    
    DateSelect.prototype.dateInputHandler = function() {
        if (this.$dateStart.val() && this.$dateEnd.val()) {
            this.$btnConfirm.removeClass('btn-disabled');
        } else {
            this.$btnConfirm.addClass('btn-disabled');
        }
    }
    
    
    DateSelect.prototype.confirmHandler = function() {
        var dateStart = this.$dateStart.val(),
            dateEnd = this.$dateEnd.val();
        if ( dateStart && dateEnd ) {
            this.options.onConfirm && this.options.onConfirm(this.startKey, this.endKey, dateStart, dateEnd);
            this.hide();
        }
        return false;
    }
    
    
    DateSelect.prototype.cancelHandler = function() {
        this.hide();
        return false;
    }
    
    
    
    
    DateSelect.prototype.show = function(options) {
        this.$el.show();
    }
    
    
    DateSelect.prototype.hide = function(options) {
        this.$el.hide();
    }
    
    

    
    
    
    module.exports = DateSelect;
    
    
});