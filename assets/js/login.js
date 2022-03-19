$(function(){
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function(){
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        repwd:function(value){
            // 通过形参拿到的是确认密码框的内容,需要和密码框的内容进行比较,如果失败,则返回错误消息
            var pwd = $('.reg-box [name=password]').val();
            
            if(value !== pwd){
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        // $.post('http://www.liulongbin.top:3007/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},function(res){
        //     if(res.status !== 0){
        //         return console.log(res.message);
        //     }
        //     console.log('注册成功');
        // })
        var data = {
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val(),
        }
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:data,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                // 模拟点击行为
                $('#link_login').click();
            }
        })
    })

    // 监测登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault();
        
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                console.log(res.token);
                // return layer.msg('登录成功')
                // 将登录成功之后得到的token字符串存在localstorege里面
                localStorage.setItem('token',res.token)
                // 跳转到后台首页
                location.href = '/index.html'
            }
        })
    })









})

