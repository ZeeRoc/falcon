ipv.virus = {
    module: 'virus',
    version: 'v0.1',
    COMMAND: {
        CMD_CUSTOM: {
            cmd: 'engine_scancustom',
            locations: []
        },
        CMD_QUICK: {
            cmd: 'engine_scansystem'
        },
        CMD_FULLDISK: {
            cmd: 'engine_scanfulldisks'
        },
        CMD_PAUSE: {
            cmd: 'engine_suspend'
        },
        CMD_RESUME: {
            cmd: 'engine_resume'
        },
        CMD_STOP: {
            cmd: 'engine_stop'
        },
        CMD_REPAIR: {
            cmd: 'engine_repair',
            id: []
        },
        CMD_QUARANTINE: {
            cmd: 'get_quarantine_items'
        },
        CMD_SCANLOG: {
            cmd: 'get_scan_logs'
        },
        CMD_TRUST: {
            cmd: 'get_trust_items'
        },
        CMD_QUARANTINE_DEL: {
            cmd: 'remove_quarantine_items',
            ids:[]
        },
        CMD_QUARANTINE_RESTORE: {
            cmd: 'restore_quarantine_items',
            ids:[]
        },
        CMD_TRUST_CANCEL: {
            cmd: 'remove_trust_items',
            ids:[]
        },
        CMD_TRUST_ADD: {
            cmd: 'add_trust_item',
            path:null,
            threat_id:null
        },
        CMD_SCANLOG_DEL: {
            cmd: 'remove_scan_logs',
            ids:[]
        }
    },
    ScanStatus: {
        'custom': '自定义',
        'fulldisk': '全盘',
        'quick': '快速'
    },
    flag: false,
    scanType: '',
    fmt: (CMD) => {
        return JSON.stringify(CMD) + ';\n';
    }
};
ipv.virus.callback = {
    Quick: () => {
        ipv.virus.scanType = 'quick';
        try {
            ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUICK));

        } catch (e) {
            console.log(e)

        }
    },
    Quarantine: () => {
        console.log(ipv.virus.COMMAND.CMD_QUARANTINE);
        console.log(ipv.virus.COMMAND.CMD_SCANLOG);
        console.log(ipv.virus.COMMAND.CMD_TRUST);
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUARANTINE));
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_SCANLOG));
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_TRUST));
    },
    DelQuar: () => {
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUARANTINE_DEL));
        console.log(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUARANTINE_DEL))
    },
    RestoreQuar: () => {
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUARANTINE_RESTORE));
        console.log(ipv.virus.fmt(ipv.virus.COMMAND.CMD_QUARANTINE_RESTORE));

    },
    CancelTrust: () => {
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_TRUST_CANCEL));
        console.log(ipv.virus.fmt(ipv.virus.COMMAND.CMD_TRUST_CANCEL));

    },
    AddTrust: () => {
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_TRUST_ADD));
        console.log(ipv.virus.fmt(ipv.virus.COMMAND.CMD_TRUST_ADD));

    },
    DelScanLog: () => {
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_SCANLOG_DEL));

    },
    Custom: () => {
        ipv.virus.scanType = 'custom';
        console.log(ipv.virus.COMMAND.CMD_CUSTOM);
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_CUSTOM));
    },
    FullDisk: () => {
        ipv.virus.scanType = 'fulldisk';
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_FULLDISK));
    },
    Pause: () => {
        var currentStatus = ipv.virus.view.Pause('get');
        ipv.CLIENT.send((currentStatus == 'normal' ? ipv.virus.fmt(ipv.virus.COMMAND.CMD_PAUSE) : ipv.virus.fmt(ipv.virus.COMMAND.CMD_RESUME)));
    },
    Stop: (opt) => {
        opt = opt || 'normal';
        ipv.virus.view.isCancel = opt;
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_STOP));
    },
    RepairNow: () => {
        console.log(ipv.virus.COMMAND.CMD_REPAIR);
        ipv.CLIENT.send(ipv.virus.fmt(ipv.virus.COMMAND.CMD_REPAIR));
    },
    task_detail: (task) => {
            switch (task.cmd) {
                case 'engine_fix_started':
                    ipv.virus.view.viewAdapter({ msg: '正在处理威胁...', path: '' });
                    break;
                case 'engine_fix_stopped':
                    ipv.virus.view.fix_stoped() 
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