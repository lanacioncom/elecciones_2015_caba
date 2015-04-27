var PermanentLinkJS = function() {
	"use strict";

	var query = {};

	function reset(){ 
		query = {};
		set_hash();
		return query;
	}

	function set(key, val) {
		if (typeof key == 'object'){
			try{
				for (var k in key){
					query[k] = key[k];	
				}
			}catch(err){
				console.error("Error set query: %s", err.message);
			}
		}else{
			try{
				query[key] = val;
				set_hash();
			}catch(err){
				console.error("Error set query: %s", err.message);
			}
		}
		return query;
	}
	
	function get_parameters(str) {
		str = str || location.hash;
		return str.replace("#", "").split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this;}.bind({}))[0];
	}

	function set_from_location(){
		query = get_parameters();
		return (query);
	}

	function kill(k){ 
		delete query[k]; 
		set_hash();
		return query;
	}

	function to_string(o){
		var s = [];
		for(var k in o){
			s.push([k, o[k]].join("="));
		}
		return s.join("&");
	}

	function set_hash(q) {
		q = typeof q == "string" ? q : to_string(q || query);
		try{
			return (location.hash = q);
		}catch(err){
			console.error("Error set_hash: %s", err.message);
		}
	}

	this.get_query = function() { return query; };
	
	this.reset = reset;
	this.get_parameters = get_parameters;
	this.to_string = to_string;
	this.set_hash = set_hash;
	this.set = set;
	this.kill = kill;
	this.set_from_location = set_from_location;
};

