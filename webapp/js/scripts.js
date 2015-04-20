// scripts app
var app;
$(function(){
	"use strict";
	app = new ElecionesApp();
	console.log(app);
	// load mapa
	$.get("img/mapaBA_SVG.txt", function(mapa){
		$("#mapa_cont").html(mapa);
	});

	$('select#opts').change(function(e){
		app.change_dropdown($(this).val());
	});

});
