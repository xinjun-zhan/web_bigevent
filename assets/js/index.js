$(function(){
    // 调用函数获取用户基本信息
    getUserInfo()

    // 退出功能
    var layer = layui.layer
    $('#exit').on('click', function(){
        layer.confirm('is not?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1. 清空本地存储中的token
            localStorage.removeItem('token')
            //2. 从新跳转到登录页面
            location.href = '/code/login.html'
            //3. 关闭confirm询问框
            layer.close(index);
          })
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res){
            if(res.status !==0){
                return layui.layer.msg('获取用户失败！')
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败，最终都会调用complete回调函数
        // complete: function(res){
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //         location.href = '/code/login.html'
        //     } 
        // }
    })
}

// 渲染用户头像
function renderAvatar(user){
    // 1.获取用户名称，如果有昵称则获取昵称。没有则获取用户名
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 3.按需渲染用户头像
    if(user.user_pic !== null){
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase() // 把一个字符串当数组用，用下标取对应的值
        $('.text-avatar').html(first).show()
    }
}