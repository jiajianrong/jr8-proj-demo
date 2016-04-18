define("demo/dialog/dialog", function(require, exports, module) {
	module.exports = function(opt) {
		var $ = require('zepto');
		require('libs/zepto.dialog');
		//.dialog-alert,.dialog-confirm,.dialog-custom


		$('.info-wrap').on('click', '.dialog-confirm', function(e) {
			$.dialog({
				type: "confirm",
				btnDblOk:"双选确定",
				btnDblCanl:"双选取消",
				message: "<div style = 'text-align:left;'>swwwwwsssqwqwqwqwwwwwwwwwsssssqwqwqwqwwwwwwwwwsssqwq</div>",
				onOk: function() {
					alert("doubleOk");
				},
				onCancel:function(){
					alert("cancel");
				}
			});
		})

		$('.info-wrap').on('click', '.dialog-alert', function(e) {
			$.dialog({
				type: "alert",
				btnSing: "我知道了",
				message: "sssqwqwssswwssqwqwqwq",
				onOk:function(){
					alert("singelOk")
				}
			});
		})
	}
});