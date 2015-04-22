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

	// load mapa
	$.get("img/caba_ilus.txt", function(mapa){
		// get list partidos
		$.get("data/list_partidos.json", function(list_partidos){
			
			$.get("data/results_example.json", function(results){

				$("#mapa_cont").html(mapa + '<div class="ayuda3">Clickeá en las comunas para ver los resultados en detalle.</div>');
				// init app
				app = new ElecionesApp(list_partidos, results);
				
				$("#opts").select2({
					minimumResultsForSearch: Infinity,	
					val: "x_fuerza"
				});
				
			});
		});
		// tooltip(); lo llama elecciones_app.js
	
	});


	 /* // scroll // */

	  $("#list, #list_interna").niceScroll({
	        cursorcolor:"#d7d7d7",
	        cursorborder:"0px solid #fff",
	        cursorwidth: "7px",
	        autohidemode:false,
	        hidecursordelay:0
	  });

	  /* /// select 2 ///*/



	  
		/*compartir*/
		function myPopup(url) {
	   	 	window.open( url, "Compartir", "status = yes, height = 360, width = 500, resizable = yes, left = "+(ancho/2+250)+", top =" +(alto/2-150) );
	    	return false;
		}

});


	/* // tooltip /*/
function tooltip(){

	  	var comu = $("polygon, path");
	  	var tool = $(".tooltip");

	  	var active_zoon = null;
        comu.on( 'mouseenter', function() {
          $el = $(this);
          ide = $el.attr("id");
          app.draw_tooltip({id:ide.replace(/c/i, "")});
          // llenar popup
        });

        if(isMobile.any()) {
           
        }else{
          comu.hover(function() {
            $('.tooltip').show();
          },function(){
            $('.tooltip').hide();
          });
        }


        comu.on('mousemove', function(e){
          
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
         }else if(e.pageY > 450){
			itemY = e.pageY - 260;
         }else{
			itemY = e.pageY + 30;
         }

         $(".tooltip").animate({"top":itemY, "left":itemX},100, 'swing').stop( true, true );

        });
}
