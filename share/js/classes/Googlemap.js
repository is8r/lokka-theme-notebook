/*

//version
1.1

//discription
Googlemapを簡易的に使うクラス。
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

//howtouse
	//googlemap
	var _gm;
	$(document).ready(function(){
		_gm = new Googlemap('#googlemaps');
		_gm.showMap(-14.692284,-75.149188,20);
	});

//残り作業
・吹出しつけたり

*/

(function(window) {

//----------------------------------------------------------------------
	
function Googlemap(area) {
  alert("Googlemap");
  this.init(area);
};

var p = Googlemap.prototype;

//----------------------------------------------------------------------
//----------------------------------------------------------------------
	
// public properties:

p.id = -1;//クラス自体のカウントの為のId
p.nowId = -1;//クラス内での現在の表示用Id
p.area = '';//html上で表示させるdivの名前

//
p.mode = google.maps.MapTypeId.HYBRID;
//google.maps.MapTypeId.HYBRID//このマップ タイプは、航空写真上に主要な道路の透明なレイヤを表示します。
//google.maps.MapTypeId.ROADMAP//このマップ タイプは通常の市街地図を表示します。
//google.maps.MapTypeId.SATELLITE//このマップ タイプは航空写真を表示します。
//google.maps.MapTypeId.TERRAIN//このマップ タイプは地形や樹木などの地形的特徴を持つ地図を表示します。

p.map = null;
p.point = null;
p.markers = [];

// constructor:

p.init = function(area) {
	p.area = area;
	p.addMap(0,0,1);
};
	
// public methods:

p.showMap = function(x,y,z) {
	p.addMap(x,y,z);
	p.addMarker(x,y,z);
};

p.addMap = function(x,y,z) {
	
	var latlng = new google.maps.LatLng(x,y);
	
	var option = {
		zoom : z,
		center : latlng,
		mapTypeId: p.mode,
		mapTypeControl : false,
		//mapTypeControlOptions : {
		//	style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
		//},
		navigationControl : true,
		navigationControlOptions : {
			position : google.maps.ControlPosition.TOP_RIGHT,
			style : google.maps.NavigationControlStyle.SMALL
		},
		scaleControl : false
		//scaleControlOptions : {
		//	position : google.maps.ControlPosition.BOTTOM_RIGHT,
		//	style : google.maps.ScaleControlStyle.DEFAULT
		//}
	};
	
	p.map = new google.maps.Map($(p.area).get(0), option);
};

p.addMarker = function(x,y,z) {

	var latlng = new google.maps.LatLng(x,y);
	var clickedLocation = new google.maps.LatLng(latlng);
	var marker = new google.maps.Marker({
		position: latlng, 
		map: p.map
	});
	var id = p.markers.length;
	p.markers.push({marker:marker, z:z, id:id});
	
	
	google.maps.event.addListener(marker, 'click', function(e) {
		//p.addInfo(id);
		//p.viewDetail(id);
	});
};
p.addMarkers = function(ar) {
	var l = ar.length;
	for (var i=0; i<l; i++) {
		var point = ar[i];
		if (point == null) { continue; }
		p.addMarker(ar[i].x, ar[i].y, ar[i].z);
	}
};

p.addInfo = function(html) {
	var marker = p.markers[id].marker;
	var infoWindow = new google.maps.InfoWindow(); 
	infoWindow.setContent(html); 
	//infoWindow.open(p.map, marker);
};

//
p.viewDetail = function(id) {
	p.nowId = id;
	var marker = p.markers[id].marker;
	p.map.setZoom(p.markers[id].z);
	
	var latlng = marker.getPosition();
	var latlng2 = new google.maps.LatLng(latlng.x,latlng.y);
	p.map.panTo(latlng2);
	
	//
	p.dispatch();
};

//
p.createLinks = function() {
	//gmlink
	$('.gmlink').each(function(i){
		$(this).click(function() {
			//alert($(this).attr('rel'));
			p.viewDetail(parseInt($(this).attr('rel')));
		});
	});
};

p.slide = function(n) {
	p.nowId += n;
	
	if(p.nowId < 0) p.nowId = p.markers.length-1;
	if(p.nowId > p.markers.length-1) p.nowId = 0;
	
	p.viewDetail(p.nowId);
};

//----------------------------------------------------------------------

// listners

p.listeners = [];

p.addListener = function(o, fnc) {
	$(o).bind("detail", fnc);
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
p.dispatch = function() {
	var l = p.listeners.length;
	for (var i=0; i<l; i++) {
		var listener = p.listeners[i];
		if (listener == null) { continue; }
		$(listener).trigger("detail", p.nowId);
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------

window.Googlemap = Googlemap;
}(window));


/*
	//ドラッグ操作を有効にする。
	p.map.setDraggingEnabled(true);
	//ダブルクリックしたときにその場所にズームイン。
	p.map.setDoubleClickZoomEnabled(true);
	//マウスのホイールによる拡大/縮小の操作を有効にする。
	p.map.setScrollWheelZoomEnabled(true);
*/

