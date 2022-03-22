$(function() {
    // 定义加载文章分类的方法
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    initEditor();

    function initCate() {
        // console.log('第一步');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                // console.log('第二步');
                if (res.status !== 0) {
                    return layer.msg('读取文章类别失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布';
    // 改变文章状态
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 组织默认提交行为
        e.preventDefault();
        // console.log(1);
        // 创建formdata对象
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state)
            // 将选中的图片输出层文件,并存到fd中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd);

            })
            // 发起一个ajax请求,上传内容

    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        // 如果向服务器提交的是formdata的数据必须添加一下两个配置项
        // contentType:false,
        // processData:false

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');
                location.href = 'art_list.html'
            }
        })
    }
})