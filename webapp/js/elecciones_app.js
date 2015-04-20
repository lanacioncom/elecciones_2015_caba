var PermanentLinkJS = function() {
	"use strict";

	var query = {};

	function reset(){ query = {}; }

	function set(key, val) {
		query[key] = val;
		set_path();
	}
	
	function get_parameters(str) {
		str = str || location.hash;
		return str.replace("#", "").split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this;}.bind({}))[0];
	}

	function set_from_location(){
		query = get_parameters();
	}

	function kill(k){ 
		delete query[k]; 
		set_path();
	}

	function to_string(o){
		var s = [];
		for(var k in o){
			s.push([k, o[k]].join("="));
		}
		return s.join("&");
	}

	function set_path(q) {
		q = q || query;
		location.hash = to_string(q);
	}

	this.get_query = function() { return query; };
	
	this.reset = reset;
	this.get_parameters = get_parameters;
	this.to_string = to_string;
	this.set_path = set_path;
	this.set = set;
	this.kill = kill;
	this.set_from_location = set_from_location;
};


// Elecciones class
var ElecionesApp = function(){
	"use strict";
	
	var s = this;

	(function init(){
			// bind events
			s.$radio = $('input[type="radio"]'); 
	
	})();

	// init();
};

ElecionesApp.prototype.none = function (el){
		$(el).fadeOut();
};


ElecionesApp.prototype.change_dropdown = function(val){
	var x_fuerza = 'x_fuerza';
	if(x_fuerza == val){
		$('#x_interna').hide();
		$('#x_fuerza').show();
	}else{
		$('#x_fuerza').hide();
		$('#x_interna').show();
	}
	// set path
	this.q.set('fuerza', val);
};

ElecionesApp.prototype.q = new PermanentLinkJS();