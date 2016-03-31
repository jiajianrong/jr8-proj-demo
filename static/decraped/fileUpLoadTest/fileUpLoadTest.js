define("demo/fileUpLoadTest/fileUpLoadTest", function(require, exports, module) {
    module.exports = function(opt) {
        var $ = require('zepto'),
            section = $('section.container');
        require('libs/zepto.fileupload');
        /*
        fileupload的第二个参数支持 {} [{}] [{},{},....]
        */
        section.fileupload('initFileUpLoad', [{
            id: 'qwqwqw0',
            title: '文件上传0',
            maxuploadnum: 5,
            datarequire: true,
            imgarray: ["/static/img/example/creditcard.jpg"],
            userparams: {
                userId: '88'
            },
            uploadurl: '/market/customer/loan/upload',
            maxfilesize: 3,
            deleteurl: '/market/customer/loan/upload/delete',
            fileparams: {
                maxW: 1024,
                maxH: 10000,
                quality: 0.5,
                format: 'image/jpeg'
            }
        }, {
            id: 'qwqwqw1', //必须有
            userparams: {
                userId: '88' //必须有
            }
        }]);

        section.fileupload('initFileUpLoad', {
            id: 'qwqwqw2', //必须有
            title:'文件上传2',
            userparams: {
                userId: '88' //必须有
            }
        });
        section.fileupload("setState", [{id: "qwqwqw1",state: 1},{id: "qwqwqw0",state: 1}]);
    }
});