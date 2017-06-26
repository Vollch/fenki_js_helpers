// ==UserScript==
// @name       Shutterstock show places table
// @namespace  http://gubnota.github.io/fenki_js_helpers/plugin/monkey/
// @version    0.1.7.2
// @downloadURL http://gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/main.user.js
// @description Shows Shutterstock buyers places map spots one-by-one table
// @include        http*://submit.shutterstock.com/dashboard*
// @copyright  2015+, Vladislav Muravyev
// @author Vladislav Muravyev
// @grant          none
// @icon http://gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/ss.png
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
    if (/:\/\/submit\.shutterstock\.com\//.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
        var el = document.getElementById('shutter_places_window_helper_script');
        if (el === null) {
(function(f,e,n,k,i){
var n=e.createElement(n);
n.setAttribute('id','shutter_places_window_helper_script');
n.async=true;
n.src=k;
if(typeof(IFrameWindowHelper) == 'undefined'){
// if (/Safari/g.test(window.navigator.appVersion)){
// window_helper.js}
n.onload = function(){ShutterPlacesWindowHelperScript.Button();};
}
(e[i]('head')[0] || e[i]('body')[0]).appendChild(n);
})(window,document,'script',(6 == document.location.protocol.length ? 'https:' : 'http:') + '//raw.githubusercontent.com/vollch/fenki_js_helpers/gh-pages/plugin/monkey/shutter_places/window_helper.dev.js','getElementsByTagName');

        }//undefined el
    }//url pattern
})(window);
