$(function(){
    var form = layui.form;
    form.verify({
        pwd:[/^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码输入不一致'
            }
        }
    })

    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            data:$(this).serialize(),
            success:function(res){
                // console.log(res);
                // console.log(1);
                console.log(res);
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})