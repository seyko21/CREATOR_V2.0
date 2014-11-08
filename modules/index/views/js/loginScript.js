var loginScript_ = function(){
    
    var _private = {};
    
    this.public = {};
    
    this.public.validate = function(){
        $("#login-form").validate({
            // Rules for form validation
            rules : {
                    txtUser : {
                            required : true,
                            email: true
                    },
                    txtClave : {
                            required : true,
                            minlength : 3,
                            maxlength : 20
                    }
            },

            // Messages for form validation
            messages : {
                    txtEmail : {
                            required : 'Ingrese su correo'
                    },
                    txtClave : {
                            required : 'Ingrese su clave'
                    }
            },

            // Do not change code below
            errorPlacement : function(error, element) {
                    error.insertAfter(element.parent());
            },
                    
            submitHandler: function(){
                login.postEntrar();
            }   
        });
        
        
        
        
        
        
        
        
        
        
        var pr = "'20'";
        
        
        var ot = $('#myGrid').simpleGrid({
            tWidthFormat: 'px',
            tColumns: [
                {
                    title: lang.modulo.MOD,
                    campo: 'modulo', 
                    width: '25',
                    sortable: true,
                    ajax: {
                        fn: 'ajaxfun',
                        flag: 1,
                        serverParams: ['id_modulo','aplicacion'],
                        clientParams: ["$('#txtUser').val()",pr]
                    }
                },
                {title: lang.modulo.APP,campo: 'aplicacion', width: "20",sortable: true},
                {title: lang.modulo.USC,campo: 'usuario', width: "20",sortable: true},
                {title: lang.modulo.FECRE,campo: 'fechac', width: "15",  class: "center",sortable: true}
            ],
            pPaginate: true,
            pDisplayLength: 1,
            ajaxSource: login.dataGrid(),
            fnCallback: function(){
                
            }
        });
       
//        
//        setTimeout(function(){
//        $('#myGrid2').simpleGrid({
//            tWidthFormat: 'px',
//            tColumns: [
//                {
//                    title: lang.modulo.MOD,
//                    campo: 'modulo', 
//                    width: '25',
//                    sortable: true,
//                    ajax: {
//                        fn: 'ajaxfun',
//                        flag: 1,
//                        serverParams: ['id_modulo','aplicacion'],
//                        clientParams: ["$('#txtUser').val()",pr]
//                    }
//                },
//                {title: lang.modulo.APP,campo: 'aplicacion', width: "20",sortable: true},
//                {title: lang.modulo.USC,campo: 'usuario', width: "20",sortable: true},
//                {title: lang.modulo.FECRE,campo: 'fechac', width: "15",  class: "center",sortable: true}
//            ],
//            pPaginate: true,
//            pDisplayLength: 1,
//            ajaxSource: login.dataGrid(),
//            fnCallback: function(){
//                
//            }
//        });
//        
//        },4000);
        
        
        
        
    
    };
    
    return this.public;
};

var loginScript = new loginScript_();

loginScript.validate();



//(function($){
//    
//    /*almacena datos que van al server*/
//    _aData = [];
//    
//     _aTotal = 0;
//     
//    _p = null;
//    
//    _e = null;
//    
//    _tmpTH = null;
//
//    /*configuracion por defecto*/
//    $.run = function(p){
//   
//        p = $.extend({ //aplicando propiedades por defecto
//            tWidthFormat: '%',              /*para dimension de columnas*/
//            tChangeLength: true,            /*activa combo de registros a mostrar por pagina*/
//            tRegsLength: [10,25,50,100],    /*para numero de registros por pagina*/
//            tColumns: [],                   /*columnas del header*/
//            pPaginate: true,                /*paginacion*/
//            pDisplayStart: 0,               /*registro inicial de la data*/
//            pDisplayLength: 10,             /*numero de registros por pagina*/
//            pItemPaginas: 5,                /*numero de items a mostrar en paginador*/
//            ajaxSource: null                /*url para la data via ajax*/
//        },p);
//        
//        return p;        
//    };
//    
//    /*ordenamiento por columnas*/
//    $.sorting = function(tthis){
//        var trId = $(tthis).attr('id');
//        var idG  = $(tthis).attr('data-idGrid');
//        /*se coloca el head en .sorting*/
//        if(_tmpTH !== trId){
//            $('#'+idG).find('thead').find('tr').find('th').removeClass('sorting_asc');
//            $('#'+idG).find('thead').find('tr').find('th').removeClass('sorting_desc');
//            $('#'+idG).find('thead').find('tr').find('th').addClass('sorting');
//        }
//    
//        if($('#'+trId).is('.sorting')){                /*ordenacion ascendente*/
//            $('#'+trId).removeClass('sorting');
//            $('#'+trId).addClass('sorting_asc');
//        }else if($('#'+trId).is('.sorting_desc')){     /*ordenacion descendente*/
//            $('#'+trId).removeClass('sorting_desc');
//            $('#'+trId).addClass('sorting_asc');
//        }else if($('#'+trId).is('.sorting_asc')){      /*ordenacion ascendente*/
//            $('#'+trId).removeClass('sorting_asc');
//            $('#'+trId).addClass('sorting_desc');
//        }
//        $.sendAjax(_p.pDisplayStart,_p.pDisplayLength);
//        _tmpTH = trId;
//    };
//    
//    /*encapsula los metodo del plugin*/
//    $.motor = function(e,p){
//        
//        var method = {
//            
//            /*serialisa datos que van al server*/
//            serialize: function(){
//                var data = '';
//                for(var i in _aData){
//                    data += _aData[i].name+'='+_aData[i].value+'&';
//                }
//                _aData = [];
//                data = data.substring(0, data.length - 1);
//                return data;
//            },
//            /*parametros desde el servidor*/
//            paramServer: function(params,data){
//                var result = '';
//                /*validar si tiene parametros de servidor*/
//                if(params){
//                    /*validar si es array*/
//                    if(params instanceof Object){
//                        /*se agrega paramtros desde array*/
//                        for(var x in params){
//                            result += "'"+data[params[x]]+"',";
//                        }
//                    }else{
//                        /*se agrega parametros directos*/
//                        result += "'"+data[params]+"',";
//                    }
//                }
//                return result;
//            },
//            /*parametros desde el cliente*/
//            paramClient: function(params){
//                var result = '';
//                /*validar si tiene parametros de cliente*/
//                if(params){
//                    /*validar si es array*/
//                    if(params instanceof Object){
//                        /*se agrega paramtros desde array*/
//                        for(var x in params){
//                            result += params[x]+",";
//                        }
//                    }else{
//                        /*se agrega parametros directos*/
//                        result += params+",";
//                    }
//                }
//                return result;
//            },
//            
//            /*crea el header*/
//            header: function(){
//                var h = $('<thead></thead>'),
//                    tr= $('<tr></tr>');
//                
//                /*recorrido de columnas*/
//                for(var c in p.tColumns){
//                    var th= $('<th></th>');         /*se crea la columna*/
//                    
//                    var title = (p.tColumns[c].title !== undefined)?p.tColumns[c].title:'';  
//                    var campo = (p.tColumns[c].campo !== undefined)?p.tColumns[c].campo:'';  
//                    var sortable = (p.tColumns[c].sortable !== undefined)?' sorting':'';
//                    var width = (p.tColumns[c].width !== undefined)?p.tColumns[c].width + p.tWidthFormat:'';
//                    var pointer = '';
//                    
//                    if(sortable !== ''){
//                        pointer = ' pointer';
//                        
//                        th.attr('id',e.id+'_thead'+c);
//                        th.attr('data-search',campo);
//                        th.attr('data-idGrid',e.id);
//                        th.click(function(){
//                            $.sorting(this);                            
//                        });
//                    }
//                    
//                    th.attr('class','center'+sortable+pointer);     /*agregado class css*/
//                    th.css({width:width});                  /*agregando width de columna*/
//                    th.html(title);                         /*se agrega el titulo*/
//                    tr.append(th);                          /*se agrega al <tr>*/
//                }
//                h.html(tr);         /*se agrega al <thead>*/
//                $(e).append(h);     /*se agrega al <table>*/
//            },
//            
//            /*crea combo lenght*/
//            cbLength: function(lengthPag){
//                var cbCl = '';
//                if(p.tChangeLength){
//                    cbCl = '\n\
//                    <div id="'+e.id+'_contCbLength" class="pull-left mr5">\n\
//                        <span class="smart-form">\n\
//                            <label class="select" style="width:60px">\n\
//                                <select id="'+e.id+'_cbLength" name="'+e.id+'_cbLength" onchange="$.sendAjax(0,$(this).val())">';
//                                for(var l in p.tRegsLength){
//                                    var sel = '';
//                                    if(parseInt(lengthPag) === parseInt(p.tRegsLength[l])){
//                                        sel = 'selected="selected"';
//                                    }
//                                    cbCl += '<option value="'+p.tRegsLength[l]+'" '+sel+'>'+p.tRegsLength[l]+'</option>';
//                                }
//                    cbCl += '\
//                                </select><i></i>\n\
//                            </label>\n\
//                        </span>\n\
//                    </div>';
//                }
//                return cbCl;
//            },
//            
//            /*crear los registros*/
//            records: function(data){
//                var tbody = $('<tbody></tbody>');
//               
//                _aTotal = data[0]['total'];     /*total de registros*/ 
//                /*recorrido de los registros del server*/
//                for(var r in data){
//                    var tr = $('<tr></tr>');        /*se crea el tr*/
//                    
//                    /*recorrido de columnas configuradas en js*/
//                    for(var c in p.tColumns){
//                        var klass = (p.tColumns[c].class !== undefined)?p.tColumns[c].class:'';    /*clase css*/                                /*clase css para <td>*/
//                        /*parametros para ajax*/
//                        var ajax = (p.tColumns[c].ajax !== undefined)?p.tColumns[c].ajax:'';       /*ajax para <td>*/
//                        var fn = '';
//                        var flag = '';
//                        var clientParams = '';
//                        var serverParams = '';
//                        if(ajax){
//                            fn = (ajax.fn !== undefined)?ajax.fn:'';                                /*funcion ajax*/
//                            flag = (ajax.flag !== undefined)?ajax.flag:'';                          /*flag de la funcion*/
//                            clientParams = (ajax.clientParams !== undefined)?ajax.clientParams:'';  /*parametros desde el cliente*/
//                            serverParams = (ajax.serverParams !== undefined)?ajax.serverParams:'';  /*parametros desde el servidor*/
//                        }
//                        
//                        var td = $('<td></td>');    /*se crea el td*/
//                        
//                        var texto = data[r][p.tColumns[c].campo];
//                        /*agregando ajax*/
//                        if(fn){
//                            var xparams = '';
//                            
//                            /*validar flag para agregar como parametro*/
//                            if(flag){
//                                xparams = flag+',';
//                            }
//                            /*parametros de servidor*/
//                            xparams += this.paramServer(serverParams,data[r]);
//
//                            /*parametros de cliente*/
//                            xparams += this.paramClient(clientParams);
//                            
//                            
//                            xparams = xparams.substring(0, xparams.length - 1);
//                            fn = fn+'('+xparams+')';
//                            texto = '<a href="javascript:;" onclick="'+fn+'">'+texto+'</a>';
//                        }
//                        td.html(texto);
//                        td.attr('class',klass);       /*agregado class css*/
//                        
//                        tr.append(td);                /*se agrega al <tr>*/
//                    }
//                    
//                    tbody.append(tr);               /*se agrega al <tbody>*/
//                }
//                $(e).find('tbody').remove();
//                $(e).append(tbody);     /*se agrega al <table>*/
//            },
//            
//            /*crear paginacion*/
//            pagination: function(total,start,length){
//                if(p.pPaginate){
//                    var paginaActual = start + 1;
//                    var lengthPag = length;                         /*debe cargar del combo changelength*/
//                    var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
//                    var itemPag = Math.ceil(p.pItemPaginas / 2);
//                    
//                    var pagInicio = (paginaActual - itemPag);
//                    var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
//                    var pagFinal = (pagInicio + (p.pItemPaginas - 1));
//                    var click = '';
//                    
//                    var trIni = ((paginaActual * length) - length) + 1;
//                    var trFin = (paginaActual * length);
//                    
//                    var trFinOk = (trFin - total < length)? trFin - (trFin - total):trFin;
//                    
//                    var pag = '\
//                    <div id="'+e.id+'_paginate" class="dt-row dt-bottom-row top-pagin">\n\
//                    <div class="row">\n\
//                    <div class="col-sm-6">\n\
//                        <div id="'+e.id+'_info" class="dataTables_info pull-left mr5">'+trIni+' al '+trFinOk+' de '+total+'</div>\n\
//                        '+this.cbLength(lengthPag)+'\n\
//                        <button class="btn btn-primary mr5" title="Actualizar" onclick="$.sendAjax('+(paginaActual-1)+','+lengthPag+')"><i class="fa-refresh"></i></button>\n\
//                        <img id="'+e.id+'_loadingGrid" class="hide" src="public/img/spinner-mini.gif">\n\
//                    </div>\n\
//                    <div class="col-sm-6 text-right">\n\
//                    <div class="dataTables_paginate paging_bootstrap_full">\n\
//                        <ul class="pagination">';
//                    if(paginaActual > 1){
//                        click = '$.sendAjax('+(paginaActual-2)+','+lengthPag+')';
//                        pag += '\
//                            <li class="first"><a href="javascript:;"><i class="fa fa-fast-backward" onclick="$.sendAjax('+0+','+lengthPag+')"></i></a></li>\n\
//                            <li class="prev"><a href="javascript:;"><i class="fa fa-backward" onclick="'+click+'"></i></a></li>';
//                    }else{
//                        pag += '\
//                            <li class="first disabled"><a href="javascript:;"><i class="fa fa-fast-backward"></i></a></li>\n\
//                            <li class="prev disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>';
//                    }
//                   
//                    for(var i = pagInicio;i <= pagFinal;i++){
//                        if(i <= numPaginas){
//                            var active = '';
//                            click = '$.sendAjax('+(i-1)+','+lengthPag+')';
//                            if(i === paginaActual){
//                                active = 'active';
//                                click = '';
//                            }
//                            pag += '<li class="'+active+'"><a href="javascript:;" onclick="'+click+'">'+i+'</a></li>';
//                        }
//                    }
//                    
//                    if(numPaginas > 1 && paginaActual !== numPaginas){
//                        click = '$.sendAjax('+paginaActual+','+lengthPag+')';
//                        pag += '\
//                        <li class="next"><a href="javascript:;" onclick="'+click+'"><i class="fa fa-forward"></i></a></li>\n\
//                        <li class="last"><a href="javascript:;" onclick="$.sendAjax('+(numPaginas-1)+','+lengthPag+')"><i class="fa fa-fast-forward"></i></a></li>';
//                    }else{
//                        pag += '\
//                        <li class="next disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>\n\
//                        <li class="last disabled"><a href="javascript:;"><i class="fa fa-fast-forward"></i></a></li>';
//                    }
//                    pag += '</ul>\n\
//                    </div>\n\
//                    </div>\n\
//                    </div>\n\
//                    </div>';
//                }
//                $('#'+e.id+'_paginate').remove();
//                $(pag).insertAfter(e);
//            },
//            
//            ini: function(){
//                /*si existe columnas se genera el header*/
//                if(p.tColumns.length){
//                    method.header();
//                }
//                /*se valida se data sera via ajax*/
//                if(p.ajaxSource){
//                    $.sendAjax(p.pDisplayStart,p.pDisplayLength);
//                }
//            }
//            
//        };
//        
//        return method;
//    };
//    
//    $.sendAjax = function(start,length){
//        $('#'+_e.id+'_loadingGrid').removeClass('hide');
//        var pp = $.run(_p);
//        
//        _p.pDisplayStart = start;
//        _p.pDisplayLength= length;
//      
//        _aData.push({name: 'pDisplayStart', value: _p.pDisplayStart}); 
//        _aData.push({name: 'pDisplayLength', value:_p.pDisplayLength}); 
//
//        /*serializacion de datos*/
//        var datos = $.motor(_e,pp).serialize();
//
//        $.ajax({
//            type: "POST",
//            data: datos,
//            url: pp.ajaxSource,
//            dataType: 'json',
//            success: function(data){
//                /*validar error del SP*/
//                if(data.length>0 || data.error !== undefined){
//                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
//                    if(data instanceof Object === false || data.error !== undefined){
//                        var msn = data;
//                        if(data.error !== undefined){
//                            msn = data.error;
//                        }
//                        simpleScript.notify.error({
//                            content: msn
//                        });
//                    }
//                }
//
//                /*generar registros*/
//                $.motor(_e,pp).records(data);
//
//                /*generar paginacion*/
//                $.motor(_e,pp).pagination(_aTotal,_p.pDisplayStart,_p.pDisplayLength);
//
//                if(pp.fnCallback !== undefined){//si existe callback
//                    var callBback = pp.fnCallback;
//                    callBback(data);
//                }
//                $('#'+_e.id+'_loadingGrid').addClass('hide');
//            }
//        });
//    };
//    
//    $.fn.simpleGrid = function(p){
//        return this.each(function () {
//                var el  = this;		//e == es el elemento
//           
//                $(document).ready(function () {
//                    _p = p;
//                    _e = el;
//                    $.motor(_e,$.run(_p)).ini();
//                });
//        });
//    };
//})(jQuery);