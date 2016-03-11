/** 
 * @authors jiajianrong@58.com
 * @date    2015-12-04
 * demo
 * TODO: 类化

var rtn = validator.validateForm([
    {
        errmsg: "融资金额必须为数字10000-500000",
        name: "financeAmount",
        regexp: "^([1-9]\d{4}|[1-5]\d{5}|6[0]{5})$",
        value: "afas"
    },
    
    {
        errmsg: "首付比例必须为数字",
        name: "firstPayRatio",
        rule: "isNumber",
        value: "222222"
    },
    
    {
        errmsg: "必须是100到10000之间的数字",
        name: "dealerOpenBank",
        vfunc: function(){
            return value>100 && value<10000;
        },
        value: "2222"
    }
]);

rtn.isValid
rtn.messages

*/






define( 'libs/common.validate', function(require, exports, module){
    
    
    

    /*
     * helper
     */
    function isEmptyObject(obj) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    }
    
    
    
    
    var validator = {
     
        // 所有可以的验证规则处理类存放的地方，后面会单独定义
        rules: {
            // 验证给定的值不为空
            isNonEmpty: function (value) {
                return !!value && (value.trim() != '');
            },
            // 验证给定的值是否是数字
            isNumber: function (value) {
                return !!value && (value.trim() != '') && !isNaN(value);
            },
            // 验证给定的值是否只是字母或数字
            isAlphaNum: function (value) {
                return !/[^a-z0-9]/i.test(value);
            },
            // 下拉框值不能为-1
            mustSelect: function(value) {
                return !!value && (value.trim() != '') && (value != '-1');
                // regexp: "(?!.*-1)^.*$"
            }
        },
        
        
     
        // 验证类型所对应的错误消息
        messages: {},
        
        
        
        
        
        
        // ------------------
        // 暴露的公开验证方法(表单组件使用)
        // ------------------
        validateForm: function(datas) {
            
            var data, regExp, checker, result_ok;
            
            // 清空所有的错误信息
            this.messages = {};
            
            for (var i=0; i<datas.length; i++) {
                
                data = datas[i];
                
                if ( data.regexp ) {
                    regExp = new RegExp(data.regexp);
                    result_ok = regExp.test(data.value);
                    
                } else if ( data.rule ) {
                    checker = this.rules[data.rule];
                    result_ok = checker(data.value);
                    
                } else if ( data.vfunc ) {
                    result_ok = data.vfunc(data.value);
                }
                
                if (!result_ok) {
                    this.messages[data.name] = data.errmsg;
                }
                
            }
            
            return {
                isValid: isEmptyObject(this.messages),
                messages: this.messages
            }
        }
    };
    
    
    
    
    
    
    module.exports = validator;
    
    
});



