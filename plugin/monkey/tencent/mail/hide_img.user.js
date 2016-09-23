// ==UserScript==
// @name       *mail.qq.com blocks all images from amazon, ebay, optional load images by click
// @3namespace  http://gubnota.github.io/fenki_js_helpers/plugin/monkey/tencent/mail/
// @version    0.0.2
// @3downloadURL http://gubnota.github.io/fenki_js_helpers/plugin/monkey/tencent/mail/hide_img.user.js
// @description removes adds block(s) in mail.yeah.net
// @include      https://*mail.qq.com/*
// @copyright  2016+, Vladislav Muravyev
// @author Vladislav Muravyev
// @grant          none
// @icon http://gubnota.github.io/fenki_js_helpers/plugin/monkey/tencent/favicon.ico
// @run-at document-end
// ==/UserScript==
(function(){

var imgscope='#mailContentContainer *',/*image searching scope*/
empty_dot="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",/*.placedb-letter*/
click_handlers='.b-datalist__item',/*on click which items to (re)-run hide images*/
insert_button_place='.noUnderLineList',/*where to insert show images button*/
button_id='show_img',/*button id to show images*/
button_code='<span id="show_img" style="color:#15c;cursor:pointer;text-decoration:underline">Показать картинки</span>',
button_where='BeforeEnd',
button_from='Показ',
button_to='Спрят',
button_search='з',
main_interval_reload=2000;
function bgimg_handler(el){
if(el.style.backgroundImage){
	if (!el.getAttribute('old-bgimg')){
	el.setAttribute('old-bgimg',el.style.backgroundImage.replace(/(.*)/,'/*$1*/'));
	el.style.backgroundImage="url("+empty_dot+")";
	}
	else{
	el.style.backgroundImage=el.getAttribute('old-bgimg').replace(/\/\*(.*)\*\//,'$1');
	el.removeAttribute('old-bgimg');
	}
}
}
function attr_handler(el,attr){
	attr.forEach(function(at){
	if (!el.getAttribute('old-'+at) && el.getAttribute(at)){
	el.setAttribute('old-'+at,el.getAttribute(at));
	el.setAttribute(at,empty_dot);
	}
	else if (el.getAttribute('old-'+at)){
	el.setAttribute(at,el.getAttribute('old-'+at));
	el.removeAttribute('old-'+at);
	}
	});
}

function hide_show_letter_img(){
[].forEach.call(document.querySelectorAll(imgscope),function(el) {
bgimg_handler(el);/*bg-img*/

if (el.nodeName=='IMG') {
	bgimg_handler(el);
	attr_handler(el,['src','srcset']);
}/*img src*/
});}

function init_find_place(){
var a = document.querySelectorAll(insert_button_place);
var b=document.getElementById(button_id);

if (b === null && a.length>0){
a[0].insertAdjacentHTML(button_where,button_code);hide_show_letter_img();
}

if (b!==null){
b.onclick=function(e){var i=e.target.innerText;
var t=button_to,f=button_from;
if(i.indexOf(button_search)>-1){f=button_to;t=button_from;}
e.target.innerText=i.replace(f,t);hide_show_letter_img();
};}
}



document.addEventListener("DOMContentLoaded", function(){init_find_place();});
init_find_place();
window.onload=function(){init_find_place();var t = setInterval(function(){init_find_place();},main_interval_reload);
document.addEventListener('DOMNodeInserted',function(e){init_find_place();});
};
})();