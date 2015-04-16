// scripts app
(function(){
	"use strict";
	// load mapa
	$.get("img/mapaBA_SVG.txt", function(mapa){
		$("#mapa_cont").html(mapa);
	});

})();