define("page/wddx-plain-index/wddx-plain-index", function(require, exports, module){

    module.exports = function(opt) {

        var $ = require('zepto'),
            procedureTpl = __inline('./dialog-procedure.tmpl');

        require('libs/zepto.dialog');

        var $knowDetail = $('#know-detail');

        // 小知识-贷款申请流程
        $knowDetail.on('click', '#alert-procedure', function(e) {
            $.dialog({
                type: "custom",
                title: "贷款申请流程",
                message: procedureTpl()
            });
        });

        // 小知识-贷款点评
        $knowDetail.on('click', '#alert-comment', function(e) {
            $.dialog({
                type: "custom",
                title: "贷款评价",
                message: "贷款评价，是指用户在58金融申请贷款对贷款结果和贷款机构进行评价！"
            });
        });   

        // 小知识
        $('.know').on('click', function() {
            $knowDetail.toggle();
        });     
    }
});
