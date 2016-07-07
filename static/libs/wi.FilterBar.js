/**
 * 
 * @require /static/scss/wi.FilterBar.scss
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
 * var dd = new FilterBar({
        $el: '.nav',
        
        events: {
            'click #trantype': function(e){
                console.log("dd watch #trantype");
            },
            'click #trandate': function(){
                console.log("dd watch #trandate");
            }
        },
        
        menus: [{
            $el: '#trantype',
            listTpl: __inline('tpl/dropdown-item-trantype.html'),
            events: {
                'click': function() {
                    console.log("dditem watch #trantype");
                }
            },
            optionOnSelect: retrieve
        }, {
            $el: '#trandate',
            listTpl: __inline('tpl/dropdown-item-trandate.html'),
            events: {
                'click': function() {
                    console.log("dditem watch #trandate");
                }
            },
            optionOnSelect: retrieve
        }]
    })
 * 
 * 
 * 
 */
define( 'libs/wi.FilterBar', function(require, exports, module){
    'use strict';
    
    var BaseWidget = require('libs/wi.BaseWidget');
    var FilterMenu = require('libs/wi.FilterMenu');
    
    
    function FilterBar(options) {
        BaseWidget.call(this, options);
        return this;
    }
    
    
    function _mixin(target,source) {
        for(var key in source) {
            target[key] = source[key]
        }
        return target;
    }
    
    
    
    FilterBar.prototype = new BaseWidget({})
    FilterBar.prototype.constructor = FilterBar
    
    FilterBar.prototype.defaults = {}
    FilterBar.prototype.events = {}
    
    
    FilterBar.prototype.init = function(options) {
        BaseWidget.prototype.init.call(this,options);
        this.allMenus = [];
        this.addMenus();
        return this;
    }
    
    
    FilterBar.prototype.addMenus = function() {
        var menus = this.options.menus;
        
        for (var i=0; i<menus.length; i++) {
            var opt = _mixin({parent: this}, menus[i]);
            this.allMenus.push( new FilterMenu(opt) );
        }
        
        return this;
    }
    
    
    FilterBar.prototype.blurAll = function() {
        var allMenus = this.allMenus;
        
        for (var i=0; i<allMenus.length; i++) {
            allMenus[i].blur();
        }
        
        return this;
    }
    
    


    
    
    
    module.exports = FilterBar;
    
    
});