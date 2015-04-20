// scripts app
var app;
(function(){
	"use strict";
	app = new ElecionesApp();
	console.log(app);
	// load mapa
	$.get("img/caba_ilus.txt", function(mapa){
		$("#mapa_cont").html(mapa);
	});

	$('select#opts').change(function(e){
		app.change_dropdown($(this).val());
	});


	/*compartir*/
	function myPopup(url) {
   	 	window.open( url, "Compartir", "status = yes, height = 360, width = 500, resizable = yes, left = "+(ancho/2+250)+", top =" +(alto/2-150) );
    	return false;
	}
	

})();
