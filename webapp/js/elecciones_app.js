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
var ElecionesApp = function(list_partidos, results){
	"use strict";
	// set self class var
	var s = this;
	s.list_partidos = list_partidos;
	s.r_general = results.general;
	s.comuna_active_path = null;
	// s.r_internas = results.inernas;

	function set_data_active(str){
		$("#selected h4").html(str).fadeIn();
	}


	function select_comuna(polygon){
		var id = polygon.id.replace(/c/i, "");
		var com_name = "Comuna "+ id;
		set_data_active(com_name);
		
		// set polygon active
		// var bbox = polygon.getBBox();
		// console.log(bbox.x);
		// $("svg").css("transform", "translateX("+bbox.x+"px) translateY("+bbox.x+"px) scale(2)")
		s.remove_comuna_active_path();
		s.comuna_active_path = $(polygon).clone();
		s.comuna_active_path.attr("class","comuna_active_path");
		$("svg").append(s.comuna_active_path);
		s.q.set("comuna", id);
		// lista de partidos x comuna
		// console.log(s.r_general.comunas['comuna_'+id]);
		s.draw_ul_list(s.r_general.comunas['comuna_'+id]);

	}


	(function init(){
			// bind events
			var candidato_btn = $('input[type="radio"]');
			candidato_btn.on('click.select_condidato', function(el){
				var $el = $(this);
				$('li.active:has(input)').removeClass('active');
				$el.closest('li').addClass('active');

				set_data_active(this.value);
				s.q.set("candidato", this.value);

			});

			// change dropdown
			$('select#opts').change(function(e){
				s.change_dropdown($(this).val());
			});

			
			// template para el select de internas
			s.tmpl_opts = Handlebars.compile($('#tmpl_opts').html());
			$("#opts").html( s.tmpl_opts(s.list_partidos) );
			
			
			// template para listado de resultados por partido
			s.cont_results = $("#results"); // contenedor ul para los partidos (barras)  
			s.tmpl_li_partido = Handlebars.compile($('#tmpl_li_partido').html());
			s.tmpl_x_interna = Handlebars.compile($('#tmpl_x_interna').html());
			
			s.draw_ul_list();


			// template tooltip
			s.tooltip = $("#tooltip"); // contenedor ul para los partidos (barras)  
			s.tmpl_tooltip = Handlebars.compile($('#tmpl_tooltip').html());

			// click mapa
			$('polygon, path').on('click.on_comuna', function(e){
				select_comuna(this);
			});

			tooltip(); // esta en scripts.js
	})();

	// init();
};

ElecionesApp.prototype.reset = function (){
	// resetea el los filtros
	$("#selected h4").hide().html("");
	this.draw_ul_list();
	this.remove_comuna_active_path();
	this.q.kill("comuna");
};

ElecionesApp.prototype.barios_x_com = {
	'c1':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c2':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c3':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c4':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c5':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c6':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c7':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c8':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c9':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c10':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c11':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c12':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c13':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c14':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar.",
	'c15':"Agronomia, Chacarita, Paternal, Parque Chas, Villa Crespo, Villa Ortuzar."
};



ElecionesApp.prototype.draw_ul_list = function(data){
	if(!data){
		data = this.r_general.total;
	}
	this.cont_results.html(this.tmpl_li_partido(data));
};


ElecionesApp.prototype.draw_x_interna = function(data){
	// if(!data){
	// 	data = this.r_general.total;
	// }
	this.cont_results.html(this.tmpl_x_interna());
};



ElecionesApp.prototype.draw_tooltip = function(data){
	this.tooltip.html(this.tmpl_tooltip(data));
};

ElecionesApp.prototype.remove_comuna_active_path = function(){
	if(this.comuna_active_path){	
		this.comuna_active_path.remove();
	}

};

ElecionesApp.prototype.change_dropdown = function(val){
	var x_fuerza = 'x_fuerza';
	// if(x_fuerza == val){
	// 	$('#x_interna').hide();
	// 	$('#x_fuerza').show();
	// }else{
	// 	$('#x_fuerza').hide();
	// 	$('#x_interna').show();
	// }

	if(x_fuerza == val){
		this.draw_ul_list();
	}else{
		this.draw_x_interna();
	}
	// set path
	this.q.set('fuerza', val);
};

ElecionesApp.prototype.q = new PermanentLinkJS();