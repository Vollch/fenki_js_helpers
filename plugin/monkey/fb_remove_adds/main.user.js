// ==UserScript==
// @name       Facebook remove adds
// @namespace  http://git.gubnota.ru/fenki_js_helpers/plugin/monkey/fb_remove_adds/
// @version    0.1.2
// @downloadURL http://git.gubnota.ru/fenki_js_helpers/plugin/monkey/fb_remove_adds/main.user.js
// @description removes adds block in Facebook
// @include      https://www.facebook.com/*
// @copyright  2012+, Vladislav Muravyev
// @grant          none
// @icon http://git.gubnota.ru/fenki_js_helpers/plugin/monkey/fb_remove_adds/fb.ico
// @run-at document-end
// ==/UserScript==
(function(){
var t = setInterval(function(){
var el = document.getElementsByClassName('ego_column');
    for(var i =0; i<el.length; i++){
    el[i].remove();//clearInterval(t);
    }
    },100);
})();

