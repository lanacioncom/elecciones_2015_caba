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
		$("#mapa_cont").html(mapa + '<div class="ayuda3">Clickeá en las comunas para ver los resultados en detalle.</div>');
		
		// tooltip();

		app = new ElecionesApp();
		console.log(app);
	
	});


	 /* // scroll // */

	  $("#list, #list_interna").niceScroll({
	        cursorcolor:"#d7d7d7",
	        cursorborder:"0px solid #fff",
	        cursorwidth: "7px",
	        autohidemode:false,
	        hidecursordelay:0
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
	  	var tool = $(".tooltip")

        comu.on( 'mouseenter', function() {
          ide = $(this).attr("id");
          console.log(ide);
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

         if(e.pageX > 185 && ancho < 750){
           var itemX = e.pageX - 200;
         }else if(e.pageX < 330){
           var itemX = e.pageX;
         }else{
         	var itemX = e.pageX - 200;
         }

         if(e.pageY > 350 && ancho < 750){
           var itemY = e.pageY - 260;
         }else if(e.pageY > 450){
           var itemY = e.pageY - 260;
         }else{
           var itemY = e.pageY + 30;
         }

         $(".tooltip").animate({"top":itemY, "left":itemX},100, 'swing').stop( true, true );

        });
}
