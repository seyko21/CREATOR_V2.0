(function($){
    
    "use strict";
  
    $.method = null;
    
    $.fn.extend({
        
        simpleGrid: function(options){
            
            var _idGrid     = $(this).attr('id');   /*identificador de la grilla*/
            
            var _aData      = [];                   /*almacena datos que van al server*/
            
            var _s     = 0;                         /*ejecuta scrool una vez por gilla*/
            
            var _tmpTH      = null;                 /*id th*/
            
            var defaults = { //aplicando propiedades por defecto
                tObjectTable: _idGrid,          /*identificador de la grilla*/
                tWidthFormat: '%',              /*para dimension de columnas*/
                tChangeLength: true,            /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10,25,50,100],    /*para numero de registros por pagina*/
                tColumns: [],                   /*columnas del header*/
                tOrderField: '',                /*para el order ASC o DESC*/
                tFilter: false,                 /*filtro general de tabla*/
                tPlaceHolderFilter: 'Busqueda', /*palceholder del filter*/
                tSearch: '',                    /*texto a buscar*/
                tScrollY: '',                   /*scrool Y de tabla*/
                tNumeracion: true,              /*para mostrar la numeracion*/
                pInfo: true,                    /*para mostrar informacion de paginacion*/
                pPaginate: true,                /*paginacion*/
                pDisplayStart: 0,               /*registro inicial de la data*/
                pDisplayLength: 10,             /*numero de registros por pagina*/
                pItemPaginas: 5,                /*numero de items a mostrar en paginador*/
                ajaxSource: null,               /*url para la data via ajax*/
                sTotal: 0                       /*total de registros*/
            };
        
            var options = $.extend(defaults, options);
            var noOrderNro = function(oSettings){
                if(oSettings.tNumeracion){
                    $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').eq(0).off('click');
                    $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').eq(0).removeClass('sorting');
                } 
            };
            /*serialisa objeto*/
            var serialObject = function(cadena){
                cadena = JSON.stringify(cadena).replace(/'/g,'~');
                cadena = cadena.replace(/"/g,'^');
                return cadena;
            };
            /*deserialisa objeto*/
            var unserialObject = function(cadena){
                var cc='';
                
                for(var i in cadena){
                    if(cadena[i] === '^'){
                       cc += '"';
                    }else{
                        cc += cadena[i];
                    }
                }
                cc = cc.replace(/~/g,"'");
                
                cc = JSON.parse(cc);
                return cc;
            };
            /*calcula limit inferior*/
            var limitInferior = function(oSettings){
                var limit0 = oSettings.pDisplayStart;
                if(oSettings.pDisplayStart > 0){
                   limit0 = oSettings.pDisplayLength * limit0;
                }
                return limit0;
            };
            /*genera txt filter*/
            var inputFilter = function(oSettings){
                var fil = '\
                <div class="col-sm-6">\n\
                    <div class="input-group col-sm-6">\n\
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>\n\
                        <input type="text" id="'+oSettings.tObjectTable+'_filter" name="'+oSettings.tObjectTable+'_filter" class="form-control" placeholder="'+oSettings.tPlaceHolderFilter+'">\n\
                    </div>\n\
                </div>';
                    
                $('#'+oSettings.tObjectTable+'_tools').append(fil);
                $('#'+oSettings.tObjectTable+'_filter').keyup(function(tecla){
                    if(tecla.keyCode === 13){
                        oSettings.tSearch = this.value;
                        oSettings.pDisplayStart = 0;            /*para busqueda se reinicia a cero*/
                        $.method.sendAjax(oSettings);
                    }
                });
                
            };
            /*cebra de columna al ordenar*/
            var cebraCol = function(r,tOrderField,campo){
                var m,classort;
                m = tOrderField.split(' ');
                classort = '';
                if(campo === m[0]){
                    classort = ' sorting_1';
                    if(r%2){
                        classort = ' sorting_2';
                    }
                }
                return classort;
            };
            /*redimensiona header*/
            var resizeHeader = function(oSettings){
                $('#'+oSettings.tObjectTable).find('tbody tr').each(function(index){
                    if(index === 1){
                        $(this).find('td').each(function(i){
                            var w = $(this).width();
                            $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').eq(i).width(w+'px');
                        });
                    }
               });
            };
            /*activar scrool: Y de tabla*/
            var scroolYY = function(oSettings){
                if(oSettings.tScrollY !== ''){
                    var c = $('#'+oSettings.tObjectTable).attr('class');                /*class de tabla*/
                    var h = $('#'+oSettings.tObjectTable).find('thead').html();
                    
                    $('#'+oSettings.tObjectTable).find('thead').remove();
                    
                    var dhead = $('<div></div>');
                    dhead.css({
                        'border-right': '1px solid #ccc',
                        'border-left': '1px solid #ccc',
                        'border-top': '1px solid #ccc',
                        'position': 'fixed',
                        'padding-right': '17px'
                    });
                    $(dhead).insertBefore('#'+oSettings.tObjectTable+'_main');
                    
                    var head = $('<table></table>');
                    head.attr('class',c);
                    head.attr('id',oSettings.tObjectTable+'_head');
                    
                    var headhd = $('<thead></thead>');
                    headhd.html(h);
                    $(head).html(headhd);
                    
                    $(dhead).html(head);
                    
                    $(window).resize(function(){
                        resizeHeader(oSettings);
                    });
                    
                    /*agregar sorting*/
                    var sortable;
                    $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').each(function(){                        
                        var tthis = this;
                        sortable = $(this).is('.sorting');
                        if(sortable !== ''){
                            $(this).click(function(){                                
                                $.method.sorting(tthis,oSettings);
                            });
                        }
                    });
                    noOrderNro(oSettings);
                }
            };
            /*crea el main*/
            var mainTable = function(oSettings){
                var c = $('#'+oSettings.tObjectTable).attr('class');                /*class de tabla*/
                var divMain = $('<div id="'+oSettings.tObjectTable+'_main"></dv>');

                $(divMain).insertBefore('#'+oSettings.tObjectTable);                /*se agrega div main*/

                $('#'+oSettings.tObjectTable).remove();                             /*se elimina tabla*/

                var t = $('<table id="'+oSettings.tObjectTable+'" class="'+c+'"></table>');

                $('#'+oSettings.tObjectTable+'_main').html(t);                      /*se garega la tabla*/ 
                
                /*verficamos si se configuro el scrool*/
                if(oSettings.tScrollY !== ''){
                    $('#'+oSettings.tObjectTable+'_main').css({
                        height: oSettings.tScrollY,
                        'overflow-y': 'scroll',
                        position: 'relative !important',
                        'border-right': '1px solid #ccc',
                        'border-left': '1px solid #ccc',
                        'margin-top': '27px'
                    });
                }
            };
            
            return this.each(function() {
                
                var oSettings = options; 
                
                $.method = {
                    /*ordenamiento por columnas*/
                    sorting: function(tthis,oSettings){
                        var thId = $(tthis).attr('id'),
                            orienta;
                        var cad = thId.split('_');
                        
                        oSettings.tOrderField = $('#'+thId).attr('data-order');
                        var _grid = cad[0];
                      
                        /*se coloca el head en .sorting*/
                        if(_tmpTH !== thId){
                            $('#'+_grid).find('thead').find('tr').find('th').removeClass('sorting_asc');
                            $('#'+_grid).find('thead').find('tr').find('th').removeClass('sorting_desc');
                            $('#'+_grid).find('thead').find('tr').find('th').addClass('sorting');
                            
                            $('#'+_grid+'_head').find('thead').find('tr').find('th').removeClass('sorting_asc');
                            $('#'+_grid+'_head').find('thead').find('tr').find('th').removeClass('sorting_desc');
                            $('#'+_grid+'_head').find('thead').find('tr').find('th').addClass('sorting');
                        }

                        if($('#'+thId).is('.sorting')){                /*ordenacion ascendente*/
                            $('#'+thId).removeClass('sorting');
                            $('#'+thId).addClass('sorting_asc');
                            orienta = ' ASC';
                        }else if($('#'+thId).is('.sorting_desc')){     /*ordenacion descendente*/
                            $('#'+thId).removeClass('sorting_desc');
                            $('#'+thId).addClass('sorting_asc');
                            orienta = ' ASC';
                        }else if($('#'+thId).is('.sorting_asc')){      /*ordenacion ascendente*/
                            $('#'+thId).removeClass('sorting_asc');
                            $('#'+thId).addClass('sorting_desc');
                            orienta = ' DESC';
                        }
                        
                        oSettings.tOrderField += orienta;
                        oSettings.pDisplayLength = $('#'+_grid+'_cbLength').val();
                        oSettings.tObjectTable = _grid;
                        oSettings.pDisplayStart = parseInt($('#'+_grid+'_paginate').find('ul.pagination').find('li.active').find('a').html()) - 1;
                        
                        $.method.sendAjax(oSettings);
                        _tmpTH = thId;
                        noOrderNro(oSettings);
                    },
                    /*serialisa datos que van al server*/
                    serialize: function(){
                        var data = '';
                        for(var i in _aData){
                            data += _aData[i].name+'='+_aData[i].value+'&';
                        }
                        _aData = [];
                        data = data.substring(0, data.length - 1);
                        return data;
                    },
                    /*parametros desde el servidor*/
                    paramServer: function(params,data){
                        var result = '';
                        /*validar si tiene parametros de servidor*/
                        if(params){
                            /*validar si es array*/
                            if(params instanceof Object){
                                /*se agrega paramtros desde array*/
                                for(var x in params){
                                    result += "'"+data[params[x]]+"',";
                                }
                            }else{
                                /*se agrega parametros directos*/
                                result += "'"+data[params]+"',";
                            }
                        }
                        return result;
                    },
                    /*parametros desde el cliente*/
                    paramClient: function(params){
                        var result = '';
                        /*validar si tiene parametros de cliente*/
                        if(params){
                            /*validar si es array*/
                            if(params instanceof Object){
                                /*se agrega paramtros desde array*/
                                for(var x in params){
                                    result += params[x]+",";
                                }
                            }else{
                                /*se agrega parametros directos*/
                                result += params+",";
                            }
                        }
                        return result;
                    },
                    /*crea el header*/
                    header: function(){
                        var h = $('<thead></thead>'),
                            tr= $('<tr></tr>'),
                            defaultOrder,
                            cad;
                            //sorting = this.sorting;
                        
                        /*verificar si se agrega la numeracion*/
                        if(oSettings.tNumeracion){
                            var th = $('<th style="width:1%">Nro.</th>');         /*se crea la columna*/ 
                            tr.append(th);                       /*se agrega al <tr>*/
                        }
                        /*recorrido de columnas*/
                        for(var c in oSettings.tColumns){
                            var th= $('<th></th>');         /*se crea la columna*/

                            var title = (oSettings.tColumns[c].title !== undefined)?oSettings.tColumns[c].title:'';  
                            var campo = (oSettings.tColumns[c].campo !== undefined)?oSettings.tColumns[c].campo:'';  
                            var sortable = (oSettings.tColumns[c].sortable !== undefined)?' sorting':'';
                            var width = (oSettings.tColumns[c].width !== undefined)?oSettings.tColumns[c].width + oSettings.tWidthFormat:'';
                            var pointer = '';
                            
                            if(sortable !== ''){
                                pointer = ' pointer';
                                th.attr('data-order',campo);
//                                th.click(function(){
//                                    var tthis = this;
//                                    sorting(tthis,oSettings);
//                                });
                            }
                            /*verificar si se inicio ordenamiento y agegar class a th*/
                            cad = oSettings.tOrderField.split(' ');
                            defaultOrder = '';
                            if(cad[0] === campo){
                                defaultOrder = ' sorting_'+cad[1];
                            }
                            th.attr('id',oSettings.tObjectTable+'_head_th_'+c);
                            th.attr('class','center'+sortable+pointer+defaultOrder);        /*agregado class css*/
                            th.css({width:width});                                          /*agregando width de columna*/
                            th.html(title);                                                 /*se agrega el titulo*/
                            tr.append(th);                                                  /*se agrega al <tr>*/
                        }
                        h.html(tr);                 /*se agrega al <thead>*/
                        $('#'+oSettings.tObjectTable).append(h);     /*se agrega al <table>*/
                        
                        if(oSettings.tFilter){
                            /*contenedor de filter y botones*/
                            var contTools = $('<div id="'+oSettings.tObjectTable+'_tools" class="dt-row dt-bottom-row borderTools"></div>');
                            $(contTools).insertBefore('#'+oSettings.tObjectTable+'_main');
                        }
                    },
                    /*onchange pata combo length*/
                    cbChange: function(oSettings){
                        var oSett = unserialObject(oSettings);
                        oSett.pDisplayStart = 0;
                        oSett.pDisplayLength = $('#'+oSett.tObjectTable+'_cbLength').val();
                        $.method.sendAjax(oSett);
                    },
                    /*crea combo lenght*/
                    cbLength: function(oSettings){
                        var cbCl = '';
                        if(oSettings.tChangeLength){
                            cbCl = '\n\
                            <div id="'+oSettings.tObjectTable+'_contCbLength" class="pull-left mr5">\n\
                                <span class="smart-form">\n\
                                    <label class="select" style="width:60px">\n\
                                        <select id="'+oSettings.tObjectTable+'_cbLength" name="'+oSettings.tObjectTable+'_cbLength" onchange="$.method.cbChange(\''+serialObject(oSettings)+'\')">';
                                        for(var l in oSettings.tRegsLength){
                                            var sel = '';
                                            if(parseInt(oSettings.pDisplayLength) === parseInt(oSettings.tRegsLength[l])){
                                                sel = 'selected="selected"';
                                            }
                                            cbCl += '<option value="'+oSettings.tRegsLength[l]+'" '+sel+'>'+oSettings.tRegsLength[l]+'</option>';
                                        }
                            cbCl += '\
                                        </select><i></i>\n\
                                    </label>\n\
                                </span>\n\
                            </div>';
                        }
                        return cbCl;
                    },
                    /*crear los registros*/
                    records: function(data,oSettings){
                        var tbody = $('<tbody></tbody>');
                        var n = oSettings.pDisplayStart * oSettings.pDisplayLength;     /*para la numeracion*/
                        var classort;
                        
                        oSettings.sTotal = data[0]['total'];     /*total de registros*/ 
                        /*recorrido de los registros del server*/
                        for(var r in data){
                            n++;
                            var tr = $('<tr></tr>');        /*se crea el tr*/
                            
                            /*verificar si se agrega la numeracion*/
                            if(oSettings.tNumeracion){
                                var td = $('<td></td>');         /*se crea la columna*/ 
                                td.html(n);
                                tr.append(td);                   /*se agrega al <tr>*/
                            }
                        
                            /*recorrido de columnas configuradas en js*/
                            for(var c in oSettings.tColumns){
                                var klass = (oSettings.tColumns[c].class !== undefined)?oSettings.tColumns[c].class:'';    /*clase css*/                                /*clase css para <td>*/
                                /*parametros para ajax*/
                                var ajax = (oSettings.tColumns[c].ajax !== undefined)?oSettings.tColumns[c].ajax:'';       /*ajax para <td>*/
                                var fn = '';
                                var flag = '';
                                var clientParams = '';
                                var serverParams = '';
                                if(ajax){
                                    fn = (ajax.fn !== undefined)?ajax.fn:'';                                /*funcion ajax*/
                                    flag = (ajax.flag !== undefined)?ajax.flag:'';                          /*flag de la funcion*/
                                    clientParams = (ajax.clientParams !== undefined)?ajax.clientParams:'';  /*parametros desde el cliente*/
                                    serverParams = (ajax.serverParams !== undefined)?ajax.serverParams:'';  /*parametros desde el servidor*/
                                }

                                var td = $('<td></td>');    /*se crea el td*/

                                var texto = data[r][oSettings.tColumns[c].campo];
                                /*agregando ajax*/
                                if(fn){
                                    var xparams = '';

                                    /*validar flag para agregar como parametro*/
                                    if(flag){
                                        xparams = flag+',';
                                    }
                                    /*parametros de servidor*/
                                    xparams += this.paramServer(serverParams,data[r]);

                                    /*parametros de cliente*/
                                    xparams += this.paramClient(clientParams);


                                    xparams = xparams.substring(0, xparams.length - 1);
                                    fn = fn+'('+xparams+')';
                                    texto = '<a href="javascript:;" onclick="'+fn+'">'+texto+'</a>';
                                }
                                td.html(texto);
                                /*verificar si se ordena para marcar*/
                                classort = cebraCol(r,oSettings.tOrderField,oSettings.tColumns[c].campo);
                                
                                td.attr('class',klass+classort);        /*agregado class css*/

                                tr.append(td);                          /*se agrega al <tr>*/
                            }

                            tbody.append(tr);                           /*se agrega al <tbody>*/
                        }
                        $('#'+oSettings.tObjectTable).find('tbody').remove();
                        $('#'+oSettings.tObjectTable).append(tbody);     /*se agrega al <table>*/
                    },
                    /*crear paginacion*/
                    pagination: function(data,oSettings){
                        var total = oSettings.sTotal;
                        var start = oSettings.pDisplayStart;
                        var length= oSettings.pDisplayLength;
                        
                        var paginaActual = start + 1;
                        var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
                        var itemPag = Math.ceil(oSettings.pItemPaginas / 2);

                        var pagInicio = (paginaActual - itemPag);
                        var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
                        var pagFinal = (pagInicio + (oSettings.pItemPaginas - 1));
                        var click = '';

                        var trIni = ((paginaActual * length) - length) + 1;
                        var trFin = (paginaActual * length);

                        var cantRreg = trFin - (trFin - data.length);
                        var trFinOk = (cantRreg < length)? (cantRreg == total)?cantRreg:(parseInt(length) + parseInt(cantRreg)):trFin;

                        oSettings.pDisplayStart = paginaActual-1;   /*para boton actualizar*/
                          
                        var pag = '\
                            <div id="'+oSettings.tObjectTable+'_paginate" class="dt-row dt-bottom-row top-pagin">\n\
                            <div class="row">\n\
                                <div class="col-sm-6">';
                        /*se verifica si la info se visualizara*/
                        if(oSettings.pInfo){
                            pag +='\
                                <div id="'+oSettings.tObjectTable+'_info" class="dataTables_info pull-left mr5">'+trIni+' al '+trFinOk+' de '+total+'</div>';
                        }
                        
                        pag +='\
                                '+this.cbLength(oSettings)+'\n\
                                <button class="btn btn-primary mr5" title="Actualizar" onclick="$.method.sendAjax(\''+serialObject(oSettings)+'\')"><i class="fa-refresh"></i></button>\n\
                                <img id="'+oSettings.tObjectTable+'_loadingGrid" class="hide" src="public/img/spinner-mini.gif">\n\
                            </div>';
                        /*se verifica si va la paginacion*/
                        if(oSettings.pPaginate){
                            pag += '\
                            <div class="col-sm-6 text-right">\n\
                            <div class="dataTables_paginate paging_bootstrap_full">\n\
                                <ul class="pagination">';
                            if(paginaActual > 1){
                                oSettings.pDisplayStart = 0;                /*para boton primero*/
                                pag += '\
                                    <li class="first"><a href="javascript:;"><i class="fa fa-fast-backward" onclick="$.method.sendAjax(\''+serialObject(oSettings)+'\')"></i></a></li>';
                                
                                oSettings.pDisplayStart = paginaActual-2;   /*para boton anterior*/
                                pag += '\
                                    <li class="prev"><a href="javascript:;"><i class="fa fa-backward" onclick="$.method.sendAjax(\''+serialObject(oSettings)+'\')"></i></a></li>';
                            }else{
                                pag += '\
                                    <li class="first disabled"><a href="javascript:;"><i class="fa fa-fast-backward"></i></a></li>\n\
                                    <li class="prev disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>';
                            }

                            for(var i = pagInicio;i <= pagFinal;i++){
                                if(i <= numPaginas){
                                    var active = '';
                                    
                                    oSettings.pDisplayStart = i-1;      /*para cada una de las paginas en paginador*/
                                    
                                    click = '$.method.sendAjax(\''+serialObject(oSettings)+'\');';
                                    if(i === paginaActual){
                                        active = 'active';
                                        click = '';
                                    }
                                    pag += '<li class="'+active+'"><a href="javascript:;" onclick="'+click+'">'+i+'</a></li>';
                                }
                            }

                            if(numPaginas > 1 && paginaActual !== numPaginas){
                                oSettings.pDisplayStart = paginaActual;     /*para boton siguiente*/
                                pag += '\
                                <li class="next"><a href="javascript:;" onclick="$.method.sendAjax(\''+serialObject(oSettings)+'\')"><i class="fa fa-forward"></i></a></li>';
                                oSettings.pDisplayStart = numPaginas-1;     /*para boton ultimo*/
                                pag += '\
                                <li class="last"><a href="javascript:;" onclick="$.method.sendAjax(\''+serialObject(oSettings)+'\')"><i class="fa fa-fast-forward"></i></a></li>';
                            }else{
                                pag += '\
                                <li class="next disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>\n\
                                <li class="last disabled"><a href="javascript:;"><i class="fa fa-fast-forward"></i></a></li>';
                            }
                            pag += '</ul>\n\
                            </div>\n\
                            </div>';
                        }   
                        pag += '\
                            </div>\n\
                            </div>';
                        $('#'+oSettings.tObjectTable+'_paginate').remove();
                        $(pag).insertAfter('#'+oSettings.tObjectTable+'_main');
                    },
            
                    ini: function(){
                        _s = 1;
                        
                        /*se crea el main*/                   
                        mainTable(oSettings);
                        
                        /*si existe columnas se genera el header*/
                        if(oSettings.tColumns.length){
                            $.method.header(oSettings);
                        }
                        /*se valida se data sera via ajax*/
                        if(oSettings.ajaxSource){
                            this.sendAjax(oSettings);
                        }
                        /*se verifica si se genera el filter*/
                        if(oSettings.tFilter){
                            inputFilter(oSettings);
                        }
                    },
                    
                    sendAjax: function(oSettings){
                        if(oSettings instanceof Object === false){
                            var c = unserialObject(oSettings);
                            oSettings = c;
                        }
                        
                        var _Grid = oSettings.tObjectTable;
                        $('#'+_Grid+'_loadingGrid').removeClass('hide');
                        
                        /*configurando limit inferior*/
                        var limit0 = limitInferior(oSettings);

                        _aData.push({name: 'pDisplayStart', value: limit0}); 
                        _aData.push({name: 'pDisplayLength', value: oSettings.pDisplayLength}); 
                        _aData.push({name: 'pOrder', value: oSettings.tOrderField}); 
                        _aData.push({name: 'pSearch', value: oSettings.tSearch}); 

                        /*serializacion de datos*/
                        var datos = this.serialize();
                        
                        $.ajax({
                            type: "POST",
                            data: datos,
                            url: oSettings.ajaxSource,
                            dataType: 'json',
                            success: function(data){
                                /*validar error del SP*/
                                if(data.length>0 || data.error !== undefined){
                                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                                    if(data instanceof Object === false || data.error !== undefined){
                                        var msn = data;
                                        if(data.error !== undefined){
                                            msn = data.error;
                                        }
                                        simpleScript.notify.error({
                                            content: msn
                                        });
                                    }
                                }

                                /*generar registros*/
                                $.method.records(data,oSettings);

                                /*generar paginacion*/
                                $.method.pagination(data,oSettings);

                                if(_s === 1){
                                    /*se activa scrool*/
                                    scroolYY(oSettings);
                                }
                                _s++;
                                
                                if(oSettings.fnCallback !== undefined){//si existe callback
                                    var callBback = oSettings.fnCallback;
                                    callBback(data);
                                }
                                $('#'+_Grid+'_loadingGrid').addClass('hide');
                            }
                        });
                    }
                    
                };
                
                $.method.ini();
                
            });
            
        }
        
    });
   
})(jQuery);