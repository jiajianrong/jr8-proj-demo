/**
 * @authors jiajianrong@58.com
 * @date    2015-01-19
 * 使用
 * 
 * var countdown = new CountDown( endDate )  // endDate可是是date型或者long(毫秒)型
 * countdown.run({
        onTick: function(ts) {
            var d = ts.days ? (ts.days + "天") : "", 
                h = ts.hours ? (ts.hours + "时") : "",
                m = ts.minutes ? (ts.minutes + "分") : "0分",
                s = ts.seconds ? (ts.seconds + "秒") : "0秒";
            
            console.log(d+h+m+s);
        },
        onFinish: function() {
            console.log("已结束");
        }
    });
 */

define( 'libs/common.countdown', function(require, exports, module) {
    'use strict';

    // 通过 exports 对外提供接口
    
    var STATUS_WAITING = 'waiting',
        STATUS_RUNNING = 'running',
        STATUS_FINISHED = 'finished';

    /* 确保日期格式正确 */
    function ensureDate(date) {
        if(!(date instanceof Date)) {
            if(date !== null && isFinite(date)) { // 注意：Number(null)为0，导致isFinite(null)为true
                return new Date(+date);
            } else {
                return new Date();
            }
        } else {
            return date;
        }
    }

    /* 计算时间间隔 */
    function calcTimeSpan(start, end) {
        var timeSpan = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if(end > start) {
            var distance = Math.round((end - start) / 1000);

            timeSpan.seconds = distance % (60);
            distance = parseInt(distance / 60);

            timeSpan.minutes = distance % (60);
            distance = parseInt(distance / 60);

            timeSpan.hours = distance % (24);
            distance = parseInt(distance / 24);

            timeSpan.days = distance;
        }
        return timeSpan;
    };

    function CountDown(endDate) {
        this._endDate = ensureDate(endDate);
        this._status = STATUS_WAITING;
    }

    CountDown.prototype.run = function(options) {
        var self = this,
            options = options || {};

        if(STATUS_RUNNING === this._status) {
            return;
        }

        function handler() {
            var now = new Date();

            if(self._endDate > now) {
                self._status = STATUS_RUNNING;

                // 触发“tick”事件
                if('function' === typeof options.onTick) {
                    options.onTick.call(self, calcTimeSpan(now, self._endDate));
                }
            } else {
                clearInterval(self._timer);

                // 触发“tick”事件
                if('function' === typeof options.onTick) {
                    options.onTick.call(self, calcTimeSpan(now, self._endDate));
                }
                
                if(STATUS_RUNNING === self._status) {
                    self._status = STATUS_FINISHED;

                    // 触发“完成”事件
                    if('function' === typeof options.onFinish) {
                        options.onFinish.call(self);
                    }
                }
            }
        }

        this._timer = setInterval(function() {
            handler.call(self);
        }, 1000);

        handler.call(this);
    };

    CountDown.prototype.stop = function() {
        clearInterval(this._timer);
        this._status = STATUS_WAITING;
    }

    return CountDown;
});






