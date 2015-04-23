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
	s.internas = results.interna;
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

	this.set_data_active = set_data_active;
};

ElecionesApp.prototype.reset = function (){
	// resetea el los filtros
	$("#selected h4").hide().html("");
	this.draw_ul_list();
	this.remove_comuna_active_path();
	this.q.kill("comuna");
};

ElecionesApp.prototype.get_max_obj = function(arr, key){ 
	
	var max = arr.map(function(x){ return x[key]; });
	return Math.max.apply(null, max); 
};

ElecionesApp.prototype.sort_obj = function(arr, key){ 
	function compare(a,b) {
	  if (a[key] > b[key])
	     return -1;
	  if (a[key] < b[key])
	    return 1;
	  return 0;
	}
	return arr.sort(compare);
};

ElecionesApp.prototype.draw_ul_list = function(data){ // si no viene data, escribe la general
	
	var is_comuna = false;
	if(!data){
		data = this.r_general.total;
	}else{
		is_comuna = true;
	}
	this.sort_obj(data, 'porcentaje');
	var max = data.map(function(x){ return x.porcentaje; }); 
	var l = {
		data : data,
		is_comuna: is_comuna,
		max : this.get_max_obj(data, "porcentaje")
	};

	this.cont_results.html(this.tmpl_li_partido(l));
	if(is_comuna){ $(".help_text, #line").hide();}else{$(".help_text, #line").show();}

// start niceScroll
	this.start_niceScroll("#list");

};


ElecionesApp.prototype.draw_x_interna = function(val){
	
	var s = this;

	var d = this.internas;
	console.log(this);
	s.cont_results.html(this.tmpl_x_interna(d));

// bind events for inputs
	var candidato_btn = $('input[type="radio"]');
	candidato_btn.on('click.select_condidato', function(el){
		var $el = $(this);
		$('li.active:has(input)').removeClass('active');
		$el.closest('li').addClass('active');

		s.set_data_active(this.value);
		s.q.set("candidato", this.value);
	});

// start niceScroll
	s.start_niceScroll();
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

	$('#ayud1').hide();
	$('.compartir').show();

	if(x_fuerza == val){
		this.draw_ul_list();
	}else{
		this.draw_x_interna(val);
	}
	// set path
	this.q.set('fuerza', val);
};

ElecionesApp.prototype.q = new PermanentLinkJS();

ElecionesApp.prototype.start_niceScroll = function(selector){
	$(selector).niceScroll({
		cursorcolor:"#d7d7d7",
		cursorborder:"0px solid #fff",
		cursorwidth: "7px",
		autohidemode:false,
		hidecursordelay:0
	});
};

ElecionesApp.prototype.barios_x_com = {
	  "c1": "Recoleta",
	  "c2": "Palermo",
	  "c3": "Barracas, Boca, Nueva Pompeya, Parque Patricios ",
	  "c4": "Constitución, Monserrat, Puerto Madero, Retiro, San Nicolás, San Telmo",
	  "c5": "Belgrano, Colegiales, Nuñez",
	  "c6": "Almagro, Boedo",
	  "c7": "Caballito",
	  "c8": "Flores, Parque Chacabuco",
	  "c9": "Liniers, Mataderos, Parque Avellaneda",
	  "c10": "Floresta, Monte Castro, Velez Sarsfield, Versalles, Villa Luro, Villa Real",
	  "c11": "Villa Del Parque, Villa  Devoto, Villa Gral. Mitre, Villa Santa Rita",
	  "c12": "Coghlan, Saavedra, Villa Pueyrredón, Villa Urquiza",
	  "c13": "Balvanera, San Cristobal",
	  "c14": "Agronomía, Chacarita,  Parque Chas,  Paternal, Villa Crespo, Villa Ortuzar",
	  "c15": "Villa Lugano, Villa Riachuelo, Villa Soldati"
	};