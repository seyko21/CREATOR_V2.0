var configurarUsuarios_ = function(){
    
    /*cargar requires*/
    simpleObject.require({
        usuarios: 'configurarUsuariosScript'
    });
    
    var _private = {};
    
    _private.idUsuario = 0;
    
    _private.tab = 0;
    
    _private.config = {
        modulo: 'usuarios/configurarUsuarios/'
    };
    
    this.public = {};
    
    this.public.main = function(){
        simpleScript.addTab({
            id : tabs.T4,
            label: simpleObject.getTitle(),
            fnCallback: function(){
                configurarUsuarios.getCont();
            }
        });
    };
    
    this.public.getCont = function(){
        simpleAjax.send({
            dataType: 'html',
            root: _private.config.modulo,
            fnCallback: function(data){
                $('#'+tabs.T4+'_CONTAINER').html(data);
                configurarUsuarios.getGridUsuarios();
            }
        });
    };
    
    this.public.getGridUsuarios = function (){
        var oTable = $('#'+tabs.T4+'gridUsuariosx').dataTable({
            bProcessing: true,
            bServerSide: true,
            bDestroy: true,
            sPaginationType: "bootstrap_full", //two_button
            sServerMethod: "POST",
            bPaginate: true,
            iDisplayLength: 10,            
            aoColumns: [
                {sTitle: "Usuario",sWidth: "20%"},
                {sTitle: "Nombres", sWidth: "25%"},
                {sTitle: "Roles", sWidth: "20%", bSortable: false},
                {sTitle: "Estado", sWidth: "8%",  sClass: "center", bSortable: false},
                {sTitle: "Ultimo acceso", sWidth: "12%", sClass: "center", bSortable: false},
                {sTitle: "Acciones", sWidth: "8%", sClass: "center", bSortable: false}
            ],
            aaSorting: [[1, 'asc']],
            sScrollY: "300px",
            sAjaxSource: _private.config.modulo+'getUsuarios',
            fnDrawCallback: function() {
                $('#'+tabs.T4+'gridUsuariosx_filter').find('input').attr('placeholder','Buscar por nombres');
                simpleScript.enterSearch('#'+tabs.T4+'gridUsuariosx',oTable);
                /*para hacer evento invisible*/
                simpleScript.removeAttr.click({
                    container: '#widget_'+tabs.T4+'usuarios',
                    typeElement: 'button'
                });
                $('#'+tabs.T4+'refresh').click(function(){
                    oTable.fnReloadAjax(oTable.fnSettings());
                });
            },
            fnInfoCallback: function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                return '<button id="'+tabs.T4+'refresh" class="btn btn-primary" title="Actualizar"><i class="fa-refresh"></i></button> '+iStart +" al "+ iEnd+' de '+iTotal;
            }
        });
        setup_widgets_desktop();
    };
    
    this.public.getNuevoUsuario = function(btn){
        simpleAjax.send({
            element: btn,
            dataType: 'html',
            root: _private.config.modulo + 'nuevoUsuario',
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T4+'formUsuario').modal('show');
            }
        });
    };
    
    this.public.getEditUsuario = function(btn,id){
        _private.idUsuario = id;
        
        simpleAjax.send({
            element: btn,
            dataType: 'html',
            root: _private.config.modulo + 'editarUsuario',
            fnServerParams: function(sData){
                sData.push({name: '_idUsuario', value: _private.idUsuario});
            },
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T4+'formUsuario').modal('show');
            }
        });
    };
    
    this.public.getFormEmpleado = function(btn,tab){
        _private.tab = tab;
        simpleAjax.send({
            element: btn,
            dataType: 'html',
            root: _private.config.modulo + 'buscarEmpleado',
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T4+'formBuscarEmpleado').modal('show');
            }
        });
    };
    
    this.public.getEmpleados = function(){
        $('#'+tabs.T4+'gridEmpleadosFound_filter').remove();
        $('#'+tabs.T4+'gridEmpleadosFound').dataTable({
            bProcessing: true,
            bServerSide: true,
            bDestroy: true,
            sServerMethod: "POST",
            bPaginate: false,
            aoColumns: [
                {sTitle: "Nro.", sClass: "center",sWidth: "2%",  bSortable: false},
                {sTitle: "Nombres y Apellidos", sWidth: "88%"}
            ],
            aaSorting: [[1, 'asc']],
            sScrollY: "250px",
            sAjaxSource: _private.config.modulo+'getEmpleados',
            fnServerParams: function(aoData) {
                aoData.push({"name": tabs.T4+"_term", "value": $('#'+tabs.T4+'txt_search').val()});
                aoData.push({"name": "_tab", "value": _private.tab});
            },
            fnDrawCallback: function() {
                $('#'+tabs.T4+'gridEmpleadosFound_filter').remove();
                $('#'+tabs.T4+'gridEmpleadosFound_wrapper').find('.dt-bottom-row').remove();
                $('#'+tabs.T4+'gridEmpleadosFound_wrapper').find('.dataTables_scrollBody').css('overflow-x','hidden');
                /*para hacer evento invisible*/
                simpleScript.removeAttr.click({
                    container: '#'+tabs.T4+'gridEmpleadosFound',
                    typeElement: 'a'
                });
            }
        });
        $('#'+tabs.T4+'gridEmpleadosFound_filter').remove();
    };
    
    this.public.postNuevoUsuario = function(){
        simpleAjax.send({
            flag: 1,
            element: '#'+tabs.T4+'btnGrabaAccion',
            root: _private.config.modulo + 'postNuevoUsuario',
            form: '#'+tabs.T4+'formUsuario',
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarUsuarios.getGridUsuarios();
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confUsuario.USUSI
                    });
                }
            }
        });
    };
    
    this.public.postEditarUsuario = function(){
        simpleAjax.send({
            flag: 3,
            element: '#'+tabs.T4+'btnGrabaAccion',
            root: _private.config.modulo + 'postEditarUsuario',
            form: '#'+tabs.T4+'formUsuario',
            fnServerParams: function(sData){
                sData.push({name: '_idUsuario', value: _private.idUsuario});
            },
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            _private.idUsuario = 0;
                            configurarUsuarios.getGridUsuarios();
                            simpleScript.closeModal('#'+tabs.T4+'formUsuario');
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confUsuario.USUSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.confUsuario.EMASI 
                    });
                }
            }
        });
    };
    
    this.public.postDeleteUsuario = function(){
        var id = simpleScript.getParam(arguments[0]);
        
        simpleScript.notify.confirm({
            content: lang.mensajes.MSG_5,
            callbackSI: function(){
                simpleAjax.send({
                    flag: 3,
                    gifProcess: true,
                    root: _private.config.modulo + 'postDeleteUsuario',
                    fnServerParams: function(sData){
                        sData.push({name: '_key', value: id});
                    },
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: lang.mensajes.MSG_6,
                                callback: function(){
                                    configurarUsuarios.getGridUsuarios();
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    return this.public;
    
};
 var configurarUsuarios = new configurarUsuarios_();
 
 configurarUsuarios.main();