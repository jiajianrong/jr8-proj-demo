/**
 * @urlparser 兼容支持get参数和hash的解析
 * @author yuebin
 */

define( 'libs/common.urlparser', function(require, exports, module) {
    'use strict';

    // 通过 exports 对外提供接口
    exports.get = function(key) {
        var match = location.search.match(new RegExp('[?&#]' + key + '=([^&#]*)'));
        if (match) {
            return decodeURIComponent(match[1]);
        }

        return null;
    };

    exports.parse = function(str) {
        var urlStr = str || location.search;
        var index = urlStr.indexOf('?');
        if (index === -1) {
            index = urlStr.indexOf('#');
        }
        urlStr = urlStr.substr(index+1);

        var result = {};

        var paramsArray = urlStr.split(/&|#/);

        for (var i = 0; i< paramsArray.length; i++) {
            var parts = paramsArray[i].split('=');

            if (parts.length === 2 && parts[0]) {
                result[parts[0]] = decodeURIComponent(parts[1]);
            }
        }

        return result;
    }
});