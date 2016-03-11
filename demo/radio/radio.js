define("demo/radio/radio", function(require, exports, module) {
	module.exports = function(opt) {
		var $ = require('zepto'),
			testsection = $(".test");
		require("libs/zepto.radio");

		testsection.radio("init", {
			id: "shebao",
			filedName: "社保",
			radios:{
				A:"不限",
				B:"有"
			},
			autoValue:"有",
			autoKey:"A"
		});

	}
});