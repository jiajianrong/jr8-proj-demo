# jr8-proj-demo
jr8方案使用范例





##安装开发环境

- npm install -g jr8

- 或者  npm --registry http://registry.cnpmjs.org install -g jr8
(淘宝npm代理会有一小时延迟，请先npm view jr8 version对比)

- git clone本项目，然后进入到项目根目录

- jr8 server start

- jr8 release -cw





##JS规范

- 多加空行分割!!!!!!!
- 多写注释!!!!!!!
- 用方法代替大块大块代码!!!!!!


##CSS规范


- 下划线开头的css文件（意思是被include的类库）  
  只允许写scss方法和常量（如@mixin等），不能写具体类(写具体类的话会实际输出到最终页，影响体积)  
  参见_button.scss

- zepto插件的css文件（意思是插件/widget）  
  类名都以wi-开头，如.wi-selectcity-single  
  参见zepto.selectcity.single.scss

- page.开头的css文件（意思是直接为最终页写的）  
  类名都以ui-开头，如.ui-form  
  参见page.form.scss




