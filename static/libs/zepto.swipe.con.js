/**
 * 滑动效果
 * 
 * @authors jiajianrong@58.com
 * @date    2017-07-07
 * 使用
 * 
 * <div class="wrap" style="height:250px;overflow:hidden;">
 *     <ul>
           ...
       </ul>
 * </div>
 * 
 * $('.wrap').swipecon();
 */

define( 'libs/zepto.swipe.con', function(require, exports, module){
    
    var $ = require('zepto');
    
    
    $.fn.swipecon = function() {
        
        var $con = this.children().eq(0);
        
        
        
        $con.on('touchstart', function(e){
            this.startY = e.targetTouches[0].screenY;
            this.startTop = this.y || 0;
            this.startTime = e.timeStamp;
            this.moved = false;
            this.wrapH = $(this).parent()[0].offsetHeight;
            if (!this.maxScrollY) {
                this.scrollerHeight = this.offsetHeight;
                this.maxScrollY = this.wrapH - this.scrollerHeight + 1
            }
            //this._height = this._height || $(this).parent().height() - $(this).find("li").height() * $(this).find("li").length + 1;
            if (this.isInTransition) {
                var matrix = window.getComputedStyle(this, null );
                matrix = matrix["webkitTransform"].split(")")[0].split(", ");
                this.y = matrix[13] || matrix[5];
                this.y = Math.round(this.y);
                this.startTop = Math.round(this.y);
                $(this).css({
                    "-webkit-transform": "translate3d(0," + this.y + "px, 0)",
                    "-webkit-transition-duration": "0"
                });
                this.isInTransition = false
            }
        })
        
        
        
        $con.on('touchmove', function(e){
            e.preventDefault();
            e.stopPropagation();
            this.moved = true;
            this.y = e.targetTouches[0].screenY - this.startY + this.startTop;
            if (this.y > 0 || this.y < this.maxScrollY) {
                var newY = this.y - (e.targetTouches[0].screenY - this.startY) * 2 / 3;
                this.y = this.y > 0 ? 0 : this.maxScrollY;
                if (newY > 0 || newY < this.maxScrollY) {
                    this.y = newY
                }
            }
            $(this).css({
                "-webkit-transform": "translate3d(0," + this.y + "px, 0)",
                "-webkit-transition-duration": "0"
            });
            this.isInTransition = false;
            var timeStamp = e.timeStamp;
            if (timeStamp - this.startTime > 300) {
                this.startTime = timeStamp;
                this.startY = e.targetTouches[0].screenY;
                this.startTop = this.y
            }
        })
        
        
        
        $con.on('touchend', function(e){
            var dist = e.changedTouches[0].screenY - this.startY;
            this.endTime = e.timeStamp;
            var duration = this.endTime - this.startTime;
            if (this.moved) {
                e.preventDefault();
                e.stopPropagation();
                var newY = Math.round(e.changedTouches[0].screenY);
                this.isInTransition = true;
                if (this.y > 0 || this.y < this.maxScrollY) {
                    scrollTo(this, this.y, this.maxScrollY, 600);
                    return
                }
                if (duration < 300) {
                    var move = calculateMoment(this.y, this.startTop, duration, this.maxScrollY, this.wrapH);
                    this.y = move.destination;
                    var time = move.duration;
                    $(this).css({
                        "-webkit-transform": "translate3d(0, " + this.y + "px, 0)",
                        "transition-timing-function": "cubic-bezier(0.1, 0.3, 0.5, 1)",
                        "-webkit-transition-duration": time + "ms"
                    })
                }
                return
            }
        })
        
        
        
        
        $con.on("transitionend", function() {
            this.isInTransition = false;
            scrollTo(this, this.y, this.maxScrollY, 600)
        })
        
        
        
        function scrollTo(obj, y, maxY, time, sety) {
            if (y > 0 || maxY > 0) {
                y = 0
            } else if (y < maxY) {
                y = maxY
            } else if (sety != 0) {
                //obj.y = 0
                y = sety
            }
            obj.isInTransition = true;
            $(obj).css({
                "-webkit-transform": "translate3d(0, " + y + "px, 0)",
                "transition-timing-function": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                "-webkit-transition-duration": time + "ms"
            })
        }
        
        
        
        function calculateMoment(current, start, time, lowerMargin, wrapperSize) {
            var distance = current - start, speed = Math.abs(distance) / time, destination, duration;
            var deceleration = 6e-4;
            destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed
            }
            return {
                destination: Math.round(destination),
                duration: duration
            }
        }
        
        
        
    };
    
    
    // zepto插件不需要return
    //return $;
    
} )


