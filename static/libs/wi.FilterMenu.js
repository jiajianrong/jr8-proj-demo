/**
 * @require /static/scss/wi.FilterMenu.scss
 * 
 * 
 * @authors jiajianrong@58.com
 * @date    2016-06-26
 * 
 * 异步加载时顶部的条件选择下拉列表
 * 参见 /demo/filter/filter
 * 
 * demo
 * 
 * 
 * 
 * 
 */
define( 'libs/wi.FilterMenu', function(require, exports, module){
    'use strict';
    
    var $ = require('zepto');
    var BaseWidget = require('libs/wi.BaseWidget');
    var FilterMask = require('libs/wi.FilterMask');
    require('libs/zepto.swipe.con');
    
    
    function FilterMenu(options) {
        BaseWidget.call(this, options);
        return this;
    }
    
    FilterMenu.prototype = new BaseWidget({})
    FilterMenu.prototype.constructor = FilterMenu
    
    FilterMenu.prototype.defaults = {}
    FilterMenu.prototype.events = {}
    
    
    
    FilterMenu.prototype.init = function(options) {
        BaseWidget.prototype.init.call(this,options);
        
        this.parent = options.parent;
        this.optionOnSelect = this.options.optionOnSelect || function(){};
        this.mask = new FilterMask({});
        return this;
    }
    
    
    
    FilterMenu.prototype.render = function() {
        BaseWidget.prototype.render.call(this);
        
        this.renderList();
        return this;
    }
    
    
    
    FilterMenu.prototype.bind = function() {
        // 点击展开或收起options
        this.$el.on('click', this.clickHandler.bind(this));
        
        // 选择事件
        this.bindListEvent();
        
        BaseWidget.prototype.bind.call(this);
        return this;
    }
    
    
    
    FilterMenu.prototype.clickHandler = function() {
        if (this.$el.hasClass('on')) {
            this.blur();
        } else {
            this.parent.blurAll();
            this.focus();
        }
    }
    
    
    
    FilterMenu.prototype.focus = function(){
        this.$el.addClass('on');
        this.mask.show();
        this.$list.show();
    }
    
    
    
    FilterMenu.prototype.blur = function(){
        this.$el.removeClass('on');
        this.mask.hide();
        this.$list.hide();
    }
    
    
    
    FilterMenu.prototype.renderList = function() {
        var $el = this.$el,
            top = $el.offset().top + $el.height(),
    
            tpl = $(this.options.listTpl),
            $tpl = $(tpl).css('top', top);
        
        this.$list = $tpl;
        $el.after(this.$list);
        
        this.qKey = this.$list.data('query-key');
    }
    
    
    
    FilterMenu.prototype.singleSelectHandler = function(e) {
        var $opt = $(e.currentTarget),
            qVal = $opt.data('query-value'),
            label = $opt.data('label') || $opt.text();
        
        this.updateLabel(label);
        this.selectOption($opt);
        this.blur(false);
        
        this.optionOnSelect.call(this,{
            dditem: this,
            $opt: $opt,
            qKey: this.qKey,
            qVal: qVal
        });
        
        window.scrollTo(0,0);
    }
    
    
    
    FilterMenu.prototype.multipleSelectHandler = function(e) {
        var $opt = $(e.currentTarget);
        this.selectOption($opt,true);
    }
    
    
    
    FilterMenu.prototype.multipleResetHandler = function(e) {
        this.selectOption(false);
    }
    
    
    
    FilterMenu.prototype.multipleSubmitHandler = function(e) {
        var $qVals = this.$list.find('.option.on').map(function(i,item){
                return $(item).data('query-value')
            }),
            
            qVals = Array.prototype.slice.call($qVals),
            qVal = qVals.join(',');
        
        if (qVal && qVal.length) {
            this.optionOnSelect.call(this,{
                dditem: this,
                $opt: null,
                qKey: this.qKey,
                qVal: qVal
            });
            window.scrollTo(0,0);
        }
        
        this.blur(false);
    }
    
    
    
    FilterMenu.prototype.bindListEvent = function() {
        
        var isSingleSelection = this.$list.data('selection')==='single',
            isDateMode = !!this.$list.find('[data-mode=date]').size();
        
        
        this.$list.on('touchmove', function(){ return false; })
        
        // 单选/多选
        if (isSingleSelection) {
            this.$list.on('click', '.option', this.singleSelectHandler.bind(this));
        } else {
            this.$list.on('click', '.option', this.multipleSelectHandler.bind(this));
            this.$list.on('click', '.action-reset', this.multipleResetHandler.bind(this));
            this.$list.on('click', '.action-submit', this.multipleSubmitHandler.bind(this));
        }
        
        // 包含有自定义日期输入按钮，绑定事件比较复杂
        if (isDateMode) {
            this.bindDateEvent();
        }
        
        // 绑定菜单滑动事件
        var $options = this.$list.find('.options');
        $options.swipecon();
    }
    
    
    
    
    FilterMenu.prototype.updateLabel = function(str) {
        this.$el.find('span').text(str);
        return this;
    }
    
    
    
    /**
     * 处理option被选中时的事件
     * 多选时： check/uncheck
     * 单选时：当前option check，其余options uncheck；或者全部uncheck
     * @param {Object} $opt
     * @param {Object} isMulti
     */
    FilterMenu.prototype.selectOption = function($opt,isMulti) {
        if (isMulti) {
            if ($opt.hasClass('on')) {
                $opt.removeClass('on');
            } else {
                $opt.addClass('on');
            }
        } else {
            if ($opt===false) {
                this.$list.find('.option,.option-customized').removeClass('on');
            } else {
                $opt.addClass('on').siblings().removeClass('on');
            }
        }
        return this;
    }
    
    
    
    
    FilterMenu.prototype.bindDateEvent = function() {
        
        var qKey = this.qKey,
            $opt = this.$list.find('[data-mode=date]'),
            qVal = $opt.data('query-value'),
            label = $opt.data('label') || $opt.text();
        
        var encode = encodeURIComponent;
        
        
        var onConfirm = function( startKey, endKey, dateStart, dateEnd ) {
            
            this.optionOnSelect.call(this,{
                dditem: this,
                $opt: $opt,
                params: [{ qKey: qKey, qVal: qVal },{ qKey: startKey, qVal: encode(dateStart) },{ qKey: endKey, qVal: encode(dateEnd) }]
            });
            
            $opt.find('[data-date-details]').text( dateStart.replace(/-/g,'.') + ' - ' + dateEnd.replace(/-/g,'.') );
            this.blur();
            
        }.bind(this);
        
        
        
        var DateSelect = require('libs/wi.DateSelect');
        var dateSelect = new DateSelect({
            onConfirm: onConfirm
        });
        
        
        $opt.on('click', function(e){
            this.updateLabel(label);
            this.selectOption($opt);
            dateSelect.show();
            
            return false;
        }.bind(this));
    
    }

    
    
    
    module.exports = FilterMenu;
    
    
});