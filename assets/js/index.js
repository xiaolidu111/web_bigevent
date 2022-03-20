$(function(){
    // 调用getUserInfo 获取用户基本信息
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click',function(){
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', {icon: 3, title:'确定退出登录'}, function(index){
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转登录页
            location.href = '/codee/login.html';
            layer.close(index)
          });
    })
})


// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers就是请求配置头
        headers:{
            Authorization: localStorage.getItem('token') || ''
        },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg(res.message)
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data);
        },
        // 不论成功还是失败,都会调用complete函数
        // complete:function(res){
        //     // 在complete毁掉函数中可以使用res.responseJson拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录页面
        //         location.href = '/codee/login.html'
        //     }
        // }
    })
}

function renderAvatar(user){
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;'+name);
    // 按需渲染头像
    if(user.user_pic){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}