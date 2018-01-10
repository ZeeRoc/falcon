(function(ipv) {
    ipv.pop = {
        des: 'dropDown',
        cmd: {
            "cmd": "hips_create_process_notify"
        },
        loadData: function(obj) {
            var popObj = ipv.virus.view.popQueue.shift(),
                // vtype = document.querySelector('#v-type'),
                vpath = document.querySelector('#v-path'),
                vname = document.querySelector('#v-name'),
                vid = document.querySelector('#v-id');
            if(popObj.displayVirusName.indexOf('Ransom')>-1){
                document.querySelector('#tips').innerHTML = "发现勒索者病毒，已为您清除威胁！";
                document.querySelector('#arrow').style.visibility = 'hidden';
                document.querySelector('#prevent').style.visibility = 'hidden';
            }else{
                document.querySelector('#tips').innerHTML = "发现恶意程序，建议您立即清除！";
                document.querySelector('#arrow').style.visibility = 'visible';
                document.querySelector('#prevent').style.visibility = 'visible';
            }
            if (popObj != 'undefined') {
                vid.innerHTML = popObj.id;
                // vtype.innerHTML = popObj.displayVirusName;
                vpath.innerHTML = popObj.displayName;
                vname.innerHTML = popObj.displayVirusName;
            }
        }(ipv),
        closePop: function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.close();
            win.on('closed', function() {
                ipv.pop.arrow();
            })
        },
        arrow: function() {
            var vid = document.querySelector('#v-id');
            ipv.pop.cmd.id = vid.innerHTML;
            ipv.pop.cmd.operation = 0;
            ipv.CLIENT.send(ipv.virus.fmt(ipv.pop.cmd));
            ipv.pop.closePop();
            // console.log(cmd)
        },
        prevent: function() {
            var vid = document.querySelector('#v-id');

            ipv.pop.cmd.id = vid.innerHTML;
            ipv.pop.cmd.operation = 1;
            ipv.CLIENT.send(ipv.virus.fmt(ipv.pop.cmd));
            ipv.pop.closePop();
            console.log(cmd)
        },
        timer: function() {
            var tm = document.querySelector('#timer');

            setInterval(function() {
                tm.innerHTML = Number(tm.innerHTML) - 1;
                if(Number(tm.innerHTML)<=0){
                    ipv.pop.prevent();
                }
            }, 1000)
        }()
    };
    // ipv.pop.dropDown = {
    //     init: function(ele) {
    //         this.menu = ele.parentNode.querySelector('ul');
    //         this.toggleMenu(this.menu);

    //     },
    //     toggleMenu: function(menu) {
    //         if (menu.style.display == 'none') {
    //             menu.style.display = 'block';
    //         } else {
    //             menu.style.display = 'none';
    //         }

    //     }
    // }
    //     ipv.toolbox.addEvents(document.querySelectorAll('.minify'), 'click', function(ele) {
    //     ipv.view.minifyWin();
    // }, false);
    // ipv.toolbox.addEvents(document.querySelector('#moreOperation'), 'click', function() { ipv.pop.dropDown.init(this) }, false);
    ipv.toolbox.addEvents(document.querySelector('#pop-close'), 'click', function() { ipv.pop.closePop() }, false);
    ipv.toolbox.addEvents(document.querySelector('#arrow'), 'click', function() { ipv.pop.arrow() }, false);
    ipv.toolbox.addEvents(document.querySelector('#prevent'), 'click', function() { ipv.pop.prevent() }, false);
    // ipv.toolbox.addEvents(document.querySelector('body'), 'load', function() { ipv.pop.timer() }, false);
    // ipv.toolbox.addEvents(window, 'load', function() { ipv.pop.loadData() }, false);
})(global.ipv);
