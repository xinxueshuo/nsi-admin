

// console.log($.cookie('User_TureName'))
$('#username').text($.cookie('User_TureName'))

//除去搜索页面的获取cookie
function getCookie() {
    $(function () {
        $.ajax({
            type : "get",
            async:true,
            traditional :true,
            data: {
                'member_sign':$.cookie('usertitle'),
                'username':$.cookie('username'),
                'UserVerifyCode':$.cookie('userVerifyCode')
            },//提交的参数
            url:'http://'+changeUrl.address+'/User_api?whereFrom=verify',
            dataType : "jsonp",//数据类型为jsonp  
            jsonp: "Callback",//服务端用于接收callback调用的function名的参数  
            success : function(msg){
                // alert('成功')
                console.log(msg.verifyResult);
                if(msg.verifyResult<0){
                    layui.use('layer',function () {
                            window.location.href="./login.html"
                            var layer = layui.layer;
                            layer.alert('当前用户未登录，无法访问该页面',{
                                skin: 'layui-layer-molv' //样式类名
                                ,closeBtn: 0
                                ,icon:4
                            },function () {
                                window.location.href="./login.html"   //未登录，跳回登录页面
                            })
                        }
                    )
                    console.log($.cookie('usertitle'))
                    console.log($.cookie('username'))
                    console.log($.cookie('userVerifyCode'))
                    console.log( $.cookie('User_TureName'))
                }else{
                    $('.loginUser').text( $.cookie('User_TureName'))
                }
            },
            error:function(){
                alert('发生错误，请求数据失败！');
            }
        });
    })
}
$(function () {
    getCookie()
})

//退出登录，删除cookie
function exitLogin() {
    $.cookie('usertitle', null , { expires: -1, path: '/'  });
    $.cookie('username',null , { expires: -1 ,path: '/'});
    $.cookie('User_TureName', null , { expires: -1 ,path: '/'});
    $.cookie('userVerifyCode', null , { expires: -1 ,path: '/'});
    window.location.href = './login.html'
}

$.each(rightsControl,function (index,value) {
    $.each(value,function (i,v) {
        if(v == $.cookie('username')){
            console.log(index,v)
            if(index == 'right01'){
                console.log('权限01')
                $('#cardControlAll').removeClass('layui-hide')
            }else if( index == 'right02'){
                console.log('权限02')
                $('#indexControlAll,#dataBaseControlAll').removeClass('layui-hide')
            }else if( index == 'right03'){
                console.log('权限03')
                $('#classRightAll').removeClass('layui-hide')
            }else {
                console.log('超级管理员')
                $('#indexControlAll,#dataBaseControlAll,#cardControlAll,#classRightAll').removeClass('layui-hide')
            }
        }
    })
})

// 系统消息处理
$('#systemMessage').on('click',function () {
    // console.log($('#systemInfoDot').hasClass('layui-hide'))
    if($('#systemInfoDot').hasClass('layui-hide')){
        layer.alert('暂时没有消息要处理哟~~~', {
            title:'系统消息'
            ,btn:['知道了']
            ,icon:6
            ,closeBtn: 0
            ,shade:[0.8,'#000']
            ,btnAlign :'c'
        });
    }else {
        systemInfoProsess()
    }
})

$(function () {
    systemInfoProsess()
    setInterval(function () {
        systemInfoProsess()
    },300000)
})

function systemInfoProsess() {
    layui.use('layer',function () {
        var layer = layui.layer
        $.ajax({
            type:'get',
            url:'http://' + changeUrl.address + '/School_api?whereFrom=verify_notification',
            success:function (msg) {
                console.log(msg)
                if(msg.SchoolData ==0 && msg.InstitutionData == 0){
                     //没有数据需要审核
                }else{
                    $('#systemInfoDot').removeClass('layui-hide')
                    layer.alert('有新数据要审核哟~~~', {
                        title:'系统消息'
                        ,btn:['知道了']
                        ,icon:6
                        ,closeBtn: 0
                        ,shade:[0.8,'#000']
                        ,btnAlign :'c'
                    });
                }

                if(msg.SchoolData != 0){
                    $('#schoolVerifyDot').removeClass('layui-hide')
                }
                if(msg.InstitutionData != 0){
                    $('#instiVerifyDot').removeClass('layui-hide')
                }

            },
            error:function () {
                layer.msg('获取系统消息失败！')
            }
        })
    })
}

//判断是否有新消息（如果没有，去除圆点消息）
$(function () {
    //1 表示有系统消息
    localStorage.setItem('schoolData',1)
    localStorage.setItem('instiData',1)
    localStorage.setItem('allData',1)
    function checkVerify() {
            if(localStorage.getItem('schoolData') == 0) {
                $('#schoolVerifyDot').addClass('layui-hide')
            }
            if(localStorage.getItem('instiData') == 0){
                $('#instiVerifyDot').addClass('layui-hide')
            }
            if(localStorage.getItem('allData') == 0){
                $('#systemInfoDot').addClass('layui-hide')
            }
    }
    setInterval(checkVerify,2000)
})

var storage = window.localStorage
layui.use('layer',function () {
        var layer = layui.layer
        // 刷新页面
        if(storage.isLock == 1){
            layer.open({
                type:1,
                title:false,
                area: ['410px', '260px'],
                shade:[0.96,'#000'],
                closeBtn:0,
                content: $('#lockScreen') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
        }
       //唤起锁屏
        $('#toLockScreen').on('click',function () {
            storage.setItem('isLock',1)  //1 表示锁屏 0 表示没锁屏
            $('#lockUserName').text($.cookie('User_TureName'))
            layer.open({
                type:1,
                title:false,
                area: ['410px', '260px'],
                shade:[0.96,'#000'],
                closeBtn:0,
                content: $('#lockScreen') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
       })
    
      //解锁
      $('#unlock').on('click',function () {
          if($('#lockPwd').val() == ''){
              layer.msg('请输入解锁密码')
          }else {
              if($('#lockPwd').val() == $.cookie('username')){
                  storage.isLock = 0
                  layer.closeAll()
              }else {
                  layer.msg('密码错误，请重新输入')
              }
          }
      })
})

//样式控制
$(function () {
    if($(window).width() < 480 ){
        $('.layui-nav-item').removeClass('layui-nav-itemed')
        $('#kitSideShow').on('click',function (event) {
            event.stopPropagation()
            $('#mobileSide').animate({
                left:0
            },300)
            $('.shadowWrap').show()
            $(this).hide()
        })

        $(document).on('click',function (e) {
            $('#mobileSide').animate({
                left:-200
            },300)
            $('.shadowWrap').hide()
            $('#kitSideShow').show()
        })

        $('#mobileSide').on('click',function (e) {
            e.stopPropagation()
        })
    }
})




