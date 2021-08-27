$(function(){
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          })
    })

    // 由于弹出框的代码是点击添加类别的那一刻才镶嵌到网页中，
    //所以要给确认按钮绑定事件做不到，因为那时候还没有这个元素
    //所以需要用代理的方式给该按钮绑定事件,body代理form-add的点击事件
    $('body').on('submit', '#form-add', function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(){
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          })

          var id = $(this).attr('data-id')
          // 发起请求获取对应分类的数据
          $.ajax({
              method: 'GET',
              url: '/my/article/cates/' + id,
              success: function(res){
                form.val('form-edit', res.data)
              }
          })
    })

    //通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e){
        // alert('确实要提交吗')
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                // console.log('正在修改中。。。')
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式，为删除按钮绑定事件
    $('body').on('click', '.btn-delete', function(){
        id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
          });
    })


})