<?php
/**
 * Description of BasicJs
 *
 * @author RDCC
 */
class BasicJs {
    
    /*crear archivo js BASICO*/
    public static function create($ruta,$opcion,$pre){
        $capitaleOpcion = Functions::capitalize($opcion);
        
        $contenido = '/*
* ---------------------------------------
* --------- CREATED BY CREATOR ----------
* fecha: '.date('d-m-Y H:m:s').' 
* Descripcion : '.$opcion.'.js
* ---------------------------------------
*/
var '.$opcion.'_ = function(){
    
    /*cargar requires*/
    /*descomentar de ser necesario
    simpleObject.require({
        '.$opcion.': "'.$opcion.'Script"
    });
    */
    
    /*metodos privados*/
    var _private = {};
    
    _private.id'.$capitaleOpcion.' = 0;
    
    _private.config = {
        modulo: "'.$ruta['modulo'].'/'.$opcion.'/"
    };

    /*metodos publicos*/
    var _public = {};
    
    /*crea tab : '.$capitaleOpcion.'*/
    _public.main = function(){
        simpleScript.addTab({
            id : tabs.'.$pre.',
            label: simpleObject.getTitle(),
            fnCallback: function(){
                '.$opcion.'.getIndex();
            }
        });
    };
    
    /*index del tab: '.$capitaleOpcion.'*/
    _public.getIndex = function(){
        simpleAjax.send({
            dataType: "html",
            root: _private.config.modulo,
            fnCallback: function(data){
                $("#"+tabs.'.$pre.'+"_CONTAINER").html(data);
                '.$opcion.'.getGrid'.$capitaleOpcion.'();
            }
        });
    };
    
    _public.getGrid'.$capitaleOpcion.' = function (){
        var oTable = $("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'").dataTable({
            bProcessing: true,
            bServerSide: true,
            bDestroy: true,
            sPaginationType: "bootstrap_full", //two_button
            sServerMethod: "POST",
            bPaginate: true,
            iDisplayLength: 10,            
            aoColumns: [
                {sTitle: "N°", sWidth: "1%",bSortable: false},
                {sTitle: "Acciones", sWidth: "8%", sClass: "center", bSortable: false},
                {sTitle: "CAMPO 1", sWidth: "25%"},
                {sTitle: "CAMPO 2", sWidth: "25%", bSortable: false},
                {sTitle: "Estado", sWidth: "10%", sClass: "center", bSortable: false}                
            ],
            aaSorting: [[2, "asc"]],
            sScrollY: "300px",
            sAjaxSource: _private.config.modulo+"getGrid'.$capitaleOpcion.'",
            fnDrawCallback: function() {
                $("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'_filter").find("input").attr("placeholder","Buscar por '.$capitaleOpcion.'").css("width","250px");
                simpleScript.enterSearch("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'",oTable);
                    
                /*para hacer eventos invisible*/
                simpleScript.removeAttr.click({
                    container: "#widget_"+tabs.'.$pre.',
                    typeElement: "button"
                });
                $("#"+tabs.'.$pre.'+"refresh").click(function(){
                    oTable.fnReloadAjax(oTable.fnSettings());
                });
            },
            fnInfoCallback: function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                return \'<button id="\'+tabs.'.$pre.'+\'refresh" class="btn btn-primary" title="Actualizar"><i class="fa-refresh"></i></button>\'+iStart +\' al \'+ iEnd+\' de \'+iTotal;
            }
        });
        setup_widgets_desktop();
    };
    
    _public.getFormNew'.$capitaleOpcion.' = function(btn){
        simpleAjax.send({
            element: btn,
            dataType: "html",
            root: _private.config.modulo + "formNew'.$capitaleOpcion.'",
            fnCallback: function(data){
                $("#cont-modal").append(data);  /*los formularios con append*/
                $("#"+tabs.'.$pre.'+"formNew'.$capitaleOpcion.'").modal("show");
            }
        });
    };
    
    _public.getFormEdit'.$capitaleOpcion.' = function(btn,id){
        _private.id'.$capitaleOpcion.' = id;
            
        simpleAjax.send({
            element: btn,
            dataType: "html",
            root: _private.config.modulo + "formEdit'.$capitaleOpcion.'",
            fnServerParams: function(sData){
                sData.push({name: "_id'.$capitaleOpcion.'", value: _private.id'.$capitaleOpcion.'});
            },
            fnCallback: function(data){
                $("#cont-modal").append(data);  /*los formularios con append*/
                $("#"+tabs.'.$pre.'+"formEdit'.$capitaleOpcion.'").modal("show");
            }
        });
    };
    
    _public.postNew'.$capitaleOpcion.' = function(){
        simpleAjax.send({
            flag: AQUI_FLAG,
            element: "#"+tabs.'.$pre.'+"btnGr'.$capitaleOpcion.'",
            root: _private.config.modulo + "new'.$capitaleOpcion.'",
            form: "#"+tabs.'.$pre.'+"formNew'.$capitaleOpcion.'",
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: mensajes.MSG_3,
                        callback: function(){
                            '.$opcion.'.getGrid'.$capitaleOpcion.'();
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: "'.$capitaleOpcion.' ya existe."
                    });
                }
            }
        });
    };
    
    _public.postEdit'.$capitaleOpcion.' = function(){
        simpleAjax.send({
            flag: AQUI_FLAG,
            element: "#"+tabs.'.$pre.'+"btnEd'.$capitaleOpcion.'",
            root: _private.config.modulo + "edit'.$capitaleOpcion.'",
            form: "#"+tabs.'.$pre.'+"formEdit'.$capitaleOpcion.'",
            clear: true,
            fnServerParams: function(sData){
                sData.push({name: "_id'.$capitaleOpcion.'", value: _private.id'.$capitaleOpcion.'});
            },
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: mensajes.MSG_10,
                        callback: function(){
                            _private.id'.$capitaleOpcion.' = 0;
                            simpleScript.closeModal("#"+tabs.'.$pre.'+"formEdit'.$capitaleOpcion.'");
                            simpleScript.reloadGrid("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'");
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: "'.$capitaleOpcion.' ya existe."
                    });
                }
            }
        });
    };
    
    _public.postDelete'.$capitaleOpcion.' = function(btn,id){
        simpleScript.notify.confirm({
            content: mensajes.MSG_5,
            callbackSI: function(){
                simpleAjax.send({
                    flag: AQUI_FLAG,
                    element: btn,
                    gifProcess: true,
                    root: _private.config.modulo + "delete'.$capitaleOpcion.'",
                    fnServerParams: function(sData){
                        sData.push({name: "_id'.$capitaleOpcion.'", value: id});
                    },
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: mensajes.MSG_6,
                                callback: function(){
                                    simpleScript.reloadGridDelete("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'");
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    _public.postDelete'.$capitaleOpcion.'All = function(btn){
        simpleScript.validaCheckBox({
            id: "#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'",
            msn: mensajes.MSG_9,
            fnCallback: function(){
                simpleScript.notify.confirm({
                    content: mensajes.MSG_7,
                    callbackSI: function(){
                        simpleAjax.send({
                            flag: 3, //si se usa SP usar flag, sino se puede eliminar esta linea
                            element: btn,
                            form: "#"+tabs.'.$pre.'+"formGrid'.$capitaleOpcion.'",
                            root: _private.config.modulo + "delete'.$capitaleOpcion.'All",
                            fnCallback: function(data) {
                                if(!isNaN(data.result) && parseInt(data.result) === 1){
                                    simpleScript.notify.ok({
                                        content: mensajes.MSG_8,
                                        callback: function(){
                                            simpleScript.reloadGridDelete("#"+tabs.'.$pre.'+"grid'.$capitaleOpcion.'");
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    };
    
    return _public;
    
};
var '.$opcion.' = new '.$opcion.'_();

'.$opcion.'.main(); ';
        
        $r = $ruta['app'].'/modules/'.$ruta['modulo'].'/views/js/';
        
        if(file_exists($r.$opcion.'.js')){
            throw new Exception('Archivo: '.$r.$opcion.'.js ya existe.');
        }else{
            $fp=fopen($r.$opcion.'.js',"x");
            fwrite($fp,$contenido);
            fclose($fp) ;
        }
    }
    
}
