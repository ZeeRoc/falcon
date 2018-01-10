ipv.common = {
    module: 'common',
    version: 'v0.1',
    COMMAND: {
        CMD_CHECK_UPDATE: {
            cmd: 'check_update'
        },
        CMD_UPDATE_DOWNLOAD: {
            cmd: 'download_update_files'
        },
        CMD_UPDATE_Restart: {
            cmd: 'restart_and_update_client'
        }
    },
    fmt: (CMD) => {
        return JSON.stringify(CMD) + ';\n';
    }
};
ipv.common.callback = {
    CheckUpdate: () => {
        ipv.CLIENT.send(ipv.common.fmt(ipv.common.COMMAND.CMD_CHECK_UPDATE));
    },
    UpdateNow: () => {
        ipv.CLIENT.send(ipv.common.fmt(ipv.common.COMMAND.CMD_UPDATE_DOWNLOAD));
    },
    RestartClient:()=>{
        ipv.CLIENT.send(ipv.common.fmt(ipv.common.COMMAND.CMD_UPDATE_Restart));

    },
    task_detail: (task) => {
        switch (task.cmd) {
            case 'message':
                console.log(task);
                ipv.common.view.message_queue.push(task);
                ipv.common.view.check_message_queue();
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
            case 'checking_update':
                ipv.common.view.CheckUpdateProgress(60)
                break;
            case 'update_checked':
                ipv.common.view.UpdateStatus(task.is_need_update)
                break;
            case 'update_download_files_started':
                // 开始更新
                ipv.common.view.TipsAdapter('正在请求更新，请稍后...');
                break;
            case 'update_file_download_begin':
                // 开始下载某一文件
                ipv.common.view.TipsAdapter('正在下载更新文件，请稍后...');
                var total = task.total;
                var current = task.current;
                var rate = Math.round((current / total) * 100);
                ipv.common.view.CheckUpdateProgress(rate)
                break;
            case 'update_file_download_finish':
                // 某一文件下载完成
                ipv.common.view.TipsAdapter('正在安装更新，请稍后...');
                break;
            case 'update_download_files_stopped':
                // 某一文件下载完成
                ipv.common.view.DownFinished(task);
                break;
            // case 'update_request_restart_client':
            //     // 询问是否重启
            //     ipv.common.view.UpdateStatus(task.is_need_update)
            //     break;
            default:
                break;
        };
    }
}