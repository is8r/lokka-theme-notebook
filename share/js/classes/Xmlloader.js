/*

■説明
Xmlloader

■使い方
	//xmlloader
	$(document).ready(function(){
		var _loader = new Xmlloader();
		_loader.addListener('#xmlloader' ,function onLoad(e, xml){
			//alert($(xml).find('item').length);
			$(xml).find('item').each(function(i){
				$('#xmlloader').append($(this).find('title').text() + ', ');
			});
		});
		_loader.load('banner/banner.xml');
	});

*/

(function(window) {

//----------------------------------------------------------------------
	
function Xmlloader() {
  //alert("Xmlloader");
  this.init();
}
var p = Xmlloader.prototype;

//----------------------------------------------------------------------
//----------------------------------------------------------------------
	
// public properties:

p.id = -1;
p.area = '';
p.url = '';
p.xmlData = null;
p.listeners = null;

// constructor:

p.init = function() {
	p.listeners = [];
}
	
// public methods:

p.load = function(url) {
	p.addLoader(true);
	
	p.url = url;
	$.ajax({
		url: p.url,
		async: true,
		cache: false,
		contentType: "text/xml; charset=utf-8",
		dataType: "xml",
		success: function(xml){
			p.xmlData = xml;
			p.onLoadXml();
		},
		error: function(){
			alert('error');
		}
	});
}
p.onLoadXml = function() {
	p.addLoader(false);
}
p.dispatch = function() {
	var l = p.listeners.length;
	for (var i=0; i<l; i++) {
		var listener = p.listeners[i];
		if (listener == null) { continue; }
		$(listener).trigger("load", p.xmlData);
	}
}


// private methods:

p.addLoader = function(bo) {
	if (p.listeners == null) { return; };
	if (p.listeners.length == 0) { return; };
	p.area = p.listeners[0];
	if(bo == true){
		$(p.area).append('<img src="./share/images/ajax-loader.gif">');
		$(p.area).animate( {opacity:0}, 0, function(){$(this).animate( {opacity:1}, 300 )});
	} else {
		//$(p.area).animate( {opacity:0}, 300, function(){$(this).empty(); p.dispatch()});
		$(p.area).animate( {opacity:0}, 300, function(){
			$(this).empty();
			$(this).css({opacity:1});
			p.dispatch();
		});
	}
}

// listners

p.addListener = function(o, fnc) {
	$(o).bind("load", fnc);
	p.listeners.push(o);
}
p.removeListener = function(o) {
	if (p.listeners == null) { return; }
	var index = p.listeners.indexOf(o);
	if (index != -1) {
		p.listeners.splice(index,1);
	}
}
p.removeAllListeners = function() {
	p.listeners = [];
}


//----------------------------------------------------------------------
//----------------------------------------------------------------------

window.Xmlloader = Xmlloader;
}(window));





