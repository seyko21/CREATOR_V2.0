var auditoria_ = function() {

    var _private = {};

    _private.config = {
        modulo: 'auditoria/auditoria/'
    };

    var _public = {};

    _public.logAuditoria = function(txt) {
        simpleAjax.send({
            root: _private.config.modulo + 'logAuditoria',
            fnServerParams: function(sData) {
                sData.push({name: '_txt', value: txt});
            }
        });
    };

    /*para creacion de dataGrid, borrar despues*/
    _public.logErrors = function(txt) {
        simpleAjax.send({
            root: _private.config.modulo + 'logErrors',
            fnServerParams: function(sData) {
                sData.push({name: '_txt', value: txt});
            }
        });
    };

    return _public;
};

var auditoria = new auditoria_();