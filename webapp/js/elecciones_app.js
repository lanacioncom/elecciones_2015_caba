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
		return (query = get_parameters());
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


// Elecciones class
var ElecionesApp = function(list_partidos){
	"use strict";
	// set self class var
	var s = this;
	s.list_partidos = list_partidos;

	function set_data_active(str){
		$("#selected h4").html(str).fadeIn();
	}

	function select_comuna(id){
		var com_name = "Comuna "+id.replace(/c/i, "");
		set_data_active(com_name);
		s.q.set("comuna", id);
	}


	(function init(){
			// bind events
			var candidato_btn = $('input[type="radio"]');
			candidato_btn.on('click.select_condidato', function(el){
				var $el = $(this);
				$('li.active:has(input)').removeClass('active');
				$el.closest('li').addClass('active');

				set_data_active(this.value);

			});

			// change dropdown
			$('select#opts').change(function(e){
				s.change_dropdown($(this).val());
			});

			// template para el select de internas
			s.tmpl_opts = Handlebars.compile($('#tmpl_opts').html());
			$("#opts").html( s.tmpl_opts(s.list_partidos) );
			

			// click mapa
			$('polygon').on('click.on_comuna', function(e){
				select_comuna(this.id);
			});

			tooltip(); // esta en scripts.js
	})();

	// init();
};

ElecionesApp.prototype.reset = function (){
	// resetea el los filtros
	$("#selected h4").html("").fadeOut();
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