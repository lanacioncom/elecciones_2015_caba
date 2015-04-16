// scripts app

"use strict";

(function(){
	// load mapa
	$.get("img/mapaBA_SVG.txt", function(mapa){
		$("#mapa_cont").html(mapa);
	});

	$('select#opts').change(function(e){
		change_dropdown($(this).val());
	});

})();

function change_dropdown(val){
	var x_fuerza = 'x_fuerza';
	if(x_fuerza == val){
		$('#x_interna').hide();
		$('#x_fuerza').show();
	}else{
		$('#x_fuerza').hide();
		$('#x_interna').show();
	}
}

function display_none(el){
	$(el).fadeOut();
}