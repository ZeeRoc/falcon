(function(win) {
    var ipv = {
        HOST: '192.168.223.131',
        PORT: 60020,
        // NET: require('net'),
        CLIENT: null,
        taskList: ''
    };
    ipv.stream = {
        Socket: function() {
            // ipv.CLIENT = new ipv.NET.Socket();
            ipv.CLIENT = new WebSocket('ws://' + ipv.HOST + ':' + ipv.PORT);
            var client = ipv.CLIENT;

            client.onopen = function() {
                console.log('The Socket Server Connected')
            };
            client.onmessage = function(data) {
                console.log(data.data)

                ipv.callback.onData(data.data);
            };
            client.onclose = function() {
                ipv.callback.onClose()
            };
            client.onerror = function(e) {
                console.log(e)
            }
            // client.connect(ipv.PORT, ipv.HOST, function() {
            //     ipv.callback.connect(ipv.HOST, ipv.PORT)
            // });
            // client.on('data', function(data) {
            //     ipv.callback.onData(data);
            //     // client.destroy();
            // });
            // client.on('close', function(e) {
            //     ipv.callback.onClose(e);
            // });
            // client.on('error', function(e) {
            //     ipv.callback.onError(e);
            // });
        }()
    };
    ipv.callback = {
        connect: (port, host) => {
            console.log('CONNECTED TO: ' + ipv.HOST + ':' + ipv.PORT);
        },
        onData: (data) => {
            taskList = data.toString().split(';');
            taskList.splice(taskList.indexOf('\n'), 1);
            task = JSON.parse(taskList)
            for (let item in taskList) {
                // var task = taskList[item].replace('\n', '');
                if (task.cmd.indexOf('engine') > -1) {
                    ipv.virus.callback.task_detail(task);

                } else if (task.cmd.indexOf('vulnerability') > -1) {
                    ipv.vulnerability.callback.task_detail(task);

                } else {
                    ipv.common.callback.task_detail(task);

                }
            }
        },
        onClose: (evt) => {
            console.log('Connection Closed : ' + evt);
        },
        onError: (err) => {
            console.log('Connection Error : ' + err);
        }
    }
    win.ipv = ipv;
})(window);
