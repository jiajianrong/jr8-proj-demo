/**
 * @require /static/scss/zepto.selectcity.single.scss
 * 
 * @authors MXR, fuhebo, jiajianrong@58.com
 * @date    2016-02-28   2016-04-11
 * 
 * demo
 * var cityList = {
        list: [{
            "label":"A",
            "value":"key",
            "hash": "A"
        },{
            "label":"鞍山",
            "value":"as"
        }]
 * };
 *  var scs = $.selectcitySingle({
        data: cityList,
        onSelect: function (data) {
            console.log(data);
        }
    });
    scs.show();
 */
define( 'libs/zepto.selectcity.single', function(require, exports, module) {

    var $ = require('zepto'),
        historystate = require('libs/common.historystate'),
        $body = $('body'),
        tpl = __inline('./zepto.selectcity.single.tmpl');


    function SelectCitySingle(opts) {
        
        this.data = opts.data || {};
        
        // 模版渲染
        this.$con = $(tpl(this.data));
        
        // 选中的城市
        this.selectList = {};

        // 初始化已选中城市
        this.$con.find(".sc-main-item-value-selected").forEach(function(item){
            var $item = $(item), 
                text = $item.text();
            this.selectList[text] = $item.attr('data-sc-value');
        }.bind(this));
        
        // mixin callback
        ['onSelect','onBackRefreshFn'].forEach( $.proxy( function(item){
            this[item] = opts[item] || function(){};
        }, this) );

        this.init();
    }



    SelectCitySingle.prototype.init = function () {

        var self = this;
        var scope = this.$con;
        
        //添加到body
        $body.append(this.$con);

        //绑定事件

        //侧边栏定位
        scope.find('.sc-aside-list').on('click', '.sc-aside-key', function () {
            var $e = $(this),
                scrollId = '#' + $e.attr('data-schash'),
                buffer = $('.sc-banner').height() || 50,
                distance = $(scrollId).offset().top - buffer;

            scrollTo(0, distance);
        });
        
        //城市状态切换＋push进选中队列
        scope.find('.sc-main').on('click', '.sc-main-item-value', function () {
            var $e = $(this),
                text = $e.text(),
                className = 'sc-main-item-value-selected';
            
            //切换状态
            if (!$e.hasClass(className)) {
                $e.addClass(className).siblings('.' + className).removeClass(className)
                self.selectList = {};
                self.selectList[text] = $e.attr('data-sc-value');
                self.select();
            }
            
            setTimeout(function(){
                self.hide();
            }, 300);
            
        });

        scope.find('.sc-banner-back').on('click', function () {
            self.hide();
        });
        
        // 处理浏览器后退数据丢失
        historystate({
            backRefreshFn: this.onBackRefreshFn.bind(this)
        })
    }

    SelectCitySingle.prototype.show = function () {
        this._scrollTopMain = window.scrollY;
        this.$con.show();
        window.scrollTo(0, this._scrollTopSC||0);
    }

    SelectCitySingle.prototype.select = function () {
        this.onSelect(this.selectList);
    }

    SelectCitySingle.prototype.hide = function () {  
        this._scrollTopSC = window.scrollY;
        this.$con.hide();
        window.scrollTo(0, this._scrollTopMain||0);
    }



    $.selectcitySingle = function (opts) {
        return new SelectCitySingle(opts);
    }

});