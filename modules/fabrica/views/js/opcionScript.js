var opcionScript_ = function() {
    
    var _private = {};
    
    _private.filEtiq = 0;
    
    _private.filEtiqDel = 0;
    
    var _public = {};

    _public.validaOpcion = function(data, navigation, baseItemSelector, index, tipo) {
        if (parseInt(data.result1) > 0 || parseInt(data.result2) === 3) {/*si existe*/
            simpleScript.notify.error({
                content: lang.opcion.OPEX
            });
            navigation.find(baseItemSelector + ':eq(0) a').tab('show');
            return false;
        }
        if (parseInt(data.prefijo) > 0) {/*si existe*/
            simpleScript.notify.error({
                content: lang.opcion.PREEX
            });
            navigation.find(baseItemSelector + ':eq(0) a').tab('show');
            return false;
        }
        if (parseInt(data.existModulo) === 0) {
            simpleScript.notify.error({
                content: 'Módulo: ' + data.modulo + ' no existe'
            });
            navigation.find(baseItemSelector + ':eq(0) a').tab('show');
            return false;
        }
        /*opcion no existe*/
        if (parseInt(data.result1) === 0 && parseInt(data.result2) === 1 && parseInt(data.prefijo) === 0) {
            switch (tipo.toString()) {
                case 'B': //basico
                    /*si es Basica pasa hasta el paso final*/
                    navigation.find(baseItemSelector + ':eq(3) a').tab('show');
                    /*marca el paso como completado*/
                    opcionScript.nextPaso('#bootstrap-wizard-1', index);
                    return false;
                    break;
                case 'M': //mantenedor
                    navigation.find(baseItemSelector + ':eq(1) a').tab('show');

                    /*marca el paso como completado*/
                    opcionScript.nextPaso('#bootstrap-wizard-1', index);

                    /*carga las tabals de db al ingresar al tab formulario*/
                    opcion.getTablesDB(data.db);
                    return false;
                    break;
            }
        }
    };

    _public.marcaTable = function(el) {
        $('#' + tabs.T6 + 'cont-tables').find('.h').removeClass('verdeT');
        $(el).addClass('verdeT');
    };

    _public.enableCols = function(el, fila) {
        if ($(el).is(':checked')) {//activar elementos
            $('#' + tabs.T6 + fila + 'chk_key').attr('disabled', false).parent().removeClass('state-disabled');
            $('#' + tabs.T6 + fila + 'txt_id').attr('disabled', false);
            $('#' + tabs.T6 + fila + 'txt_name').attr('disabled', false);
            $('#' + tabs.T6 + fila + 'txt_etiqueta').attr('disabled', false);
            $('#' + tabs.T6 + fila + 'lst_tipo').attr('disabled', false);
            $('#' + tabs.T6 + fila + 'chk_ayuda').attr('disabled', false).parent().removeClass('state-disabled');
            $('#' + tabs.T6 + fila + 'chk_validar').attr('disabled', false).parent().removeClass('state-disabled');
        } else {
            $('#' + tabs.T6 + fila + 'chk_key').attr('disabled', true).parent().addClass('state-disabled');
            $('#' + tabs.T6 + fila + 'txt_id').attr('disabled', true);
            $('#' + tabs.T6 + fila + 'txt_name').attr('disabled', true);
            $('#' + tabs.T6 + fila + 'txt_etiqueta').attr('disabled', true);
            $('#' + tabs.T6 + fila + 'lst_tipo').attr('disabled', true);
            $('#' + tabs.T6 + fila + 'chk_ayuda').attr('disabled', true).parent().addClass('state-disabled');
            $('#' + tabs.T6 + fila + 'chk_validar').attr('disabled', true).parent().addClass('state-disabled');
        }
    };

    _public.enableAyuda = function(el, fila) {
        if ($(el).is(':checked')) {//activar elementos
            $('#' + tabs.T6 + fila + 'txt_ayuda').attr('disabled', false);
        } else {
            $('#' + tabs.T6 + fila + 'txt_ayuda').attr('disabled', true);
        }
    };

    _public.enableCols2 = function(el, fila) {
        $('#' + tabs.T6 + fila + 'lst_tipodata').attr('disabled', true).val('');

        if (el.value === 'select' || el.value === 'radio' || el.value === 'checkbox') {
            $('#' + tabs.T6 + fila + 'lst_tipodata').attr('disabled', false);
        }
    };

    _public.nextPaso = function(wizard, index) {
        $(wizard).find('.form-wizard').children('li').eq(index - 1).addClass('complete');
        $(wizard).find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
    };

    _public.addEtiqueta = function() {
        _private.filEtiq++;
        
        var li = '\
        <li id="trEtiq'+_private.filEtiq+'" class="etiq">\n\
            <label class="input pull-left" style="width: 50%;">\n\
                <input type="text" id="" name="' + tabs.T6 + 'txt_etiqueta_campo[]" onfocus="opcionScript.setFilaDelete('+_private.filEtiq+');">\n\
            </label>\n\
            <label class="input pull-right" style="width: 50%">\n\
                <input type="text" id="" name="' + tabs.T6 + 'txt_value_campo[]" onfocus="opcionScript.setFilaDelete('+_private.filEtiq+');">\n\
            </label>\n\
            <div class="clearfix"></div>\n\
        </li>';
        $('#' + tabs.T6 + 'tabEtiquetas').find('tbody').find('ul').append(li);
    };

    _public.setFilaDelete = function(f){
        _private.filEtiqDel = f;
    };
    
    _public.deleteEtiqueta = function(){
        $('#trEtiq'+_private.filEtiqDel).remove();
    };
    
    _public.setFilaEtiq = function(f){
        _private.filEtiq = f;
    };
    
    _public.showFormValidate = function(k){
        $('.validaV').hide();
        $('#' + tabs.T6 + k +'formValidate').fadeIn();
    };
    
    _public.activeTxt = function(chk,el){
        if($(chk).is(':checked')){
            $(el).attr('disabled',false);
        }else{
            $(el).attr('disabled',true);
            $(el).val('');
        }
    };
    
    _public.validaNumber = function(el,el2){
        if(isNaN($(el).val()) || parseFloat($(el).val()) === 0){
            $(el).val('');
            return false;
        }
        
        if(el2 !== undefined){
            if(isNaN($(el2).val()) || parseFloat($(el2).val()) === 0){
                $(el2).val('');
                return false;
            }
        
            if(parseFloat($(el2).val()) <= parseFloat($(el).val())){
                simpleScript.notify.warning({
                    content: lang.opcion.RANGMA
                });
                $(el2).val('');
            }
        }
    };
    
    return _public;

};
var opcionScript = new opcionScript_();