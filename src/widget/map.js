/**
 * Map widget
 * 
 * @author Benjamin Dezile
 * @date July 7, 2012
 */  

$.widget("ui.map", {
	
	map: null,
	shapes: {},
	
	_init: function(){
		if (!this.options.ns) {
			throw "Map namespace required";
		}
		this.make();
	},
	
	_ensureInit: function() {
		if (!this.map) {
			throw "No map found (call make first)";
		}
	},
	
	ns: function() {
		return this.options.ns;
	},
	
	m: function() {
		return this.map;
	},
	
	make: function(options) {
		var m = this.options.ns;
		var opts = {
			zoom: 4,
		    mapTypeControl: false,
		  	panControl: false,
		  	zoomControl: false,
		  	scaleControl: false,
		  	streetViewControl: false,
		  	center: this.options.center ? new m.LatLng(this.options.center[0], this.options.center[1]) : new m.LatLng(37.0, -97.0),
		  	mapTypeId: m.MapTypeId.ROADMAP
		};
		if (this.options.options) {
			for (var k in this.options.options) {
				opts[k] = this.options.options[k];
			}
		}
		if (options) {
			for (var k in options) {
				opts[k] = options[k];
			}
		}
		this.map = new m.Map(this.element[0], opts);
	},
	
	setCenter: function(point) {
		var m = this.options.ns;
		this.map.setCenter(new m.LatLng(point[0], point[1]));
	},
	
	addMarker: function(pos, drop, extraParams) {
		this._ensureInit();
		var m = this.options.ns;
		var options = {
			position: new m.LatLng(pos[0], pos[1]),
			map: this.map
		};
		if (extraParams) {
			for (var k in extraParams) {
				options[k] = extraParams[k];
			}
		}
		if (drop == true) {
			options['animation'] = m.Animation.DROP;
		}
		return new m.Marker(options);
	},
	
	addShape: function(points, extraParams) {
		var m = this.options.ns;
		var options = {
			paths: $.map(points, function(v,i){
				return new m.LatLng(v[0],v[1]);
			}),
			map: this.map
		};
		if (extraParams) {
			for (var k in extraParams) {
				options[k] = extraParams[k];
			}
		}
		return new google.maps.Polygon(options);
	},
	
	clear: function() {
		this._ensureInit();
		if (this.map.clearOverlays) { 
			this.map.clearOverlays();
		}
	}
		
});