$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function(){
        // console.log("我被点击了")
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录的链接
    $('#link_login').on('click', function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form对象
    var form = layui.form
    // 从layui中获取弹出层对象
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
          ],
        // 校验两次密码是否一致的规则
        repwd: function(value){
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的值，然后进行一次等于判断
            // 如果判断失败，则return一个提示消息即可
            // alert(value)
            var pwd = $('#first_pwd').val()
            // 也可 var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e){
        // 1.阻止默认提交行为
        e.preventDefault()
        // 要提交到服务器的数据
        data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
                }
        // 2.发起ajax的POST请求
        $.post('/api/reguser', 
        data, 
        function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            // 注册成功后跳转到登录页面，模拟登录按钮的点击事件
            $('#link_login').click()
        }
        )
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止默认的提交行为
        e.preventDefault()
        // 在调用ajax之前会调用ajaxPrefilter()函数，
        // 类似于中间件，在这个函数中可以对交给ajax函数的数据进行处理
        // 在baseAPI.js中进行该函数的重写
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登陆失败！')
                }
                layer.msg('登录成功！')
                // 将登陆成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                // console.log(res.token)
                // 跳转到后台主页
                location.href = 'index.html'
            }
        })
    })

})