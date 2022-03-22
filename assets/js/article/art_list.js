$(function() {
    // 定义一个查询参数对象,将来请求数据的时候,需要将强求参数提交到服务器
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义没花时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
    }

    function padZero(value) {
        return value > 9 ? value : '0' + value;
    }
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, // 每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染文章列表数据
                // console.log(res.data);
                var htmlStr = template('tpl-table', res)
                    // console.log(htmlStr);
                $('tbody').html(htmlStr);
                // 渲染分页列表
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // console.log(res);
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id,
            q.state = state;
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法来渲染分页结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump分页发生切换的时候触发分页回调
            // 触发该函数的方式有两种 1.点击页码 2.调用了laypage.render方法就会触发jump回调
            jump: function(obj, first) {
                // console.log(first);//拿到最新的页码值
                q.pagenum = obj.curr; //把最新的页码值复制到q这个查询参数对象中
                // 把最新的条目数复制到条目q中
                q.pagesize = obj.limit;
                //根据最新的q获取最新的数据列表渲染表盒
                if (first !== true) {
                    initTable();
                }
            }
        })
    }

    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 获取删除按钮个数
        var len = $('.btn-delete').length;
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    // 判断该页是否还有剩余的数据,如没有剩余数据,就减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable();
                }
            })
            layer.close(index);
        });
    })
})