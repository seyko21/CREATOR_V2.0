(function($){
    
    "use strict";
  
    $.method = null;
    
    $.fn.extend({
        
        simpleGrid: function(options){
            
            var _idGrid     = $(this).attr('id');   /*identificador de la grilla*/
            
            var _aData      = [];                   /*almacena datos que van al server*/
            
            var _s     = 0;                         /*ejecuta scrool una vez por gilla*/
            
            var _tmpTH      = null;                 /*id th*/
            
            var _searchOk = false;               /*para activar busqueda por columnas*/
            
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
                sTotal: 0,                      /*total de registros*/
                sPositionAxion: 'last',         /*posicion de las acciones*/
                sAxions: [],                    /*acciones del grid*/
                sCheckbox: {                    /*para activar checkbox*/
                    start:false,
                    possition: 'first',
                    serverValues: [],
                    clientValues: []
                },
                fnCallback: function(){},
                sFilterCols: ''
            };
        
            var options = $.extend(defaults, options);
            
            var noOrderNro = function(oSettings){
                if(oSettings.tScrollY === ''){
                    /*si no tiene scrool es el head directo*/
                    var idS = oSettings.tObjectTable;
                }else{
                    var idS = oSettings.tObjectTable+'_head';
                }
                if(oSettings.tNumeracion){
                    $('#'+idS).find('thead').find('tr th').eq(0).off('click');
                    $('#'+idS).find('thead').find('tr th').eq(0).removeClass('sorting');
                } 
                if(oSettings.sAxions.length){
                    $('#'+idS).find('thead').find('tr').find('#'+oSettings.tObjectTable+'_axions').off('click');
                    $('#'+idS).find('thead').find('tr').find('#'+oSettings.tObjectTable+'_axions').removeClass('sorting');
                }
                if(oSettings.sCheckbox.start){
                    $('#'+idS).find('thead').find('tr').find('#'+oSettings.tObjectTable+'_chkall_0').off('click');
                    $('#'+idS).find('thead').find('tr').find('#'+oSettings.tObjectTable+'_chkall_0').removeClass('sorting');
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
                            var r = ($(this).attr('data-render') !== undefined)?$(this).attr('data-render'):1;
                            if(r){
                                $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').eq(i).width(w+'px');
                            }
                        });
                    }
               });
               
               var w_h = parseFloat($('#'+oSettings.tObjectTable+'_main').width() + 2);
               
               /*width de header con scrool se desconfiguraba el ancho, se tuvo q colocal el mismo ancho de la tablas*/
               $('#'+oSettings.tObjectTable+'_head_container').css({width: w_h+'px'});
            };
            /*agregando sort a <table>*/
            var addSorting = function(oSettings){
                var sortable;
                if(oSettings.tScrollY === ''){
                    /*si no hay scrool el head no tiene id*/
                    $('#'+oSettings.tObjectTable).find('thead').find('tr th').each(function(){                
                        var tthis = this;
                        sortable = $(this).is('.sorting');
                        if(sortable !== ''){
                            $(this).click(function(){                                
                                $.method.sorting(tthis,oSettings);
                            });
                        }
                    });
                }else{
                    $('#'+oSettings.tObjectTable+'_head').find('thead').find('tr th').each(function(){                
                        var tthis = this;
                        sortable = $(this).is('.sorting');
                        if(sortable !== ''){
                            $(this).click(function(){                                
                                $.method.sorting(tthis,oSettings);
                            });
                        }
                    });
                }
                noOrderNro(oSettings);
            };
            /*activar scrool: Y de tabla*/
            var scroolYY = function(oSettings){
                if(oSettings.tScrollY !== ''){
                    var c = $('#'+oSettings.tObjectTable).attr('class');                /*class de tabla*/
                    var h = $('#'+oSettings.tObjectTable).find('thead').html();
                    
                    $('#'+oSettings.tObjectTable).find('thead').remove();
                    
                    var dhead = $('<div></div>');
                    dhead.attr('id',oSettings.tObjectTable+'_head_container');
                    dhead.css({
                        'border-right': '1px solid #ccc',
                        'border-left': '1px solid #ccc',
                        'border-top': '1px solid #ccc',
                        'position': 'fixed',
                        'padding-right': '16px'
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
                    addSorting(oSettings);
                    
                    /*agrega evento de busqueda a filtros de columnas*/
                    addSearchCol(oSettings);
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
                        'margin-top': '34px'                /*margin de tabla de registros con el header*/
                    });
                }
            };
            /*crear texto accion en cabecera, y su posicion*/
            var headAxionText = function(oSettings){
                if(oSettings.sAxions.length){
                    var txtax = $('<th id="'+oSettings.tObjectTable+'_axions" class="center">Acciones</th>');
                    return txtax;
                }
            };
            /*generando las acciones*/
            var axionButtons = function(r,data,oSettings){
                if(oSettings.sAxions.length){
                    var w = oSettings.sAxions.length * 4;
                    var td = $('<td class="center" style="width:'+w+'%;"></td>');
                    /*recorrido de acciones*/
                    for(var i in oSettings.sAxions){
                        var titulo = (oSettings.sAxions[i].titulo !== undefined)?oSettings.sAxions[i].titulo:'';
                        var icono  = (oSettings.sAxions[i].icono !== undefined)?oSettings.sAxions[i].icono:'';
                        var klass  = (oSettings.sAxions[i].class !== undefined)?oSettings.sAxions[i].class:'';
                        /*parametros para ajax*/
                        var ajax = (oSettings.sAxions[i].ajax !== undefined)?oSettings.sAxions[i].ajax:'';       /*ajax para <td>*/
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
                        /*configurando ajax*/
                        if(fn){
                            var xparams = '';

                            /*validar flag para agregar como parametro*/
                            if(flag){
                                xparams = flag+',';
                            }
                            /*parametros de servidor*/
                            xparams += $.method.paramServer(serverParams,data[r]);

                            /*parametros de cliente*/
                            xparams += $.method.paramClient(clientParams);


                            xparams = xparams.substring(0, xparams.length - 1);
                            fn = fn+'('+xparams+')';
                        }
                            
                        var btn = $('<button></button>');
                        btn.attr('type','button');
                        btn.attr('id',oSettings.tObjectTable+'_btn'+i);
                        btn.attr('title',titulo);
                        /*agrgando ajax*/
                        if(fn){
                            btn.click(function(){
                                eval(fn);
                            });
                        }
                        if(klass !== ''){
                            btn.attr('class',klass);
                        }
                        if(icono !== ''){
                            btn.html('<i class="'+icono+'"></i>');
                        }
                        td.append(btn);
                    }
                    return td;
                }
            };
            /*coloca los botones en _tools*/
            var renderButtons = function(oSettings){
                var btns = $('#'+oSettings.tObjectTable+'_btns').html();        /*se obtiene los botones*/
                $('#'+oSettings.tObjectTable+'_btns').remove();
                
                var bt = '\
                <div class="col-sm-6 pull-right">\n\
                    <div class="btn-group pull-right">\n\
                        '+btns+'\n\
                    </div>\n\
                </div>';
                    
                $('#'+oSettings.tObjectTable+'_tools').append(bt);
            };
            /*values desde el servidor*/
            var valuesServer = function(params,data){
                var result = '';
                /*validar si tiene parametros de servidor*/
                if(params){
                    /*validar si es array*/
                    if(params instanceof Object){
                        /*se agrega paramtros desde array*/
                        for(var x in params){
                            result += data[params[x]]+"*";
                        }
                    }else{
                        /*se agrega parametros directos*/
                        result += data[params]+"*";
                    }
                }
                return result;
            };
            /*values desde el cliente*/
            var valuesClient = function(params){
                var result = '';
                /*validar si tiene parametros de cliente*/
                if(params){
                    /*validar si es array*/
                    if(params instanceof Object){
                        /*se agrega paramtros desde array*/
                        for(var x in params){
                            result += params[x]+"*";
                        }
                    }else{
                        /*se agrega parametros directos*/
                        result += params+"*";
                    }
                }
                return result;
            };
            /*crear checkbox en filas*/
            var createCheckbox = function(oSettings,data,r){
                var clientValues = (oSettings.sCheckbox.clientValues !== undefined)?oSettings.sCheckbox.clientValues:'';    /*parametros del cliente*/
                var serverValues = (oSettings.sCheckbox.serverValues !== undefined)?oSettings.sCheckbox.serverValues:'';    /*parametros del servidor*/
                var xvalues = '';

                if(clientValues !== ''){
                    /*parametros de cliente*/
                    xvalues += valuesClient(clientValues,data[r]);
                }
                if(serverValues !== ''){
                    /*parametros de servidor*/
                    xvalues += valuesServer(serverValues,data[r]);
                }
                xvalues = xvalues.substring(0, xvalues.length - 1);

                var td = $('<td></td>');
                td.html('<input id="'+oSettings.tObjectTable+'_chk_'+r+'" type="checkbox" value="'+xvalues+'">');
                td.attr('class','center');
                td.css('width','25px');
                td.attr('data-render','0');
                return td;
            };
            /*reenumarar tabla*/
            var reNumeracion = function(oSettings){
                $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                    $(this).find('td').eq(0).html((1+index));
                });
                
            };
            /*crea botones primero y anterior de paginacion*/
            var liFirstPrev = function(ul,oSettings,pagActual){
                if(pagActual > 1){
                    oSettings.pDisplayStart = 0;                /*para boton primero*/
                }
                /*se crea boton <li> ptimero*/
                var liFirst = $('<li></li>');
                
                if(pagActual > 1){
                    liFirst.attr('class','first');
                }else{
                    liFirst.attr('class','first disabled');
                }
                

                /*se crea <a> primero*/
                var aFirst = $('<a></a>');
                aFirst.attr('href','javascript:;');
                aFirst.html('<i class="fa fa-fast-backward"></i>');
                if(pagActual > 1){
                    aFirst.click(function(){
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liFirst).html(aFirst);                /*aFirst dentro de liFirst*/
                $(ul).append(liFirst);                  /*liFirst dentro de ul*/
                
                if(pagActual > 1){
                    oSettings.pDisplayStart = pagActual-2;   /*para boton anterior*/
                }
                /*se crea boton <li> anterior*/
                var liPrev = $('<li></li>');
                if(pagActual > 1){
                    liPrev.attr('class','prev');
                }else{
                    liPrev.attr('class','prev disabled');
                }

                /*se crea <a> anterior*/
                var aPrev = $('<a></a>');
                aPrev.attr('href','javascript:;');
                aPrev.html('<i class="fa fa-backward"></i>');
                if(pagActual > 1){
                    aPrev.click(function(){
                        $.method.sendAjax(oSettings);
                    });
                }   
                $(liPrev).html(aPrev);                /*aPrev dentro de liPrev*/
                $(ul).append(liPrev);                  /*liPrev dentro de ul*/
            };
            /*crea botones ultimo y siguiente de paginacion*/
            var liLastNext = function(ul,oSettings,pagActual,numPaginas){
                if(numPaginas > 1 && pagActual !== numPaginas){
                    oSettings.pDisplayStart = pagActual;             /*para boton siguiente*/
                }
                
                /*se crea boton <li> siguiente*/
                var liNext = $('<li></li>');
                if(numPaginas > 1 && pagActual !== numPaginas){
                    liNext.attr('class','next');
                }else{
                    liNext.attr('class','next disabled');
                }

                /*se crea <a> anterior*/
                var aNext = $('<a></a>');
                aNext.attr('href','javascript:;');
                aNext.html('<i class="fa fa-forward"></i>');
                if(numPaginas > 1 && pagActual !== numPaginas){
                    aNext.click(function(){
                        $.method.sendAjax(oSettings);
                    });
                }   
                $(liNext).html(aNext);                /*aNext dentro de liNext*/
                $(ul).append(liNext);                  /*liNext dentro de ul*/
                
                if(numPaginas > 1 && pagActual !== numPaginas){
                    oSettings.pDisplayStart = numPaginas-1;     /*para boton ultimo*/
                }
                
                /*se crea boton <li> ultimo*/
                var liLast = $('<li></li>');
                
                if(numPaginas > 1 && pagActual !== numPaginas){
                    liLast.attr('class','last');
                }else{
                    liLast.attr('class','last disabled');
                }

                /*se crea <a> primero*/
                var aLast = $('<a></a>');
                aLast.attr('href','javascript:;');
                aLast.html('<i class="fa fa-fast-forward"></i>');
                if(numPaginas > 1 && pagActual !== numPaginas){
                    aLast.click(function(){
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liLast).html(aLast);                /*aLast dentro de liLast*/
                $(ul).append(liLast);                  /*liLast dentro de ul*/
            };
            /*ejecuta la busqueda de fitros de columnas*/
            var executeSearchCols = function(oSettings){
                var searchTxt = '';
                /*agregar evento a searchs*/
                $('#'+oSettings.tObjectTable+'_input_search').find('td').each(function(){
                    var tipoElement = $(this).attr('data-elemento');
                    
                    /*si existe tipo elemento en <td>*/
                    if(tipoElement !== undefined){
                        switch(tipoElement.toLowerCase()){
                            case 'text':
                                var input = $(this).find('input:text');
                                break;
                            case 'select':
                                var input = $(this).find('select');
                                break;
                        }
                        var operator = input.attr('data-operator');
                        var campo = input.attr('data-campo');

                        if(input.val() !== ''){
                            var com = '';
                            /*si operator es LIKE se agrea comodin %*/
                            if(operator.toLowerCase() === 'like'){
                                com = '*';
                            }
                            searchTxt +=' AND '+campo+' '+operator+' "'+com+input.val()+com+'"';
                        }
                    }
                });
                oSettings.sFilterCols = searchTxt;
                oSettings.pDisplayStart = 0;
                $.method.sendAjax(oSettings);
            };
            /*agrega evento a elemento para filtros de columnas*/
            var addSearchCol = function(oSettings){
                /*agregar evento a searchs*/
                $('#'+oSettings.tObjectTable+'_input_search').find('td').each(function(){
                    var element = $(this).attr('data-elemento');
                 
                    /*si existe tipo de elemento*/
                    if(element !== undefined){
                        /*agregar evento segun elemento*/
                        switch(element.toLowerCase()){
                            case 'text':
                                var input = $(this).find('input:text');
                                input.keyup(function(tecla){
                                    if(tecla.keyCode === 13){
                                        executeSearchCols(oSettings);
                                    }
                                });
                                break;
                            case 'select':
                                var input = $(this).find('select');
                                input.change(function(){
                                    executeSearchCols(oSettings);
                                });
                                break;
                        }
                        
                    }
                });
            };
            /*activar busqueda por columnas*/
            var searchColumns = function(oSettings){
                var tr= $('<tr></tr>');
                tr.attr('id',oSettings.tObjectTable+'_input_search');
                
                /*
                 * verificar si se agrega la numeracion
                 * NUMERACION
                */
                if(oSettings.tNumeracion){
                    var th = $('<td>&nbsp;</td>');         /*se crea la columna*/ 
                    th.css('width','35px');
                    tr.append(th);                       /*se agrega al <tr>*/
                }

                /*
                 * verificar si se agrega acciones
                 * ACCIONES
                */
                /*verificar si es first*/
                if(oSettings.sPositionAxion.toLowerCase() === 'first'){
                    var td = $('<td></td>');
                    tr.append(td);
                }

                /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                if(oSettings.sCheckbox.start){
                    var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'first';

                    if(pos.toLowerCase() === 'first'){
                        var th = $('<td>&nbsp;</td>');
                        th.css({'width':'25px'});
                        tr.append(th);                       /*se agrega al <tr>*/
                    }
                }

                /*recorrido de columnas*/
                for(var c in oSettings.tColumns){
                    var th= $('<td></td>');         /*se crea la columna*/

                    var campo = (oSettings.tColumns[c].campo !== undefined)?oSettings.tColumns[c].campo:'';  
                    var search = (oSettings.tColumns[c].search !== undefined)?oSettings.tColumns[c].search:false;   /*para activar busqueda de columnas*/

                    /*activando busqueda de columnas*/
                    var lbInput = $('<label></label>'); 
                    lbInput.attr('class','input');
                    
                    /*se configuro search por columna*/
                    if(search instanceof Object){
                        var tipo = (search.type !== undefined)?search.type:'text';          /*tipo de elemento*/
                        var operator = (search.operator !== undefined)?search.operator:'='; /*para el where en sql*/
                        var inputSearch;
                        
                        /*validando type de pbjeto*/
                        switch(tipo.toLowerCase()){
                            case 'text':
                                th.attr('data-elemento',tipo);         /*se agrega el tipo de elemento a la columna*/
                                inputSearch = $('<input></input>');
                                inputSearch.attr('type','text');
                                break;
                            case 'select':
                                th.attr('data-elemento',tipo);         /*se agrega el tipo de elemento a la columna*/
                                lbInput.attr('class','select');         /*se cambia class a <label>*/
                                operator = '=';                         /*en <select> operador es =*/
                                
                                inputSearch = $('<select></select>');
                                
                                /*options*/
                                var opt = $('<option></option>');
                                opt.attr('value','');
                                opt.html('Sel...');
                                
                                inputSearch.append(opt);
                                
                                /*agregar options segun data de query*/
                                
                                break;
                        }
                        
                        
                        
                        inputSearch.attr('data-operator',operator);
                        inputSearch.attr('data-campo',campo);
                        inputSearch.attr('id',oSettings.tObjectTable+'_search_'+campo);
                    }else{
                        var inputSearch = $('<span></span>');
                        inputSearch.html('&nbsp;');
                    }
                    
                    lbInput.append(inputSearch);
                    th.html(lbInput);                                                 /*se agrega el titulo*/
                    tr.append(th);                                                  /*se agrega al <tr>*/
                }

                /*verificar si se agrega CHECKBOX y si esta en la posicion last*/
                if(oSettings.sCheckbox.start){
                    var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'last';

                    if(pos.toLowerCase() === 'last'){
                        var th = $('<td>&nbsp;</td>');
                        th.css('width','25px');
                        tr.append(th);                       /*se agrega al <tr>*/
                    }
                }

                /*verificar si se agrega acciones*/
                /*verificar si es last*/
                if(oSettings.sPositionAxion.toLowerCase() === 'last'){
                    var td = $('<td></td>');
                    tr.append(td);
                }                        

                $('#'+oSettings.tObjectTable).find('thead').append(tr);     /*se agrega al <thead>*/
                
                /*si scrool esta activo se aumenta margin-top*/
                if(oSettings.tScrollY !== ''){
                    /*se aumenta margin-top de _main*/
                    $('#'+oSettings.tObjectTable+'_main').css({'margin-top':'77px'});
                }else{
                    addSearchCol(oSettings);
                }
            };
            
            return this.each(function() {
                
                var oSettings = options; 
                          
                /*
                 * METODOS CALLBACK
                 */
                /*borrar una fila <tr>*/
                oSettings.fnDeleteRow = function(i){
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                        if(index === i){
                            $(this).remove();
                            /*si existe numeracion se reordena los numeros*/
                            if(oSettings.tNumeracion){
                                reNumeracion(oSettings);
                            }
                        }
                    });
                };
                /*onclick en <tr>*/
                oSettings.fnClickRow = function(fn){
                    var objTd = [];
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                        $(this).click(function(){
                            /*recorrer <td>*/
                            $(this).find('td').each(function(){
                                var c = $.trim($(this).html());
                                objTd.push(c);
                            });
                            fn(objTd);
                        });
                    });
                };
                /*return data de <table>*/
                oSettings.fnGetData = function(fn){
                    var objTr = [];
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                        var objTd = [];
                        /*recorrer <td>*/
                        $(this).find('td').each(function(){
                            var c = $.trim($(this).html());
                            objTd.push(c);
                        });
                        objTr.push(objTd);
                    });
                    fn(objTr);
                };
                /*para actualizar filas*/
                oSettings.fnUpdate = (function(obj,i){
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                        if(index === i){
                            /*recorrer <td>*/
                            $(this).find('td').each(function(ii){
                                /*se recorre data obj*/
                                for(var k in obj){
                                    if(parseInt(k) === parseInt(ii)){
                                        $(this).html(obj[k]);
                                    }
                                }
                            });
                        }
                    });
                });                
                /*para hacer cambios en info*/
                var nFoot = oSettings.tObjectTable+'_info';
                oSettings.fnFooterCallback = function(fn){
                    fn(nFoot,oSettings.data,oSettings.iStart,oSettings.iEnd,oSettings.sTotal);
                };
                /*color a un <tr>*/
                oSettings.fnStyleRow = function(obj,style){
                    var txtCompare2;
                    $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(index){
                        var txtCompare1='',txtCompare2='';;
                        /*se concatena dato a comparar*/
                        /*se recorre data obj*/
                        for(var k in obj){
                            txtCompare1 += obj[k]; /*dato a comparar*/
                        }
                        /*recorrer <td>*/
                        $(this).find('td').each(function(ii){
                            /*se recorre data obj*/
                            for(var kk in obj){
                                if(parseInt(ii) === parseInt(kk)){
                                    txtCompare2 += $(this).html(); /*dato a comparar*/
                                }
                            }
                            
                        });

                        if(txtCompare1 === txtCompare2){
                            /*busco tr con indice index y agregar style*/
                            $('#'+oSettings.tObjectTable).find('tbody').find('tr').each(function(indice){
                                if(index === indice){
                                    $(this).find('td').css(style);
                                }
                            });
                        }
                    });
                };
                /*renumeracion de numeros, publico*/
                oSettings.fnDrawNumber = function(oSettings){
                    reNumeracion(oSettings);
                };
                
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
                            
                        
                        
                        /*
                         * verificar si se agrega la numeracion
                         * NUMERACION
                        */
                        if(oSettings.tNumeracion){
                            var th = $('<th>Nro.</th>');         /*se crea la columna*/ 
                            th.attr('class','center');
                            th.css('width','35px');
                            tr.append(th);                       /*se agrega al <tr>*/
                        }
                        
                        /*
                         * verificar si se agrega acciones
                         * ACCIONES
                        */
                        /*verificar si es first*/
                        if(oSettings.sPositionAxion.toLowerCase() === 'first'){
                            tr.append(headAxionText(oSettings));
                        }
                        
                        /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                        if(oSettings.sCheckbox.start){
                            var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'first';
                            
                            if(pos.toLowerCase() === 'first'){
                                var th = $('<th></th>');
                                th.html('<input type="checkbox" onclick="simpleScript.checkAll(this,\'#'+oSettings.tObjectTable+'\')">');
                                th.attr('class','center');
                                th.attr('id',oSettings.tObjectTable+'_chkall_0');
                                th.css({'width':'25px','margin':'0px'});
                                tr.append(th);                       /*se agrega al <tr>*/
                            }
                        }
                        
                        /*recorrido de columnas*/
                        for(var c in oSettings.tColumns){
                            var th= $('<th></th>');         /*se crea la columna*/

                            var title = (oSettings.tColumns[c].title !== undefined)?oSettings.tColumns[c].title:'';  
                            var campo = (oSettings.tColumns[c].campo !== undefined)?oSettings.tColumns[c].campo:'';  
                            var sortable = (oSettings.tColumns[c].sortable !== undefined)?' sorting':'';
                            var width = (oSettings.tColumns[c].width !== undefined)?oSettings.tColumns[c].width + oSettings.tWidthFormat:'';
                            var search = (oSettings.tColumns[c].search !== undefined)?oSettings.tColumns[c].search:false;   /*para activar busqueda de columnas*/
                            var pointer = '';
                            
                            if(sortable !== ''){
                                pointer = ' pointer';
                                th.attr('data-order',campo);
                            }
                            /*verificar si se inicio ordenamiento y agegar class a th*/
                            cad = oSettings.tOrderField.split(' ');
                            defaultOrder = '';
                            if(cad[0] === campo){
                                defaultOrder = ' sorting_'+cad[1];
                            }
                            /*activando busqueda de columnas*/
                            if(search){
                                  _searchOk = true;
                            }
                            th.attr('id',oSettings.tObjectTable+'_head_th_'+c);
                            th.attr('class','center'+sortable+pointer+defaultOrder);        /*agregado class css*/
                            th.css({width:width});                                          /*agregando width de columna*/
                            th.html(title);                                                 /*se agrega el titulo*/
                            tr.append(th);                                                  /*se agrega al <tr>*/
                        }
                        
                        /*verificar si se agrega CHECKBOX y si esta en la posicion last*/
                        if(oSettings.sCheckbox.start){
                            var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'last';
                            
                            if(pos.toLowerCase() === 'last'){
                                var th = $('<th></th>');
                                th.attr('class','center');
                                th.css('width','25px');
                                th.html('<input type="checkbox" onclick="$.method.checkAll()" onclick="simpleScript.checkAll(this,\'#'+oSettings.tObjectTable+'\')">');
                                tr.append(th);                       /*se agrega al <tr>*/
                            }
                        }
                        
                        /*verificar si se agrega acciones*/
                        /*verificar si es last*/
                        if(oSettings.sPositionAxion.toLowerCase() === 'last'){
                            tr.append(headAxionText(oSettings));
                        }                        
                        
                        h.html(tr);                 /*se agrega al <thead>*/
                        $('#'+oSettings.tObjectTable).append(h);     /*se agrega al <table>*/
                        
                        /*verificar si tiene botones*/
                        var btns = $('#'+oSettings.tObjectTable+'_btns').length;
                        
                        if(oSettings.tFilter || btns){
                            /*contenedor de filter y botones*/
                            var contTools = $('<div id="'+oSettings.tObjectTable+'_tools" class="dt-row dt-bottom-row borderTools"></div>');
                            $(contTools).insertBefore('#'+oSettings.tObjectTable+'_main');
                            
                            /*renderizar botones*/
                            if(btns){
                                renderButtons(oSettings);
                            }
                        }
                        
                        /*si no existe scrool activar sorting*/
                        if(oSettings.tScrollY === ''){
                            addSorting(oSettings);
                        }
                        /*activando busquedas por columna*/
                        if(_searchOk){
                            searchColumns(oSettings);
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
                        
                        if(data.length){
                            oSettings.sTotal = data[0]['total'];     /*total de registros*/ 
                            /*recorrido de los registros del server*/
                            for(var r in data){
                                n++;
                                var tr = $('<tr></tr>');        /*se crea el tr*/

                                /*verificar si se agrega la numeracion*/
                                if(oSettings.tNumeracion){
                                    var td = $('<td></td>');         /*se crea la columna*/ 
                                    td.html(n);
                                    td.css('width','35px');
                                    td.attr('data-render','0');
                                    tr.append(td);                   /*se agrega al <tr>*/
                                }

                                /*verificar si se agrega ACCIONES*/
                                /*verificar si es first*/
                                if(oSettings.sPositionAxion.toLowerCase() === 'first'){
                                    tr.append(axionButtons(r,data,oSettings));
                                }

                                /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                                if(oSettings.sCheckbox.start){
                                    var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'first';

                                    if(pos.toLowerCase() === 'first'){
                                        tr.append(createCheckbox(oSettings,data,r));        /*se agrega al <tr>*/
                                    }
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

                                /*verificar si se agrega CHECKBOX y si esta en la posicion first*/
                                if(oSettings.sCheckbox.start){
                                    var pos = (oSettings.sCheckbox.possition !== undefined)?oSettings.sCheckbox.possition:'last';

                                    if(pos.toLowerCase() === 'last'){
                                        tr.append(createCheckbox(oSettings,data,r));        /*se agrega al <tr>*/
                                    }
                                }

                                /*verificar si se agrega acciones*/
                                /*verificar si es first*/
                                if(oSettings.sPositionAxion.toLowerCase() === 'last'){
                                    tr.append(axionButtons(r,data,oSettings));
                                }

                                tbody.append(tr);                           /*se agrega al <tbody>*/
                            }
                        }else{
                            oSettings.sTotal = 0;     /*total de registros*/ 
                            var tr = $('<tr></tr>');        /*se crea el tr*/
                            var td = $('<td></td>');         /*se crea la columna*/ 
                            td.html('<div class="alert alert-info center"><i class="fa-info"></i> No se encontraron registros.<div>');
                            
                            tr.append(td);                          /*se agrega al <tr>*/
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
                          
//                        /*crear paginador content*/
//                        var cPag = $('<div></div>');
//                        cPag.attr('id',oSettings.tObjectTable+'_paginate');
//                        cPag.attr('class','dt-row dt-bottom-row top-pagin');
                        
                        /*se crea div row*/
                        var cRow = $('<div></div>');
                        cRow.attr('class','row');                        
                        
                        /*se crea div col-sm-6 para info y btn actualizar*/
                        var cInfoUp = $('<div></div>');
                        cInfoUp.attr('class','col-sm-6');
                        
                        $(cRow).append(cInfoUp);            /*se agrega cInfoUp a div cRow*/
                        
                        /*se verifica si la info se visualizara*/
                        if(oSettings.pInfo){
                            oSettings.iStart = trIni;
                            oSettings.iEnd = trFinOk;
                            /*se crea div _info*/
                            var cInfo = $('<div></div>');
                            cInfo.attr('class','dataTables_info pull-left mr5');
                            cInfo.attr('id',oSettings.tObjectTable+'_info');
                            cInfo.html(trIni+' al '+trFinOk+' de '+total);
                            
                            $(cInfoUp).append(cInfo);           /*se agrega cInfo dentro de div cInfoUp*/
                            
                            var cb = this.cbLength(oSettings);
                            $(cInfoUp).append(cb);                /*se agrega combo cb a cInfoUp*/
                            
                            /*creando boton update*/
                            var btnUp = $('<button></button>');
                            btnUp.attr('type','button');
                            btnUp.attr('id',oSettings.tObjectTable+'_btn_update');
                            btnUp.attr('class','btn btn-primary mr5');
                            btnUp.attr('title','Actualizar');
                            btnUp.html('<i class="fa-refresh"></i>');
                            
                            $(cInfoUp).append(btnUp);           /*se garega btnUp a cInfoUp*/
                            
                            /*creando img loadding*/
                            var imgL = $('<img></img>');
                            imgL.attr('id',oSettings.tObjectTable+'_loadingGrid');
                            imgL.attr('class','hide');
                            imgL.attr('src','public/img/spinner-mini.gif');
                            
                            $(cInfoUp).append(imgL);           /*se garega imgL a cInfoUp*/
                        }
                        
                        if(oSettings.pPaginate){
                            /*se crea div paginador*/
                            var cDivPagin = $('<div></div>');
                            cDivPagin.attr('class','"col-sm-6 text-right');
                            
                            /*se crea div dataTables_paginate*/
                            var cDivTablePagin = $('<div></div>');
                            cDivTablePagin.attr('class','dataTables_paginate paging_bootstrap_full');
                            
                            /*se crea el <ul>*/
                            var ul = $('<ul></ul>');
                            ul.attr('class','pagination');
                            ul.attr('id',oSettings.tObjectTable+'_ul_paginas');
                            
                            /*INICIO BOTONES PRIMERO Y ANTERIOR*/
                            liFirstPrev(ul,oSettings,paginaActual);
                            
                            /*INICIO FOR PARA LA NUMERACION*/
                            for(var i = pagInicio;i <= pagFinal;i++){
                                if(i <= numPaginas){
                                    /*se crea <li> para numeros de paginas*/
                                    var liNumero = $('<li></li>');
                                    /*se crea <a> anterior*/
                                    var aNumero = $('<a></a>');
                                    aNumero.attr('href','javascript:;');
                                    aNumero.html(i);
                                    
                                    if(i === paginaActual){
                                        liNumero.attr('class','num active');
                                    }else{
                                        liNumero.attr('class','num');
                                    }
                                    
                                    $(liNumero).html(aNumero);                /*aNumero dentro de liNumero*/
                                    $(ul).append(liNumero);                  /*liNumero dentro de ul*/
                                }else{
                                    break;
                                }
                            }
                            /*FIN FOR PARA LA NUMERACION*/
                            
                            /*BOTONES ULTIMO Y SIGUIENTE*/
                            liLastNext(ul,oSettings,paginaActual,numPaginas);
                            
                            cDivTablePagin.html(ul);                /*ul dentro de cDivTablePagin*/
                            cDivPagin.html(cDivTablePagin);         /*cDivTablePagin es html de cDivPagin*/
                            $(cRow).append(cDivPagin);           /*se agrega cDivPagin dentro de cRow*/
                        }
                        
                        //cPag.html(cRow);            /*se agrega row a cPag*/
                        $('#'+oSettings.tObjectTable+'_paginate').html(cRow);            /*se agrega row a cPag*/
                        
                        //$('#'+oSettings.tObjectTable+'_paginate').remove();
//                        $(cPag).insertAfter('#'+oSettings.tObjectTable+'_main');
                        
                        /*agregando eventos para paginacion*/
                        $('#'+oSettings.tObjectTable+'_ul_paginas').find('li').each(function(){
                            var n = $(this).is('.num');
                            /*solo los numeros de pagina*/
                            if(n){
                                var activo = $(this).is('.active');     /*numero de pagina actual*/
                                var numero = parseInt($(this).find('a').html());
                                
                                
                                /*evento a numeros inactivos*/
                                if(!activo){
                                    $(this).find('a').click(function(){
                                        oSettings.pDisplayStart = numero-1; 
                                        $.method.sendAjax(oSettings);
                                    });
                                }else{
                                    /*agregando evento a boton actualizar*/
                                    $('#'+oSettings.tObjectTable+'_btn_update').click(function(){
                                        oSettings.pDisplayStart = numero-1; 
                                        $.method.sendAjax(oSettings);
                                    });
                                }
                            }
                        });
                        
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
                        /*crear paginador content*/
                        var cPag = $('<div></div>');
                        cPag.attr('id',oSettings.tObjectTable+'_paginate');
                        cPag.attr('class','dt-row dt-bottom-row top-pagin');
                        
                        $(cPag).insertAfter('#'+oSettings.tObjectTable+'_main');
                        
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
                        _aData.push({name: 'sFilterCols', value: simpleAjax.stringPost(oSettings.sFilterCols)});

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
                               
                                /*se ejecuta callback*/
                                if(oSettings.fnCallback !== 0){//si existe callback
                                    var callback = oSettings.fnCallback;
                                    oSettings.data = data;
                
                                    callback(oSettings);
                                    
                                }
                                
                                $('#'+_Grid+'_loadingGrid').addClass('hide');
                                
                                /*si se activo scrool renderizar header*/
                                if(oSettings.tScrollY !== ''){
                                    resizeHeader(oSettings);
                                }
                            }
                        });
                    }                    
                    
                };
                
                $.method.ini();
                
            });
        }
        
    });
   
})(jQuery);