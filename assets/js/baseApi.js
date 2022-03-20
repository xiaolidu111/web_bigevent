// 注意每次调用$.get或者$.post或者$.post之前会先调用这个函数,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})