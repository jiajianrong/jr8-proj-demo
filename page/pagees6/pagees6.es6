
'use strict'

import $ from 'zepto';

let div = $('#div')[0]

console.log($)
console.log(div.name,div.getAttribute('name'))


exports.go = function(){
    console.log('go');
}


//var i=1; setInterval(function(){console.log(i++, new Date().getTime());},1000)


var getProvinces = window.getProvinces = function() {
    var a = $.Deferred();
    
    setTimeout(function(){
        console.log("produce province");
        a.resolve({
            provinces: ['北京','天津','上海']
        })
    }, 8000)
    
    return a.promise();
}


var getCities = window.getCities = function(province) {
    console.log("get province", province);
    var a = $.Deferred();
    
    setTimeout(function(){
        console.log("produce city");
        a.resolve({
            cities: ['海淀','朝阳','昌平']
        })
    }, 4000)
    
    return a.promise();
}


var getStreets = window.getStreets = function(city) {
    console.log("get city", city);
    var a = $.Deferred();
    
    setTimeout(function(){
        console.log("produce street");
        a.resolve({
            streets: ['长安街','二环','机场高速']
        })
    }, 2000)
    
    return a.promise();
}


var getFast = window.getFast = function() {
    return 'fast';
}

//$.when(getProvinces(),getCities(),getStreets(),).then(function(){console.log("all done");})

//getProvinces().then(getCities).then(getStreets).then(function(){console.log("all done");})


//getProvinces().then(function(){console.log("all done");})




//$.Callbacks({memory:1})
//
//.add(function(){
//  console.log("1",arguments);
//})
//.add(function(){
//  console.log("2",arguments);
//})
//.add(function(){
//  console.log("3",arguments);
//})
//
//.fire(123)
//.fire(456)