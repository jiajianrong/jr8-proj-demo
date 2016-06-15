/**
 * @authors jiajianrong@58.com
 * @date    2016-05-18
 * 
 */


define( 'libs/common.prototype.array', function(require, exports, module) {
    'use strict';

    
    if ( !Array.prototype.from ) {
        Array.prototype.from=function(origin){
            var arr = [];

            if (origin && origin.length) {
                for(var i=0;i<origin.length;i++) {
                    arr[i] = origin[i];
                }
            }

            return arr;
        };
    }
    
    
    


    
});


