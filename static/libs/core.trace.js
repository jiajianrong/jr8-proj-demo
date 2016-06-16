/** 
 * @authors jiajianrong@58.com
 * @date    2016-06-14
 * 
 * 发送日志
 * 
 * Demo:
 * 
 * 
 */


define("libs/core.trace", function(require, exports, module){
    
    
    var encode = encodeURIComponent;
    
    
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
        traceUrlPrefix: 'http://log.jr.58888.com/trace?project=daoliu-test&',
        

        /**
         * 对外暴露接口
         */
        send: function() {
            
            // 包裹trace对象
            this.traceObj.page = encode(location.pathname);
            this.traceObj._ = +new Date();
            
            var to = this.traceObj,
                tgtUrl = to.tgtUrl,
                traceParams = json2query(to),
                isLeave = tgtUrl && (! /(?:javascript\:)|(?:^#)/i.test(tgtUrl) ),
                callback;
            
            // 修正callback参数
            traceParams = traceParams.replace(/callback=[^#&]+/,'callback=true');
            
            if (isLeave) {
                callback = this.emulateLeave(tgtUrl);
            }
            
            if (to.callback) {
                // 如果leave和callback同时存在，合并二者
                if (callback)
                    callback = (function() {
                        var f = callback;
                        return function() {
                            f.apply(null);
                            to.callback.apply(null);
                        };
                    })();
                // 否则直接赋值
                else
                    callback = to.callback;
            }
            
            // https站点 fallback to sending image
            if ( /https/i.test(location.protocol) )
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
            
        }
        
        
        
    };

    
    
    
    
    
    
    
    // document.addEventListener( "DOMContentLoaded", function() {
    document.body.addEventListener( 'click', function(e){
        
        var traceElement = e.target,
            traceObject;
        
        while( !traceElement.getAttribute('data-trace') && traceElement.parentNode!==document.body ) {
            traceElement = traceElement.parentNode;
        }
        
        // 没有 [data-trace] 代理则返回
        if ( traceElement===document.body) {
            return true;
        }
        
        
        // 计算traceObject
        traceObject = traceElement.getAttribute('data-trace');
        traceObject = /\{/.test(traceObject) ? JSON.parse(traceObject) : { tid: +traceObject };
        
        
        // 当前trace元素是a标签？
        if ( traceElement.tagName.toLowerCase()==='a' ) {
            var url = traceObject.tgtUrl = traceElement.getAttribute('href');
            if ( ! /(?:^#)|(?:^tel\:)/i.test(url) ) {
                e.preventDefault();
            }   
        }
        
        
        // 发送打点
        if ( require && require.has && require.has('libs/core.trace') ) {
            var coreTrace = require('libs/core.trace');
            coreTrace.send( traceObject );
        }
        
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