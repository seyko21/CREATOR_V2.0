(function($){
    
    "use strict";
  
    $.method = null;
    
    $.fn.extend({
        
        simpleGrid: function(options){
            
            var _idGrid     = $(this).attr('id');   /*identificador de la grilla*/
            
            var _aData      = [];                   /*almacena datos que van al server*/
            
            var _aTotal     = 0;                    /*total de registros*/
            
            var _tmpTH      = null;                 /*id th*/
            
            var defaults = { //aplicando propiedades por defecto
                tWidthFormat: '%',              /*para dimension de columnas*/
                tChangeLength: true,            /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10,25,50,100],    /*para numero de registros por pagina*/
                tColumns: [],                   /*columnas del header*/
                tOrderField: '',                /*para el order ASC o DESC*/
                pPaginate: true,                /*paginacion*/
                pDisplayStart: 0,               /*registro inicial de la data*/
                pDisplayLength: 10,             /*numero de registros por pagina*/
                pItemPaginas: 5,                /*numero de items a mostrar en paginador*/
                ajaxSource: null               /*url para la data via ajax*/
            };
        
            var options = $.extend(defaults, options);
        
            return this.each(function() {
                
                var o = options; 
                
                $.method = {
                    /*ordenamiento por columnas*/
                    sorting: function(tthis){
                        var thId = $(tthis).attr('id'),
                            orienta;
                        var cad = thId.split('_');
                        
                        o.tOrderField = $('#'+thId).attr('data-search');
                        _idGrid = cad[0];
                        
                        /*se coloca el head en .sorting*/
                        if(_tmpTH !== thId){
                            $('#'+_idGrid).find('thead').find('tr').find('th').removeClass('sorting_asc');
                            $('#'+_idGrid).find('thead').find('tr').find('th').removeClass('sorting_desc');
                            $('#'+_idGrid).find('thead').find('tr').find('th').addClass('sorting');
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
                        
                        o.tOrderField += orienta;
                      
                        $.method.sendAjax(_idGrid,o.pDisplayStart,o.pDisplayLength,o.tOrderField);
                        _tmpTH = thId;
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
                            sorting = this.sorting;

                        /*recorrido de columnas*/
                        for(var c in o.tColumns){
                            var th= $('<th></th>');         /*se crea la columna*/

                            var title = (o.tColumns[c].title !== undefined)?o.tColumns[c].title:'';  
                            var campo = (o.tColumns[c].campo !== undefined)?o.tColumns[c].campo:'';  
                            var sortable = (o.tColumns[c].sortable !== undefined)?' sorting':'';
                            var width = (o.tColumns[c].width !== undefined)?o.tColumns[c].width + o.tWidthFormat:'';
                            var pointer = '';

                            if(sortable !== ''){
                                pointer = ' pointer';
                                th.attr('data-search',campo);
                                th.click(function(){
                                    var tthis = this;
                                    sorting(tthis);
                                });
                            }
                            
                            th.attr('id',_idGrid+'_th_'+c);
                            th.attr('class','center'+sortable+pointer);     /*agregado class css*/
                            th.css({width:width});                          /*agregando width de columna*/
                            th.html(title);                                 /*se agrega el titulo*/
                            tr.append(th);                                  /*se agrega al <tr>*/
                        }
                        h.html(tr);                 /*se agrega al <thead>*/
                        $('#'+_idGrid).append(h);     /*se agrega al <table>*/
                    },
                    /*crea combo lenght*/
                    cbLength: function(lengthPag){
                        var cbCl = '';
                        if(o.tChangeLength){
                            cbCl = '\n\
                            <div id="'+_idGrid+'_contCbLength" class="pull-left mr5">\n\
                                <span class="smart-form">\n\
                                    <label class="select" style="width:60px">\n\
                                        <select id="'+_idGrid+'_cbLength" name="'+_idGrid+'_cbLength" onchange="$.method.sendAjax(\''+_idGrid+'\',0,$(this).val())">';
                                        for(var l in o.tRegsLength){
                                            var sel = '';
                                            if(parseInt(lengthPag) === parseInt(o.tRegsLength[l])){
                                                sel = 'selected="selected"';
                                            }
                                            cbCl += '<option value="'+o.tRegsLength[l]+'" '+sel+'>'+o.tRegsLength[l]+'</option>';
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
                    records: function(data){
                        var tbody = $('<tbody></tbody>');

                        _aTotal = data[0]['total'];     /*total de registros*/ 
                        /*recorrido de los registros del server*/
                        for(var r in data){
                            var tr = $('<tr></tr>');        /*se crea el tr*/

                            /*recorrido de columnas configuradas en js*/
                            for(var c in o.tColumns){
                                var klass = (o.tColumns[c].class !== undefined)?o.tColumns[c].class:'';    /*clase css*/                                /*clase css para <td>*/
                                /*parametros para ajax*/
                                var ajax = (o.tColumns[c].ajax !== undefined)?o.tColumns[c].ajax:'';       /*ajax para <td>*/
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

                                var texto = data[r][o.tColumns[c].campo];
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
                                td.attr('class',klass);       /*agregado class css*/

                                tr.append(td);                /*se agrega al <tr>*/
                            }

                            tbody.append(tr);               /*se agrega al <tbody>*/
                        }
                        $('#'+_idGrid).find('tbody').remove();
                        $('#'+_idGrid).append(tbody);     /*se agrega al <table>*/
                    },
                    /*crear paginacion*/
                    pagination: function(start,length){
                        var total = _aTotal;
                        if(o.pPaginate){
                            var paginaActual = start + 1;
                            var lengthPag = length;                         /*debe cargar del combo changelength*/
                            var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
                            var itemPag = Math.ceil(o.pItemPaginas / 2);

                            var pagInicio = (paginaActual - itemPag);
                            var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
                            var pagFinal = (pagInicio + (o.pItemPaginas - 1));
                            var click = '';

                            var trIni = ((paginaActual * length) - length) + 1;
                            var trFin = (paginaActual * length);

                            var trFinOk = (trFin - total < length)? trFin - (trFin - total):trFin;

                            var pag = '\
                            <div id="'+_idGrid+'_paginate" class="dt-row dt-bottom-row top-pagin">\n\
                            <div class="row">\n\
                            <div class="col-sm-6">\n\
                                <div id="'+_idGrid+'_info" class="dataTables_info pull-left mr5">'+trIni+' al '+trFinOk+' de '+total+'</div>\n\
                                '+this.cbLength(lengthPag)+'\n\
                                <button class="btn btn-primary mr5" title="Actualizar" onclick="$.method.sendAjax(\''+_idGrid+'\','+(paginaActual-1)+','+lengthPag+')"><i class="fa-refresh"></i></button>\n\
                                <img id="'+_idGrid+'_loadingGrid" class="hide" src="public/img/spinner-mini.gif">\n\
                            </div>\n\
                            <div class="col-sm-6 text-right">\n\
                            <div class="dataTables_paginate paging_bootstrap_full">\n\
                                <ul class="pagination">';
                            if(paginaActual > 1){
                                click = '$.method.sendAjax(\''+_idGrid+'\','+(paginaActual-2)+','+lengthPag+')';
                                pag += '\
                                    <li class="first"><a href="javascript:;"><i class="fa fa-fast-backward" onclick="$.method.sendAjax(\''+_idGrid+'\','+0+','+lengthPag+')"></i></a></li>\n\
                                    <li class="prev"><a href="javascript:;"><i class="fa fa-backward" onclick="'+click+'"></i></a></li>';
                            }else{
                                pag += '\
                                    <li class="first disabled"><a href="javascript:;"><i class="fa fa-fast-backward"></i></a></li>\n\
                                    <li class="prev disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>';
                            }

                            for(var i = pagInicio;i <= pagFinal;i++){
                                if(i <= numPaginas){
                                    var active = '';
                                    click = '$.method.sendAjax(\''+_idGrid+'\','+(i-1)+','+lengthPag+')';
                                    if(i === paginaActual){
                                        active = 'active';
                                        click = '';
                                    }
                                    pag += '<li class="'+active+'"><a href="javascript:;" onclick="'+click+'">'+i+'</a></li>';
                                }
                            }

                            if(numPaginas > 1 && paginaActual !== numPaginas){
                                pag += '\
                                <li class="next"><a href="javascript:;" onclick="$.method.sendAjax(\''+_idGrid+'\','+paginaActual+','+lengthPag+')"><i class="fa fa-forward"></i></a></li>\n\
                                <li class="last"><a href="javascript:;" onclick="$.method.sendAjax(\''+_idGrid+'\','+(numPaginas-1)+','+lengthPag+')"><i class="fa fa-fast-forward"></i></a></li>';
                            }else{
                                pag += '\
                                <li class="next disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>\n\
                                <li class="last disabled"><a href="javascript:;"><i class="fa fa-fast-forward"></i></a></li>';
                            }
                            pag += '</ul>\n\
                            </div>\n\
                            </div>\n\
                            </div>\n\
                            </div>';
                        }
                        $('#'+_idGrid+'_paginate').remove();
                        $(pag).insertAfter('#'+_idGrid);
                    },
            
                    ini: function(){
                        /*si existe columnas se genera el header*/
                        if(o.tColumns.length){
                            $.method.header();
                        }
                        /*se valida se data sera via ajax*/
                        if(o.ajaxSource){
                            this.sendAjax(_idGrid,o.pDisplayStart,o.pDisplayLength);
                        }
                    },
                    
                    sendAjax: function(g,start,length,order){
                        _idGrid = g;
                        $('#'+_idGrid+'_loadingGrid').removeClass('hide');
                        
                        o.pDisplayStart = start;
                        o.pDisplayLength= length;

                        _aData.push({name: 'pDisplayStart', value: o.pDisplayStart}); 
                        _aData.push({name: 'pDisplayLength', value:o.pDisplayLength}); 
                        _aData.push({name: 'pOrder', value:(order !== undefined)?order:''}); 

                        /*serializacion de datos*/
                        var datos = this.serialize();

                        $.ajax({
                            type: "POST",
                            data: datos,
                            url: o.ajaxSource,
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
                                $.method.records(data);

                                /*generar paginacion*/
                                $.method.pagination(o.pDisplayStart,o.pDisplayLength);

                                if(o.fnCallback !== undefined){//si existe callback
                                    var callBback = o.fnCallback;
                                    callBback(data);
                                }
                                $('#'+_idGrid+'_loadingGrid').addClass('hide');
                            }
                        });
                    }
                    
                };
                
                $.method.ini();
                
            });
            
        }
        
    });
   
})(jQuery);