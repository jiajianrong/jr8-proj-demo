/**
 * @require /static/scss/zepto.selectcity.scss
 * 
 * @authors MXR
 * @date    2016-02-28
 * 
 * demo
 * var cityList = {
		list: [
			{
				"label":"A",
	            "value":"key",
	            "hash": "A"
			},
			{
                "label":"鞍山",
                "value":"as"
            }
		]
 * };
 *  var selectcity = $.selectcity({
		data: cityList,
		onMsg: function (data) {
			console.log('msg');
			console.log(data);
		}
	});
	selectcity.show();
 */
define( 'libs/zepto.selectcity', function(require, exports, module) {

	var $ = require('zepto'),
		$body = $('body'),
		tpl = __inline('./zepto.selectcity.tmpl');


	function SelectCity(opts) {
		//模版渲染
		var self = this;
		this.data = opts.data || {};
		this.$con = $(tpl(this.data));
		//选中的选项
		this.selectList = {
			length: !this.data.checkedVal  ? 0 : this.data.checkedVal.split(',').length
		};

		this.$con.find(".sl-item-selected").forEach(function(item){
			var $item = $(item), text = $item.text();
			self.selectList[text] = $(item).attr('data-sc-value');
		});
		// mixin callback
        ['onInit','onShow','onMsg','onHide','onDestroy'].forEach( $.proxy( function(item){
            this[item] = opts[item] || function(){};
        }, this) );

        this.init();

	}

	SelectCity.prototype.init = function () {

		var self = this;
		var scrop = self.$con;
		//添加到body
		$body.append(this.$con);

		//绑定事件

		//侧边栏定位
		scrop.find('.sc-aside-key').on('click', function (e) {
			var $e = $(e.target),
				scrollId = '#' + $e.attr('data-schash'),
				buffer = $('.sc-top-banner').eq(0).height() || 50,
				distance = $(scrollId).offset().top - buffer;

			scrollTo(0, distance);
		});
		//城市状态切换＋push进选中队列
		scrop.find('.sl-item').on('click', function (e) {
			var $e = $(e.target),
				text = $e.text();
			//切换状态
			if (!$e.hasClass('sl-item-selected')) {
				$e.addClass('sl-item-selected');
				self.selectList[text] = $e.attr('data-sc-value');
				++self.selectList.length;
			} else {
				$e.removeClass('sl-item-selected');
				delete self.selectList[text];
				--self.selectList.length;
			}
			//不限和选择的切换
			if (self.selectList.length === 0) {
				scrop.find('.sl-limit').addClass('sl-limit-selected');
				scrop.find('.sc-city-name').text('不限');
			} else {
				scrop.find('.sl-limit').removeClass('sl-limit-selected');
				scrop.find('.sc-city-name').text(self.selectList.length);
			}
		});
		scrop.find('.sl-limit').on('click', function (e) {
			var $e = $(e.target);

			if ($e.hasClass('sl-limit-selected')) {
				return
			} else {
				$e.addClass('sl-limit-selected');
				scrop.find('.sl-item').removeClass('sl-item-selected');
				self.selectList = {
					length: 0
				};
				scrop.find('.sc-city-name').text('不限');
			}
		});
		scrop.find('.sc-city-keep').on('click', function (e) {
			self.msg();
		});
		scrop.find('.sc-top-back').on('click', function (e) {
			self.hide();
		});

		this.onInit();
	}

	SelectCity.prototype.show = function () {

		var self = this;

		self.$con.show();

		this.onShow();
	}

	SelectCity.prototype.msg = function () {

		var self = this;

		self.onMsg(self.selectList);

		self.hide();
	}

	SelectCity.prototype.hide = function () {

		var self = this;
			
		self.$con.hide();


	}

	SelectCity.prototype.destroy = function () {

		var self = this;
		
		this.onDestroy();
	}

	$.selectcity = function (opts) {
		var selectcity = new SelectCity(opts);

		return selectcity;
	}

});