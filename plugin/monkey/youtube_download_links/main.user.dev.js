// ==UserScript==
// @name       Youtube video links inserter
// @namespace  http://gubnota.github.io/fenki_js_helpers/plugin/monkey/
// @version    0.1.1
// @downloadURL http://gubnota.github.io/fenki_js_helpers/plugin/monkey/youtube_download_links/main.user.js
// @description adds links to download video at Youtube.com
// @include        https://*.youtube.com/*
// @include        https://youtube.com/*
// @include        http://*.youtube.com/*
// @include        http://youtube.com/*
// @copyright  2015+, Vladislav Muravyev
// @author Vladislav Muravyev
// @grant          none
// @icon http://gubnota.github.io/fenki_js_helpers/plugin/monkey/youtube_download_links/yt.png
// @run-at document-end
// ==/UserScript==
(function(window, undefined){
var w = window;
    // Пример: подключение jquery.min.js
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/:\/\/.*youtube\.com\//.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
        var el = document.getElementById('youtube_download_links_window_helper_script');
        if (el === null) {
    (function(f,e,n,k,i){
    var m=e.createElement(n);
    m.setAttribute('id','youtube_download_links_window_helper_script');
    m.async=true;
    m.src=k;
    if(typeof(IFrameWindowHelper) == 'undefined'){
    m.onload = function(){YoutubeVideosWindowHelperScript.init();};
    }
    (e[i]('head')[0] || e[i]('body')[0]).appendChild(m);
    })(window,document,'script',(6 == document.location.protocol.length ? 'https:' : 'http:') + '//gubnota.github.io/fenki_js_helpers/plugin/monkey/youtube_download_links/window_helper.js','getElementsByTagName');


        }//undefined el
    }//url pattern
})(window);
