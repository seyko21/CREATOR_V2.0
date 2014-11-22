var configurarRoles_ = function() {

    /*cargar requires*/
    simpleObject.require({
        roles: 'configurarRolesScript'
    });

    var _private = {};

    _private.config = {
        modulo: 'roles/configurarRoles/'
    };

    _private.idRol = 0;

    this.public = {};

    this.public.main = function() {
        try {
            simpleScript.addTab({
                id: tabs.T1,
                label: simpleObject.getTitle(),
                fnCallback: function() {
                    configurarRoles.getCont();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.getCont = function() {
        try {
            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo,
                fnCallback: function(data) {
                    $('#' + tabs.T1 + '_CONTAINER').html(data);
                    configurarRoles.getGridRoles();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.getGridRoles = function() {
        try {
            var oTable = $('#' + tabs.T1 + 'gridRoles').dataTable({
                bProcessing: true,
                bServerSide: true,
                bDestroy: true,
                sPaginationType: "bootstrap_full", //two_button
                sServerMethod: "POST",
                bPaginate: true,
                iDisplayLength: 10,
                aoColumns: [
                    {sTitle: "Código", sClass: "center", sWidth: "10%"},
                    {sTitle: "Rol", sWidth: "50%"},
                    {sTitle: "Estado", sWidth: "10%", sClass: "center", bSortable: false},
                    {sTitle: "Acciones", sWidth: "15%", sClass: "center", bSortable: false}
                ],
                aaSorting: [[1, 'asc']],
                sScrollY: "300px",
                sAjaxSource: _private.config.modulo + 'getRoles',
                fnDrawCallback: function() {
                    $('#' + tabs.T1 + 'gridRoles_filter').find('input').attr('placeholder', 'Buscar por rol');

                    simpleScript.enterSearch('#' + tabs.T1 + 'gridRoles', oTable);
                    /*para hacer evento invisible*/
                    simpleScript.removeAttr.click({
                        container: '#widget_' + tabs.T1 + 'roles',
                        typeElement: 'button'
                    });
                    $(window).resize(function() {
                        //oTable.fnAdjustColumnSizing();
                    });
                    $('#' + tabs.T1 + 'refresh').click(function() {
                        oTable.fnReloadAjax(oTable.fnSettings());
                    });
                },
                fnInfoCallback: function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    return '<button id="' + tabs.T1 + 'refresh" class="btn btn-primary" title="Actualizar"><i class="fa-refresh"></i></button> ' + iStart + " al " + iEnd + ' de ' + iTotal;
                }
            });
            setup_widgets_desktop();
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.getNuevoRol = function() {
        try {
            simpleAjax.send({
                element: '#CRDCRbtnNew',
                dataType: 'html',
                root: _private.config.modulo + 'nuevoRol',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#CRDCRformNuevoRol').modal('show');
                    configurarRolesScript.validateRol({
                        form: '#CRDCRformNuevoRol',
                        evento: 'configurarRoles.postRol()'
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*extraer rol para editar*/
    this.public.getRol = function() {
        try {
            _private.idRol = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'editarRol',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idRol});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);
                    $('#CRDCRformEditRol').modal('show');
                    configurarRolesScript.validateRol({
                        form: '#CRDCRformEditRol',
                        evento: 'configurarRoles.postEditRol()'
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*los accesos del rol*/
    this.public.getAccesos = function() {
        try {
            _private.idRol = simpleScript.getParam(arguments[0]);
            var rol = simpleScript.getParam(arguments[1]);

            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'accesos',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idRol});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);
                    $('#CRDCRformAccesos').modal('show');
                    $('#cont-rol').html(rol);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*los acciones del rol opcion*/
    this.public.getAccionesRolOpcion = function() {
        try {
            var contAccion = simpleScript.getParam(arguments[0]);
            var idRolOpcion = simpleScript.getParam(arguments[1]);
            simpleAjax.send({
                dataType: 'html',
                element: '#btn_' + contAccion,
                abort: false,
                root: _private.config.modulo + 'accesosRolOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_rolOpcion', value: idRolOpcion});
                },
                fnCallback: function(data) {
                    $('.accionesOpcion-cont').fadeOut();
                    $('#cont-acciones' + contAccion).html(data);
                    $('#cont-acciones' + contAccion).fadeIn();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postRol = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#CRDCRbtnGrabaRol',
                root: _private.config.modulo + 'postRol',
                form: '#CRDCRformNuevoRol',
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarRoles.getGridRoles();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_4
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postEditRol = function() {
        try {
            simpleAjax.send({
                flag: 3,
                element: '#CRDCRbtnEditaRol',
                root: _private.config.modulo + 'postRol',
                form: '#CRDCRformEditRol',
                clear: true,
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: _private.idRol});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarRoles.getGridRoles();
                                simpleScript.closeModal('#CRDCRformEditRol');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_4
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*eliminar rol*/
    this.public.postDeleteRol = function() {
        try {
            _private.idRol = simpleScript.getParam(arguments[0]);

            simpleScript.notify.confirm({
                content: mensajes.MSG_5,
                callbackSI: function() {
                    simpleAjax.send({
                        flag: 2,
                        gifProcess: true,
                        root: _private.config.modulo + 'postDeleteRol',
                        fnServerParams: function(sData) {
                            sData.push({name: '_key', value: _private.idRol});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                simpleScript.notify.ok({
                                    content: mensajes.MSG_6,
                                    callback: function() {
                                        configurarRoles.getGridRoles();
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

    /*agregar opcion a rol*/
    this.public.postOpcion = function() {
        try {
            var radio = simpleScript.getParam(arguments[0]);
            var flag = simpleScript.getParam(arguments[1]);
            var idRol = simpleScript.getParam(arguments[2]);
            var idOpcion = simpleScript.getParam(arguments[3]);

            simpleAjax.send({
                flag: flag,
                gifProcess: true,
                root: _private.config.modulo + 'postOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: idRol});
                    sData.push({name: '_opcion', value: idOpcion});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        /*se activa boton acciones y se agrega evento*/
//                    alert(simpleAjax.stringGet(idRol)+simpleAjax.stringGet(idOpcion)+'---'+idOpcion)
                        $('#btn_' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion) + '').attr('disabled', false);
                        simpleScript.setEvent.click({
                            element: '#btn_' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion),
                            event: 'configurarRoles.getAccionesRolOpcion(\'' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion) + '\',simpleAjax.stringPost(\'' + data.id_rolopciones + '\'));'
                        });
                        /*se cambia ebento para que elimine*/
                        $(radio).attr("onclick", "");
                        simpleScript.setEvent.click({
                            element: radio,
                            event: "configurarRoles.postOpcion(this,5,'" + idRol + "','" + idOpcion + "')"
                        });
                        simpleScript.notify.ok({
                            content: mensajes.MSG_3
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: mensajes.MSG_4
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
//                    alert(simpleAjax.stringGet(idRol)+simpleAjax.stringGet(idOpcion)+'---'+idOpcion)
                        /*se desactiva boton acciones y quita evento*/
                        $('#btn_' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion) + '').attr('disabled', true).removeAttr('onclick');
                        $('#btn_' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion) + '').off('click');
                        /*se cambia evento para que agregue*/
                        $(radio).attr("onclick", "");
                        simpleScript.setEvent.click({
                            element: radio,
                            event: "configurarRoles.postOpcion(this,4,'" + idRol + "','" + idOpcion + "')"
                        });
                        simpleScript.notify.ok({
                            content: mensajes.MSG_6
                        });
                        /*se limpia contenedor de acciones*/
                        $('#cont-acciones' + simpleAjax.stringGet(idRol) + simpleAjax.stringGet(idOpcion) + '').html('');
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postAccionOpcionRol = function() {
        try {
            var flag = simpleScript.getParam(arguments[0]);
            var rolOpcion = simpleScript.getParam(arguments[1]);
            var accion = simpleScript.getParam(arguments[2]);

            simpleAjax.send({
                flag: flag,
                gifProcess: true,
                abort: false,
                root: _private.config.modulo + 'postAccionOpcionRol',
                fnServerParams: function(sData) {
                    sData.push({name: '_accion', value: accion});
                    sData.push({name: '_opcion', value: rolOpcion});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: mensajes.MSG_3
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.ok({
                            content: mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    this.public.postDuplicarRol = function(btn, id) {
        try {
            simpleAjax.send({
                element: btn,
                root: _private.config.modulo + 'duplicarRol',
                fnServerParams: function(sData) {
                    sData.push({name: '_key', value: id});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: 'Rol se duplicó correctamente',
                            callback: function() {
                                configurarRoles.getGridRoles();
                            }
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return this.public;

};
var configurarRoles = new configurarRoles_();

configurarRoles.main();