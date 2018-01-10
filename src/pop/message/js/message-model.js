(function(ipv) {
    ipv.pop = {
        des: 'dropDown',
        cmd: {
            "cmd": "hips_create_process_notify"
        },
        loadData: function(obj) {
            var popObj = ipv.common.view.message_queue.shift(),
                msg_title = document.querySelector('#msg-title'),
                msg_content = document.querySelector('#msg-content'),
                msg_author = document.querySelector('#msg-author'),
                msg_id = document.querySelector('#msg-id');
            if (popObj) {
                msg_id.innerHTML = 0;
                msg_title.innerHTML = popObj.title;
                msg_content.innerHTML = popObj.content;
                msg_author.innerHTML = popObj.author;
            }
        }(ipv),
        closePop: function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.close();
            // win.on('closed', function() {
            //     ipv.pop.arrow();
            // })
        }
    };
    
    ipv.toolbox.addEvents(document.querySelector('#pop-close'), 'click', function() { ipv.pop.closePop() }, false);
})(global.ipv);
