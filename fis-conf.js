/**
 * README 
 * 使用步骤
 * 
 * step 1
 * 直接npm安装jr8
 * npm install jr8 -g
 * 或者使用淘宝代理安装jr8（推荐使用代理，因为直接npm安装的话网速太慢了）
 * npm install -g jr8 --registry=https://registry.npm.taobao.org
 * 
 * step 2
 * 编译到本地tomcat
 * jr8 release -cw
 * 
 * step 2
 * 编译给Javaer
 * jr8 release -comd ../out-your-path publish
 * 或者
 * jr8 release -comd publish
 * 
 * 
 * 其他
 * 
 * 2016-08-24
 * 新加es6功能
 * 
 * 2016-06-21
 * 新加trace功能
 * jr8 release -cw
 * jr8 release -comd ../out-your-path publish trace
 * 
 * 2016-03-09
 * 整理jr8及插件:
 * 关键字: isViews publish process jr8
 */


var IS_PUBLISH = /\bpublish\b/i.test(process.title);









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
        reg: /^\/(fis-conf-.+|README.*|build\.sh)$/i,
        release: false
    },
    
    /* 模板 */
    {
        reg: '**.tmpl',
        release: false,
        isJsLike: true,
        useOptimizer: false
    }
];







// ----------------------
// 发布给后端
// ----------------------
if (IS_PUBLISH)
    
common_roadmap_path = common_roadmap_path.concat([

    /* publish的时候不需要server.conf */
    {
        reg: /^\/(server\.conf)$/i,
        release: false
    },
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
        url: '/static/$1',
        release: '/resources/static/$1'
    },
    
    /*********************************
     * vm及其资源
     ********************************/

    // 务必保证次序
    {
        reg: /^\/(page|widget)\/(.+)\.vm$/i,
        release: '/views/$1/$2',
        isViews: true
    },

    {
        reg: /^\/page\/pagees6\/pagees6\.js$/i,
        url: '/static/page/pagees6/pagees6.js',
        release: '/resources/static/page/pagees6/pagees6.js',
        isES6: true
    },

    {
        reg: /^\/(page|widget)\/(.+)$/i,
        url: '/static/$1/$2',
        release: '/resources/static/$1/$2'
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
        release: '/WEB-INF/views/$1/$2',
        useCache: false,  // 2016-03-31 临时关闭cache保证deploy dep
        isViews: true
    },
    
    {
        reg: /^\/page\/pagees6\/pagees6\.js$/i,
        url: '/static/page/pagees6/pagees6.js',
        release: '/static/page/pagees6/pagees6.js',
        isES6: true
    },
    
    {
        reg: /^\/(page|widget)\/(.+)\.(scss)$/i,
        release: '/static/$1/$2',
        useCache: false  // 2016-03-31 临时关闭cache保证deploy dep
    }

])
    




















fis.config.merge({
    
    // --------------------------------
    // 通用 roadmap 配置
    // --------------------------------
    roadmap: {
        
        ext: {
            vm: IS_PUBLISH ? 'html' : 'vm',
            scss: 'css'
        },
    
        path: common_roadmap_path.concat(fis.config.get('roadmap.path', []))
    },
    
    
    // --------------------------------
    // 发布目录
    // --------------------------------
    deploy: {
        publish: {
            to: '../output_'+(+new Date())
        }
    }
    
    
});



