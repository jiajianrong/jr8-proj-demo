define("demo/selection/selection", function(require, exports, module) {
	module.exports = function(opt) {
		var $ = require('zepto');//,
			testsection = $(".test");
		require('libs/zepto.singleSelection');
		require("libs/zepto.radio");

		var test = {
				id: "yuexin",
				/*selections: {
					A: "3000以下",
					B: "3000-10000",
					C: "10000-20000",
					D: "20000以上",
					E: "不限"
				},*/
				selections: ["不限", "3000以下", "3000-10000", "10000-20000", "20000以上"],
				singleSelectTitle: "请选择月收入范围",
				required: true,
				filedName: "月收入",
				autoValue: "不限"
			},
			test1 = {
				id: "yuexin1",
				selections: {
					A: "不限",
					B: "买房",
					C: "买车",
					D: "生意周转",
					E: "其他"
				},
				//selections: ["不限","买房","买车","生意周转","其他"],
				singleSelectTitle: "请选择贷款用途",
				required: true,
				filedName: "贷款用途"
			};
		testsection.singleSelection("init", test1);
		testsection.singleSelection("init", test);

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
		
		/*function creatSingleSelect(obj) {
			var maindiv;
			if (obj.id && obj.selections && obj.singleSelectTitle) {
				var divBorder = $("<div class = 'singleSelection-border'></div>"),
					label,
					divcon = $("<div class='singleSelection-con'></div>"),
					italic = $("<i class='icon icon-select'></i>"),
					input,
					divSelect = $("<div class = 'select placeholder placeholder-has' name = '" + obj.id + "' data-title = '" + obj.singleSelectTitle + "'>" + obj.autoValue || obj.singleSelectTitle + "</div>"),
					singleSelection = $("<section class='singleSelection-option-con'></section>"),
					ul = $("<ul class='singleSelection-option'></ul>");
				maindiv = $("<div class = 'singleSelection-item' id = '" + obj.id + "'></div>");
				if (obj.filedName)
					label = $("<label>" + obj.filedName + "</label>");
				if (Object.prototype.toString.call(obj.selections) === "[object Object]")
					for (var p in obj.selections) {
						if (p == obj.autoKey)
							ul.append($("<li data-value = '" + p + "' class = 'checked'><i class='icon icon-radio'></i>" + obj.selections[p] + "</li>"));
						else
							ul.append($("<li data-value = '" + p + "'><i class='icon icon-radio'></i>" + obj.selections[p] + "</li>"));
					} else if (Object.prototype.toString.call(obj.selections) === "[object Array]") {
						var objarray = obj.selections;
						for (var i = 0, len = objarray.length; i < len; i++) {
							if (objarray[i] == obj.autoValue)
								ul.append($("<li class = 'checked'><i class='icon icon-radio'></i>" + objarray[i] + "</li>"));
							else
								ul.append($("<li><i class='icon icon-radio'></i>" + objarray[i] + "</li>"));
						}
					}
				singleSelection.append(ul);
				var value = obj.autoKey || "";
				if (obj.required)
					input = $("<input type = 'text' class = 'singleSelection-hidden' required name = '" + obj.id + "'" + "value = '" + value + "'>");
				else
					input = $("<input type = 'text' class = 'singleSelection-hidden' name = '" + obj.id + "'" + "value = '" + value + "'>");
				divcon.append(italic).append(input).append(divSelect).append(singleSelection);
				divBorder.append(label).append(divcon);
				maindiv.append(divBorder);
			}
			return maindiv ? maindiv : $("<div style = 'height:20px'>请输入正确的参数</div>");
		}

		$("div.singleSelection-item").on('click', '.select, .icon-select', function(event) {
			var $select = null;
			if ($(event.target).hasClass('select')) {
				$select = $(event.target);
			} else {
				$select = $(event.target).parent().find('.select');
			}
			$.dialog({
					type: "custom",
					title: $select.data('title'),
					message: $select.next('.singleSelection-option-con').html()
				})
				Modal({
					content: $select.next('.modal-option-con').html(),
					title: $select.data('title'),
					afterOpen: function($modal) {
						$modal.on('click', '.modal-option>li', function(e) {
							var $li = $(e.target).closest('li');
							if (!$li.hasClass('checked')) {
								$li.addClass('checked').siblings('.checked').removeClass('checked');
								var _selectText = $li.text();
								var _selectValue = $li.data('value');
								$select.text(_selectText).removeClass('placeholder').prev('.select-hidden').val(_selectValue || _selectText);
								$select.next('.modal-option-con').find('.modal-option li').eq($li.index()).addClass('checked').siblings('.checked').removeClass('checked');
							}
							setTimeout(function() {
								$modal.destroy();
							}, 200);
						});
					  },
					beforeClose: function($modal) {
						$modal.off();
					}
				});
		});*/
	}
});