// scripts app


(function(){
	"use strict";
	
	// load mapa
	$.get("img/mapaBA_SVG.txt", function(mapa){
		$("#mapa_cont").html(mapa);
	});

	$('select#opts').change(function(e){
		change_dropdown($(this).val());
	});

})();

var app = (function(document, $){
	"use strict";

	function _change_dropdown(val){
		var x_fuerza = 'x_fuerza';
		if(x_fuerza == val){
			$('#x_interna').hide();
			$('#x_fuerza').show();
		}else{
			$('#x_fuerza').hide();
			$('#x_interna').show();
		}
	}

	function _none(el){
		$(el).fadeOut();
	}

	return {
		change_dropdown: _change_dropdown,
		none: _none
	};
})(document, Jquery);
