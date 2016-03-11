/**
 * README
 * 
 * 安装jr58
 * npm install jr58 -g
 * 
 * 编译到本地tomcat
 * jr58 release -cDw
 * 或者
 * jello release -cDw
 * 
 * 编译给Javaer (请先安装jr58，暂不支持jello命令)
 * jr58 release -comDd ../out-your-path publish
 * 
 * 
 * 2016-02-16
 * 新加性能监控功能(统计head加载时间、doc加载及渲染时间、js加载及运行时间、window onLoad时间)
 * jr58 release -cDw performance
 * jr58 release -comDd ../out-your-path publish performance
 */

var IS_PUBLISH     = /\bpublish\b/i.test(process.title);
var IS_PERFORMANCE = /\bperformance\b/i.test(process.title);

console.log('IS_PUBLISH    :' + IS_PUBLISH);
console.log('IS_PERFORMANCE:' + IS_PERFORMANCE);



// cdn判断
if (!/D[^:]/.test(process.title)) {
    throw 'Contract module use CDN, please add param -D';
}


var domainCDN = { "/static/img/contract/*.png": ["http://cdn.com.cn/your"] };





// --------------------------------
// vm内路径转换插件: 仅在publish下使用vmparse插件
//    2016-03-04 decraped 已被jello-postpackager-vmparse取代
// --------------------------------
//if (IS_PUBLISH) // 加判断提升编译速度
//
//fis.config.merge({
//  modules: {
//      preprocessor: {
//          useCache: false,
//          vm: 'vmparse',
//          html: 'vmparse'
//      }
//  },
//  settings: {
//      preprocessor: {
//          vmparse: {
//              prefixPath: IS_PUBLISH ? '/views/crm-m' : '',
//              suffixType: IS_PUBLISH ? 'html' : 'vm'
//          }
//      }
//  }
//})






// --------------------------------
// 压缩优化
// --------------------------------
fis.config.merge({
    modules: {
        optimizer: {
            // js后缀文件会经过fis-optimizer-uglify-js插件的压缩优化
            js: 'uglify-js',
            css: 'clean-css' //, png : 'png-compressor'
        }
    },
    // 使用pngquant进行压缩，png图片压缩后均为png8
    // fis.config.set('settings.optimizer.png-compressor.type', 'pngquant');
    settings: {
        optimizer: {
            'png-compressor': {
                type: 'pngquant'
            }
        }
    },

    deploy: {
        publish: {
            // jello release -ompDd publish
            to: '../output-CRM-And-PC-BMS'
        }
    }
});






// --------------------------------
// js 模板支持
// --------------------------------
fis.config.set('modules.parser.tmpl', 'utc');
//fis.config.set('roadmap.ext.tmpl', 'js');
//fis.config.set('roadmap.ext.tpl', 'js');
//fis.config.merge({
//  settings: {
//      parser : {
//          'utc': {
//              variable: 'obj'
//          }
//      }
//  }
//});






// --------------------------------
// 性能统计server配置
// --------------------------------
fis.config.merge({
    settings: {
        postpackager: {
            'performance-framework': {
                urlPrefix: 'http://1.1.1.1:1111/saveTime?project=cfq-crm'
            }
        }
    }
})




// --------------------------------
// 打包配置
// --------------------------------
// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
//fis.config.set('modules.packager', 'depscombine');
//
//fis.config.set('pack', {
//  // css
//  'pkg/frame.css': ['page/layout/frame.vm'],   // 因为依赖会被打包，所以这个规则会把 frame.vm 依赖的 css 打包在一起。
//  // js
//  // 依赖也会自动打包进来。
//  'pkg/boot.js': ['static/js/require.js', 'components/zepto_1.1.6/zepto.js']
//  //'pkg/app.js': ['page/examples/form.js']
//});






// --------------------------------
// 通用roadmap.path配置
// --------------------------------
var common_roadmap_path = [
        
    /* 配置文件 */
    {
        reg: /^\/fis-conf-.+$/i,
        release: false
    },
    
    /* 模板 */
    {
        reg: '**.tmpl',
        release: false,
        isJsLike: true,
        useOptimizer: false
    },
    
    /* 废弃 */
    {
        reg: /^\/static\/decraped\/.*/i,
        release: false,
        useMap: false
    }
];




// ----------------------
// 发布给后端
// ----------------------
if (IS_PUBLISH)
    
common_roadmap_path = common_roadmap_path.concat([

    /* 模拟数据 */
    {
        reg: /^\/test\/.*/i,
        release: false,
        useMap: false
    },

    /* demo */
    {
        reg: /^\/demo\/.*/,
        release: false,
        useMap: false
    },

    /*********************************
     * static静态资源
     ********************************/
    
    // 此处放到CDN->chedai->contract文件加下，见上方domain配置
    // CDN路径：http://j1.58cdn.com.cn/jinrong/chedai/contract/seal-58.png
    {
        reg: /^\/static\/img\/contract\/(.*)/i,
        useHash: false,
        url: '/$1',
        release: 'resources/crm-m/static/img/contract/$1'
    },

    /* demo图片 */
    {
        reg: /^\/static\/img\/example\/(.*)/,
        release: '/resources/crm-m/static/img/example/$1',
        useHash: false
    },
    
    /* 所有其他static静态资源 */
    {
        reg: /^\/static\/(.*)/i,
        url: '/crm-m/static/$1',
        release: '/resources/crm-m/static/$1'
    },
    
    /*********************************
     * vm及其资源
     ********************************/

    // 务必保证次序
    {
        reg: /^\/(page|widget)\/(.+)\.vm$/i,
        release: '/views/crm-m/$1/$2.html',
        isViews: true
    },

    {
        reg: /^\/(page|widget)\/(.+)$/i,
        url: '/crm-m/static/$1/$2',
        release: '/resources/crm-m/static/$1/$2'
    }
    
])



// ----------------------
// 发布给tomcat
// ----------------------
else
    
common_roadmap_path = common_roadmap_path.concat([
    
    /*********************************
     * static静态资源
     ********************************/

    /* demo图片 */
    {
        reg: /^\/static\/img\/example\/.*/,
        useHash: false
    },

    // 此处放到CDN->chedai->contract文件加下，见上方domain配置
    // CDN路径：http://j1.58cdn.com.cn/jinrong/chedai/contract/seal-58.png
    {
        reg: /^\/static\/img\/contract\/(.*)/i,
        useHash: false,
        url: '/$1',
        release: ''
    },
    
    /*********************************
     * vm及其资源
     ********************************/

    {
        reg: /^\/(page|widget|demo)\/(.+)\.vm$/i,
        release: 'WEB-INF/views/$1/$2.vm',
        isViews: true
    }

])//.concat(fis.config.get('roadmap.path', []))
    





// --------------------------------
// 通用 roadmap 配置
// --------------------------------
fis.config.set('roadmap', {

    domain: domainCDN,

    ext: {
        vm: IS_PUBLISH ? 'html' : 'vm',
        scss: 'css'
    },

    path: common_roadmap_path
})










// --------------------------------
//postpackager插件接受4个参数，
//ret包含了所有项目资源以及资源表、依赖树，其中包括：
//   ret.src: 所有项目文件对象
//   ret.pkg: 所有项目打包生成的额外文件
//   reg.map: 资源表结构化数据
//其他参数暂时不用管
//    2016-03-08 已被jello-postpackager-require-framework替代
// --------------------------------
//var createFrameworkConfig = function(ret, conf, settings, opt) {
//
//  var allRes = [];
//
//
//
//  fis.util.map(ret.map.res, function(fileName, fileDetails) {
//      var obj = {};
//
//      obj.fileName = fileName;
//      obj.fileUri = fileDetails.uri;
//      obj.deps = fileDetails.deps;
//
//      allRes.push(obj);
//  });
//
//
//  /**
//   * allRes: array
//   * 
//      0: Object
//      deps: Array[9]
//      fileName: "page/car-apply/car-apply.js"
//      fileUri: "/crm-m/static/page/car-apply/car-apply_4e6788d.js"
//      
//      1: Object
//      deps: undefined
//      fileName: "page/car-apply/car-apply.scss"
//      fileUri: "/crm-m/static/page/car-apply/car-apply_9101db8.css"
//      
//      ...
//   */
//
//  // var stringify = JSON.stringify(all);
//
//
//
//  function digui(jsName, allRes, rtnRes) {
//
//      allRes.forEach(function(item) {
//
//          if (item.fileName && item.fileName.indexOf(jsName) != -1) {
//
//              var obj = {};
//
//              obj.deps = item.deps || [];
//              obj.fileUri = item.fileUri;
//
//              obj.deps && obj.deps.length && obj.deps.forEach(function(item) {
//                  digui(item + ".js", allRes, rtnRes);
//              });
//
//              // 一定保证digui调用在本句前面，依赖提前加载
//              rtnRes.push(obj);
//
//              return false;
//          }
//
//      });
//  }
//
//
//  function quchong(arr) {
//      var rtnArr = [],
//          tmpMap = {},
//          itemUri;
//      for (var i = 0; i < arr.length; i++) {
//          itemUri = arr[i].fileUri;
//
//          // 靠fileUri做map key值去重
//          if (!tmpMap[itemUri]) {
//              tmpMap[itemUri] = true;
//              rtnArr.push(arr[i]);
//          }
//      }
//      return rtnArr;
//  }
//
//
//
//  //再次遍历文件，找到isViews标记的文件
//  //替换里面的__FRAMEWORK_CONFIG__钩子
//  fis.util.map(ret.src, function(subpath, file) {
//      //有isViews标记，并且是js或者html类文件，才需要做替换
//      if (file.isViews && (file.isJsLike || file.isHtmlLike)) {
//
//          // 当前view对应的js文件
//          var jsName = file.id.replace(/\.vm/, '.js');
//
//          // 为数组以保证依赖顺序
//          var rtnRes = [];
//
//          digui(jsName, allRes, rtnRes);
//
//
//          rtnRes = quchong(rtnRes);
//
//
//          var tmpRes = rtnRes.map(function(item) {
//              return item.fileUri;
//          });
//          //console.log("\n\n" + jsName + " --requires--\n" + tmpRes.join("\n"));
//
//
//
//          var stringify = "";
//
//          rtnRes.forEach(function(item) {
//              stringify += "<script src='" + item.fileUri + "'></script>";
//          })
//
//          var content = file.getContent();
//
//          //替换文件内容
//          content = content.replace(/\b__FRAMEWORK_CONFIG__\b/g, stringify);
//          file.setContent(content);
//      }
//  });
//};







// --------------------------------
// vm文件加性能统计代码
//     2016-03-09 移入jello-postpackager-performance-framework
// --------------------------------
//var perfFrameworkConfig = function(ret, conf, settings, opt) {
//  
//  var performance = require('./fis-conf-performance');
//  
//  
//  fis.util.map(ret.src, function(subpath, file) {
//      
//      if (file.isHtmlLike && file.isViews) {
//          
//          var content = file.getContent();
//          
//          // <head>开始 --- 开始记录
//          content = content.replace(/(\<\s*head\s*\>)/ig, function() {
//              return RegExp.$1 + performance.placeholder.headStart;
//          });
//          
//          // </head>结束 --- 白屏时间
//          content = content.replace(/(\<\s*\/\s*head\s*\>)/ig, function() {
//              return RegExp.$1 + performance.placeholder.headEnd;
//          });
//          
//          // __FRAMEWORK_CONFIG__钩子前 --- document渲染时间，以及js开始加载时间
//          content = content.replace(/(\b__FRAMEWORK_CONFIG__\b)/g, function() {
//              return performance.placeholder.jsStart + RegExp.$1;
//          });
//          
//          // </body>结束 --- js执行完毕时间；发送统计数据
//          content = content.replace(/(\<\s*\/\s*body\s*\>)/ig, function() {
//              return performance.placeholder.jsEnd + performance.placeholder.docReadyHandler + RegExp.$1;
//          });
//          
//          file.setContent(content);
//      }
//  })
//}












