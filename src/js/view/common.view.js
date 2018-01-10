(function(win, doc, unf) {

    'use strict';

    ipv.common.view = {

        message_tag: false,
        message_queue: [],
        check_message_queue: function() {
            var _self = this;
            console.log(_self.message_queue);

            if (!_self.message_tag) {
                _self.OpenMessage();
            }
        },
        /**
         * Open Window
         * @param 
         */
        OpenMessage: function(title, author, content) {
            var gui = require('nw.gui'),
                _self = this,
                WinWidth = 490,
                WinHeight = 290,
                wId = title,
                opt = {
                    id: wId,
                    title: wId,
                    position: 'center',
                    width: WinWidth,
                    height: WinHeight,
                    focus: true,
                    show: false,
                    always_on_top: true,
                    frame: false,
                    transparent: true
                },
                winX = window.screen.width - WinWidth,
                winY = window.screen.height - WinHeight - 40;
            var win = gui.Window.open('../pop/message/message-model.html', opt, function(w) {
                global.ipv = window.ipv;
                w.x = winX;
                w.y = winY;
                w.show();
                _self.message_tag = true;
                w.on('closed', function() {
                    let message_queue = _self.message_queue.length;
                    console.log(_self.message_queue);
                    if (message_queue > 0) {
                        _self.OpenMessage();
                    } else {
                        _self.message_tag = false;
                    }
                })
            });

        },
        CheckUpdate: function() {
            console.log($('check-update'))
            $('.modal-cover').show();
            $('.check-update').css('transform', 'scale(1)');
            $('.check-update .update-progress-bar').css('width', '10%');
            setTimeout(function() {
                ipv.common.view.CheckUpdateProgress(40)
            }, 1000)
            setTimeout(function() {
                ipv.common.callback.CheckUpdate();
            }, 2000)
        },
        UpdateNow: function() {
            ipv.common.callback.UpdateNow();
        },
        CheckUpdateProgress: function(rate) {
            if(rate == 0){
                $('.check-update .update-download-rate').hide()
            }else{
                $('.check-update .update-download-rate').show();
            }
            $('.check-update .update-download-rate').html(rate + '%')
            $('.check-update .update-progress-bar').css('width', rate + '%')
        },
        UpdateStatus: function(status) {
            ipv.common.view.CheckUpdateProgress(0)
            if (status) {
                $('#update-ok').hide();
                $('#update-now').show();
                $('#update-restart').hide();
                $('.update-tips').html('发现新版本，立即升级，享受更专业的安全防护');
                $('.check-update-footer').css('height', '70px');
            } else {
                $('#update-ok').show();
                $('#update-now').hide();
                $('#update-restart').hide();
                $('.update-tips').html('您已是最新版本，无需更新');
                $('.check-update-footer').css('height', '70px');

            }
        },
        CloseUpdateWindow: function() {
            $('.modal-cover').hide();
            $('.check-update').css('transform', 'scale(0)');
            ipv.common.view.CheckUpdateProgress(0)
            $('.check-update-footer').css('height', '0px');
            $('.update-tips').html('正在检查更新，请稍后...');

        },
        TipsAdapter:function(tips){
            $('.update-tips').html(tips);
        },
        DownFinished:function(task){
            if (task.isSuccess){
                ipv.common.view.TipsAdapter('更新完成，请立即重启电脑...');
                $('#update-ok').hide();
                $('#update-now').hide();
                $('#update-restart').show();
            }else{
                ipv.common.view.TipsAdapter('更新失败，请尝试检查网络...');
                $('#update-ok').show();
                $('#update-now').hide();
                $('#update-restart').hide();
            }
        },
        RestartClient:function(){
            ipv.common.callback.RestartClient();
        }

    };

}(window, document, undefined));