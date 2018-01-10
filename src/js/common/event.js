ipv.toolbox.addEvents(document.querySelectorAll('nav li a'), 'click', function(ele) {
    ipv.view.togglePage(ele.target);
}, false);
ipv.toolbox.addEvents(document.querySelectorAll('.close'), 'click', function(ele) {
    ipv.view.closeWin();
}, false);
ipv.toolbox.addEvents(document.querySelectorAll('.minify'), 'click', function(ele) {
    ipv.view.minifyWin();
}, false);
ipv.toolbox.addEvents(document.querySelectorAll('.menu'), 'click', function(ele) {
    ipv.view.showToolsMenu(ele);
}, false);

// 禁止拖拽
ipv.toolbox.addEvents(document.querySelectorAll('a'), 'dragstart', function(e) {
    e.preventDefault();
}, false);

// 检查更新
ipv.toolbox.addEvents(document.querySelector('#update'), 'click', function() {
    ipv.common.view.CheckUpdate();
}, false);

// 关闭更新弹窗
ipv.toolbox.addEvents(document.querySelector('.update-close'), 'click', function() {
    ipv.common.view.CloseUpdateWindow();
}, false);
ipv.toolbox.addEvents(document.querySelector('#update-ok'), 'click', function() {
    ipv.common.view.CloseUpdateWindow();
}, false);

ipv.toolbox.addEvents(document.querySelector('#update-now'), 'click', function() {
    ipv.common.view.UpdateNow();
}, false);


ipv.toolbox.addEvents(document.querySelector('#update-restart'), 'click', function() {
    ipv.common.view.RestartClient();
}, false);

// var gui = require('nw.gui');
// var win = gui.Window.get();
// win.show();

// 禁止拖拽
// ipv.toolbox.addEvents(document.querySelectorAll('body'), 'mousedown', function(e) {
//     ipv.view.move();
//     console.log('eee');

// }, false);

var isShowWindow = true;

var gui = require('nw.gui');
var win = gui.Window.get();
var tray = new gui.Tray({
    title: 'My Application',
    icon: 'images/ico/logo.jpg'
});
tray.tooltip = "猎鹰企业管家";

//添加菜单  
var menu = new gui.Menu({ type: 'menubar' });
// console.log(menu)
// menu.append(new gui.MenuItem({
//     type: 'normal',
//     label: 'SHow/Hide',
//     click: function() {
//         if (isShowWindow) {
//             win.hide();
//             isShowWindow = false;
//         } else {
//             win.show();
//             isShowWindow = true;
//         }
//     }
// }));

menu.append(new gui.MenuItem({
    type: 'normal',
    label: 'Exit',
    click: function() {
        win.hide();
        tray.remove();
        tray = null;
        win.removeAllListeners('close');
        gui.App.quit();
        this.close(true);
    }
}));

tray.menu = menu;

tray.on('click', function(e) {
    console.log(e)
    if (isShowWindow) {
        win.hide();
        isShowWindow = false;
    } else {
        win.show();
        isShowWindow = true;
    }
})
// // 禁止拖拽
// ipv.toolbox.addEvents(document.querySelectorAll('body'), 'mouseup', function(e) {

//     console.log('aaa');

// }, false);
// var oDiv = document.querySelectorAll('html')[0];
// // body.style.webkitAppRegion = 'drag';

// // var oDiv = document.getElementById('box')
// oDiv.onmousedown = function(ev) {
//     var disX = ev.clientX - oDiv.offsetLeft
//     var disY = ev.clientY - oDiv.offsetTop

//     document.onmousemove = function(ev) {
//         var l = ev.clientX - disX
//         var t = ev.clientY - disY

//         oDiv.style.left = l + 'px'
//         oDiv.style.top = t + 'px'
//     }
//     document.onmouseup = function() {
//         document.onmousemove = null;
//         document.onmouseup = null
//     }
// }