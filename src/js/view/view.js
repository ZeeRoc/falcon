(function(win, doc, unf) {

    'use strict';

    ipv.view = {
        togglePage: function(ele) {
            var currentTag = ele.getAttribute('toggle-tag');
            var togPage = doc.querySelector('#' + currentTag);
            togPage.style.display = 'block';
            setTimeout(function() {
                togPage.style.opacity = 1;
                togPage.style.transform = 'translate(0,0)';

            }, 20)
            var otherPage = doc.querySelectorAll('.context section');
            var bodyBg = doc.querySelector('body');
            var menu = doc.querySelectorAll('nav li a');
            for (var i = 0; i < menu.length; i++) {
                $(menu[i]).removeClass('active')
            }
            $(ele).addClass('active');
            console.log($(ele))
            for (var i = 0; i < otherPage.length; i++) {
                if (otherPage[i].id != currentTag) {
                    otherPage[i].style.display = 'none';
                    otherPage[i].style.opacity = 0;
                    otherPage[i].style.transform = 'translate(0,20px)';
                }
            }

        },
        closeWin: function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.hide();
        },
        minifyWin: function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.minimize();
        },
        showToolsMenu: function(e) {
            var menu = $('.menu-item')[0];
            console.log(window.getComputedStyle(menu, null).display)
            if (window.getComputedStyle(menu, null).display == 'none') {
                $('.menu-item').css("display", "block");
            } else {
                $('.menu-item').css("display", "none");
            }
            $(document).click(function() {
                // console.log('mo');
                $('.menu-item').css("display", "none");
            });
            e.stopPropagation()

        },
        move: function() {
            var body = document.querySelectorAll('body')[0];
            // body.className = 'a';
            // body.className = 'dragable';
        },
        argvStart:function(){
            // Load native UI library  
            var gui = require('nw.gui');  
            var argv = gui.App.argv[0];
            var win = gui.Window.get();
            if(argv == 'hide'){
                win.hide();
            }else{
                win.show();
            }
        }()


    };

}(window, document, undefined));