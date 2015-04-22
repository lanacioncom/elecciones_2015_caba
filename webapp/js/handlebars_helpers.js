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

Handlebars.registerHelper('isLessThan', function(v1, v2, options) {
  if(+v1 < +v2) {
	return options.fn(this);
  }
  return options.inverse(this);
});


Handlebars.registerHelper( "lower", function ( _str ){
	return  _str.toLowerCase();
});


Handlebars.registerHelper( "get_width_bar", function ( porcentaje, max, options ){
	var n = porcentaje*100/max;
	return  n;
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
