var login_ = function() {

    /*cargar requires*/
    simpleObject.require({
        index: 'loginScript'
    });

    var _private = {};

    _private.config = {
        modulo: 'index/'
    };

    this.public = {};

    this.public.postEntrar = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#btnEntrar',
                root: _private.config.modulo + 'login',
                fnServerParams: function(sData) {
                    sData.push({name: '_user', value: simpleAjax.stringPost($('#txtUser').val())});
                    sData.push({name: '_clave', value: simpleAjax.stringPost($('#txtClave').val())});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.id_usuario) && data.id_usuario > 0) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_2,
                            callback: function() {
                                simpleScript.redirect('index');
                            }
                        });
                    } else {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_1
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*para creacion de dataGrid, borrar despues*/
    this.public.dataGrid = function() {
        try {
            return _private.config.modulo + 'index/dataGrid';
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    /*para cargar lst de modulos en grilla*/
    this.public.listModulos = function() {
        try {
            return _private.config.modulo + 'index/listaModulos';
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return this.public;
};

var login = new login_();