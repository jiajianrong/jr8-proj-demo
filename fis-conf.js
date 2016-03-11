/**
 * README
 * 
 * 安装jr8
 * npm install jr8 -g
 * 
 * 编译到本地tomcat
 * jr8 release -cw
 * 
 * 编译给Javaer
 * jr8 release -comd ../out-your-path publish
 * 
 * 
 * 2016-02-16
 * 新加性能监控功能
 * jr8 release -cw performance
 * jr8 release -comd ../out-your-path publish performance
 * 
 * 2016-03-09
 * 整理jr8及插件:
 * 关键字: isViews performance publish process jr8
 */


var IS_PUBLISH = /\bpublish\b/i.test(process.title);





// --------------------------------
// 发布目录
// --------------------------------
fis.config.merge({
    deploy: {
        publish: {
            to: '../output-111'
        }
    }
});













// --------------------------------
// 性能统计server配置
// --------------------------------
fis.config.merge({
    settings: {
        postpackager: {
            'performance-framework': {
                urlPrefix: 'http://1.1.1.1:1001/saveTime?project=projName'
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

    ext: {
        vm: IS_PUBLISH ? 'html' : 'vm',
        scss: 'css'
    },

    path: common_roadmap_path
})













