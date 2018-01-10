(function(ipv, L) {
    ipv.virus.view = {
        ScanRes: {
            'remove': '删除文件',
            'disinfection': '清除感染',
            'terminateprocess': '结束进程',
            'terminatethread': '结束线程',
            'custom': '清除威胁'
        },
        timer: null,
        minutes: 0,
        seconds: 1,
        scanStatus: null,
        diskList: {},
        fixedCount: 0,
        popTag: false,
        popQueue: [],
        isCancel: 'normal',
        forceStop: false,
        _self: function() {
            return this;
        },
        _current: document.querySelector('#virus'),
        getCurrentState: function() {
            var pageList = document.querySelectorAll('section');
            for (var i = 0; i < pageList.length; i++) {
                if (window.getComputedStyle(pageList[i], null).display == 'block') {
                    return pageList[i].id;
                }
            }
            return false;
        },
        switchWay: function(ele) {
            var caret = ipv.virus.view._current.querySelectorAll(".dropdown ul")[0];
            if (window.getComputedStyle(caret, null).display != "block") {
                caret.style.display = 'block';
            } else {
                caret.style.display = 'none';
            }
            $(document).click(function() {
                // console.log('mo');
                caret.style.display = 'none';
            });
            ele.stopPropagation()
        },
        drawView: function(status, operation) {
            operation = operation || 'none';
            var _self = this;
            _self.scanStatus = status;
            var main = ipv.virus.view._current.querySelectorAll(".main-ctx")[0];
            var scan = ipv.virus.view._current.querySelectorAll(".scan-ctx")[0];
            var currentSection = ipv.virus.view._current;
            var resTitle = ipv.virus.view._current.querySelector('#tips');
            var progress = ipv.virus.view._current.querySelector('#progress');

            if (operation == 'begin') {

                main.style.display = 'none';
                scan.style.display = 'block';
                resTitle.innerHTML = '正在进行' + _self.scanStatus + '杀毒...';
                // scan.querySelector('#scan-type').innerHTML = status;
                progress.style.display = 'block';

                currentSection.setAttribute('data-status', 'scanning');

                setTimeout(function() {
                    scan.querySelectorAll('.top')[0].style.height = '120px';
                    scan.querySelectorAll('.bottom')[0].style.height = '358px';
                }, 10)
                // _self.timeWatch('init');
                _self.timeWatch('begin');
            }
            if (operation == 'end') {
                currentSection.setAttribute('data-status', 'normal');
                main.removeAttribute('style');
                scan.removeAttribute('style');
                progress.removeAttribute('style');
                ipv.virus.view.initView();
            }


        },
        initView: function() {
            console.log('begin init');
            var ScanPause = ipv.virus.view._current.querySelector('#scan-pause'),
                scanTime = ipv.virus.view._current.querySelector('#scan-time'),
                resList = ipv.virus.view._current.querySelector('.resList'),
                child = resList.querySelectorAll('li'),
                virusNum = ipv.virus.view._current.querySelector('.virus-num'),
                resCount = ipv.virus.view._current.querySelector('.virus-scan-res-title input'),
                tips = resList.querySelector('h5'),
                _self = this;
            try {
                _self.forceStop = false;
                _self.timeWatch('init');
                _self.initBtn('none');
                resCount.checked = true;
                // scanTime.innerHTML = '00:00:00';
                ScanPause.innerHTML = '暂停';
                ScanPause.setAttribute('data-status', 'normal');

                for (let i = 0; i < child.length; i++) {
                    resList.removeChild(child[i]);
                };

                tips.style.display = 'block';
                virusNum.innerHTML = '0';
            } catch (e) {
                console.log(e)
            }

            console.log('end init');

        },
        fix_stoped: function() {
            var count = ipv.virus.COMMAND.CMD_REPAIR.id.length;
            var all = ipv.virus.view._current.querySelectorAll(".resList li").length;
            if (all > 0) {
                ipv.virus.view.viewAdapter({ msg: '已清除' + count + '个威胁', path: '还剩' + all + '个威胁未处理，建议及时进行清理' });
                return false;
            } else {
                ipv.virus.view.viewAdapter({ msg: '已清除' + count + '个威胁', path: '电脑已恢复健康状态，建议经常进行清理' });
                ipv.virus.view.initBtn('healthy');
                ipv.virus.flag = false;
            }

        },
        GetHistory: function(operation) {
            var history = ipv.virus.view._current.querySelector("#scan-history"),

                modalBg = ipv.virus.view._current.querySelectorAll('.modal-bg'),
                status = false,
                _self = this;
            if (operation != 'open') {
                status = 'none';
                history.style.transform = 'scale(0)';
                for (let i = 0; i < modalBg.length; i++) {
                    modalBg[i].style.display = status;
                }

                // console.log(history.querySelectorAll('input'))
                for (var item in history.querySelectorAll('input')) {
                    history.querySelectorAll('input')[item].checked = false;
                }
                // history.querySelectorAll('input').checked = false;
                return -1;
            } else {
                // ipv.virus.view.Tree.LoadTree('/');
                status = 'block';
                history.style.transform = 'scale(1)';
                for (let i = 0; i < modalBg.length; i++) {
                    modalBg[i].style.display = status;
                }
            }
            // if (window.getComputedStyle(history, 'style').display == 'none') {
            //     history.style.display = 'block'
            // } else {
            //     history.style.display = 'none'
            // }

        },
        Quarantine: function(data) {
            console.log(data.cmd)
            var quarantine = ipv.virus.view._current.querySelector("#quarantine-data");
            var trust = ipv.virus.view._current.querySelector("#trust-data");
            var scanlog = ipv.virus.view._current.querySelector("#scanlog-data");
            if (data.cmd == 'quarantine_items_got') {
                if (data['isSuccess'] == true && data.hasOwnProperty('items')) {

                    var quar_html = ''

                    for (var item in data['items']) {
                        var ctx = data['items'][item],
                            path = ctx['path'];
                        if (path.length > 30) {
                            path = path.substr(0, 15) + '...' + path.substr(-15);
                        }
                        quar_html += '<tr id="trquar_' + ctx['id'] + '">\
                                <td>\
                                    <input type="checkbox" class="hide" id="quar_' + ctx['id'] + '" name="quarantine-item" value="">\
                                    <label for="quar_' + ctx['id'] + '">' + ctx['virus_name'] + '</label><p>' + path + '</p></td>\
                                <td>' + new Date(ctx['insert_time']).toLocaleString('chinese', { hour12: false }) + '</td>\
                            </tr>'
                    }
                    quarantine.innerHTML = quar_html;
                }
            }

            if (data.cmd == 'scan_logs_got') {
                if (data['isSuccess'] == true && data.hasOwnProperty('items')) {

                    var scanlog_html = ''

                    for (var item in data['items']) {
                        var ctx = data['items'][item];
                        scanlog_html += '<tr id="trlog_' + ctx['id'] + '">\
                                <td>\
                                    <input type="checkbox" class="hide" id="log__' + ctx['id'] + '" name="quarantine-item" value="">\
                                    <label for="log__' + ctx['id'] + '">' + new Date(ctx['scanStartTime']).toLocaleString('chinese', { hour12: false }) + '</label></td>\
                                <td>' + ctx['scanType'] + '</td>\
                                <td>发现了 ' + ctx['threatNum'] + ' 个威胁</td>\
                            </tr>'
                    }
                    scanlog.innerHTML = scanlog_html;
                }
            }

            if (data.cmd == 'trust_items_got') {
                if (data['isSuccess'] == true && data.hasOwnProperty('items')) {

                    var trust_html = ''

                    for (var item in data['items']) {
                        var ctx = data['items'][item],
                            path = ctx['path'];
                        if (path.length > 30) {
                            path = path.substr(0, 15) + '...' + path.substr(-15);
                        }
                        trust_html += '<tr id="trtrust_' + ctx['id'] + '">\
                                <td>\
                                    <input type="checkbox" class="hide" id="trust_' + ctx['id'] + '" name="trust-item" value="">\
                                    <label for="trust_' + ctx['id'] + '">' + path + '</label><p>' + path + '</p></td>\
                                <td>' + new Date(ctx['addedTime']).toLocaleString('chinese', { hour12: false }) + '</td>\
                            </tr>'
                    }
                    trust.innerHTML = trust_html;
                }
            }


            // }

        },
        DelQuar: function() {
            var quarantine = ipv.virus.view._current.querySelectorAll("#quarantine-data input:checked");
            ipv.virus.COMMAND.CMD_QUARANTINE_DEL.ids = []
            for (var i = 0; i < quarantine.length; i++) {
                ipv.virus.COMMAND.CMD_QUARANTINE_DEL.ids.push(parseInt(quarantine[i].id.split('_')[1]))
            }
            ipv.virus.callback.DelQuar();
        },
        RestoreQuar: function() {
            var quarantine = ipv.virus.view._current.querySelectorAll("#quarantine-data input:checked");
            ipv.virus.COMMAND.CMD_QUARANTINE_RESTORE.ids = []
            for (var i = 0; i < quarantine.length; i++) {
                ipv.virus.COMMAND.CMD_QUARANTINE_RESTORE.ids.push(parseInt(quarantine[i].id.split('_')[1]))
            }
            ipv.virus.callback.RestoreQuar();

        },
        CancelTrust: function() {
            var trust = ipv.virus.view._current.querySelectorAll("#trust-data input:checked");

            var trust = ipv.virus.view._current.querySelectorAll("#trust-data input:checked");
            ipv.virus.COMMAND.CMD_TRUST_CANCEL.ids = []
            for (var i = 0; i < trust.length; i++) {
                ipv.virus.COMMAND.CMD_TRUST_CANCEL.ids.push(parseInt(trust[i].id.split('_')[1]))
            }
            ipv.virus.callback.CancelTrust();

        },
        AddTrust: function(evt) {
            console.log(evt)

            var path = evt.parentNode.parentNode.querySelectorAll('.virus-path')[0].title;
            var threat_id = evt.parentNode.parentNode.querySelectorAll('.virus-path')[0].parentNode.querySelectorAll('input')[0].id.split('_')[1];
            // console.log(current)
            // return false;
            // var trust = ipv.virus.view._current.querySelectorAll("#trust-data input:checked");
            ipv.virus.COMMAND.CMD_TRUST_ADD.path = path
            ipv.virus.COMMAND.CMD_TRUST_ADD.threat_id = threat_id
            // for (var i = 0; i < trust.length; i++) {
            //     ipv.virus.COMMAND.CMD_TRUST_CANCEL.ids.push(parseInt(trust[i].id.split('_')[1]))
            // }
            ipv.virus.callback.AddTrust();

        },
        AddFileTrust: function() {
            var trust = ipv.virus.view._current.querySelectorAll("#trust-data input:checked");

        },
        ExportScanLog: function() {
            var scanlog = ipv.virus.view._current.querySelectorAll("#scanlog-data input:checked");

        },
        DelScanLog: function() {
            var scanlog = ipv.virus.view._current.querySelectorAll("#scanlog-data input:checked");

        },
        qts_operation_detail: function(task) {
            switch (task.cmd) {
                case 'quarantine_items_removed':
                    for (var item in task.results) {
                        if (task.results[item]['isSuccess']) {
                            console.log(task.results[item]['isSuccess'])
                            ipv.virus.view._current.querySelector('#quarantine-data').removeChild(ipv.virus.view._current.querySelector('#trquar_' + task.results[item]['id']))
                        }
                    }
                    break;
                case 'quarantine_items_restored':
                    for (var item in task.results) {
                        if (task.results[item]['isSuccess']) {
                            console.log(task.results[item]['isSuccess'])
                            ipv.virus.view._current.querySelector('#quarantine-data').removeChild(ipv.virus.view._current.querySelector('#trquar_' + task.results[item]['id']))
                        }
                    }
                    break;
                case 'quarantine_emptied':

                    break;
                case 'trust_items_removed':
                    for (var item in task.results) {
                        if (task.results[item]['isSuccess']) {
                            console.log(task.results[item]['isSuccess'])
                            ipv.virus.view._current.querySelector('#trust-data').removeChild(ipv.virus.view._current.querySelector('#trtrust_' + task.results[item]['id']))
                        }
                    }

                    break;
                case 'trust_items_emptied':

                    break;
                case 'trust_item_added':

                    break;
                case 'scan_logs_removed':

                    break;
                case 'scan_logs_emptied':

                    break;
            }
        },
        checkQuarAll: function(evt) {
            console.log(evt)
            var name = evt.getAttribute('name');
            var area = ipv.virus.view._current.querySelectorAll('#' + name + '-area input')
            console.log(area)
            check = false;
            if (evt.checked) {
                check = true;
            }
            for (var item in area) {
                area[item].checked = check;
            }

        },
        checkHistory: function(e) {
            var menu = e.target.parentNode.parentNode.querySelectorAll('li a')
            var eName = e.target.getAttribute('ref');
            var content = ipv.virus.view._current.querySelectorAll(".tab .tab-area");
            var arenbtn = ipv.virus.view._current.querySelectorAll(".area-btn");

            for (var i = 0; i < menu.length; i++) {
                menu[i].removeAttribute('class')
            }
            e.target.setAttribute('class', 'active')
            for (var j = 0; j < content.length; j++) {
                content[j].style.display = 'none'
            }
            for (var j = 0; j < arenbtn.length; j++) {
                arenbtn[j].style.display = 'none'
            }
            var area = ipv.virus.view._current.querySelector(".tab #" + eName)
            var abtn = ipv.virus.view._current.querySelector("#" + eName + '-btn')
            console.log(eName)
            area.style.display = 'block';
            abtn.style.display = 'block';
        },

        /**
         * Scan Pause 
         */
        Pause: function(operation) {
            operation = operation || 'get';
            var ScanPause = ipv.virus.view._current.querySelector('#scan-pause'),
                _self = this;
            var Status = ScanPause.getAttribute('data-status');
            var resTitle = ipv.virus.view._current.querySelector('.virus #tips');

            if (operation == 'get') {
                if (Status == null) {
                    ScanPause.setAttribute('data-status', 'normal');
                    return ScanPause.getAttribute('data-status');
                }
                return Status;
            } else if (operation == 'engine_suspended') {
                _self.timeWatch('pause');
                ScanPause.setAttribute('data-status', 'pause');
                resTitle.innerHTML = '杀毒已暂停...'
                ScanPause.innerHTML = '继续';
            } else if (operation == 'engine_resumed') {
                this.timeWatch('begin');
                ScanPause.setAttribute('data-status', 'normal');
                ScanPause.innerHTML = '暂停';
                resTitle.innerHTML = '正在进行' + _self.scanStatus + '杀毒...';
            };
        },


        /**
         * progress bar
         */
        ProgressBar: function(schedule, state) {
            var progress = ipv.virus.view._current.querySelector('#progress-now');
            var scanType = ipv.virus.scanType;
            // console.log(scanType)
            // if (scanType == '全盘') {
            //     schedule = 0.01;
            // } else {
            //     schedule = 0.1;
            // }

            if (state == 'engine_scan_stopped') {
                schedule = 100;
            } else {

                if (Number(progress.style.width.replace('%', '')) > 99) {
                    progress.style.width = '0%'
                }
                if (Number(progress.style.width.replace('%', '')) > 93) {
                    return -1;
                }
                schedule = progress.getAttribute('style') ? Number(progress.style.width.replace('%', '')) + schedule : 0;
            }
            console.log(schedule)
            progress.style.width = schedule + '%';
        },

        /**
         * Cancel
         * @param 
         */
        CancelScan: function(operation) {
            operation = operation || 'none';
            var tips = ipv.virus.view._current.querySelector('#cancel-tips');

            if (operation == 'ok') {
                ipv.virus.view.forceStop = true;
                ipv.virus.callback.Stop();
                tips.style.display = 'none';

            } else if (operation == 'no') {
                ipv.virus.callback.Pause();
                tips.style.display = 'none';
            } else {
                tips.style.display = 'block';
                console.log(ipv.virus.view.Pause('get'))
                if (ipv.virus.view.Pause('get') == 'normal') {
                    ipv.virus.callback.Pause();
                }
            }


        },
        /***********************************************************************************************************/
        checkQueue: function() {
            var _self = this;
            console.log(_self.popQueue);

            if (!_self.popTag) {
                _self.OpenWindow();
            }
        },
        /**
         * Open Window
         * @param 
         */
        OpenWindow: function() {
            var gui = require('nw.gui'),
                _self = this,
                WinWidth = 480,
                WinHeight = 277,
                wId = '金山安全卫士 - 文件拦截',
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
            var win = gui.Window.open('../pop/virus/virus-model.html', opt, function(w) {
                global.ipv = window.ipv;
                w.x = winX;
                w.y = winY;
                console.log(WinWidth, WinHeight)
                w.show();
                _self.popTag = true;
                w.on('closed', function() {
                    let popQueue = _self.popQueue.length;
                    console.log(_self.popQueue);
                    if (popQueue > 0) {
                        _self.OpenWindow();
                    } else {
                        _self.popTag = false;
                    }
                })
            });

        },

        /**
         *  Detail Timer 
         */
        fixNum: function(num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        },

        /**
         * Check All [ Check All checkbox ]
         */
        CheckAll: function(evt) {
            var virusList = ipv.virus.view._current.querySelectorAll('.resList li input'),
                checkLen = 0,
                ScanFix = ipv.virus.view._current.querySelector('#scan-repair');
            console.log(evt)
            for (let item in virusList) {
                if (!isNaN(item)) {
                    if (evt.checked) {
                        virusList[item].checked = true;
                    } else {
                        virusList[item].checked = false;
                    }
                }
            }
            console.log(checkLen)
            checkLen = ipv.virus.view._current.querySelectorAll('.resList input:checked').length;
            if (checkLen < 1) {
                ScanFix.setAttribute('class', 'btn-opt disabled');
            } else {
                ScanFix.setAttribute('class', 'btn-opt');
            }
        },
        checkFixState: function(ele) {
            var checkLen = ele.parentNode.parentNode.querySelectorAll('input:checked').length,
                nodeLen = ele.parentNode.parentNode.querySelectorAll('input').length,
                checkAll = ipv.virus.view._current.querySelector('#checkAll'),
                ScanFix = ipv.virus.view._current.querySelector('#scan-repair');
            console.log(checkLen, nodeLen)
            if (checkLen >= nodeLen) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
            if (checkLen < 1) {
                ScanFix.setAttribute('class', 'btn-opt disabled');
            } else {
                ScanFix.setAttribute('class', 'btn-opt');
            }
        },
        /**
         * Fix Now [ Fix has checked item ]
         */
        RepairNow: function() {
            console.log(this);
            var virusList = ipv.virus.view._current.querySelectorAll('.resList li input'),
                repairList = [];
            for (let item in virusList) {
                if (!isNaN(item)) {
                    if (virusList[item].checked) {
                        repairList.push(virusList[item].id.split('_')[1]);
                    }
                }
            };
            ipv.virus.COMMAND.CMD_REPAIR.id = repairList;
            ipv.virus.callback.RepairNow();
        },

        /**
         * Change Scan Status Text 
         */
        viewAdapter: function(content) {

            var resTitle = ipv.virus.view._current.querySelector('.virus #tips');
            var resPath = ipv.virus.view._current.querySelector('.virus #des');
            // if (content.path == '') return -1;
            if (content.path.length > 60) {
                content.path = content.path.substr(0, 30) + '...' + content.path.substr(-30);
            }
            var _self = this;
            if (content.msg) {
                resTitle.innerHTML = content.msg;
            }
            if (content.path) {
                resPath.innerHTML = content.path;
            }
        },

        /**
         * Scan End [ Change Status Text ]
         */
        ScanEnd: function() {
            try {
                operation = ipv.virus.view.isCancel;
                var virusNum = ipv.virus.view._current.querySelector('.virus-num'),
                    virusTips = ipv.virus.view._current.querySelector('#virus-tips'),
                    checkAll = ipv.virus.view._current.querySelector('#checkAll'),
                    resTitle = ipv.virus.view._current.querySelector('.virus #tips'),
                    scanCancel = ipv.virus.view._current.querySelector('#scan-cancle'),
                    scanRepair = ipv.virus.view._current.querySelector('#scan-repair'),
                    scanPause = ipv.virus.view._current.querySelector('#scan-pause'),
                    scanTime = ipv.virus.view._current.querySelector('#scan-time'),
                    scanFinsih = ipv.virus.view._current.querySelector('#scan-finish'),
                    resPath = ipv.virus.view._current.querySelector('.virus #des');
                this.timeWatch('pause');
                checkAll.disabled = false;
                console.log(resTitle)
                if (virusNum.innerHTML > 0) {
                    resTitle.innerHTML = '已发现 ' + virusNum.innerHTML + ' 个威胁，请立即处理！';
                    this.initBtn('unhealthy')

                } else {
                    resTitle.innerHTML = '扫描完成，暂未发现木马病毒';
                    this.initBtn('healthy')
                }

                resPath.innerHTML = '';
            } catch (e) {
                console.log(e)
            }
        },
        initBtn: function(mode) {
            mode = mode || 'none';
            var scanCancel = ipv.virus.view._current.querySelector('#scan-cancle'),
                scanRepair = ipv.virus.view._current.querySelector('#scan-repair'),
                scanPause = ipv.virus.view._current.querySelector('#scan-pause'),
                scanTime = ipv.virus.view._current.querySelector('#scan-time'),
                nodetail = ipv.virus.view._current.querySelector('#no-details'),
                scanFinsih = ipv.virus.view._current.querySelector('#scan-finish');
            switch (mode) {
                case 'healthy':
                    scanCancel.style.display = 'none';
                    scanPause.style.display = 'none';
                    scanRepair.style.display = 'none';
                    scanFinsih.style.display = 'inline-block';
                    scanTime.style.display = 'none';
                    nodetail.style.display = 'none';
                    break;
                case 'unhealthy':
                    scanCancel.style.display = 'none';
                    scanPause.style.display = 'none';
                    scanRepair.style.display = 'inline-block';
                    scanFinsih.style.display = 'none';
                    scanTime.style.display = 'none';
                    nodetail.style.display = 'inline-block';
                    break;
                default:
                    scanCancel.style.display = 'inline-block';
                    scanPause.style.display = 'inline-block';
                    scanRepair.style.display = 'none';
                    scanFinsih.style.display = 'none';
                    scanTime.style.display = 'inline-block';
                    nodetail.style.display = 'none';
                    break;

            }
        },
        /**
         * Open Detail Page
         */
        // OpenDetailPage: function(operation) {
        //     var _self = ipv.virus.view,
        //         detailPage = ipv.virus.view._current.querySelector('#detail-page'),
        //         fixRes = ipv.virus.view._current.querySelector('#fixRes'),
        //         fixResTag = ipv.virus.view._current.querySelector('#fixResTag'),
        //         parentPage = detailPage.parentNode;
        //     operation = operation || null;
        //     if (operation == 'close') {
        //         detailPage.style.transform = 'translate(0px, -458px)';
        //         return 1;
        //     }
        //     if (_self.fixedCount > 0) {
        //         fixRes.innerHTML = '成功处理' + _self.fixedCount + '个威胁！';
        //         _self.fixedCount = 0;
        //     } else {
        //         fixRes.innerHTML = '扫描完成，无风险项！';
        //     }
        //     fixResTag.innerHTML = ipv.virus.ScanStatus[ipv.virus.scanType] + '扫描';
        //     detailPage.style.transform = 'translate(0px, 0px)';
        //     this.Repair('fe');

        // },

        /**
         * Fix Virus [ Remove has fixed item ]
         */
        DetailVirus: function(ele) {
            try {
                var list = ipv.virus.view._current.querySelector('.resList'),
                    vNum = ipv.virus.view._current.querySelector('.virus-num'),
                    fixEle = ipv.virus.view._current.querySelector('#uuid_' + ele).parentNode,
                    vPath = fixEle.querySelector('p').innerHTML;
                this.viewAdapter({ path: vPath });
                list.removeChild(fixEle);
                this.fixedCount++;
                vNum.innerHTML = list.childElementCount - 1;
                // if (list.childElementCount <= 1) {
                //     list.querySelector('h5').style.display = 'block';
                // }
            } catch (e) {
                console.log(e)
            }

        },

        /**
         * Start Scan Animation
         */
        // beginScan: function(status, operation) {
        //     var _self = this;
        //     console.log(status)
        //     var main = ipv.virus.view._current.querySelectorAll(".virus .main-ctx")[0];
        //     var scan = ipv.virus.view._current.querySelectorAll(".virus .scan-ctx")[0];
        //     main.style.display = 'none';
        //     scan.style.display = 'block';
        //     scan.querySelector('#scan-type').innerHTML = status;
        //     setTimeout(function() {
        //         scan.querySelectorAll('.top')[0].style.height = '120px';
        //         scan.querySelectorAll('.bottom')[0].style.height = '358px';
        //     }, 10)

        // },
        /**
         * ReScan
         */
        // ReScan: function() {
        //     var scanType = ipv.virus.scanType;
        //     ipv.virus.view.OpenDetailPage('close');
        //     ipv.virus.view.NoDetail('re');
        //     switch (scanType) {
        //         case 'quick':
        //             ipv.virus.callback.Quick();
        //             break;
        //         case 'custom':
        //             ipv.virus.callback.Custom();
        //             break;
        //         case 'fulldisk':
        //             ipv.virus.callback.FullDisk();
        //             break;
        //     }
        // },
        /**
         * Detail No [ Return Main View ]
         */
        // NoDetail: function(type) {

        //     var _self = ipv.virus.view,
        //         resList = ipv.virus.view._current.querySelector('.resList'),
        //         child = resList.querySelectorAll('li'),
        //         virusNum = ipv.virus.view._current.querySelector('.virus-num'),
        //         tips = resList.querySelector('h5');
        //     for (let i = 0; i < child.length; i++) {
        //         resList.removeChild(child[i]);
        //     };
        //     tips.style.display = 'block';
        //     virusNum.innerHTML = '0';
        //     _self.Repair();
        //     if (type == 're') {
        //         return -1;
        //     }
        //     _self.StartScanAni('None', 'close');
        // },

        /**
         * Scan Time 
         */
        timeWatch: function(operation) {
            var _self = this;
            if (operation == 'pause') {
                clearInterval(_self.timer);
            }
            if (operation == 'init') {
                clearInterval(_self.timer);
                _self.minutes = 0;
                _self.seconds = 0;
            }
            if (operation == 'begin') {
                _self.timer = setInterval(function() {
                    let time = ipv.virus.view._current.querySelector('#scan-time');
                    time.innerHTML = '00:' + _self.fixNum(_self.minutes, 2) + ':' + _self.fixNum(_self.seconds, 2);
                    _self.seconds++;
                    if (_self.seconds >= 60) {
                        _self.seconds = 0;
                        _self.minutes++;
                    };
                }, 1000)
            }
        },

        /**
         * Found Virus [ Add virus to List ]
         */
        FoundVirus: function(virusObj) {
            console.log(virusObj)
            if (virusObj.displayName == "") {
                return -1;
            }
            var li = document.createElement('li'),
                virusNum = ipv.virus.view._current.querySelector('.virus-num'),
                resList = ipv.virus.view._current.querySelector('.resList');
            li.innerHTML = '<input type="checkbox" checked class="hide" id="uuid_' + virusObj.id + '" name="virusItem" value=""><label for="uuid_' + virusObj.id + '">' + virusObj.displayVirusName + '</label><a href="##" class="detail-info">详情</a>\
                            <div class="f-r"><a href="##" class="res-control no-op">' + ipv.virus.view.ScanRes[virusObj.operation.toLowerCase()] + '</a><a href="##" class="res-control v-trust">信任</a></div>\
                            <p class="virus-path" title="' + virusObj.displayName + '">路径：' + virusObj.displayName + '</p>';
            // console.log('find v')
            if (resList.children[0].nodeName == 'H5') {
                resList.children[0].style['display'] = 'none';
            };
            resList.appendChild(li);
            virusNum.innerHTML = resList.childElementCount - 1;
            ipv.toolbox.addEvents(li.querySelector('input'), 'click', function() {
                ipv.virus.view.checkFixState(this);
            }, false);
            ipv.toolbox.addEvents(li.querySelector('.v-trust'), 'click', function() {
                ipv.virus.view.AddTrust(this)
            }, false);
            // ipv.toolbox.addEvents(ipv.virus.view._current.querySelectorAll('.v-trust'), 'click', function() { console.log(this);ipv.virus.view.AddTrust(this) }, false);
        },

        /**
         * Change Button Status
         */
        // Repair: function(operation) {
        //     try {
        //         operation = operation || 'clear';
        //         var ScanPause = ipv.virus.view._current.querySelector('#scan-pause'),
        //             ScanStop = ipv.virus.view._current.querySelector('#scan-stop'),
        //             FixNo = ipv.virus.view._current.querySelector('#scan-repair-no'),
        //             ScanFix = ipv.virus.view._current.querySelector('#scan-repair'),
        //             ScanTime = ipv.virus.view._current.querySelector('#ScanTime'),
        //             ScanReStart = ipv.virus.view._current.querySelector('#scan-re-start'),
        //             ScanReturn = ipv.virus.view._current.querySelector('#scan-return');
        //         if (operation == 'se') {
        //             ScanPause.setAttribute('class', 'btn-opt hide');
        //             ScanStop.setAttribute('class', 'btn-opt hide');
        //             FixNo.setAttribute('class', 'btn-opt');
        //             ScanFix.setAttribute('class', 'btn-opt');
        //             ScanReStart.setAttribute('class', 'btn-opt hide');
        //             ScanReturn.setAttribute('class', 'btn-opt hide');
        //         } else if (operation == 'fe') {
        //             ScanPause.setAttribute('class', 'btn-opt hide');
        //             ScanStop.setAttribute('class', 'btn-opt hide');
        //             FixNo.setAttribute('class', 'btn-opt hide');
        //             ScanFix.setAttribute('class', 'btn-opt hide');
        //             ScanReStart.setAttribute('class', 'btn-opt');
        //             ScanReturn.setAttribute('class', 'btn-opt');
        //         } else {
        //             ScanPause.setAttribute('class', 'btn-opt');
        //             ScanStop.setAttribute('class', 'btn-opt');
        //             FixNo.setAttribute('class', 'btn-opt hide');
        //             ScanFix.setAttribute('class', 'btn-opt hide');
        //             ScanReStart.setAttribute('class', 'btn-opt hide');
        //             ScanReturn.setAttribute('class', 'btn-opt hide');
        //         }
        //         // this.ScanEnd();
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },

        /**
         * Restart Scan
         */
        // ReStartScan: function() {
        //     var _self = ipv.virus.view;
        //     _self.StartScanAni('None', 'open');
        // },

        /**
         * Return Main View
         */
        // End: function() {
        //     var _self = ipv.virus.view;
        //     _self.OpenDetailPage('close');
        //     _self.NoDetail();
        // },
        // TreeSelect: function(evt) {
        //     console.log(evt)
        // },

        /**
         * Get Disk List
         */
        GetCustomWindow: function(operation) {
            var exec = require('child_process').exec,
                il = require('iconv-lite'),
                customPath = ipv.virus.view._current.querySelector('#custom-path'),
                modalBg = document.querySelectorAll('.modal-bg'),
                status = false,
                _self = this;
            if (operation != 'open') {
                status = 'none';
                customPath.style.transform = 'scale(0)';
                for (let i = 0; i < modalBg.length; i++) {
                    modalBg[i].style.display = status;
                }
                return -1;
            } else {
                // ipv.virus.view.Tree.LoadTree('/');
                status = 'block';
                // customPath.style.transform = 'scale(1)';
                for (let i = 0; i < modalBg.length; i++) {
                    modalBg[i].style.display = status;
                }
            }
            var platform = navigator.platform;
            var cmd = null;
            var tmp = 'ls -F | grep "/$"';
            if (platform == 'Win32') {
                cmd = 'wmic logicaldisk get Caption,VolumeName';
            } else if (platform == 'Linux x86_64') {
                cmd = 'ls / -F | grep "/$"';
            }
            // show  Windows letter, to compatible Windows xp
            var wmicResult;
            var command = exec(cmd, { encoding: 'binary' }, function(err, stdout, stderr) {
                if (err || stderr) {
                    console.log("root path open failed" + err + stderr);
                    return;
                }
                // console.log(err, il.decode(stdout, 'gbk'), stderr)
                wmicResult = il.decode(stdout, 'gbk');
                // console.log(wmicResult)
            });
            // stop the input pipe, in order to run in windows xp
            command.stdin.end();
            command.on('close', function(code) {
                var data = wmicResult.split('\n');
                for (let items in data) {
                    var disk_name = null;
                    if (platform == "Win32") {
                        if (data[items].indexOf(':') > -1) {
                            console.log(data[items].indexOf(':') > -1)
                            console.log(data[items])
                            ipv.virus.view.diskList[data[items].split(':')[0]] = data[items].split(':')[1].trim() == "" ? "本地磁盘" : data[items].split(':')[1].trim();

                        }
                    } else if (platform == 'Linux x86_64') {
                        ipv.virus.view.diskList[data[items]] = data[items];
                        // disk_name = data[items].split(':')[1].trim() == "" ? "本地磁盘" : data[items].split(':')[1].trim();

                    }
                    console.log(ipv.virus.view.diskList)
                }

                // ipv.virus.view.GetDisk();
                if (operation == 'open') {
                    ipv.virus.view.Tree.LoadTree('/');
                    // status = 'block';
                    customPath.style.transform = 'scale(1)';
                }
                // for (let i = 0; i < modalBg.length; i++) {
                //     modalBg[i].style.display = status;
                // }
                // add event to tree 
                ipv.toolbox.addEvents(ipv.virus.view._current.querySelectorAll('#treeSelect a'), 'click', function() {
                    ipv.virus.view.Tree.ToggleTree(this);
                }, false);
                ipv.toolbox.addEvents(ipv.virus.view._current.querySelectorAll('#treeSelect input'), 'click', function() {
                    console.log(this);
                    ipv.virus.view.Tree.ChangeCheck(this);
                }, false);
            });
        },

        /**
         * Open Custom Scan Window
         */
        // GetCustomWindow: function(operation) {
        //     var customPath = ipv.virus.view._current.querySelector('#custom-path'),
        //         modalBg = ipv.virus.view._current.querySelectorAll('.modal-bg'),
        //         status = false;
        //     ipv.virus.view.GetDisk();
        //     if (operation == 'open') {
        //         ipv.virus.view.Tree.LoadTree('/');
        //         status = 'block';
        //         customPath.style.transform = 'scale(1)';

        //     } else {
        //         status = 'none';
        //         customPath.style.transform = 'scale(0)';
        //     };
        //     for (let i = 0; i < modalBg.length; i++) {
        //         modalBg[i].style.display = status;
        //     }
        //     // add event to tree 
        //     ipv.toolbox.addEvents(ipv.virus.view._current.querySelectorAll('#treeSelect a'), 'click', function() {
        //         ipv.virus.view.Tree.ToggleTree(this);
        //     }, false);
        //     ipv.toolbox.addEvents(ipv.virus.view._current.querySelectorAll('#treeSelect input'), 'click', function() {
        //         console.log(this);
        //         ipv.virus.view.Tree.ChangeCheck(this);
        //     }, false);
        // }
    };
    ipv.virus.view.Tree = {
        Init: function() {
            console.log(ipv.virus.view.diskList);
        },
        ToggleTree: function(evt) {
            var _self = this;
            var flag = false;

            var nodes = evt.parentNode.childNodes;
            for (let node in nodes) {
                if (nodes[node].nodeName == 'UL') {
                    flag = true;
                    if (getComputedStyle(nodes[node], 'style').display == 'none') {
                        nodes[node].style.display = 'block';
                    } else {
                        nodes[node].style.display = 'none';
                    }
                }
            }
            if (!flag) {
                _self.LoadTree(evt);
            }
        },
        LoadTree: function(evt) {
            var path;
            if (!(typeof(evt) == 'string')) {
                path = evt.getAttribute('data-path');
            } else {
                path = evt;
            }
            // path = path.replace(/\\\\/g,"\\");
            // console.log(path);
            if (path == '/') {
                var diskList = ipv.virus.view.diskList,
                    tmplate = '',
                    platform = ipv.toolbox.detectOS();
                eleDiskList = ipv.virus.view._current.querySelector('#treeSelect');
                console.log(platform)
                for (var item in diskList) {
                    if (platform == "WinXP" || platform == "Win7" || platform == "Win10") {
                        tmplate += '<li><input type="checkbox" data-path="' + item + ':\\" class="hide" root-attr=true id="' + item + '" name="b3" value=""><label for="' + item + '"></label><a href="###" data-path="' + item + ':\\">' + diskList[item] + '&nbsp;&nbsp;(' + item + ':)</a></li>';

                    } else if (platform == "Linux") {
                        tmplate += '<li><input type="checkbox" data-path="/' + item + '" class="hide" root-attr=true id="/' + item + '" name="b3" value=""><label for="/' + item + '"></label><a href="###" data-path="/' + item + '">' + diskList[item] + '&nbsp;&nbsp;</a></li>';

                    }
                }

                eleDiskList.innerHTML = tmplate;

                // console.log(tmplate)

            } else {
                var fs = require('fs');
                var files = fs.readdirSync(path);
                var ul = document.createElement('ul');
                var tmplate = '';
                var isCheck = '';
                var os = require('path');
                console.log(evt)
                var child = evt.parentNode.childNodes;
                for (let item in child) {
                    if (child[item].nodeName == 'INPUT') {
                        if (child[item].checked) {
                            isCheck = 'checked';
                            console.log(child[item].checked)
                        }
                    }
                }
                files.forEach(function(fa) {
                    try {
                        if (fs.statSync(path + os.sep + fa).isDirectory()) {
                            if (navigator.platform == 'Linux x86_64') {
                                tmplate += '<li><input type="checkbox" ' + isCheck + ' data-path="' + path + os.sep + fa + '" class="hide" id="' + path + os.sep + fa + '" name="b3" value=""><label for="' + path + os.sep + fa + '"></label><a href="###" data-path="' + path + os.sep + fa + '">' + fa + '</a></li>';
                            } else if (navigator.platform == 'Win32') {
                                tmplate += '<li><input type="checkbox" ' + isCheck + ' data-path="' + path + os.sep + fa + '" class="hide" id="' + path + os.sep + fa + '" name="b3" value=""><label for="' + path + os.sep + fa + '"></label><a href="###" data-path="' + path + os.sep + fa + '">' + fa + '</a></li>';
                            }

                        }
                    } catch (e) {
                        console.log(e);
                    }
                    ul.innerHTML = tmplate;
                    evt.parentNode.appendChild(ul);
                })
                for (let item in ul.childNodes) {
                    if (ul.childNodes[item].nodeName == 'LI') {
                        ipv.toolbox.addEvents(ul.childNodes[item].querySelectorAll('a'), 'click', function() {
                            ipv.virus.view.Tree.ToggleTree(this);
                        }, false);
                        ipv.toolbox.addEvents(ul.childNodes[item].querySelectorAll('input'), 'click', function() {
                            ipv.virus.view.Tree.ChangeCheck(this);
                        }, false);
                    }
                }

            }
        },
        GetCheckDisk: function() {
            var checkList = ipv.virus.view._current.querySelectorAll('#treeSelect input:checked'),
                hasCheck = [];
            console.log(checkList)

            for (let i = 0; i < checkList.length; i++) {
                var isParent = checkList[i].parentNode.parentNode.parentNode.querySelector('input').checked;

                if (checkList[i].getAttribute('root-attr') == 'true') {
                    hasCheck.push(checkList[i].getAttribute('data-path').replace(/\\\\/g, "\\"))
                } else {
                    if (!checkList[i].parentNode.parentNode.parentNode.querySelector('input').checked) {
                        hasCheck.push(checkList[i].getAttribute('data-path').replace(/\\\\/g, "\\"))
                    }
                }

            };
            console.log(hasCheck)
            ipv.virus.COMMAND.CMD_CUSTOM.locations = hasCheck;
            console.log(hasCheck)
            ipv.virus.callback.Custom();
            ipv.virus.view.GetCustomWindow('close');
        },
        ChangeCheck: function(ele) {
            var child = ele.parentNode.childNodes,
                isCheck = false;
            for (let item in child) {
                if (child[item].nodeName == 'INPUT') {
                    let pNode = child[item].parentNode.parentNode,
                        pNodes = pNode.parentNode,
                        currentLen = pNode.querySelectorAll('input').length,
                        checkLen = pNode.querySelectorAll('input:checked').length;
                    console.log(ele.parentNode.parentNode.id)
                    if (ele.parentNode.parentNode.id != 'treeSelect') {
                        if (currentLen == checkLen) {
                            pNodes.querySelector('input').setAttribute('check-status', true);
                            pNodes.querySelector('input').checked = true;
                        } else {
                            pNodes.querySelector('input').setAttribute('check-status', false);
                            pNodes.querySelector('input').checked = false;
                        }
                    }

                    if (child[item].checked) {
                        isCheck = true;
                    } else {
                        isCheck = false;
                    }
                }
                if (child[item].nodeName == 'UL') {
                    let inputs = child[item].querySelectorAll('input');
                    for (let ipt in inputs) {
                        if (isNaN(inputs[ipt])) {
                            inputs[ipt].checked = isCheck;
                        }
                    }
                }
            }
        }
    };
})(ipv);