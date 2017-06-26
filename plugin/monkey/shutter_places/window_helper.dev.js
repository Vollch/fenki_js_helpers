/*
 Copyright 2014 Gubnota Tech (Shenzhen) Ltd, Art Well Enterprise (HK) Ltd.
 All rights reserved. Licensed under the Apache License, 
 Version 2.0 (the "License"); you may not use this file except in 
 compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Written by: Vladislav Muravyev
 Inspired by: Google inc. cookiechoices.js
 Requirements: jQuery lib for ajax-calls
 To Load button, call it like:

<script>
(function(f,e,n,k,i){
var n=e.createElement(n);
n.setAttribute('id','shutter_places_window_helper_script');
n.async=true;
n.src=k;
(e[i]('head')[0] || e[i]('body')[0]).appendChild(n);
if(typeof(IFrameWindowHelper) == 'undefined'){
    n.onload = function() {ShutterPlacesWindowHelperScript.Button({buttonText:"Places",closeText:"Collapse",url:'//gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/response.json'});}
}
})(window,document,'script',(6 == document.location.protocol.length ? 'https:' : 'http:') + '//gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/window_helper.js','getElementsByTagName');
</script>

 Or:

<script src="//gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/window_helper.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function(event) {
    ShutterPlacesWindowHelperScript.Button({buttonText:"Places",closeText:"Collapse",url:'//gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/response.json'});
  });
</script>
*/

(function(window) {
    if (window !== top) return;
    if ( !! window.ShutterPlacesWindowHelperScript) {
        return window.ShutterPlacesWindowHelperScript;
    }

    var document = window.document;
    // IE8 does not support textContent, so we should fallback to innerText.
    var ShutterPlacesWindowHelperScript = (function() {
        var id = Math.ceil(Math.random() * 1000); //уникальный id объекта
        var ShutterPlacesWindowHelperScriptId = 'ShutterPlacesInfo' + id;
        var ShutterPlacesIframeId = 'ShutterPlacesInfoIframe' + id;
        var dismissLinkId = 'ShutterPlacesDismiss' + id;
        var buttonId = 'ShutterPlacesButtonOpen' + id;
        var lang = 'en';
        var url = "https://submit.shutterstock.com/api/user/downloads/map"; //"http://gubnota.github.io/fenki_js_helpers/plugin/monkey/shutter_places/response.json";
        var keys = ['buttonText','closeText','thumbText','similarText','utilizesText','timeText','placeText'];
        var dic = 
        {'en':['Places','Collapse','Thumbnail','Similar on Site','Who utilizes picture','Time','Place','Undefined'],
        'ru':['Места','Свернуть','Миниатюра','Похожие на сайте','Кто использует картину','Время','Место','Не определено'],
        'zh':['地方','关闭','缩略图','类似在网站','谁利用图片','时间','地方','未定义'],
        'fr':['Lieux','Fermer','Miniature','Similaires dans le site','Qui utilise l\'image','Temps','Lieu','Indéterminé'],
        'pl':['Miejsca','Zwiń okno','Miniatura','Podobne w witrynie','Kto korzysta z obrazu','Pora','Miejsce','Nieokreślone'],
        'es':['Lugares','Cerrar','Miniatura','Similar en el sitio','¿Quién utiliza la imagen','Tiempo','Lugar','Indefinido'],
        'tr':['Yerler','Yakın','Küçük resim','Sitedeki benzer','Kim resmi kullanır','Zaman','Yer','Tanımsız'],
        'pt':['Locais','Fechar','Thumbnail','Similar no Site','Quem utiliza imagem','Tempo','Lugar','Indefinido'],
        'de':['Places','Fenster','Daumennagel','Ähnliche vor Ort','Wer nutzt Bild','Zeit','Platz','Undefiniert'],
        'id':['Tempat','Tutup','Miniatur','Serupa di Situs','Siapa yang menggunakan gambar','Waktu','Tempat','Terdefinisi'],
        'jp':['場所','隠す','サムネイル','サイト上内サイト','誰が絵を利用','時間','場所','未定義']
        };
        var param = {buttonText:dic['en'][0], closeText:dic['en'][1], url:url};
        function _sort(stock){
            for (var i = 1; i<stock.length; i++){
                if (stock[i].time < stock[i-1].time) {
                    var new_stock = stock[i];
                    stock[i] = stock[i-1];
                    stock[i-1] = new_stock;
                }
            }
            return stock;
        }
        function _localStorage(data,limit,skip){
            if (data !== undefined && data.length>0){
            for (var i = data.length - 1; i >= 0; i--) {
                data[i].time = parseInt((new Date(data[i].time).getTime()/1000).toFixed());
                if (data[i].media_type == 'image') delete data[i].media_type;
                if (data[i].aspect !== undefined) delete data[i].aspect;
                if (data[i].region !== undefined) delete data[i].region;
            }
            }
            if (window.localStorage !== undefined) {
                if ((window.localStorage.getItem('shutter_places')+"").substr(0,2)=='[{')
                {
                    var stock = JSON.parse(window.localStorage.getItem('shutter_places'));
                    if (typeof stock != 'undefined' && stock.length>0)
                    {
                        for (var j = data.length - 1; j >= 0; j--)
                        {
                        var found = false;
                        for (var i = 0; i<stock.length; i++)
                        {
                            if (stock[i].time == data[j].time && stock[i].media_id == data[j].media_id) {found = true; break;}
                        }
                        if (!found) stock.push(data[j]);
                        }
                        stock = _sort(stock);
                        window.localStorage.setItem('shutter_places', JSON.stringify(stock));
                    }
                }
                else {
                        data = _sort(data);
                        window.localStorage.setItem('shutter_places', JSON.stringify(data));
                }
            }
            return data;
        }
        function _createDialogElement(dismissText, linkHref) {
            var glassStyle = 'position:fixed;width:100%;height:100%;z-index:9999;' +
                'top:0;left:0;opacity:0.3;filter:alpha(opacity=30);' +
                'background-color:#000;';
            var dialogStyle = 'z-index:10000;position:fixed;top:0';
            var contentStyle = 'position:fixed;height:100%;width:100%;' +
                'background-color:#fff6e9;padding:10px 0;box-shadow:4px 4px 25px #888;font: 15px/17px "PT Sans",Arial;z-index: 10000;';
            //border:5px solid #193441;
            var ShutterPlacesWindowHelperScriptElement = document.createElement('div');
            ShutterPlacesWindowHelperScriptElement.id = ShutterPlacesWindowHelperScriptId;

            var glassPanel = document.createElement('div');
            glassPanel.style.cssText = glassStyle;

            var content = document.createElement('div');
            content.style.cssText = contentStyle;

            var css = document.createElement('style');
            css.innerHTML = '#' + ShutterPlacesIframeId + ' table{' + ['background:#fff6e9',
                'width:100%',
                'margin-bottom:50px',
                'border-bottom:2px solid #bdb6ad',
                'margin:10px 0'
            ].join(';') + '}' + '#' + ShutterPlacesIframeId + ' th{' + ['display:table-cell',
                'padding:2px 10px',
                'border:solid #ece4d8',
                'border-width:0 2px 2px 0',
                'color:#cd596b',
                'font-family:"Open Sans",Myriad,Calibri,sans-serif',
                'font-weight:bold',
                'font-size:.85em',
            ].join(';') + '}' + '#' + ShutterPlacesIframeId + ' td{' + ['border-width:0 2px 0 0', 'border:solid #ece4d8', 'vertical-align:middle', 'text-align:center'].join(';') + '}' + '#' + ShutterPlacesIframeId + ' table:after{' + ['content:" "', 'display:block', 'width:100%', 'height:100px'].join(';') + '}' + '#' + ShutterPlacesIframeId + ' td.thumb img{' + ['min-width:50px', 'min-height:50px', 'max-width:100px'].join(';') + '}';
            var dialog = document.createElement('div');
            dialog.style.cssText = dialogStyle;
            dialog.id = ShutterPlacesWindowHelperScriptId+'dialog';
            var dismissLink = _createDismissLink(dismissText || param.closeText);
            dismissLink.style.cssText = dismissLink.style.cssText + ';display:block;background-color:#193441;' +
                'text-align:center;padding:4px;font:normal 15px/17px \'PT Sans\',Arial';

            content.appendChild(dismissLink);
            var frame = document.createElement('div');
            frame.id = ShutterPlacesIframeId;
            frame.style.cssText = "width:100%;height:100%;overflow-y:scroll;";
            content.appendChild(frame);
            dialog.appendChild(content);
            ShutterPlacesWindowHelperScriptElement.appendChild(glassPanel);
            ShutterPlacesWindowHelperScriptElement.appendChild(dialog);
            ShutterPlacesWindowHelperScriptElement.appendChild(css);
            return ShutterPlacesWindowHelperScriptElement;
        }

        function _setElementText(element, text) {
            element.innerHTML = text;
        }

        function _createDismissLink(dismissText) {
            var dismissLink = document.createElement('a');
            _setElementText(dismissLink, dismissText || param.closeText);
            dismissLink.id = dismissLinkId;
            dismissLink.href = '#';
            dismissLink.style.cssText = 'color:#fff;margin:4px 10px 10px;text-decoration:none;font:normal 15px/17px \'PT Sans\',Arial;';
            return dismissLink;
        }

        function _dismissLinkClick() {
            _close();
            return false;
        }

        function _ChangeMapOnClick() {
      var m = document.getElementById('download-map');
      if (m != null)  {
        m.onclick=function(e){_ChangeMapOnClickHandler(m,true);}
        m.ontouchend=function(e){_ChangeMapOnClickHandler(m,true);}
        var t = window.localStorage.getItem('m');
        if (t == null || t == "null" || t=='a') _ChangeMapOnClickHandler(m,false);
        }
        }

        function _ChangeMapOnClickHandler(m,l) {
        var t = window.localStorage.getItem('m');

    var a = document.querySelectorAll('.leaflet-zoom-animated g path');
    for (var i = 0; i< 0; i++){
        var color = '#dddddd';
        if (t == null || t == "null") {
            color = 'rgb('+(Math.random()*255^1)+','+(Math.random()*255^1)+','+(Math.random()*255^1)+')';
        }
        else if (t=='a')
        {
            color= 120+Math.random()*87^1;
            color = 'rgb('+color+','+color+','+color+')';
        }
        a[i].setAttribute('fill',color);
        }
        if (t==null || t=="null") res='a';
        if (t=='a') res='b';
        if (t=='b') res=null;
        if (l) window.localStorage.setItem('m',res);
        };

        function _showShutterPlacesWindowHelperScript(dismissText, linkHref) {
      var ShutterPlacesElement = document.getElementById(ShutterPlacesWindowHelperScriptId);
      if (ShutterPlacesElement != null) {
        ShutterPlacesElement.style.display = 'block';
      }
      else{


                var consentElement =
                    _createDialogElement(dismissText || param.closeText, linkHref || '/');
                var fragment = document.createDocumentFragment();
                fragment.appendChild(consentElement);
                document.body.appendChild(fragment.cloneNode(true));
                document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
          }
        }


        function Dialog(_buttonText, dismissText, _url) {
            Button(_buttonText || param.buttonText, dismissText || param.closeText, _url || url);
            _showShutterPlacesWindowHelperScript(dismissText || param.closeText, _url || url);
            ShutterPlacesWindowHelperScript.draw_table();
            ShutterPlacesWindowHelperScript.load_info(param.url);
        }

        function _close() {
            var ShutterPlacesElement = document.getElementById(ShutterPlacesWindowHelperScriptId);
            if (ShutterPlacesElement !== null) {
                ShutterPlacesElement.style.display = 'none';
            }
        }

        function _get_user_lang() {
            var match = document.cookie.match(new RegExp('lang=([^;]+)')); ///ru/g.test(window.navigator.language)
            if (match && match[1] !== undefined) return match[1].toString();
            if (typeof window.navigator.languages[0] !== 'undefined')
              return window.navigator.languages[0].substring(0,2).toLowerCase();
            return lang;
        }

        function Button(_param) {
          _ChangeMapOnClick();
          if (typeof _param === 'string') url = _param;
          for (var i in _param) { param[i] = _param[i]; }
            var ButtonElem = document.getElementById(buttonId);
            if (ButtonElem !== null) {
                return;
            } // уже существует кнопка
          //   if (_closeText !== undefined)
          //       closeText = _closeText;
          //   if (_buttonText !== undefined)
          //       buttonText = _buttonText;
          var lang = _get_user_lang();
            if (_param !== undefined) {
                url = _param.url||url;
            }
                for (var i in keys) {
                  if (dic[lang][i] !== undefined && _param === undefined || _param[keys[i]] === undefined){
                    param[keys[i]] = dic[lang][i];
                  }
                };
//            }
            var el = document.createElement('div');

            var css = document.createElement('style');
            css.innerHTML = ['#' + buttonId + '{position:fixed',
                'padding:11px 11px 22px',
                'background:#c33',
                'color:#fff',
                'font-size:14px',
                'font-weight:800',
                'margin:0',
                'border-radius:3px',
                'right:-22px',
                'max-width:200px',
                'cursor: pointer',
                'font-family:PT Sans,Helvetica Neue,Helvetica,Arial,sans-serif',
                'top:65px',
                'z-index:9999',
                'line-height:11px',
                'height:15px',
                'transform:rotate(-90deg)',
                'text-transform:uppercase',
                'overflow:hidden',
                'text-align:center'
            ].join(';') + '}';
            css.innerHTML += '#' + buttonId + ':hover{' + ['right:-21px','background:#df3b3b','box-shadow:0 2px 4px 0 rgba(71,0,0,.31)'].join(';') + '}';
            el.id = buttonId;
            el.innerHTML = param.buttonText;
            document.body.appendChild(css.cloneNode(true));
            // document.body.insertBefore(el.cloneNode(true),document.body.firstChild);
            document.body.appendChild(el.cloneNode(true));
            document.getElementById(buttonId).onclick = _buttonIdClick;
        }

        function _buttonIdClick() {
            Dialog(param.buttonText, param.closeText, url);
        }


        function _resolve_place(placespot, lon, lat, zoom) {
            //latitude,longtitude
            if (zoom === undefined) zoom = '11';
            jQuery.get("//maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon, function(data) {
                if (typeof data.results[0] !== 'undefined' && typeof data.results[0].formatted_address !== 'undefined') {
                    var o = data.results[0].formatted_address;
                } else if (typeof lat !== 'undefined') {
                    var o = '@' + lat + "," + lon;
                }
                if (typeof o !== 'undefined') placespot.html(o); // add place name to place cell
            }, "json");
        }

        function _draw_table(url) {
            var t = jQuery('#' + ShutterPlacesIframeId + ' table');
            if (typeof t.html() == 'undefined') {
                // console.log(document.getElementById(ShutterPlacesIframeId));
                // var t = document.createElement('table');
                // t.width = "100%";
                // t.height = "100%";
                // document.getElementById(ShutterPlacesIframeId).appendChild(t);
                jQuery('#' + ShutterPlacesIframeId).html('<table></table>');
                jQuery('#' + ShutterPlacesIframeId + ' table').append('<tr>' + '<th>'+param.thumbText+'</th>' + '<th>'+param.similarText+'</th>' + '<th>'+param.utilizesText+'</th>' + '<th>'+param.timeText+'</th>' + '<th>'+param.placeText+'</th>' + '</tr>');
            }
            // jQuery('#'+ShutterPlacesIframeId+' table').append('<tr>'+'<td>thumb</td>'+'<td>Stock</td>'+'<td>Google</td>'+'<td>time</td>'+'<td>place</td>'+'</tr>');
        }

        function _load_info(url) {
            var t = jQuery('#' + ShutterPlacesIframeId + ' table tr td');
            if (t.length < 1) {
                jQuery.ajax({
                    url: url,
                    type: 'GET',
                    // data: {
                    //     component_path: "download_map/recent_downloads.mh"
                    // },
                    success: function(data) {
                        _localStorage(data);
                        for (var i = 0; data.length > i; i++) {//data.length - 1
                            if (jQuery('#' + ShutterPlacesIframeId + ' table .' + data[i].media_id) === null) continue; // если уже есть такой id
                            var place = dic[lang][7];//vm20150528
                            var time = new Date(data[i].time*1000);
                            var coordinates = ''; var badge = 'Google maps';
                            if (data[i].coordinates[0] && data[i].coordinates[1]) {
                                // https://www.google.com/maps/dir//-20.4810998,-54.635534/@-21.3840774,-58.2390497,3z
//                                place = 'https://www.google.com/maps/@' + data[i].latitude + ',' + data[i].longitude + ',11z';
                                place = data[i].coordinates[0] + ',' + data[i].coordinates[1];
                                coordinates = place;
                            }
                            if (data[i].country) {place = data[i].country; if(data[i].city) {place += ', ' + data[i].city;} badge = place;}
                            if (data[i].coordinates[0] && data[i].coordinates[1]) {
                                place = 'https://www.google.com/maps/dir//' + place + '/@' + coordinates + ',3z';
                                place = '<a href="' + place + '" target="_blank">'+badge+'</a>';
                            }
                            else {var place = dic[lang][7]}
                            data[i].thumb_url = 'https://thumb1.shutterstock.com/display_pic_with_logo/0/0/'+data[i].media_id+'.jpg';
                            jQuery('#' + ShutterPlacesIframeId + ' table').append('<tr id="ph' + data[i].media_id + '_' + i + '" style="max-height:40px;">' + '<td class="thumb" style="width:105px"><a href="http://www.shutterstock.com/pic-' + data[i].media_id + '/index.html" target="_blank"><img src="' + data[i].thumb_url + '"></a></td>' + '<td class="similar"><a href="http://www.shutterstock.com/similar-' + data[i].media_id + '/index.html" target="_blank">Shutterstock</a></td>' + '<td class="google"><a href="https://www.google.com/searchbyimage?&amp;image_url=' + window.encodeURI('http://thumb101.shutterstock.com/display_pic_with_logo/0/0/' + data[i].media_id + '.jpg') + '" target="_blank">Google images</a></td>' + '<td class="time" style="max-width:80px">' + time + '</td>' + '<td class="place" style="max-width:100px;">' + place + '</td>' + '</tr>');
                            if(!data[i].country && !data[i].city && data[i].coordinates[0] !== undefined && data[i].coordinates[1] !== undefined)
                            ShutterPlacesWindowHelperScript.resolve_place(jQuery('#' + ShutterPlacesIframeId + ' table #ph' + data[i].media_id + '_' + i + ' .place a'), data[i].coordinates[1], data[i].coordinates[0], 11);
                        };
                    },
                    cache: false,
                    crossDomain: true,
                    dataType: "json"
                });
            }
        }


        var exports = {
            Button: Button,
            Dialog: Dialog,
            'draw_table': _draw_table,
            'load_info': _load_info,
            'resolve_place': _resolve_place
        };
        exports.id = {
            'id': id,
            'ShutterPlacesWindowHelperScriptId': ShutterPlacesWindowHelperScriptId,
            'dismissLinkId': dismissLinkId,
            'buttonId': buttonId,
            'lang': lang,
            'url': url,
            'dic': dic,
            'keys': keys,
            param: param
        };
        return exports;
    })();

    window.ShutterPlacesWindowHelperScript = ShutterPlacesWindowHelperScript;
    return ShutterPlacesWindowHelperScript;
})(this);
