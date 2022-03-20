// 注意每次调用$.get或者$.post或者$.post之前会先调用这个函数,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 全局统一挂载complete回调函数
    options.complete = function(res){
        // 在complete毁掉函数中可以使用res.responseJson拿到服务器响应回来的数据
        console.log(res.responseJSON);

        if(res.responseJSON){
            console.log(res.responseJSON);
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                // 1.强制清空token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = '/codee/login.html'
            }
        }
        
    }
})