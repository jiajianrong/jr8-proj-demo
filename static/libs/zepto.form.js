/**
 * @authors jiajianrong@58.com
 * @date    2015-12-09
 */

define( 'libs/zepto.form', function(require, exports, module){
    
    var $ = require('zepto'),
        v = require('libs/common.validate');
    
    
    /**
     * helper: 按照dom出现顺序排序formData
     */
    function validateSort(formData/* array */){
        
        if(formData.length < 2)
            return formData;
        
        var arrRtn = [],
            nameArr = formData.map(function(item){
                return item.name;
            });
        
        this.find('[name]').forEach(function(item){
            if($.inArray(item.name, nameArr) != -1)
                arrRtn.push(formData[nameArr.indexOf(item.name)]);
        });
        
        return arrRtn;
    }
    
    
	
	$.fn.form = function(opts, param){
		if (typeof opts == 'string'){
			return $.fn.form.methods[opts].call(this, param);
		}
		
		this._result = null; // shared within methods
		return this;
	};
	
	
	/**
	 * 直接挂在方法form上 --- easyui写法
	 */
	$.fn.form.methods = {
	    
	    /**
	     * 提交表单
	     * @param {Object} options
	     */
        onvalidate: function(options){
            
            if ( !options || !(typeof options == 'object') )
                return;
            
            if ( this._result.isValid && options.success )
                options.success.call(this);
                
            if ( !this._result.isValid && options.error )
                options.error.call(this, this._result.messages);
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
            
            var formData = this.find('[name]').filter(function(){
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
                
                options = Array.prototype.slice.call( Object.prototype.toString.call(options)=="[object Array]" ? options : arguments );
                
                options.forEach(function(item){
                    item.value = _$form.find( '[name='+item.name+']' ).val();
                });
                
                // now formData maybe dis-sorted
                formData = formData.concat( options );
                
                // 排序- 高版本浏览器支持map顺序
                formData = validateSort.bind(this)(formData);
            }
            
            return this._result = v.validateForm(formData);
        }
    };

    

    // zepto插件不需要return
    //return $;
} )