/**
 * @authors jiajianrong@58.com
 * @date    2015-01-22
 * 使用
 * 
    <input type="text" name="your_date" placeholder = "请选择日期" readonly/>
    <input type="text" name="your_date" placeholder = "请选择日期" value="1999-04-14" readonly/>
    
    $('.class-name').date();
    $('.class-name').date({defaultTime:'2010-01-10'});
 */

define( 'libs/zepto.date', function(require, exports, module){


    var $ = require('zepto'),
        render = require('libs/common.render.date'),
        
        // 下面俩变量只定义一次
        wrapEl = $('<div class="widget-date-wrap-default">'),
        registered = false,
        
        // helper
        zeroAndLong = function(dateStr/* 1999-10-03 */) {
            if (!dateStr) 
                return null;
                
            var timeStr = dateStr + " 00:00:00",
                arr = timeStr.split(/[- :]/),
                l = +(new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]));
            return l;
        };
    
    
    
    $.fn.date = function(settings) {
        
        settings = settings || {};
        
        // flag
        this.data('date-input', '__Y__');
        
        
        // this supposed to be $input
        this.on('click', function(){
            
            var selected = this.value.trim(),
                current  = selected || settings.defaultTime || (new Date()).format('{y}-{M}-{d}'),
                html,
                wrapT = this.offsetTop + this.offsetHeight + 10;
                //wrapW = document.body.offsetWidth - 40;
            
            selected = zeroAndLong(selected);
            current =  zeroAndLong(current);
            
            html = render(current,selected);
            
            wrapEl
                .empty()
                .remove()
                .html(html)
                .css({ top: wrapT });
            
            // 弹出控件插入到当前input后面
            $(this).after(wrapEl);
        });
        
        
        // clean env
        !registered && wrapEl.off('.wrap.date');
        
        
        // click next/prev month
        !registered && wrapEl.on('click.wrap.date', 'a[data-date-prev],a[data-date-next]', function(){
            
            var $this = $(this);
            
            if($this.hasClass("disable")) 
                return;
            
            var current = $this.closest("[data-date]").data("v"),
                nextOrPrev = new Date(current).ago( this.hasAttribute('data-date-prev') ? 1 : -1,"month"),
                html = render(nextOrPrev);
            
            wrapEl
                .empty()
                .append(html);
            
            return false;
        });
        
        
        // click specific day
        !registered && wrapEl.on('click.wrap.date', 'a[data-v]', function(e){
            
            var v = (new Date($(this).data('v'))).format('{y}-{M}-{d}');
            
            //$(this).closest('[data-date]').parent().prev().val(v);
            //$(e.originalEvent.currentTarget).prev().val(v);
            wrapEl.prev().val(v);
            
            wrapEl
                .empty()
                .remove();
        });
        
        
        // click other places to close
        !registered && $(document.body).off(".doc.date").on('click.doc.date', function (e) {
            
            if ( $(e.target).closest('[data-date]').size() || $(e.target).data('date-input') == '__Y__' )
                return;

            wrapEl
                .empty()
                .remove();
        });
        
        
        // ios document/body click bubble fix
        !registered && (/iphone/i.test(navigator.userAgent)) && $(document.body).children().click(function(){});
        
        
        registered = true;
    };
    
    
    
    // zepto插件不需要return
    //return $;
} )




