var modulo_ = function(){
    
    /*cargar requires*/
    simpleObject.require({
        fabrica: 'opcion'
    });
    
    var _private = {};
    
    _private.id = 0;
    
    _private.config = {
        modulo: 'fabrica/modulo/'
    };

    this.publico = {};
    
    this.publico.main = function(){
        simpleScript.addTab({
            id : tabs.T5,
            label: simpleObject.getTitle(),
            fnCallback: function(){
                modulo.getCont();
            }
        });
    };
    
    this.publico.getCont = function(){
        simpleAjax.send({
            dataType: 'html',
            root: _private.config.modulo,
            fnCallback: function(data){
                $('#'+tabs.T5+'_CONTAINER').html(data);
                modulo.getGridModulo();
            }
        });
    };
    
    this.publico.getGridModulo = function (){
        var oTable = $('#'+tabs.T5+'gridModulo').dataTable({
            bProcessing: true,
            bServerSide: true,
            bDestroy: true,
            sPaginationType: "bootstrap_full", //two_button
            sServerMethod: "POST",
            bPaginate: true,
            iDisplayLength: 10,            
            aoColumns: [
                {sTitle: "<input type='checkbox' id='"+tabs.T5+"chk_all' onclick='simpleScript.checkAll(this,\"#"+tabs.T5+"gridModulo\");'>", sWidth: "1%", sClass: "center", bSortable: false},
                {sTitle: lang.modulo.MOD, sWidth: "25%"},
                {sTitle: lang.modulo.APP, sWidth: "20%", bSortable: false},
                {sTitle: lang.modulo.USC, sWidth: "20%", bSortable: false},
                {sTitle: lang.modulo.FECRE, sWidth: "15%",  sClass: "center", bSortable: false},
                {sTitle: lang.generic.AX, sWidth: "15%", sClass: "center", bSortable: false}
            ],
            aaSorting: [[1, 'asc']],
            sScrollY: "300px",
            sAjaxSource: _private.config.modulo+'getGridModulo',
            fnDrawCallback: function() {
                $('#'+tabs.T5+'gridModulo_filter').find('input').attr('placeholder',lang.modulo.BSM);
                simpleScript.enterSearch('#'+tabs.T5+'gridModulo',oTable);
                
                /*para hacer evento invisible*/
                simpleScript.removeAttr.click({
                    container: '#widget_'+tabs.T5, //widget del datagrid
                    typeElement: 'button, #'+tabs.T5+'chk_all'
                });
                $('#'+tabs.T5+'refresh').click(function(){
                    oTable.fnReloadAjax(oTable.fnSettings());
                });
            },
            fnInfoCallback: function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                return '<button id="'+tabs.T5+'refresh" class="btn btn-primary" title="'+lang.generic.ACT+'"><i class="fa-refresh"></i></button> '+iStart +" al "+ iEnd+' de '+iTotal;
            }
        });
        setup_widgets_desktop();
    };
    
    this.publico.getNuevoModulo = function(btn){
        simpleAjax.send({
            element: btn,
            dataType: 'html',
            root: _private.config.modulo + 'formNuevoModulo',
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T5+'formNuevoModulo').modal('show');
            }
        });
    };
    
    this.publico.postNuevoModulo = function(){
        simpleScript.notify.confirm({
            content: modulo.ALNEW,
            callbackSI: function(){
                simpleAjax.send({
                    flag: 1,
                    element: '#'+tabs.T5+'btnGmodulo',
                    root: _private.config.modulo + 'postNuevoModulo',
                    form: '#'+tabs.T5+'formNuevoModulo',
                    clear: true,
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: lang.mensajes.MSG_3,
                                callback: function(){
                                    modulo.getGridModulo();
                                }
                            });
                        }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                            simpleScript.notify.error({
                                content: lang.mensajes.MSG_4
                            });
                        }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                            simpleScript.notify.error({
                                content: lang.modulo.MODEX
                            });
                        }
                    }
                });
            }
        });
    };
    
    return this.publico;
    
};
var modulo = new modulo_();

modulo.main();