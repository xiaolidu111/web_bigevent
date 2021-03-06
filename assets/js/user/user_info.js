$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname : function(value){
            if(value.length >= 6){
                return '名称长度需在1~6位之间'
            }
        }
    })
    initUserinfo();
    // 初始化用户基本信息
    function initUserinfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            success:function(res){
                if(res.status === 1){
                    return layer.msg('获取用户信息失败!')
                }
                console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserinfo()
    })
    // 监听表单的提交事件
    $('.layui-form').submit(function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})