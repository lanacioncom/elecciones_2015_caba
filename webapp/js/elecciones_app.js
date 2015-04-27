// Elecciones class
var ElecionesApp = function(dict_partidos, dict_candidatos, results, path_to_data){
	"use strict";
	// set self class var
	var s = this;
	s.dict_partidos = dict_partidos;
	s.dict_candidatos = dict_candidatos;
	s.path_to_data = path_to_data;
	
	// data dinamica
	s.r_general = results;
	s.internas = results.interna;
	s.comuna_active_path = null;
	s.filtro_home = "00"; // filtro seteado por default
	s.filtro_activo = "00";
	// s.r_internas = results.inernas;
	
	function set_data_active(str){
		$("#selected h4").html(str).fadeIn();
	}


	(function init(){
		
		// bind events

		// change dropdown
		$('select#opts').change(function(e){
			s.change_dropdown($(this).val());
		});
		$('h3').on('click', function(){ // volver a la home 
			s.filtro_activo = s.filtro_home;
			s.reset();
			$('select#opts').select2("val", s.filtro_home);
		});
		
		// template para el select de internas
		s.tmpl_opts = Handlebars.compile($('#tmpl_opts').html());
		$("#opts").html( s.tmpl_opts(s.dict_partidos) );
		
		// template para listado de resultados por partido
		s.cont_results = $("#results"); // contenedor ul para los partidos (barras)  
		s.tmpl_li_partido = Handlebars.compile($('#tmpl_li_partido').html());
		s.tmpl_x_interna = Handlebars.compile($('#tmpl_x_interna').html());
		
		// get query string
		
		s.start_app();
		s.get_mesas_escrutadas();

		// template tooltip
		s.tooltip = $("#tooltip"); // contenedor ul para los partidos (barras)  
		s.tmpl_tooltip = Handlebars.compile($('#tmpl_tooltip').html());
		s.tmpl_tooltip_interna = Handlebars.compile($('#tmpl_tooltip_interna').html());

		s.on_click_comuna();
		
// ***********
		tooltip(); // esta en scripts.js
		// setInterval(function(){s.reload_app();}, 6000);

	})();

	this.set_data_active = set_data_active;
};



ElecionesApp.prototype.cache_ajax = {};

ElecionesApp.prototype.reset_cache_ajax = function(){
	this.cache_ajax = {};
};

ElecionesApp.prototype.reload_app = function(){
	var s = this;
	s.get_r_general(function(){
		s.start_app();
		s.get_mesas_escrutadas();
		$('select#opts').select2("val", "16");
	});

};

ElecionesApp.prototype.start_app = function(){
	var s = this;
	s.q.set_from_location();
	
	var q = $.extend(true, {}, s.q.get_query());
	
	s.reset_cache_ajax();
	
	s.filtro_activo = q.fuerza || s.filtro_home;
	
	s.change_dropdown(s.filtro_activo, q.comuna);

	if(q.comuna){
		$("#selected h4").html("Comuna "+q.comuna).fadeIn();
	}
	
};

ElecionesApp.prototype.get_r_general = function(callback){
	var s = this; 
	$.get(s.path_to_data+"partido_00.json", function(results){
		s.r_general = results;
		
		if(callback){callback();}
	});
};

ElecionesApp.prototype.get_mesas_escrutadas = function(callback){
	var s = this; 
	$.get(s.path_to_data+"resumen.json", function(resumen){
		s.resumen = resumen;
		$('#mesas span').html(s.resumen.mp+'%');
		$('#votos span').html(s.resumen.vp+'%');
		$('#padron span').html((+s.resumen.e).format(0, ",", '.'));

		if(callback){callback();}
	});
};


ElecionesApp.prototype.draw_x_interna = function(val){ // recive el id del partido requerido
	var s = this;
	var key_cache = "partido_" + val;
	if(!s.cache_ajax[key_cache]){ // si no esta en cache lo va a buscar...
		
		$.get(s.path_to_data + key_cache + ".json", function(data){
			s.cache_ajax[key_cache] = data;
			s.run_interna(key_cache);
		});

	}else{	
			s.run_interna(key_cache);
	}

};


ElecionesApp.prototype.animate_barras = function(){
	$("#results .cont_barra .barra").each(function(i, el){
		var $el = $(this);
		$el.delay(500).animate({width: $el.data("width")}, {duration: 900, queue:false});
	});
};


ElecionesApp.prototype.get_ganadores_x_comuna = function(data){
	// toma todos los ganadores por comuna y pinta el mapa
	var s = this;
	s.ganadores_comunas = [];
	for (var com in data){
		if(!/c\_0{2}|r/i.test(com)){ // que no sea la comuna 00
			var i = 0;

			while(/BLC|NUL|REC|IMP/i.test(data[com][i].id)){
				i += 1;
				if(i>15){
					break;
				}
			}
			var c = data[com][i];
			c.comuna = com.replace(/\_0?/, "");
			s.ganadores_comunas.push(c);
		}
	}
	s.pintar_mapa();
};

ElecionesApp.prototype.select_comuna_interna = 	function(polygon){
	var s = this;

	var id = polygon.id.replace(/c/i, "");
	var com_name = "Comuna "+ id;
	s.set_data_active(com_name);
	
	var comuna = "c_"+(id < 10 ? "0"+(+id) : id);
	var key_cache = 'partido_'+ s.filtro_activo;
	s.run_interna(key_cache, comuna);

	s.q.set("comuna", id);
	s.set_comuna_active_path(polygon);

};


ElecionesApp.prototype.select_comuna_general = 	function(polygon){
	var s = this;

	var id = polygon.id.replace(/c/i, "");
	var com_name = "Comuna "+ id;
	s.set_data_active(com_name);

	s.set_comuna_active_path(polygon);

	s.q.set("comuna", id);

	// lista de partidos x comuna
	s.draw_ul_list(id);
};


ElecionesApp.prototype.on_click_comuna = function (){
	var s = this;
	// click mapa
	$('polygon, path').on('click', function(e){
		
		if(s.filtro_activo == s.filtro_home){ // dropdown x fuerza
			
			s.select_comuna_general(this);
		
		}else{ // dropdown x interna o listas únicas
			s.select_comuna_interna(this);

		
		}

	});
};


ElecionesApp.prototype.reset = function (){
	var s = this;
	// resetea el los filtros
	$("#selected h4").hide().html("");
	
	s.remove_comuna_active_path();
	if(this.filtro_activo == this.filtro_home){ // dropdown x fuerza
		// s.get_ganadores_x_comuna(s.r_general);
		s.draw_ul_list();
		s.q.kill("comuna");

	}else{ // dropdown x interna o listas únicas
		s.draw_x_interna(this.filtro_activo);

	}
	// clear radio btn
	$('li.candidato.active input').prop('checked', false);
	$('li.candidato.active').removeClass('active');
	
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

ElecionesApp.prototype.draw_ul_list = function(id, id_url){ // si no viene data, escribe la general
	this.get_ganadores_x_comuna(this.r_general);
	var is_comuna = false;
	var data;
	
	if(id_url){ 
		id = id_url;
		var c = document.getElementById("c"+id);
		this.set_comuna_active_path(c);
	}
	if(!id){
		data = this.r_general.c_00;
	}else{
		id = (id < 10) ? "0"+id: id; // make id for data
		data = this.r_general["c_"+id];
		is_comuna = true;
	}
	// this.sort_obj(data, 'p'); // ya viene ordenado
	var max = data.map(function(x){ return x.p; });
	var l = {
		data : data,
		dict_candidatos: this.dict_candidatos,
		dict_partidos: this.dict_partidos,
		is_comuna: is_comuna,
		max : this.get_max_obj(data, "p")
	};

	this.cont_results.html(this.tmpl_li_partido(l));
	this.animate_barras();

	if(is_comuna){ $(".help_text, #line").hide();}else{$(".help_text, #line").show();}

// start niceScroll
	this.start_niceScroll("#list");
	if(id_url){ 
		var comu = document.getElementById("c"+id);
		this.set_comuna_active_path(comu);
	}

};


ElecionesApp.prototype.run_interna = function(key_cache, comuna){
	var s = this;
	if(!comuna){ comuna = 'c_00';}

	var interna = s.cache_ajax[key_cache];

	var data = {
		interna: interna,
		comuna : interna[comuna],
		r : s.cache_ajax[key_cache].r,
		is_99: s.filtro_activo == "99",
		max: s.cache_ajax[key_cache][comuna][0].p,
		dict_candidatos: s.dict_candidatos
	};

	s.cont_results.html(s.tmpl_x_interna(data));
	s.get_ganadores_x_comuna(s.cache_ajax[key_cache]);
		
	s.animate_barras();
	
	// bind events for inputs
	var candidato_btn = $('input[type="radio"]');
	candidato_btn.on('click', function(el){
		var $el = $(this);
		$('li.active:has(input)').removeClass('active');
		$el.closest('li').addClass('active');

		s.set_data_active(this.value);
		s.q.set("candidato", this.value);
	});

	// start niceScroll
	s.start_niceScroll('#list_interna');
};

ElecionesApp.prototype.draw_tooltip = function(html){
	this.tooltip.html(html);
};

ElecionesApp.prototype.remove_comuna_active_path = function(){
	if(this.comuna_active_path){
		this.comuna_active_path.remove();
	}

};

ElecionesApp.prototype.set_comuna_active_path = function(polygon){
	this.remove_comuna_active_path();
	this.comuna_active_path = $(polygon).clone();
	this.comuna_active_path.attr("class","comuna_active_path");
	this.comuna_active_path.css("fill-opacity","0");
	$("svg").append(this.comuna_active_path);
};


ElecionesApp.prototype.change_dropdown = function(val, id_url){
	var s = this;
	s.filtro_activo = val;
	if(!id_url){
		s.reset();
		s.remove_comuna_active_path();
	}
	$('#ayud1').hide();
	$('.compartir').show();
	if(s.filtro_home == s.filtro_activo){
		$("polygon, path").css('fill-opacity', "1" );
		s.draw_ul_list(null, id_url);
	}else{	
		s.draw_x_interna(val);
	}
	// set path
	s.q.set('fuerza', val);

};

ElecionesApp.prototype.start_niceScroll = function(selector){
	$(selector).niceScroll({
		cursorcolor:"#d7d7d7",
		cursorborder:"0px solid #fff",
		cursorwidth: "7px",
		autohidemode:false,
		hidecursordelay:0
	});
};


ElecionesApp.prototype.pintar_mapa = function(){
	
	var s = this;
	var list_comunas = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13", "c14", "c15"];
	
	var fill = "#fff";

	// $("path, polygon").css({ // reset styles maps
	// 	'fill': '#fff',
	// 	'stroke': fill,
	// 	'fill-opacity': "1"
	// 	});
	
	if(this.filtro_activo == this.filtro_home){
		s.ganadores_comunas.forEach(function(x){
			$("#"+x.comuna).css({ fill: s.dict_partidos[x.id].color_partido});
		});
	}else{
		
		var interna = this.cache_ajax["partido_"+this.filtro_activo].c_00;

		s.ganadores_comunas.forEach(function(x){

			fill = s.dict_candidatos[x.id] ? s.dict_candidatos[x.id].color_candidato : "#ccc";
			var style = { fill: fill, 'fill-opacity': "1"};
			if (x.id != interna[0].id){
				style["fill-opacity"] = ".4";
				if (x.id != interna[1].id){
					style = { "fill": "#ccc"};
				}
			}
			$("#"+x.comuna).css(style);
		});
		if(s.ganadores_comunas.length < 15){ 
			$("path, polygon").css({ stroke: '#ccc'});
		}

	}
};


ElecionesApp.prototype.barios_x_com = {
	  "c01": "Constitución, Monserrat, Puerto Madero, Retiro, San Nicolás, San Telmo",
	  "c02": "Recoleta",
	  "c03": "Balvanera, San Cristobal",
	  "c04": "Barracas, La Boca, Nueva Pompeya, Parque Patricios",
	  "c05": "Almagro, Boedo",
	  "c06": "Caballito",
	  "c07": "Flores, Parque Chacabuco",
	  "c08": "Villa Lugano, Villa Riachuelo, Villa Soldati",
	  "c09": "Liniers, Mataderos, Parque Avellaneda",
	  "c10": "Floresta, Monte Castro, Vélez Sarsfield, Versalles, Villa Luro, Villa Real",
	  "c11": "Villa Del Parque, Villa  Devoto, Villa Gral. Mitre, Villa Santa Rita",
	  "c12": "Coghlan, Saavedra, Villa Pueyrredón, Villa Urquiza",
	  "c13": "Belgrano, Colegiales, Núñez",
	  "c14": "Palermo",
	  "c15": "Agronomía, Chacarita,  Parque Chas,  Paternal, Villa Crespo, Villa Ortúzar"
	};

ElecionesApp.prototype.q = new PermanentLinkJS();

ElecionesApp.prototype.colores = ["#FEDB30","#1796D7","#7CC374","#F4987E","#B185B7","#B3B3B3"];


