/*

■説明
Wiki

■使い方

*/

(function(window) {

//----------------------------------------------------------------------
	
function Wiki() {
	//alert("Wiki");
	this.init();
}
var p = Wiki.prototype;

//----------------------------------------------------------------------
//----------------------------------------------------------------------
	
// public properties:

p.id = -1;
p.area = '';
p.url = '';
p.url_data = '';
p.xmlData = null;
p.listeners = null;
p.content = null;

// constructor:

p.init = function() {
	p.listeners = [];
}
	
// public methods:

p.load = function(url) {
	p.addLoader(true);
	p.url = url;
	
	var key = url.slice(url.indexOf("/wiki/")+6);
	url = 'http://ja.wikipedia.org/wiki/Special:Export/' + key;
	p.url_data = url;
	
	$.ajaxSettings.cache = true;
	$.getJSON('http://query.yahooapis.com/v1/public/yql?callback=?', {
		'q' : 'select * from xml where url = \''+p.url_data + '\'',
		'format' : 'json'
	}, function(xml) {
		if (xml.query.count == 0) alert("no xml");
		p.xmlData = xml;
		//p.content = new String(p.xmlData.query.results.mediawiki.page.revision.text.content);
		p.content = p.xmlData.query.results.mediawiki.page.revision.text.content;
		
		p.onLoadXml();
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
		$(listener).trigger("load", p.content);
	}
}


p.replaceSummary = function(content, count) {
	//不要文字削除、置き換えフェーズ
	content = content.replaceAll(' = ','=');
	content = content.replaceAll('[[','');
	content = content.replaceAll(']]','');
	content = content.replaceAll('{{','');
	content = content.replaceAll('}}','');
	content = content.replaceAll('\'\'\'','');
	content = content.replaceAll('\'\'','');
	content = content.substring(0, count);
	content += '...';
	content += ' (<a href="'+p.url+'" target="_blank">via wikipedia</a>)';
	
	return content;
}


// private methods:

p.addLoader = function(bo) {
	if (p.listeners == null) { return; };
	if (p.listeners.length == 0) { return; };
	p.area = p.listeners[0];
	if(bo == true){
		$(p.area).append('<div>loading...</div>');
		$(p.area).animate( {opacity:0}, 0, function(){$(this).animate( {opacity:1}, 300 )});
	} else {
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

window.Wiki = Wiki;
}(window));


//全文置換を追加
String.prototype.replaceAll = function (org, dest){  
  return this.split(org).join(dest);  
}



