var acciones_ = function() {

    /*cargar requires*/
    simpleObject.require({
        roles: 'accionesScript'
    });

    var _private = {};

    _private.config = {
        klass: 'acciones',
        modulo: 'roles/acciones/'
    };

    _private.idAccion = 0;

    this.public = {};

    this.public.main = function() {
        try {
            simpleScript.addTab({
                id: tabs.T2,
                label: simpleObject.getTitle(),
                fnCallback: function() {
                    acciones.index();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.index = function() {
        try {
            simpleAjax.send({
                klass: _private.config.klass,
                dataType: 'html',
                root: _private.config.modulo,
                fnCallback: function(data) {
                    $('#' + tabs.T2 + '_CONTAINER').html(data);
                    acciones.getGridAcciones();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.getGridAcciones = function() {
        try {
            var oTable = $('#' + tabs.T2 + 'gridAcciones').dataTable({
                bProcessing: true,
                bServerSide: true,
                bDestroy: true,
                sPaginationType: "bootstrap_full", //two_button
                sServerMethod: "POST",
                bPaginate: true,
                iDisplayLength: 10,
                aoColumns: [
                    {sTitle: "Código", sClass: "center", sWidth: "10%"},
                    {sTitle: "Acción", sWidth: "25%"},
                    {sTitle: "Diseño", sWidth: "15%", sClass: "center", bSortable: false},
                    {sTitle: "Alias", sWidth: "10%"},
                    {sTitle: "Estado", sWidth: "10%", sClass: "center", bSortable: false},
                    {sTitle: "Acciones", sWidth: "15%", sClass: "center", bSortable: false}
                ],
                aaSorting: [[1, 'asc']],
                sScrollY: "300px",
                sAjaxSource: _private.config.modulo + 'getAcciones',
                fnDrawCallback: function() {
                    $('#' + tabs.T2 + 'gridAcciones_filter').find('input').attr('placeholder', 'Buscar por acción');

                    simpleScript.enterSearch('#' + tabs.T2 + 'gridAcciones', oTable);

                    /*para hacer evento invisible*/
                    simpleScript.removeAttr.click({
                        container: '#widget_' + tabs.T2 + 'acciones',
                        typeElement: 'button'
                    });
                    $('#' + tabs.T2 + 'refresh').click(function() {
                        oTable.fnReloadAjax(oTable.fnSettings());
                    });
                },
                fnInfoCallback: function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    return '<button id="' + tabs.T2 + 'refresh" class="btn btn-primary" title="Actualizar"><i class="fa-refresh"></i></button> ' + iStart + " al " + iEnd + ' de ' + iTotal;
                }
            });
            setup_widgets_desktop();
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.getNuevaAccion = function(btn) {
        try {
            var bt = '#CRDACbtnNew';
            if (btn !== undefined) {
                bt = btn;
            }
            simpleAjax.send({
                klass: _private.config.klass,
                element: bt,
                dataType: 'html',
                root: _private.config.modulo + 'nuevaAccion',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#CRDACformNuevaAccion').modal('show');
                    accionesScript.validateAccion({
                        form: '#CRDACformNuevaAccion',
                        evento: 'acciones.postAccion()'
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*extraer rol para editar*/
    this.public.getAccion = function() {
        try {
            _private.idAccion = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'editAccion',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idAccion});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);
                    $('#CRDACformEditAccion').modal('show');
                    accionesScript.validateAccion({
                        form: '#CRDACformEditAccion',
                        evento: 'acciones.postEditAccion()'
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postAccion = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#CRDACbtnGrabaAccion',
                root: _private.config.modulo + 'postAccion',
                form: '#CRDACformNuevaAccion',
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: mensajes.MSG_3,
                            callback: function() {
                                acciones.getGridAcciones();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: 'Acción ya existe'
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: 'Alias ya existe'
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postEditAccion = function() {
        try {
            simpleAjax.send({
                flag: 2,
                element: '#CRDACbtnEditaAccion',
                root: _private.config.modulo + 'postAccion',
                form: '#CRDACformEditAccion',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idAccion});
                },
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: mensajes.MSG_3,
                            callback: function() {
                                acciones.getGridAcciones();
                                simpleScript.closeModal('#CRDACformEditAccion');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: 'Acción ya existe'
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: 'Alias ya existe'
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postDeleteAccion = function() {
        try {
            _private.idAccion = simpleScript.getParam(arguments[0]);

            simpleScript.notify.confirm({
                content: mensajes.MSG_5,
                callbackSI: function() {
                    simpleAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'postDeleteAccion',
                        fnServerParams: function(sData) {
                            sData.push({name: '_key', value: _private.idAccion});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                simpleScript.notify.ok({
                                    content: mensajes.MSG_6,
                                    callback: function() {
                                        acciones.getGridAcciones();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return this.public;

};
var acciones = new acciones_();

acciones.main();
//acciones.ff=function(){alert(arguments.callee)
//    for(var i in arguments.callee.prototype){
//        alert(i+'--'+arguments.callee.prototype[i])
//    }
//};
//
//acciones.ff();
//
//alert(Array.prototype.slice.call(arguments, 1))

//var t = 'nacio-nales';
//alert(t.indexOf('o-na'))
//
//
