/** 
 * @authors jiajianrong@58.com
 * @date    2016-06-14
 * 
 * 发送日志
 * 
 * 注：
 * 对于普通页面标签里的打点，因为click代理是注册在body上，
 * ios不支持非clickable元素的click冒泡到body
 * 
 * 所以ios下务必将 data-trace 写在<a>或<input>或<button>之类的clickable的元素上
 * 如希望将 data-trace 写在 <div>上，必须给<div>加 cursor:pointer
 * 或者在<div>上注册click事件（使用代理的话代理元素不能是body），然后手动调用send方法打点
 * 
 * 否则ios下<div>等非clickable的元素不支持 data-trace 自动打点
 * 
 * 
 * 
 * 注：
 * 默认使用script.src打点
 * 对于https站点自动回退至image.src （浏览器开启无图模式时 无效）
 * 详情参见 /page/page-trace-usage/
 * 
 * 
 * 
 * 
 * 
 * 
 * 自动打点 Demo
 * 
 * (1)
 * <a href='javascript:;' data-trace='6'>test</a>
 * 
 * (2)
 * <a href='javascript:;' data-trace='abc'>test</a> // 不推荐，发送的打点最好为int
 * 
 * (3)
 * <a href='/next/page/url.html?p1=a&p2=b' data-trace='6'>test</a> // 打点后页面自动跳转
 * 
 * (4)
 * <div style='cursor:pointer;' data-trace='6'>test</div>
 * 
 * (5)
 * <a href='javascript:;' data-trace='{"tid":6,"otherParam":"aaa"}'>test</a>
 * <a href='/next/page/url.html?p1=a&p2=b' data-trace='{"tid":6,"otherParam":"aaa"}'>test</a>
 * <a href='javascript:;' data-trace='{"tid":6,"otherParam":"aaa","tgtUrl":"/next/page/url.html?p1=a&p2=b"}'>test</a>
 * // 支持json对象 以发送多个打点参数
 * // 注：w3c对于element嵌入json的标准是外层单引号，里层双引号。 写反则无效
 * // 自动打点不支持json里写callback回调函数，若有需求请使用手动打点（如下）
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 手动打点 Demo
 * 
 * var coretrace = require('libs/core.trace');
 * 在业务代码里的调用方式：
 * 
 * 
 * 
 * (1) 唯一形参，参数可以为  数值  或  字符串  或  自定义的trace对象
 * 
 * (1.1)
 * coretrace.send(6);
 * 
 * (1.2)
 * coretrace.send('abc'); // 不推荐，发送的打点最好为int
 * 
 * (1.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * });
 * 
 * (1.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     tgtUrl: '/next/page/url.html?p1=a&p2=b' // 指定发送打点后页面跳转路径
 * });
 * 
 * (1.5)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {} // 打点完成的回调 ，支持页面跳转，如 location.href='/next/page/url.html?p1=a&p2=b'
 * });
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * (2) 双形参，第二个参数为  页面跳转的字符串
 * 
 * (2.1)
 * coretrace.send(6, '/next/page/url.html?p1=a&p2=b');
 * 
 * (2.2)
 * coretrace.send('abc', '/next/page/url.html?p1=a&p2=b'); // 不推荐，发送的打点最好为int
 * 
 * (2.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * }, '/next/page/url.html?p1=a&p2=b' );
 * 
 * (2.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {} // 打点完成的回调 
 * }, '/next/page/url.html?p1=a&p2=b' );   
 * // 注：同时定义 第一个参数的callback 和  第二个参数为字符串时，callback里最好不要有页面跳转的逻辑；否则二者冲突必定有一个失效
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * (3) 双形参，第二个参数为  回调函数 （  支持页面跳转，如 location.href='/next/page/url.html?p1=a&p2=b' ）
 * 
 * (3.1)
 * coretrace.send(6, function(){});
 * 
 * (3.2)
 * coretrace.send('abc', function(){}); // 不推荐，发送的打点最好为int
 * 
 * (3.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * }, function(){} );
 * 
 * (3.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {}
 * }, function(){} );   
 * // 注：同时定义 第一个参数的callback 和  第二个参数为回调函数时，后者会覆盖前者。因为确实没有必要把回调逻辑拆为两个callback 
 * 
 * 
 * 
 */


define("libs/core.trace", function(require, exports, module){
    
    
    var encode = encodeURIComponent,
        decode = decodeURIComponent;
    
    
    /**
     * helper
     */
    var isWinLoaded = (function() {
        var winLoaded = false;
        
        var winLoadedHander = function () {
            winLoaded = true;
            window.removeEventListener( 'load', winLoadedHander );
        }
        
        window.addEventListener( 'load', winLoadedHander );
        
        return function() {
            return winLoaded;
        }
    })();
    
    
    /**
     * helper
     */
    var json2query = function(obj) {
        var arr;
        
        arr = Object.getOwnPropertyNames(obj).map( function(k){
            return encode(k) + '=' + encode(obj[k]);
        } );
        
        return arr.join('&');
    };
    
    
    /**
     * helper
     */
    var setCookie = window.setC = function(key, value, expires, domain){
        document.cookie = key + "=" + encode(value)
            + (domain ? ";domain="+domain : "")
            + (expires ? ";path=/;expires=" + expires.toGMTString()+";" : "");
    };
    
    
    /**
     * helper
     */
    var getCookie = window.getC = function(key){
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);
        return result ? decode(result[2]) : null;
    }
    
    
    /**
     * helper
     */
    var makeUID = (function () {
        
        var COOKIE_KEY = 'jr8_t_c',
            uid = getCookie(COOKIE_KEY),
            exp,
            t;
        
        if (!uid) {
            uid = location.host.replace( /\W/gi, '' ) + '.' + (+new Date()) + Math.random();
            exp = new Date();
            t = exp.getTime();
            t += 1000*3600*24*365*10;
            exp.setTime(t);
            setCookie( COOKIE_KEY, uid, exp );
        }
        
        return function() {
            return uid;
        }
    })();
    
    
    
    
    
    /**
     * 发送
     * @param {Object} traceObj
     * 
     * traceObj格式为
     * {
     *     tid: 1,
     *     pid: 1,
     *     tgtUrl: 'string',
     *     ...
     * }
     */
    function Trace (traceObj) {
        this.traceObj = traceObj;
    }
    
    
    
    
    Trace.prototype = {
        
        // 替换成日志server的实际地址
        traceUrlPrefix: 'http://log.jr.5888888.com/trace?project=daoliu-test&',
        

        /**
         * 对外暴露接口
         */
        send: function() {
            
            var to = this.traceObj,
                tgtUrl = to.tgtUrl,
                traceParams,
                isLeave = false,
                callback;
            
            // 包裹trace对象
            to.page = encode(location.pathname);
            to._ = +new Date();
            to.uid = makeUID();
            
            // stringify
            traceParams = json2query(to);
            
            
            if (to.callback) {
                callback = to.callback;
                isLeave = this.checkIfCallbackLeave();
                // 修正callback参数
                traceParams = traceParams.replace(/callback=[^#&]+/,'callback=true');
            }
            
            
            if (this.checkIfDirectLeave()) {
                
                var l = this.emulateLeave(tgtUrl);
                
                // combine callbacks
                if (callback) {
                    callback = (function() {
                        var c = callback;
                        return function() {
                            c.apply(null);
                            l.apply(null);
                        };
                    })();
                    
                } else {
                    callback = l;
                }
                
                isLeave = isLeave || true;
            }
            
            
            // in case https fallback to send image
            if ( /^https/i.test(location.protocol) )
                this.sendViaImage( this.traceUrlPrefix+traceParams, callback, isLeave );
            else
                this.sendViaScript( this.traceUrlPrefix+traceParams, callback, isLeave );
            
        },
        
        
        
        
        
        
        /**
         * 用script.src方式发送，用来替代image.src
         * 
         * @param {Object} traceUrl
         * @param {Object} callback
         */
        sendViaScript: function(traceUrl, callback, isLeave) {
            
            var script,
                
                
                sent = false,
                
                
                callback = callback || function(){},
                
                
                sendTimer = setTimeout(function(){
                    
                    clearTimeout(sendTimer);
                    sendTimer = null;
                    
                    script = document.createElement('SCRIPT');
                    
                    script.onload = script.onerror = function() {
                        sent = true;
                        callback.apply(null);
                    };
                    
                    script.src = traceUrl;
                    
                    document.body.appendChild(script);
                    
                },0),
                
                
                timeoutTimer = setTimeout( function(){
                    
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                    
                    script.onreadystatechange = script.onload = script.onerror = script.readyState = null;
                    
                    !sent && callback.apply(null);
                    
                    document.body.removeChild(script);
                    
                }, isLeave?300:3000 );
            
            
        },
        
        
        
        
        
        /**
         * 用image.src发送打点
         * 
         * @param {Object} traceUrl
         * @param {Object} callback
         */
        sendViaImage: function(traceUrl, callback, isLeave) {
            
            var img,
                
                
                sent = false,
                
                
                callback = callback || function(){},
                
                
                sendTimer = setTimeout(function(){
                    
                    clearTimeout(sendTimer);
                    sendTimer = null;
                    
                    img = new Image();
                    
                    img.onload = img.onerror = function() {
                        sent = true;
                        callback.apply(null);
                    };
                    
                    img.src = traceUrl;
                    
                },0),
                
                
                timeoutTimer = setTimeout( function(){
                    
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                    
                    img.onreadystatechange = img.onload = img.onerror = img.readyState = null;
                    
                    !sent && callback.apply(null);
                    
                }, isLeave?300:3000 );
            
            
        },
        
        
        
        
        /**
         * 模拟页面跳转
         * 
         * @param {Object} tgtUrl
         */
        emulateLeave: function(tgtUrl) {
            
            return function() {
                
                // convert url to absolute path
                var elA = document.createElement('a');
                elA.href = tgtUrl;
                tgtUrl = elA.href;
                
                // webkit在onload之前，如果有非用户发起的跳转，那么页面不会记入history。也就是跳转后点返回，回不到跳转前的页面
                if (isWinLoaded()) {
                    location.href = tgtUrl;
                
                // 如果使用模拟点击，那么js改变的页面状态在跳转返回后不会保留。比如点击下一页加载更多后，点击打点跳转，再返回，页面只有初始的第一页内容。
                } else {
                    // UC浏览器dispatch event有问题，模拟点击的href是tel:等无法触发
                    elA.click();
                }
                
            };
            
        },
        
        
        
        
        /**
         * helper
         * 判断是否需要页面跳转
         */
        checkIfCallbackLeave: function() {
            
            var callback = this.traceObj.callback,
                isLeave = false;
            
            if ( callback ) {
                var cbStr = callback.toString();
                isLeave = /location\.href\s*=/i.test(cbStr);
            }
            
            return isLeave;
        },
        
        
        
        /**
         * helper
         * 判断是否需要页面跳转
         */
        checkIfDirectLeave: function() {
            
            var tgtUrl = this.traceObj.tgtUrl,
                isLeave = false;
            
            isLeave = tgtUrl && ( ! /(?:javascript\:)|(?:^#)/i.test(tgtUrl) );
            
            return isLeave;
        }
        
        
        
    };

    
    
    
    
    
    
    
    // document.addEventListener( "DOMContentLoaded", function() {
    document.body.addEventListener( 'click', function(e){
        
        var traceElement = e.target,
            traceObject;
        
        while( traceElement && 
               traceElement.parentNode!==document.body && 
               traceElement!==document.body &&
               !traceElement.getAttribute('data-trace') ) {
            traceElement = traceElement.parentNode;
        }
        
        if (!traceElement) {
            return true;
        }
        
        traceObject = traceElement.getAttribute('data-trace');
        
        if (!traceObject) {
            return true;
        }
        
        // 计算traceObject
        traceObject = /\{/.test(traceObject) ? JSON.parse(traceObject) : { tid: +traceObject };
        
        
        // 当前trace元素是a标签？
        if ( traceElement.tagName.toLowerCase()==='a' ) {
            var url = traceObject.tgtUrl = ( traceObject.tgtUrl || traceElement.getAttribute('href') );
            if ( ! /(?:^#)|(?:^tel\:)/i.test(url) ) {
                e.preventDefault();
            }   
        }
        
        
        // 发送打点
        //-----------
        //if ( require && require.has && require.has('libs/core.trace') ) {
        //    var coreTrace = require('libs/core.trace');
        //    coreTrace.send( traceObject );
        //}
        //-----------
        TraceProxy.send( traceObject );
        
        return true;
    } );
    // } );
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    var TraceProxy = {
        send: function( traceObj, callback ) {
            
            var t = typeof traceObj;
            
            if ( t==='string' || t==='number' ) {
                traceObj = {tid: traceObj}
            }
            
            if ( typeof callback==='string' ) {
                traceObj.tgtUrl = callback;
            } else if ( typeof callback==='function' ) {
                traceObj.callback = callback;
            }
            
            var t = new Trace(traceObj);
            t.send();
        }
    };
    
    
    
    module.exports = TraceProxy;

});