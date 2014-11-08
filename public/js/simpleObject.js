var simpleObject_ = function() {

    var _private = {};

    _private.root = function(m) {
        return 'modules/' + m + '/views/js/';
    };

    _private.title = '';

    _private.jsArray = {};

    _private.jsArrayId = {};

    _private.createScript = function(scriptId, scriptName, callback) {
        /*verificar si archivo existe*/
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'script_' + scriptId;
        script.src = scriptName + '.js';

        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        //script.onreadystatechange = callback;
        script.onload = callback;

        body.appendChild(script);
        $('#script_' + scriptId).remove();
    };

    _private.executeMain = function(scriptId) {
        /*verifico si existe la funcion para ejecutarla*/
        if (eval(_private.jsArrayId[scriptId]).main instanceof Object) {
            eval(_private.jsArrayId[scriptId] + '.main();');
        }
    };

    var _publico = {};

    _publico.getTitle = function() {
        return _private.title;
    };

    _publico.init = function(module, scriptName, tthis, callback) {
        _private.title = $(tthis).attr('title');

        var scriptId = scriptName;

        if (_private.jsArrayId[scriptId] === undefined) {
            _private.jsArrayId[scriptId] = scriptId;
        }

        scriptName = _private.root(module) + scriptName;

        if (!_private.jsArray[scriptName]) {
            _private.jsArray[scriptName] = true;

            _private.createScript(scriptId, scriptName, callback);
            
        } else if (callback) {// changed else to else if(callback)
            //execute function
            callback();
        } else if (_private.jsArray[scriptName]) {
            _private.executeMain(scriptId);
        }
    };

    /*para incluir archivos*/
    _publico.require = function(requires){
        for(var i in requires){
            if (!_private.jsArray[requires[i]]) {
                _private.jsArray[requires[i]] = true;
                var scriptName = _private.root(i) + requires[i]; 
                _private.createScript(requires[i], scriptName);
            }
        }
    };
    
    return _publico;
};
var simpleObject = new simpleObject_();