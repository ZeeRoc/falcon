ipv.toolbox = {
    // 添加事件
    addEvents: function(obj, evType, fn, useCapture) {

        if (!useCapture) useCapture = false;

        if (!(obj.constructor.name == 'NodeList')) {
            if (obj.addEventListener) {
                obj.addEventListener(evType, fn, useCapture);
            } else {
                obj.attachEvent('on' + evType, fn);
            }
        } else {
            for (var item in obj) {
                if (!isNaN(item)) {
                    if (obj[item].addEventListener) {
                        obj[item].addEventListener(evType, fn, useCapture);
                    } else {
                        obj[item].attachEvent('on' + evType, fn);
                    };
                }
            };
        };
    },

    /**
     * 移除事件
     */

    removeEvent: function(obj, evType, fn, useCapture) {
        if (!useCapture) useCapture = false;

        if (obj.removeEventListener) {
            obj.removeEventListener(evType, fn, useCapture);
        } else {
            obj.detachEvent('on' + evType, fn);
        }
    },
    detectOS: function() {
        var userAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = userAgent.indexOf("Windows NT 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = userAgent.indexOf("Windows NT 5.1") > -1 || userAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = userAgent.indexOf("Windows NT 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista = userAgent.indexOf("Windows NT 6.0") > -1 || userAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin7 = userAgent.indexOf("Windows NT 10.0") > -1 || userAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win10";
        }
        return "other";
    }

};
