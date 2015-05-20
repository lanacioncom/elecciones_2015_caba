// Elecciones class
var EleccionesApp = function(dict_partidos, dict_candidatos, results, mapa, path_to_data, container_sel){
    "use strict";
    // set self class var
    var _self = this;
    _self.dict_partidos = dict_partidos;
    _self.dict_candidatos = dict_candidatos;
    _self.path_to_data = path_to_data;
    // JET: nuevo
    _self.map_data = mapa;
    _self.map_container_selector = d3.select(container_sel);
    _self.map_width = $(container_sel).width();
    _self.map_height = $(container_sel).height();
    _self.map_featureActive = d3.select(null);
    // From http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object/14691788#14691788
    _self.map_projection = d3.geo.mercator().scale(1).translate([0, 0]);
    _self.map_path = d3.geo.path().projection(_self.map_projection);
    _self.map_svg = null;
    _self.map_g = null;
    _self.map_zoom = null;
    // data dinamica
    _self.r_general = results;
    _self.internas = results.interna;
    _self.comuna_active_path = null;
    _self.filtro_home = "00"; // default filter
    _self.filtro_activo = "00";

    (function init(){

        // Draw BsAs departments map
        _self.draw_map(_self.map_width, _self.map_width, 
                       _self.map_container_selector);

        // change dropdown
        $('select#opts').change(function(e){
            _self.change_dropdown($(this).val());
        });

        $('h3').on('click', function(){ // volver a la home 
            _self.filtro_activo = _self.filtro_home;
            _self.reset_state();
            $('select#opts').select2("val", _self.filtro_home);
        });
        
        // template para el select de internas
        _self.tmpl_opts = Handlebars.compile($('#tmpl_opts').html());
        $("#opts").html( _self.tmpl_opts(_self.dict_partidos));
        
        // template para listado de resultados por partido
        _self.tmpl_li_partido = Handlebars.compile($('#tmpl_li_partido').html());
        _self.tmpl_x_interna = Handlebars.compile($('#tmpl_x_interna').html());
        
        // get query string
        _self.start_app();
        _self.get_mesas_escrutadas();

        // template tooltip
        _self.tooltip = $("#tooltip"); // contenedor ul para los partidos (barras)  
        _self.tmpl_tooltip = Handlebars.compile($('#tmpl_tooltip').html());
        _self.tmpl_tooltip_interna = Handlebars.compile($('#tmpl_tooltip_interna').html());
        _self.on_click_comuna();
        
// ***********
        tooltip(); // esta en scripts.js
        // setInterval(function(){_self.reload_app();}, 6000);

    })();
};


/* AJAX cache
 * store requests in memory
 */
EleccionesApp.prototype.cache_ajax = {};

EleccionesApp.prototype.clear_cache_ajax = function(){
    var _self = this;
    _self.cache_ajax = {};
};


EleccionesApp.prototype.set_data_active = function(str){
    $("#selected h4").html(str).fadeIn();
}

EleccionesApp.prototype.reload_app = function(){
    var _self = this;
    _self.get_r_general(function(){
        _self.start_app();
        _self.get_mesas_escrutadas();
        // JET: Para qué es esto?
        $('select#opts').select2("val", "16");
    });
};

/**
* Draws the map adjusting to container width and height
*/
EleccionesApp.prototype.draw_map = function(width, height, sel){
    var _self = this;

    // JET: Closure is there a better way to do this?
    var reset = _self.map_reset();
    var zoomed = _self.map_zoomed();
    var clicked = _self.map_feature_clicked();
    var stopped = _self.map_stopped();

    _self.map_zoom = d3.behavior.zoom()
                 .translate([0, 0])
                 .scale(1)
                 .scaleExtent([1, 8])
                 .on("zoom", zoomed);

    var comunas = topojson.feature(_self.map_data, _self.map_data.objects.comunas);

    var bounds = _self.map_path.bounds(comunas),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = 0.9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

    // Update the projection to use computed scale & translate.
    _self.map_projection.scale(scale).translate(translate);

    _self.map_svg = sel.append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .on("click", stopped, true);

    _self.map_svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", reset);
    
    _self.map_g = _self.map_svg.append("g").attr("id","comunas");

    _self.map_svg.call(_self.map_zoom) // delete this line to disable free zooming
       .call(_self.map_zoom.event);
    
    _self.map_g.selectAll("path")
             .data(comunas.features)
             .enter()
             .append("path")
             .attr("class", "feature")
             .attr("id", function(d) {return d.id;})
             .attr("d", _self.map_path)
             .on("click", clicked);


    _self.map_g.selectAll(".feature-label")
             .data(comunas.features)
             .enter().append("text")
             .attr("class", function(d) { return "feature-label " + d.id; })
             .attr("transform", function(d) { return "translate(" + _self.map_path.centroid(d) + ")"; })
             .attr("dy", ".35em")
             .text(function(d) { return d.id; });


    _self.map_g.append("path")
      .datum(topojson.mesh(_self.map_data, _self.map_data.objects.comunas, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", _self.map_path);
};

EleccionesApp.prototype.map_feature_clicked = function() {
    var _self = this;
    // JET: Another closure to access the reset function
    var reset = _self.map_reset();
    var clicked = function(d) {
        var width = _self.map_width;
        var height = _self.map_height;
        if (_self.map_featureActive.node() === this) return reset();
        _self.map_featureActive.classed("active", false);
        _self.map_featureActive = d3.select(this).classed("active", true);

        var bounds = _self.map_path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = 0.9 / Math.max(dx / width, dy / height),
          translate = [width / 2 - scale * x, height / 2 - scale * y];

        var barrios = topojson.feature(_self.map_data, _self.map_data.objects.barrios);
        var barrios_mesh = topojson.mesh(_self.map_data, _self.map_data.objects.barrios, function(a, b) { return a !== b; })
        //var g_barrios = _self.map_svg.append("g").attr("id","barrios");
        
        var pb = _self.map_g.selectAll("path.barrio");
        pb.classed("disabled", false);
        var lb = _self.map_g.selectAll("text.barrio-label");
        lb.classed("disabled", false);
        var mb = _self.map_g.selectAll("path.barrio-mesh");
        mb.classed("disabled", false);
        pb.data(barrios.features)
             .enter()
             .append("path")
             .attr("class", "barrio")
             .attr("id", function(d) {return d.id;})
             .attr("d", app.map_path);

        
        lb.data(barrios.features).enter().append("text")
             .attr("class", function(d) { return "barrio-label " + d.id; })
             .attr("transform", function(d) { return "translate(" + app.map_path.centroid(d) + ")"; })
             .attr("dy", ".35em")
             .text(function(d) { return d.id; });

        
        mb.data(barrios_mesh).enter().append("path")
          .attr("class", "barrio-mesh")
          .attr("d", app.map_path);

        _self.map_svg.transition()
          .duration(750)
          .call(_self.map_zoom.translate(translate).scale(scale).event);
    };
    return clicked;
};

EleccionesApp.prototype.map_stopped = function() {
    var _self = this;
    var stopped = function() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    };
    return stopped;
};

EleccionesApp.prototype.map_zoomed = function() {
    var _self = this;
    var zoomed = function() {
        _self.map_g.style("stroke-width", 1.5 / d3.event.scale + "px");
        _self.map_g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };
    return zoomed;
};

EleccionesApp.prototype.map_reset = function() {
    var _self = this;
    var reset = function() {
        _self.map_featureActive.classed("active", false);
        _self.map_featureActive = d3.select(null);

        //JET: Handle lower level paths
        _self.map_g.selectAll("path.barrio").classed("disabled", true);
        _self.map_g.selectAll("text.barrio-label").classed("disabled", true);
        _self.map_g.select("path.barrio-mesh").classed("disabled", true);


        _self.map_svg.transition()
           .duration(750)
           .call(_self.map_zoom.translate([0, 0]).scale(1).event);
    };
    return reset;
};

EleccionesApp.prototype.start_app = function(){
    var s = this;
    s.q.set_from_location();
    
    var q = $.extend(true, {}, s.q.get_query());
    
    s.clear_cache_ajax();
    
    s.filtro_activo = q.fuerza || s.filtro_home;
    
    s.change_dropdown(s.filtro_activo, q.comuna);

    if(q.comuna){
        $("#selected h4").html("Comuna "+q.comuna).fadeIn();
    }
    
};

EleccionesApp.prototype.get_r_general = function(callback){
    var s = this; 
    $.get(s.path_to_data+"partido_00.json", function(results){
        s.r_general = results;
        
        if(callback){callback();}
    });
};

EleccionesApp.prototype.get_mesas_escrutadas = function(callback){
    var s = this; 
    $.get(s.path_to_data+"resumen.json", function(resumen){
        s.resumen = resumen;
        $('#mesas span').html(s.resumen.mp+'%');
        $('#votos span').html(s.resumen.vp+'%');
        $('#padron span').html((+s.resumen.e).format(0, ",", '.'));

        if(callback){callback();}
    });
};


EleccionesApp.prototype.draw_x_interna = function(val){ // recive el id del partido requerido
    var s = this;
    var key_cache = "partido_" + val;
    if(!s.cache_ajax[key_cache]){ // si no esta en cache lo va a buscar...
        
        $.get(s.path_to_data + key_cache + ".json", function(data){
            s.cache_ajax[key_cache] = data;
            s.run_interna(key_cache);
        });

    }else{    
            s.run_interna(key_cache);
    }

};


EleccionesApp.prototype.animate_barras = function(){
    $("#results .cont_barra .barra").each(function(i, el){
        var $el = $(this);
        $el.delay(500).animate({width: $el.data("width")}, {duration: 900, queue:false});
    });
};


EleccionesApp.prototype.get_ganadores_x_comuna = function(data){
    // toma todos los ganadores por comuna y pinta el mapa
    var s = this;
    s.ganadores_comunas = [];
    for (var com in data){
        if(!/c\_0{2}|r/i.test(com)){ // que no sea la comuna 00
            var i = 0;

            while(/BLC|NUL|REC|IMP/i.test(data[com][i].id)){
                i += 1;
                if(i>15){
                    break;
                }
            }
            var c = data[com][i];
            c.comuna = com.replace(/\_0?/, "");
            s.ganadores_comunas.push(c);
        }
    }
    s.pintar_mapa();
};

EleccionesApp.prototype.select_comuna_interna =     function(polygon){
    var s = this;

    var id = polygon.id.replace(/c/i, "");
    var com_name = "Comuna "+ id;
    s.set_data_active(com_name);
    
    var comuna = "c_"+(id < 10 ? "0"+(+id) : id);
    var key_cache = 'partido_'+ s.filtro_activo;
    s.run_interna(key_cache, comuna);

    s.q.set("comuna", id);
    s.set_comuna_active_path(polygon);

};


EleccionesApp.prototype.select_comuna_general =     function(polygon){
    var s = this;

    var id = polygon.id.replace(/c/i, "");
    var com_name = "Comuna "+ id;
    s.set_data_active(com_name);

    s.set_comuna_active_path(polygon);

    s.q.set("comuna", id);

    // lista de partidos x comuna
    s.draw_ul_list(id);
};


EleccionesApp.prototype.on_click_comuna = function (){
    var s = this;
    // click mapa
    $('polygon, path').on('click', function(e){
        
        if(s.filtro_activo == s.filtro_home){ // dropdown x fuerza
            
            s.select_comuna_general(this);
        
        }else{ // dropdown x interna o listas únicas
            s.select_comuna_interna(this);

        
        }

    });
};


EleccionesApp.prototype.reset_state = function (){
    var s = this;
    // resetea el los filtros
    $("#selected h4").hide().html("");
    
    s.remove_comuna_active_path();
    if(this.filtro_activo == this.filtro_home){ // dropdown x fuerza
        // s.get_ganadores_x_comuna(s.r_general);
        s.draw_ul_list();
        s.q.kill("comuna");

    }else{ // dropdown x interna o listas únicas
        s.draw_x_interna(this.filtro_activo);

    }
    // clear radio btn
    $('li.candidato.active input').prop('checked', false);
    $('li.candidato.active').removeClass('active');
    
};

EleccionesApp.prototype.get_max_obj = function(arr, key){ 
    
    var max = arr.map(function(x){ return x[key]; });
    return Math.max.apply(null, max); 
};

EleccionesApp.prototype.sort_obj = function(arr, key){ 
    function compare(a,b) {
      if (a[key] > b[key])
         return -1;
      if (a[key] < b[key])
        return 1;
      return 0;
    }
    return arr.sort(compare);
};

EleccionesApp.prototype.draw_ul_list = function(id, id_url){ // si no viene data, escribe la general
    this.get_ganadores_x_comuna(this.r_general);
    var is_comuna = false;
    var data;
    
    if(id_url){ 
        id = id_url;
        var c = document.getElementById("c"+id);
        this.set_comuna_active_path(c);
    }
    if(!id){
        data = this.r_general.c_00;
    }else{
        id = (id < 10) ? "0"+id: id; // make id for data
        data = this.r_general["c_"+id];
        is_comuna = true;
    }
    // this.sort_obj(data, 'p'); // ya viene ordenado
    var max = data.map(function(x){ return x.p; });
    var l = {
        data : data,
        dict_candidatos: this.dict_candidatos,
        dict_partidos: this.dict_partidos,
        is_comuna: is_comuna,
        max : this.get_max_obj(data, "p")
    };

    $("results").html(this.tmpl_li_partido(l));
    this.animate_barras();

    if(is_comuna){ $(".help_text, #line").hide();}else{$(".help_text, #line").show();}

// start niceScroll
    this.start_niceScroll("#list");
    if(id_url){ 
        var comu = document.getElementById("c"+id);
        this.set_comuna_active_path(comu);
    }

};


EleccionesApp.prototype.run_interna = function(key_cache, comuna){
    var s = this;
    if(!comuna){ comuna = 'c_00';}

    var interna = s.cache_ajax[key_cache];

    var data = {
        interna: interna,
        comuna : interna[comuna],
        r : s.cache_ajax[key_cache].r,
        is_99: s.filtro_activo == "99",
        max: s.cache_ajax[key_cache][comuna][0].p,
        dict_candidatos: s.dict_candidatos
    };

    $("#results").html(s.tmpl_x_interna(data));
    s.get_ganadores_x_comuna(s.cache_ajax[key_cache]);
        
    s.animate_barras();
    
    // bind events for inputs
    var candidato_btn = $('input[type="radio"]');
    candidato_btn.on('click', function(el){
        var $el = $(this);
        $('li.active:has(input)').removeClass('active');
        $el.closest('li').addClass('active');

        s.set_data_active(this.value);
        s.q.set("candidato", this.value);
    });

    // start niceScroll
    s.start_niceScroll('#list_interna');
};

EleccionesApp.prototype.draw_tooltip = function(html){
    this.tooltip.html(html);
};

EleccionesApp.prototype.remove_comuna_active_path = function(){
    if(this.comuna_active_path){
        this.comuna_active_path.remove();
    }

};

EleccionesApp.prototype.set_comuna_active_path = function(polygon){
    this.remove_comuna_active_path();
    this.comuna_active_path = $(polygon).clone();
    this.comuna_active_path.attr("class","comuna_active_path");
    this.comuna_active_path.css("fill-opacity","0");
    $("svg").append(this.comuna_active_path);
};


EleccionesApp.prototype.change_dropdown = function(val, id_url){
    var s = this;
    s.filtro_activo = val;
    if(!id_url){
        s.reset_state();
        s.remove_comuna_active_path();
    }
    $('#ayud1').hide();
    $('.compartir').show();
    if(s.filtro_home == s.filtro_activo){
        //$("polygon, path").css('fill-opacity', "1" );
        s.draw_ul_list(null, id_url);
    }else{    
        s.draw_x_interna(val);
    }
    // set path
    s.q.set('fuerza', val);

};

EleccionesApp.prototype.start_niceScroll = function(selector){
    $(selector).niceScroll({
        cursorcolor:"#d7d7d7",
        cursorborder:"0px solid #fff",
        cursorwidth: "7px",
        autohidemode:false,
        hidecursordelay:0
    });
};


EleccionesApp.prototype.pintar_mapa = function(){
    
    var s = this;
    var list_comunas = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13", "c14", "c15"];
    
    var fill = "#fff";

    // $("path, polygon").css({ // reset styles maps
    //     'fill': '#fff',
    //     'stroke': fill,
    //     'fill-opacity': "1"
    //     });
    
    if(this.filtro_activo == this.filtro_home){
        s.ganadores_comunas.forEach(function(x){
            $("#"+x.comuna).css({ fill: s.dict_partidos[x.id].color_partido});
        });
    }else{
        
        var interna = this.cache_ajax["partido_"+this.filtro_activo].c_00;

        s.ganadores_comunas.forEach(function(x){

            fill = s.dict_candidatos[x.id] ? s.dict_candidatos[x.id].color_candidato : "#ccc";
            var style = { fill: fill, 'fill-opacity': "1"};
            if (x.id != interna[0].id){
                style["fill-opacity"] = ".4";
                if (x.id != interna[1].id){
                    style = { "fill": "#ccc"};
                }
            }
            $("#"+x.comuna).css(style);
        });
        if(s.ganadores_comunas.length < 15){ 
            $("path, polygon").css({ stroke: '#ccc'});
        }

    }
};


EleccionesApp.prototype.barios_x_com = {
      "c01": "Constitución, Monserrat, Puerto Madero, Retiro, San Nicolás, San Telmo",
      "c02": "Recoleta",
      "c03": "Balvanera, San Cristobal",
      "c04": "Barracas, La Boca, Nueva Pompeya, Parque Patricios",
      "c05": "Almagro, Boedo",
      "c06": "Caballito",
      "c07": "Flores, Parque Chacabuco",
      "c08": "Villa Lugano, Villa Riachuelo, Villa Soldati",
      "c09": "Liniers, Mataderos, Parque Avellaneda",
      "c10": "Floresta, Monte Castro, Vélez Sarsfield, Versalles, Villa Luro, Villa Real",
      "c11": "Villa Del Parque, Villa  Devoto, Villa Gral. Mitre, Villa Santa Rita",
      "c12": "Coghlan, Saavedra, Villa Pueyrredón, Villa Urquiza",
      "c13": "Belgrano, Colegiales, Núñez",
      "c14": "Palermo",
      "c15": "Agronomía, Chacarita,  Parque Chas,  Paternal, Villa Crespo, Villa Ortúzar"
    };

EleccionesApp.prototype.q = new PermanentLinkJS();

EleccionesApp.prototype.colores = ["#FEDB30","#1796D7","#7CC374","#F4987E","#B185B7","#B3B3B3"];


