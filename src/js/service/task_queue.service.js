ipv.service = {
     task_detail: (taskList) => {
        taskList = taskList.toString().split(';');
        taskList.splice(taskList.indexOf('\n'), 1);
        for (let item in taskList) {
            var task = JSON.parse(taskList[item].replace('\n', ''));
            console.log(task.cmd)
            switch (task.cmd) {
                case 'engine_fix_started':
                    ipv.virus.view.viewAdapter({ msg: '正在处理威胁...', path: '' });
                    break;
                case 'engine_fix_stopped':
                    ipv.virus.view.viewAdapter({ msg: '已清除所有威胁', path: '电脑已经恢复正常，建议定期进行清理' });
                    ipv.virus.view.initBtn('healthy');
                    ipv.virus.flag = false;
                    break;
                case 'engine_after_fix':
                    ipv.virus.view.DetailVirus(task.id);
                    console.log(task.id);
                    break;
                case 'engine_scan_started':
                    ipv.virus.view.drawView(ipv.virus.ScanStatus[ipv.virus.scanType], 'begin');
                    break;
                case 'engine_scan_stopped':
                    if (ipv.virus.view.forceStop && !ipv.virus.flag) {
                        console.log('force')
                        ipv.virus.view.drawView(null, 'end')
                    } else {
                        ipv.virus.view.ScanEnd();
                    }
                    ipv.virus.view.ProgressBar(0, task.cmd);
                    break;
                case 'engine_suspended':
                case 'engine_resumed':
                    console.log(task);
                    ipv.virus.view.Pause(task.cmd);
                    break;
                case 'hips_create_process_notify':
                case 'hips_ransom_info':
                    console.log(task);
                    ipv.virus.view.popQueue.push(task);
                    ipv.virus.view.checkQueue();
                    break;
                case 'quarantine_items_got':
                case 'scan_logs_got':
                case 'trust_items_got':
                    ipv.virus.view.Quarantine(task);
                    break;
                case 'quarantine_items_removed':
                case 'quarantine_items_restored':
                case 'quarantine_emptied':
                case 'trust_items_removed':
                case 'trust_items_emptied':
                case 'trust_item_added':
                case 'scan_logs_removed':
                case 'scan_logs_emptied':
                    ipv.virus.view.qts_operation_detail(task);
                    break;
                case 'message':
                    console.log(task);
                    ipv.common.view.message_queue.push(task);
                    ipv.common.view.check_message_queue();
                    break;
                default:
                    break;
            };
            if (task.cmd.indexOf('before_detect') >= 0) {
                console.log(task.cmd)
                ipv.virus.view.ProgressBar(0.01, 'normal');
                ipv.virus.view.viewAdapter({ path: task.displayName });
            } else {
                if (task.isVirus) {
                    console.log(task);
                    ipv.virus.flag = true;
                    ipv.virus.view.FoundVirus(task);
                }
            }
        }
    }
}
