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
    
    
    /**
     * ios下，吸底fixed元素在软键盘或select下拉列表出来时 定位错乱
     * 判断是否当前active元素是问题元素
     * @return true/是/需要hook; false/否/不需要hook
     */
    function needKeyBoardHook(el) {
        
        var actEl = el || document.activeElement,
            SELECT_TOSTRING = "[object HTMLSelectElement]",
            INPUT_TOSTRING = "[object HTMLInputElement]";
        
        var flag = true;
        
        // if (actEl.nodeName!='SELECT' && actEl.nodeName!='INPUT' )
        if (actEl.toString()!=SELECT_TOSTRING && actEl.toString()!=INPUT_TOSTRING )
            flag = false;
        
        else if (actEl.toString()==INPUT_TOSTRING && ['radio','checkbox'].indexOf(actEl.type)!=-1 )
            flag = false;
        
        else if (actEl.readOnly)
            flag = false;
        
        else if (actEl.disabled)
            flag = false;
        
        return flag;
    }
    
    
    
    $.fn.form = function(opts, param){
        
        //console.log(this)
        
        if (typeof opts == 'string'){
            return $.fn.form.methods[opts].call(this, param);
        }
        
        return this;
    };
    
    
    /**
     * 直接挂在方法form上 --- easyui写法
     */
    $.fn.form.methods = {
        
        /**
         * init
         * @param {Object} options
         */
        init: function(options) {
            
            // fastclick原理解决ios input 软键盘 bug
            // jiajianrong@58.com  2016-5-3
            if (/iphone/i.test(navigator.userAgent) && options.btnWrap) {
                
                var $btnWrap = $(options.btnWrap),
                    btnHideClass = 'ui-form-btmbtn-hidden',
                    touchLife;
                
                this.on( 'touchstart', 'input', function(e){
                    touchLife = new Date();
                } );
                
                this.on( 'touchend', 'input', function(e){
                    touchLife = new Date() - touchLife;
                    if (touchLife<=300) {
                        if (! needKeyBoardHook(e.target))
                            return;
                        document.activeElement = e.target;
                        $btnWrap.addClass(btnHideClass);
                    }
                } );
                
                this.on( 'focus', 'select', function(e){
                    if (! needKeyBoardHook(e.target))
                        return;
                    $btnWrap.addClass(btnHideClass);
                } );
                
                this.on( 'blur', 'input,select', function(e){
                    if (! needKeyBoardHook(e.target)) 
                        return;
                    $btnWrap.removeClass(btnHideClass);
                    window.scrollTo(0, window.scrollY + 0.1);
                } );
                
            }
            
            
            return this;
        },
        
        
        /**
         * 提交表单
         * @param {Object} options
         */
        onvalidate: function(options){
            
            if ( !options || !(typeof options == 'object') )
                return;
            
            if ( this._result.isValid )
                options.success && options.success.call(this);
            else
                options.error && options.error.call(this, this._result.messages);
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
                    var $items = _$form.find( '[name='+item.name+']' );
                    
                    // default to empty
                    item.value = '';
                    
                    // input select
                    if ($items.size()==1) {
                        item.value = $items.val();
                        
                    // radio checkbox   
                    } else if ($items.size()>1) {
                        $items.forEach(function(it){
                            if (it.checked) item.value = it.value;
                        })
                    }
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