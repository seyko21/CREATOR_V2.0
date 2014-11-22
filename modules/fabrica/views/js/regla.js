/*
 * ---------------------------------------
 * --------- CREATED BY CREATOR ----------
 * fecha: 21-08-2014 01:08:14 
 * Descripcion : regla.js
 * ---------------------------------------
 */
var regla_ = function() {

    /*metodos privados*/
    var _private = {};

    _private.idRegla = 0;

    _private.config = {
        modulo: "fabrica/regla/"
    };

    /*metodos publicos*/
    this.publico = {};

    /*crea tab : Regla*/
    this.publico.main = function() {
        try {
            simpleScript.addTab({
                id: tabs.REG,
                label: simpleObject.getTitle(),
                fnCallback: function() {
                    regla.getContenido();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    /*contenido de tab: Regla*/
    this.publico.getContenido = function() {
        try {
            simpleAjax.send({
                dataType: "html",
                root: _private.config.modulo,
                fnCallback: function(data) {
                    $("#" + tabs.REG + "_CONTAINER").html(data);
                    regla.getGridRegla();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    this.publico.getGridRegla = function() {
        /*------------------LOGICA PARA DATAGRID------------------------*/
    };

    this.publico.getFormNewRegla = function(btn) {
        try {
            simpleAjax.send({
                element: btn,
                dataType: "html",
                root: _private.config.modulo + "getFormNewRegla",
                fnCallback: function(data) {
                    $("#cont-modal").append(data);  /*los formularios con append*/
                    $("#" + tabs.REG + "formNewRegla").modal("show");
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    this.publico.postNewRegla = function() {
        /*-----LOGICA PARA ENVIO DE FORMULARIO-----*/
    };

    this.publico.postDeleteReglaAll = function(btn) {
        try {
            simpleScript.validaCheckBox({
                id: "#" + tabs.REG + "gridRegla",
                msn: lang.mensajes.MSG_9,
                fnCallback: function() {
                    simpleScript.notify.confirm({
                        content: lang.mensajes.MSG_7,
                        callbackSI: function() {
                            simpleAjax.send({
                                flag: 3, //si se usa SP usar flag, sino se puede eliminar esta linea
                                element: btn,
                                form: "#" + tabs.REG + "formGridRegla",
                                root: _private.config.modulo + "postDeleteReglaAll",
                                fnCallback: function(data) {
                                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                        simpleScript.notify.ok({
                                            content: lang.mensajes.MSG_8,
                                            callback: function() {
                                                regla.getGridRegla();
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }

    };

    return this.publico;

};
var regla = new regla_();

regla.main();