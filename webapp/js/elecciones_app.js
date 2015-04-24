// Elecciones class
var ElecionesApp = function(list_partidos, results){
	"use strict";
	// set self class var
	var s = this;
	s.list_partidos = list_partidos;
	s.r_general = results.general;
	s.internas = results.interna;
	s.comuna_active_path = null;
	s.filtro_home = "x_fuerza"; // filtro seteado por default
	s.filtro_activo = "x_fuerza";
	// s.r_internas = results.inernas;

	s.ganadores_comunas = [];
	// data temporal...
	for (var com in s.r_general.comunas){
		var c = s.r_general.comunas[com][0];
		c.comuna = com.replace(/omuna_/i, "");
		s.ganadores_comunas.push(s.r_general.comunas[com][0]);
	}
	console.log(s.ganadores_comunas);

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
			$('select#opts').select2("val", s.filtro_activo);
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

		s.on_click_comuna();
		
		s.pintar_mapa();

		tooltip(); // esta en scripts.js
	})();

	this.set_data_active = set_data_active;
};


ElecionesApp.prototype.select_comuna_interna = 	function(polygon){
	var s = this;
	var id = polygon.id.replace(/c/i, "");
	var com_name = "Comuna "+ id;
	s.set_data_active(com_name);

	s.set_comuna_active_path(polygon);
	s.q.set("comuna", id);

	// data temporal
	var data = {
		total:s.internas.comunas["comuna_"+id],
		porcentaje: 33.5
	};
	// !data temporal
	
	s.draw_x_interna(data);

};


ElecionesApp.prototype.select_comuna_general = 	function(polygon){
	var s = this;

	var id = polygon.id.replace(/c/i, "");
	var com_name = "Comuna "+ id;
	s.set_data_active(com_name);
	
	// set polygon active
	// var bbox = polygon.getBBox();
	// console.log(bbox, $('svg').height(), $('svg').width());
	// // $("svg").css("transform", "translateX("+bbox.x+"px) translateY("+bbox.x+"px) scale(2)")
	// $('svg').velocity({ translateX: (($('svg').width()/2) - bbox.x -(bbox.width/2))*2, translateY: (($('svg').height()/2) - bbox.y - (bbox.height/2))*1.5, scale: 2 });
	// s.set_comuna_active_path(polygon);

	s.q.set("comuna", id);
	// lista de partidos x comuna
	// console.log(s.r_general.comunas['comuna_'+id]);
	s.draw_ul_list(s.r_general.comunas['comuna_'+id]);
};


ElecionesApp.prototype.on_click_comuna = function (){
	var s = this;
	// click mapa
	$('polygon, path').on('click.on_comuna', function(e){
		
		if(s.filtro_activo == s.filtro_home){ // dropdown x fuerza
			
			s.select_comuna_general(this);
		
		}else{ // dropdown x interna o listas únicas
			s.select_comuna_interna(this);

		
		}

	});
};


ElecionesApp.prototype.reset = function (){
	// resetea el los filtros
	$("#selected h4").hide().html("");
	
	this.remove_comuna_active_path();
	if(this.filtro_activo == this.filtro_home){ // dropdown x fuerza
		this.draw_ul_list();
		this.q.kill("comuna");

	}else{ // dropdown x interna o listas únicas
		this.draw_x_interna();

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


ElecionesApp.prototype.draw_x_interna = function(data){
	if (!data){
		data = this.internas;
	}
	var s = this;

	s.cont_results.html(this.tmpl_x_interna(data));

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

ElecionesApp.prototype.set_comuna_active_path = function(polygon){
	
	this.remove_comuna_active_path();
	this.comuna_active_path = $(polygon).clone();
	this.comuna_active_path.attr("class","comuna_active_path");
	$("svg").append(this.comuna_active_path);

};


ElecionesApp.prototype.change_dropdown = function(val){
	
	this.filtro_activo = val;
	
	var x_fuerza = 'x_fuerza';

	$('#ayud1').hide();
	$('.compartir').show();

	if(x_fuerza == this.filtro_activo){
		this.draw_ul_list();
	}else{
		this.draw_x_interna();
	}
	// set path
	this.q.set('fuerza', val);

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


ElecionesApp.prototype.pintar_mapa = function(data){
	var s = this;
	

	if(this.filtro_activo == 'x_fuerza'){
		s.ganadores_comunas.forEach(function(x){
			$("#"+x.comuna).css({ fill: s.colores[x.id]});
		});

	}else{

		// setar el color del partido para los patterns
		// $("line").css({ stroke: color_partido});
		
	}
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

ElecionesApp.prototype.q = new PermanentLinkJS();

ElecionesApp.prototype.colores = ["#FEDB30","#1796D7","#7CC374","#F4987E","#B185B7","#B3B3B3"];


