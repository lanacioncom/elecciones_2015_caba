// scripts app
var app;

var ancho = $(window).width();
var isMobile = { //valida si es un dispositivo movil
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

$(function(){
    
	"use strict";
    // $.ajaxSetup({ cache: false }); 
	// load mapa
	$.get("img/caba_ilus.txt", function(mapa){
		// get list partidos
		$.get("data/diccionario_partidos.json", function(dict_partidos){
			$.get("data/diccionario_candidatos.json", function(dict_candidatos){
				
				$.get("data/partido_00.json", function(results){

					$("#mapa_cont").html(mapa + '<div class="ayuda2">FILTRAR POR CANDIDATO</div><div class="ayuda3">Clickeá en las comunas para ver los resultados en detalle.</div></div>');
					// init app
					
					app = new ElecionesApp(dict_partidos, dict_candidatos, results);

					/* select */
					
					$("#opts").select2({
				        minimumResultsForSearch: -1,
				        val: "x_fuerza"
				    });

					
				});
			});
		});

		// tooltip(); lo llama elecciones_app.js
	
	});

	 
	  
		/*compartir*/
		function myPopup(url) {
	   	 	window.open( url, "Compartir", "status = yes, height = 360, width = 500, resizable = yes, left = "+(ancho/2+250)+", top =" +(alto/2-150) );
	    	return false;
		}

});





	/* // tooltip /*/
function tooltip(){

	var comu = $("polygon, path");
	var toolip = $(".tooltip");

	comu.on( 'mouseenter', function() {

		$el = $(this);

		ide = $el.attr("id").replace(/c/i, "");
		
		if(app.filtro_activo == "x_fuerza"){
			ide = ide < 10 ? "0"+ide : ide;
			var data = app.r_general["c_"+ide];
			var max = data[0].p;
			data = data.slice(0, 3).map(function(d){
				d.color = app.dict_partidos[d.id].color_partido;
				d.nombre = app.dict_partidos[d.id].nombre_partido;
				return d;
			});
			
          	// llenar popup
			app.draw_tooltip({
				id:ide,
				max: max,
				partidos: data,
				barios_x_com: app.barios_x_com["c"+ide]
			});

			toolip.show();
			mouse_move($el, toolip);
		}else{
			// tooltip por interna

			app.draw_tooltip();

		}
    	
    	// animate tooltip
        

    });

	function mouse_move($el, toolip){
	    $el.on('mousemove', function(e){
	      
	         e = e || window.event;
	         e = jQuery.event.fix(e);
	         
	        var itemX = e.pageX - 200;
			if(e.pageX > 185 && ancho < 750){
				itemX = e.pageX - 200;
			}else if(e.pageX < 330){
				itemX = e.pageX;
			}

	         if(e.pageY > 350 && ancho < 750){
				itemY = e.pageY - 260;
	         }else if(e.pageY > 350){
				itemY = e.pageY - 260;
	         }else{
				itemY = e.pageY + 30;
	         }

	         $(".tooltip").animate({"top":itemY, "left":itemX},100, 'swing').stop( true, true );

	    });

	    if(isMobile.any()) {
		           
	    }else{
			
			$el.on('mouseout', function(){
	        	toolip.hide();
			});	
	    }
	}
}

