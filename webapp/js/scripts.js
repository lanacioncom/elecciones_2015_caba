// scripts app
var app;

var ancho = $(window).width();
var alto = $(window).height();

$(window).resize(function() {
      ancho = $(window).width();
    alto = $(window).height();
});

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
    var path_to_data = "http://datapaso.lanacion.com.ar/json_data/"; 
    // var path_to_data = "http://datapaso.lanacion.com.ar/sim_output/"; // url de test
    $.get("data/BsAstopo.json", function(mapa){
        // get list partidos
        $.get("data/diccionario_partidos.json", function(dict_partidos){
            $.get("data/diccionario_candidatos.json", function(dict_candidatos){
                
                $.get(path_to_data+"partido_00.json", function(results){

                    $("#mapa_cont").html('<div class="ayuda2">FILTRAR POR CANDIDATO</div><div class="ayuda3">Clickeá en las comunas para ver los resultados en detalle.</div></div>');
                    
                    // init app
                    app = new EleccionesApp(dict_partidos, dict_candidatos, results, mapa, path_to_data, "article#mapa_cont");

                    $("#opts").select2({
                        minimumResultsForSearch: -1,
                        val: "x_fuerza"
                    });

                    $(".creditos").click(function(){
                        $(".creVent").fadeIn(200);
                        $(".creVent .txts").delay(300).fadeIn(200);
                    });

                    $(".cerrar").click(function(){
                        $(".creVent .txts").fadeOut(200);
                        $(".creVent").delay(300).fadeOut(200);
                    });

                });
            });
        });
    });
});



/*compartir*/
function myPopup(url) {
    window.open( url, "Compartir", "status = yes, height = 360, width = 500, resizable = yes, left = "+(ancho/2+250)+", top =" +(alto/2-150) );
    return false;
}

/* // tooltip /*/
function tooltip(){

    var comu = $("path.feature");
    var toolip = $(".tooltip");
    var html = "";
    var data;
    comu.on( 'mouseenter', function() {

        $el = $(this);

        ide = $el.attr("id").replace(/c/i, "");
        
        ide = ide < 10 ? "0"+ide : ide;
        
        if(app.filtro_activo == app.filtro_home){
            data = app.r_general["c_"+ide];
            var max = data[0].p;
            data = data.slice(0, 3).map(function(d){
                d.color = app.dict_partidos[d.id].color_partido;
                d.nombre = app.dict_partidos[d.id].nombre_partido;
                return d;
            });
            
              // llenar popup

              html = app.tmpl_tooltip({
                id:ide,
                max: max,
                partidos: data,
                barios_x_com: app.barios_x_com["c"+ide]
            });
        }else{
            
            // tooltip por interna
            var partido_id = app.filtro_activo;
            data = app.cache_ajax['partido_'+partido_id]['c_'+ide].slice(0, 3);
                data = data.map(function(d){
                    d.color = app.dict_candidatos[d.id] ? app.dict_candidatos[d.id].color_candidato : "#ccc";
                    d.apellido = app.dict_candidatos[d.id] ? app.dict_candidatos[d.id].apellido : "#ccc";
                    // d.nombre = app.dict_partidos[d.id].nombre_partido;
                    return d;
                });
            
            html = app.tmpl_tooltip_interna({
                        id: ide,
                        max: data[0].p,
                        candidatos: data,
                        interna: app.cache_ajax['partido_'+partido_id],
                        barios_x_com: app.barios_x_com["c"+ide]
                    });
        }
        
        app.draw_tooltip(html);

        toolip.show();

        mouse_move($el, toolip);
        // animate tooltip
        
    });

    function mouse_move($el, toolip){
        $el.on('mousemove', function(e){
          
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
             }else if(e.pageY > 350){
                itemY = e.pageY - 260;
             }else{
                itemY = e.pageY + 30;
             }

             $(".tooltip").animate({"top":itemY, "left":itemX},100, 'swing').stop( true, true );

        });

        if(isMobile.any()) {
                   
        }else{
            
            $el.on('mouseout', function(){
                toolip.hide();
            });    
        }
    }
}

// JET: Replace this function with d3.format
Number.prototype.format = function(c, d, t){
        var n = this;
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? "." : d;
        t = t === undefined ? "," : t;
        var s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
        var nn = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        return nn;
};

function pad(num, size) {
          var s = num+"";
          while (s.length < size) s = "0" + s;
          return s;
}