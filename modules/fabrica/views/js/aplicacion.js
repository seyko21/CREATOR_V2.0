/*
* ---------------------------------------
* --------- CREATED BY CREATOR ----------
* fecha: 18-08-2014 19:08:36 
* Descripcion : aplicacion.js
* ---------------------------------------
*/
var aplicacion_ = function(){
    
    /*metodos privados*/
    var _private = {};
    
    _private.idAplicacion = 0;
    
    _private.config = {
        modulo: "fabrica/aplicacion/"
    };

    /*metodos publicos*/
    this.publico = {};
    
    /*crea tab : Aplicacion*/
    this.publico.main = function(){
        try{
            simpleScript.addTab({
                id : tabs.CRAP,
                label: simpleObject.getTitle(),
                fnCallback: function(){
                    aplicacion.index();
                }
            });
        }catch(ex){
            auditoria.logErrors(ex);
        }
        
    };
    
    /*contenido de tab: Aplicacion*/
    this.publico.index = function(){
        try{
            simpleAjax.send({
                dataType: "html",
                root: _private.config.modulo,
                fnCallback: function(data){
                    $("#"+tabs.CRAP+"_CONTAINER").html(data);
                    aplicacion.getGridAplicacion();
                }
            });
        }catch(ex){
            auditoria.logErrors(ex);
        }
    };
    
    this.publico.getGridAplicacion = function (){
        /*------------------LOGICA PARA DATAGRID------------------------*/
    };
    
    this.publico.getFormNewAplicacion = function(btn){
        try{
            simpleAjax.send({
                element: btn,
                dataType: "html",
                root: _private.config.modulo + "formNewAplicacion",
                fnCallback: function(data){
                    $("#cont-modal").append(data);  /*los formularios con append*/
                    $("#"+tabs.CRAP+"formNewAplicacion").modal("show");
                }
            });
        }catch(ex){
            auditoria.logErrors(ex);
        }
        
    };
    
    this.publico.postNewAplicacion = function(){
        /*-----LOGICA PARA ENVIO DE FORMULARIO-----*/
    };
    
    this.publico.postDeleteAplicacionAll = function(btn){
        try{
            simpleScript.validaCheckBox({
                id: "#"+tabs.CRAP+"gridAplicacion",
                msn: lang.mensajes.MSG_9,
                fnCallback: function(){
                    simpleScript.notify.confirm({
                        content: lang.mensajes.MSG_7,
                        callbackSI: function(){
                            simpleAjax.send({
                                flag: 3, //si se usa SP usar flag, sino se puede eliminar esta linea
                                element: btn,
                                form: "#"+tabs.CRAP+"formGridAplicacion",
                                root: _private.config.modulo + "postDeleteAplicacionAll",
                                fnCallback: function(data) {
                                    if(!isNaN(data.result) && parseInt(data.result) === 1){
                                        simpleScript.notify.ok({
                                            content: lang.mensajes.MSG_8,
                                            callback: function(){
                                                aplicacion.getGridAplicacion();
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }catch(ex){
            auditoria.logErrors(ex);
        }
    };
    
    return this.publico;
    
};
var aplicacion = new aplicacion_();

aplicacion.main();