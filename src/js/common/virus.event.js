(function(ipv) {
    ipv.virus.event = {
        init: function() {
            var _current = document.querySelector('#virus');
            ipv.toolbox.addEvents(_current.querySelector('#caret'), 'click', function(ele) { ipv.virus.view.switchWay(ele) }, false);
            ipv.toolbox.addEvents(_current.querySelectorAll('.scan-history ul li a'), 'click', ipv.virus.view.checkHistory, false);

            // Quar check all
            ipv.toolbox.addEvents(_current.querySelector('#quarantine-all'), 'click', function() { ipv.virus.view.checkQuarAll(this) }, false);
            ipv.toolbox.addEvents(_current.querySelector('#trust-all'), 'click', function() { ipv.virus.view.checkQuarAll(this) }, false);
            ipv.toolbox.addEvents(_current.querySelector('#scanlog-all'), 'click', function() { ipv.virus.view.checkQuarAll(this) }, false);

            //quar operation
            ipv.toolbox.addEvents(_current.querySelector('#quar-del'), 'click', ipv.virus.view.DelQuar, false);
            ipv.toolbox.addEvents(_current.querySelector('#quar-restore'), 'click', ipv.virus.view.RestoreQuar, false);
            ipv.toolbox.addEvents(_current.querySelector('#trust-cancel'), 'click', ipv.virus.view.CancelTrust, false);

            ipv.toolbox.addEvents(_current.querySelector('#scanlog-del'), 'click', ipv.virus.view.DelScanLog, false);

            // Quarantine
            ipv.toolbox.addEvents(_current.querySelectorAll('.virus .lnk li'), 'click', ipv.virus.callback.Quarantine, false);
            // FullDisk
            ipv.toolbox.addEvents(_current.querySelector('#fulldisk'), 'click', ipv.virus.callback.FullDisk, false);

            // QuickScan
            ipv.toolbox.addEvents(_current.querySelector('#scan-system'), 'click', ipv.virus.callback.Quick, false);

            // Pause/Resume
            ipv.toolbox.addEvents(_current.querySelector('#scan-pause'), 'click', ipv.virus.callback.Pause, false);
            // history
            ipv.toolbox.addEvents(_current.querySelectorAll('.virus .lnk li'), 'click', function() { ipv.virus.view.GetHistory('open') }, false);
            // close history
            ipv.toolbox.addEvents(_current.querySelectorAll('.qst-close'), 'click', function() { ipv.virus.view.GetHistory('close') }, false);
            // Custom
            ipv.toolbox.addEvents(_current.querySelector('#scan-custom'), 'click', function() { ipv.virus.view.GetCustomWindow('open') }, false);

            // Close Custom Window
            ipv.toolbox.addEvents(_current.querySelector('#custom-close'), 'click', function() { ipv.virus.view.GetCustomWindow('close') }, false);

            ipv.toolbox.addEvents(_current.querySelectorAll('#Start'), 'click', function() { ipv.virus.view.Tree.GetCheckDisk() }, false);

            // CheckBox
            ipv.toolbox.addEvents(_current.querySelector('#checkAll'), 'click', function() { ipv.virus.view.CheckAll(this) }, false);

            // Cancel
            ipv.toolbox.addEvents(_current.querySelector('#scan-cancle'), 'click', function() { ipv.virus.view.CancelScan() }, false);

            // Cancel -> OK
            ipv.toolbox.addEvents(_current.querySelector('#cancel-ok'), 'click', function() { ipv.virus.view.CancelScan('ok') }, false);

            // Cancel -> No
            ipv.toolbox.addEvents(_current.querySelector('#cancel-no'), 'click', function() { ipv.virus.view.CancelScan('no') }, false);

            // Cancel -> Close
            ipv.toolbox.addEvents(_current.querySelector('#cancel-close'), 'click', function() { ipv.virus.view.CancelScan('no') }, false);

            // Scan Finish
            ipv.toolbox.addEvents(_current.querySelector('#scan-finish'), 'click', function() { ipv.virus.view.drawView(null, 'end') }, false);
            // Repair
            ipv.toolbox.addEvents(_current.querySelector('#scan-repair'), 'click', ipv.virus.view.RepairNow, false);

            // No Detail
            ipv.toolbox.addEvents(_current.querySelector('#no-details'), 'click', function() { ipv.virus.view.drawView(null, 'end') }, false);
        }()
    }
})(ipv);