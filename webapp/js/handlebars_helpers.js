/*!
* Handlebars helpers
*/

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
	return options.fn(this);
  }
  return options.inverse(this);
});


Handlebars.registerHelper('ifNotCond', function(v1, v2, options) {
  if(v1 != v2) {
	return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('chekIsLessThan15', function(options) {
	if(options.data.root.is_comuna) {
		return "";
	}else if(/[a-z]/gi.test(this.id)){
		return "";
	}else if(this.p < 1.5){
		return "no_pasa";
	}
});


Handlebars.registerHelper( "lower", function ( _str ){
	return  _str.toLowerCase();
});

Handlebars.registerHelper( "toFixed_n", function ( n ){
	// return (+n).toFixed(1);
	return (+n).format(1, ",", '.');
});

Handlebars.registerHelper( "toFixed_n_0", function ( n ){
	// return (+n).toFixed(1);
	return (+n).format(0, ",", '.');
});

Handlebars.registerHelper( "get_partido", function ( options ){
	var dict_p = options.data.root.dict_partidos;
	return dict_p[this.id] ? dict_p[this.id].nombre_partido : "";
});

Handlebars.registerHelper( "get_candidato_nombre", function ( options ){
	var dict_p = options.data.root.dict_candidatos;
	return dict_p[this.id] ? dict_p[this.id].nombre_completo : "";
});

Handlebars.registerHelper( "get_candidato_color", function ( options ){
	var dict_p = options.data.root.dict_candidatos;
	return dict_p[this.id] ? dict_p[this.id].color_candidato : "";
});

Handlebars.registerHelper( "get_candidato_apellido_class", function ( options ){
	var dict_p = options.data.root.dict_candidatos;
	return dict_p[this.id] ? dict_p[this.id].foto.toLowerCase() : "";
});

Handlebars.registerHelper( "get_partido_color", function ( options ){
	var dict_p = options.data.root.dict_partidos;
	return dict_p[this.id] ? dict_p[this.id].color_partido : "";
});


Handlebars.registerHelper( "get_partido_css_class", function ( dict, id, options ){
	return dict[this.id] ? dict[this.id].nombre_partido.replace(/\./gi, "").replace(/\s/gi, "_").toLowerCase() : "";
});


Handlebars.registerHelper( "get_width_bar", function ( porcentaje, max, options ){
	var n = porcentaje*100/max;
	return  n;
});

Handlebars.registerHelper( "check_index_opacyti", function ( options ){
	var r = "";
	var win1 = options.data.root.interna.c_00[0].id;
	var win2 = options.data.root.interna.c_00[1].id;

	if(this.id != win1){
		r = "opacity: .4;";		
		if(this.id != win2){
			r += "background: #ccc;";		
		}
	}
	return r;
});



Handlebars.registerHelper("debug", function(optionalValue) {
	console.log("Current Context");
	console.log("====================");
	console.log(this);
	if (optionalValue) {
		console.log("Value");
		console.log("====================");
		console.log(optionalValue);
	}
});
