var opcion_ = function() {

    /*cargar requires*/
    simpleObject.require({
        fabrica: 'opcionScript'
    });

    var _private = {};

    _private.idModulo = 0;

    _private.db = 0;

    _private.tabla = 0;

    _private.campo = '';

    _private.config = {
        modulo: 'fabrica/opcion/'
    };

    var _public = {};

    _public.main = function(id, mod) {
        try {
            _private.idModulo = id; /*modulo al q se esta configurando una opcion*/

            simpleScript.addTab({
                id: tabs.T6,
                label: simpleObject.getTitle(),
                fnCallback: function() {
                    opcion.getIndex(mod);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    _public.getIndex = function(modulo) {
        try {
            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo,
                fnServerParams: function(sData) {
                    sData.push({name: '_modulo', value: modulo});
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    $('#' + tabs.T6 + '_CONTAINER').html(data);
                    simpleScript.activeTab(tabs.T6);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    _public.getUnique = function(navigation, baseItemSelector, index, tipo) {
        try {
            simpleAjax.send({
                gifProcess: true,
                root: _private.config.modulo + 'unique',
                form: '#' + tabs.T6 + 'formOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    opcionScript.validaOpcion(data, navigation, baseItemSelector, index, tipo);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    _public.getTablesDB = function(db) {
        try {
            _private.db = db;
            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo + 'formTablesDB',
                fnServerParams: function(sData) {
                    sData.push({name: '_db', value: _private.db});
                },
                fnCallback: function(data) {
                    $('#' + tabs.T6 + 'cont-tables').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    _public.getHtmlColumnas = function(el, tab) {
        try {
            /*si es otra tabla traera sus campos, si es el mismo no pasa*/
            if (_private.tabla === tab) {
                return false;
            }
            opcionScript.marcaTable(el);

            _private.tabla = tab;

            simpleAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'formHtmlColumnas',
                fnServerParams: function(sData) {
                    sData.push({name: '_db', value: _private.db});
                    sData.push({name: '_tabla', value: _private.tabla});
                },
                fnCallback: function(data) {
                    $('#' + tabs.T6 + 'cont-columns').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    /*formulario para congirurar data de DB*/
    _public.getFormData = function(el, f) {
        try {
            _private.campo = $('#' + f + 'chk_usar').val(); //campo q se esta configurando
            opcionScript.setFilaEtiq(0);

            simpleAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'formData',
                fnServerParams: function(sData) {
                    sData.push({name: '_tipoData', value: el});
                    sData.push({name: '_element', value: $('#' + f + 'lst_tipo').val()});
                    sData.push({name: '_campo', value: _private.campo});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T6 + 'formData').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    _public.postCrear = function(btn) {
        try {
            simpleAjax.send({
                element: btn,
                root: _private.config.modulo + 'crear',
                form: '#' + tabs.T6 + 'formOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    if (parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.opcion.OPOK
                        });
                        /*cerrar tab*/
                        simpleScript.closeTab(tabs.T6);
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEtiquetasFijas = function() {
        try {
            simpleAjax.send({
                element: '#' + tabs.T6 + 'btnGr',
                root: _private.config.modulo + 'guardarEtiquetasFijas',
                form: '#' + tabs.T6 + 'formData',
                fnServerParams: function(sData) {
                    sData.push({name: '_campo', value: _private.campo});
                },
                fnCallback: function(data) {
                    if (parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: mensajes.MSG_3
                        });
                        /*cerrar tab*/
                        simpleScript.closeModal('#' + tabs.T6 + 'formData');
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return _public;

};
var opcion = new opcion_();