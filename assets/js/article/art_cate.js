$(function(){
    // 获取文章分类列表
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            success:function(res){
                // console.log(res);//
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#dialog-add').html()
        })
    })

    // 通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功');
                layer.close(indexAdd)
            }
        })
    })


// 通过代理的形式为btn-edit绑定点击事件
    var idnexEdit = null
    $('tbody').on('click','.btn-edit',function(){
        idnexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title:'编辑文章分类',
            content:$('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        console.log(id);
        // 发起请求获取UI小的分类数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            success:function(res){
                $('#ID').val(res.data.Id);
                $('#NAME').val(res.data.name);
                $('#NICKNAME').val(res.data.alias);
            }
        })
    })

    // 通过代理的形式为修改分类的表单绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            headers:{
                Authorization: localStorage.getItem('token') || ''
            },
            data:$(this).serialize(),
            success:function(res){
                // console.log(res);
                // console.log('年后');
                if(res.status !== 0){
                    return layer.msg('更新失败')
                };
                layer.msg('更新分类数据成功')
                layer.close(idnexEdit);
                initArtCateList()
            }
        })
    })


    // 通过代理的形式绑定点击事件
    var indexDel = null;
    $('tbody').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除',{icon:3,title:'提示'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                headers:{
                    Authorization: localStorage.getItem('token') || ''
                },
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除文章分类成功');
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})
