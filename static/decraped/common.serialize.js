/** 
 * @authors jiajianrong@58.com
 * @date    2015-12-10
 * 
 * 序列化helper
 * 
 * 
 * 已废弃
 * by jiajianrong
 * 2015-12-16
 */


/**
 * helper: 把 $form.serialArray() 的输出  转换为 json map
 * 
 * 输入
 * [{name: "username", value: "111"},{name: "password",value: "222"}]
 * 
 * 输出
 * { username: "Tom", password: "123456" }
 */


define( 'libs/common.serialize', function(require, exports, module){
    
    
    function arr2map(data) {
        if ( Object.prototype.toString.call(data) === '[object Array]' ) {
            var o = {}, rtn={}, i=0;
            for ( i=0; i<data.length; i++ ) {
                o = data[i];
                rtn[o.name] = o.value || '';
            }
            return rtn;
        }
        return data;
    }
    
    
    
    
    
    
    
    
    module.exports = { 
        arr2map: arr2map 
    };
});






