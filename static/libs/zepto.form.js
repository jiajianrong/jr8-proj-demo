/**
 * @authors jiajianrong@58.com
 * @date    2015-12-09
 */

define( 'libs/zepto.form', function(require, exports, module){
    
    var $ = require('zepto'),
        v = require('libs/common.validate');
    
    
	
	$.fn.form = function(opts, param){
		if (typeof opts == 'string'){
			return $.fn.form.methods[opts].call(this, param);
		}
		
		opts = opts || {};
		
		return this;
	};
	
	
	/**
	 * 直接挂在方法form上 --- easyui写法
	 */
	$.fn.form.methods = {
        submit: function(options){
            console.log(arguments);
        },
        
        /**
         * 可以把校验配置写在dom里或js里
         * 支持如下写法
         * 
         * $form.form( 'validate', {} )
         * $form.form( 'validate', {}, {}, {} )
         * $form.form( 'validate', [{},{},{},{},{}] )
         * 
         * @param options: Array or Object
         */
        validate: function(options){
            var validItems = this.find('input,textarea,select').filter(function(){
                return $(this)[0].type !== 'submit';
            });

            var formData = validItems.filter(function(){
                return !! $(this).data('validate');
            }).map(function(){
                var $this = $(this),
                    validateCfg = $this.data('validate');
                return { 
                    name:   $this.prop('name'),
                    value:  $this.val(),
                    regexp: validateCfg.regexp,
                    rule:   validateCfg.rule,
                    errmsg: validateCfg.errmsg
                }
            });
            
            if (options) {
                
                var _$form = this;
                
                options = Array.prototype.slice.call( Object.prototype.toString.call(options)==="[object Array]" ? options : arguments );
                options.forEach(function(item){
                    item.value = _$form.find( 'input[name=' + item.name + '],textarea[name=' + item.name + '],select[name=' + item.name + ']' ).val();
                });
                
                formData = formData.concat( options );
            }
            
            return v.validateForm(validateSort(validItems,formData));
        }
    };

    var validateSort = function(formArray, validArray){
        var resultArray = [], validTmpArray;
        if(Object.prototype.toString.call(formArray) === "[object Array]" && Object.prototype.toString.call(validArray) === "[object Array]" ){
            if(validArray.length < 2)
                return validArray;

            validTmpArray = Array.prototype.slice.call(validArray,0).map(function(item){
                return item.name;
            });
            
            formArray.forEach(function(item){
                if($.inArray(item.name, validTmpArray) != -1)     
                    resultArray.push(validArray[validTmpArray.indexOf(item.name)]);
            });
        }
        return resultArray;
    }

    // zepto插件不需要return
    //return $;
} )