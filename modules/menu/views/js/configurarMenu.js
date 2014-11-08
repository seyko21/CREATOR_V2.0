var configurarMenu_ = function(){
    
    /*cargar requires*/
    simpleObject.require({
        menu: 'configurarMenuScript'
    });
    
    var _private = {};
    
    _private.config = {
        modulo: 'menu/configurarMenu/'
    };
    
    _private.idDominio = 0;
    
    _private.idModulo = 0;
    
    _private.idMenuPrincipal = 0;
    
    _private.idOpcion = 0;
    
    this.public = {};
    
    this.public.resetKey = function(){
        _private.idDominio = 0;
    };
    
    this.public.resetKeyModulo = function(){
        _private.idModulo = 0;
    };
    
    this.public.resetKeyMenuPrincipal = function(){
        _private.idMenuPrincipal = 0;
    };
    
    this.public.resetKeyOpcion = function(){
        _private.idOpcion = 0;
    };
    
    this.public.main = function(){
        configurarMenu.resetKey();
        configurarMenu.resetKeyModulo();
        configurarMenu.resetKeyMenuPrincipal();
        configurarMenu.resetKeyOpcion();
        
        simpleScript.addTab({
            id : tabs.T3,
            label: simpleObject.getTitle(),
            fnCallback: function(){
                configurarMenu.index();
            }
        });
    };
    
    this.public.index = function(){
        simpleAjax.send({
            dataType: 'html',
            root: _private.config.modulo,
            fnCallback: function(data){
                $('#'+tabs.T3+'_CONTAINER').html(data);
                setup_widgets_desktop();
            }
        });
    };
    
    /*listado de dominios*/
    this.public.getListaDominios = function(){
        simpleAjax.send({
            dataType: 'html',
            gifProcess: true,
            root: _private.config.modulo + 'dominios',
            fnCallback: function(data){
                $('#cont-listadominios').html(data);
            }
        });
    };
    
    /*listado de modulos*/
    this.public.getModulos = function(){
        _private.idDominio = simpleScript.getParam(arguments[0]);
        
        simpleAjax.send({
            dataType: 'html',
            root: _private.config.modulo + 'modulos',
            fnServerParams: function(sData){
                sData.push({name: '_idDominio', value: _private.idDominio});
            },
            fnCallback: function(data){
                $('#cont-listaModulos').html(data);
            }
        });
    };
    
    /*listado de menu principal*/
    this.public.getMenuPrincipal = function(){
        _private.idModulo = simpleScript.getParam(arguments[0]);
        
        simpleAjax.send({
            dataType: 'html',
            root: _private.config.modulo + 'menuPrincipales',
            fnServerParams: function(sData){
                sData.push({name: '_idModulo', value: _private.idModulo});
            },
            fnCallback: function(data){
                $('#cont-listaMenuPrincipal').html(data);
            }
        });
    };
    
    this.public.getNuevoDominio = function(){
        
        simpleAjax.send({
            gifProcess: true,
            dataType: 'html',
            root: _private.config.modulo + 'nuevoDominio',
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T3+'formNuevoDominio').modal('show');
            }
        });
    };
    
    this.public.getNuevoModulo = function(){
        if(_private.idDominio === 0){
            simpleScript.notify.error({
                content: lang.confMenu.NOSELMOD
            });
        }else{
            simpleAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'nuevoModulo',
                fnCallback: function(data){
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#'+tabs.T3+'formNuevoModulo').modal('show');
                }
            });
        }        
    };
    
    this.public.getNuevoMenuPrincipal = function(btn){
        if(_private.idModulo === 0){
            simpleScript.notify.error({
                content: lang.confMenu.NOSELMNU
            });
        }else{
            simpleAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'nuevoMenuPrincipal',
                fnCallback: function(data){
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#'+tabs.T3+'formNuevoMenuPrincipal').modal('show');
                }
            });
        }
    };
    
    /*dominio a editar*/
    this.public.getEditarDominio = function(){
        /*reset key modulo, menupri, opcion y sus contenedores*/
        configurarMenu.resetKeyModulo();
        configurarMenu.resetKeyMenuPrincipal();
        configurarMenu.resetKeyOpcion();
        configurarMenuScript.resetFromDominio();
                            
        _private.idDominio = simpleScript.getParam(arguments[0]);
        
        simpleAjax.send({
            dataType: 'html',
            gifProcess: true,
            root: _private.config.modulo + 'editarDominio',
            fnServerParams: function(sData){
                sData.push({name: '_idDominio', value: _private.idDominio});
            },
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T3+'formEditarDominio').modal('show');
            }
        });
    };
    
    /*modulo a editar*/
    this.public.getEditarModulo = function(){
        /*reset key menupri, opcion y sus contenedores*/
        configurarMenu.resetKeyMenuPrincipal();
        configurarMenu.resetKeyOpcion();
        configurarMenuScript.resetFromModulo();
                            
        _private.idModulo = simpleScript.getParam(arguments[0]);
        
        simpleAjax.send({
            dataType: 'html',
            gifProcess: true,
            root: _private.config.modulo + 'editarModulo',
            fnServerParams: function(sData){
                sData.push({name: '_idModulo', value: _private.idModulo});
            },
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T3+'formEditarModulo').modal('show');
            }
        });
    };
    
    /*menu principal a editar*/
    this.public.getEditarMenuPrincipal = function(){
        /*reset key opcion y sus contenedores*/
        configurarMenu.resetKeyOpcion();
        configurarMenuScript.resetFromOpcion();
                            
        _private.idMenuPrincipal = simpleScript.getParam(arguments[0]);
        
        simpleAjax.send({
            dataType: 'html',
            gifProcess: true,
            root: _private.config.modulo + 'editarMenuPrincipal',
            fnServerParams: function(sData){
                sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
            },
            fnCallback: function(data){
                $('#cont-modal').append(data);  /*los formularios con append*/
                $('#'+tabs.T3+'formEditarMenuPrincipal').modal('show');
            }
        });
    };
    
    this.public.postDominio = function(){
        simpleAjax.send({
            flag: 1,
            element: '#'+tabs.T3+'btnGrabaDominio',
            root: _private.config.modulo + 'postDominio',
            form: '#'+tabs.T3+'formNuevoDominio',
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarMenu.getListaDominios();
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.DOMSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.mensajes.MSG_6
                    });
                }
            }
        });
    };
    
    this.public.postEditarDominio = function(){
        simpleAjax.send({
            flag: 2,
            element: '#'+tabs.T3+'btnEditaDominio',
            root: _private.config.modulo + 'postDominio',
            form: '#'+tabs.T3+'formEditarDominio',
            clear: true,
            fnServerParams: function(sData){
                sData.push({name: '_idDominio', value: _private.idDominio});
            },
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            _private.idDominio = 0;
                            configurarMenu.getListaDominios();
                            simpleScript.closeModal('#'+tabs.T3+'formEditarDominio');
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.DOMSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.mensajes.MSG_6
                    });
                }
            }
        });
    };
    
    this.public.postDeleteDominio = function(){
        var idDominio = simpleScript.getParam(arguments[0]);
        
        simpleScript.notify.confirm({
            content: lang.mensajes.MSG_5,
            callbackSI: function(){
                /*reset key modulo, menupri, opcion y sus contenedores*/
                configurarMenu.resetKeyModulo();
                configurarMenu.resetKeyMenuPrincipal();
                configurarMenu.resetKeyOpcion();
                configurarMenuScript.resetFromDominio();
        
                simpleAjax.send({
                    flag: 3,
                    gifProcess: true,
                    root: _private.config.modulo + 'deleteDominio',
                    fnServerParams: function(sData){
                        sData.push({name: '_idDominio', value: idDominio});
                    },
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: lang.mensajes.MSG_6,
                                callback: function(){
                                    configurarMenu.getListaDominios();
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    this.public.postModulo = function(){
        simpleAjax.send({
            flag: 1,
            element: '#'+tabs.T3+'btnGrabaModulo',
            root: _private.config.modulo + 'postModulo',
            form: '#'+tabs.T3+'formNuevoModulo',
            fnServerParams: function(sData){
                sData.push({name: '_idDominio', value: _private.idDominio});
            },
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarMenu.getModulos(_private.idDominio);
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.MODSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.mensajes.MSG_6
                    });
                }
            }
        });
    };
    
    this.public.postEditarModulo = function(){
        simpleAjax.send({
            flag: 2,
            element: '#'+tabs.T3+'btnEditarModulo',
            root: _private.config.modulo + 'postModulo',
            form: '#'+tabs.T3+'formEditarModulo',
            clear: true,
            fnServerParams: function(sData){
                sData.push({name: '_idModulo', value: _private.idModulo});
                sData.push({name: '_idDominio', value: _private.idDominio});
            },
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarMenu.getModulos(_private.idDominio);
                            _private.idModulo = 0;
                            simpleScript.closeModal('#'+tabs.T3+'formEditarModulo');
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.MODSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.mensajes.MSG_6
                    });
                }
            }
        });
    };
    
    this.public.postDeleteModulo = function(){
        var id = simpleScript.getParam(arguments[0]);
        
        simpleScript.notify.confirm({
            content: lang.mensajes.MSG_5,
            callbackSI: function(){
                /*reset key menupri, opcion y sus contenedores*/
                configurarMenu.resetKeyMenuPrincipal();
                configurarMenu.resetKeyOpcion();
                configurarMenuScript.resetFromModulo();
        
                simpleAjax.send({
                    flag: 3,
                    gifProcess: true,
                    data: '&_idModulo='+id,
                    root: _private.config.modulo + 'postDeleteModulo',
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: lang.mensajes.MSG_6,
                                callback: function(){
                                    configurarMenu.getModulos(_private.idDominio);
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    this.public.postMenuPrincipal = function(){
        simpleAjax.send({
            flag: 1,
            element: '#'+tabs.T3+'btnGrabaMenuPri',
            root: _private.config.modulo + 'postMenuPrincipal',
            form: '#'+tabs.T3+'formNuevoMenuPrincipal',
            data: '&_idModulo='+_private.idModulo,
            fnServerParams: function(sData){
                sData.push({name: '_idModulo', value: _private.idModulo});
            },
            clear: true,
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarMenu.getMenuPrincipal(_private.idModulo);
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.MNUSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.confMenu.ALISI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 4){
                    simpleScript.notify.error({
                        content: lang.confMenu.URLSI
                    });
                }
            }
        });
    }; 
   
    this.public.postEditarMenuPrincipal = function(){
        simpleAjax.send({
            flag: 2,
            element: '#'+tabs.T3+'btnEditarMenuPri',
            root: _private.config.modulo + 'postMenuPrincipal',
            form: '#'+tabs.T3+'formEditarMenuPrincipal',
            clear: true,
            fnServerParams: function(sData){
                sData.push({name: '_idModulo', value: _private.idModulo});
                sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
            },
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_3,
                        callback: function(){
                            configurarMenu.getMenuPrincipal(_private.idModulo);
                            _private.idMenuPrincipal = 0;
                            simpleScript.closeModal('#'+tabs.T3+'formEditarMenuPrincipal');
                        }
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 2){
                    simpleScript.notify.error({
                        content: lang.confMenu.MNUSI
                    });
                }else if(!isNaN(data.result) && parseInt(data.result) === 3){
                    simpleScript.notify.error({
                        content: lang.mensajes.MSG_6
                    });
                }
            }
        });
    };
    
    this.public.postDeleteMenuPrincipal = function(){
        var id = simpleScript.getParam(arguments[0]);
        
        simpleScript.notify.confirm({
            content: lang.mensajes.MSG_5,
            callbackSI: function(){
                /*reset key opcion y sus contenedores*/
                configurarMenu.resetKeyOpcion();
                configurarMenuScript.resetFromOpcion();
        
                simpleAjax.send({
                    flag: 3,
                    gifProcess: true,
                    data: '&_idMenuPrincipal='+id,
                    root: _private.config.modulo + 'postDeleteMenuPrincipal',
                    fnCallback: function(data) {
                        if(!isNaN(data.result) && parseInt(data.result) === 1){
                            simpleScript.notify.ok({
                                content: lang.mensajes.MSG_6,
                                callback: function(){
                                    configurarMenu.getMenuPrincipal(_private.idModulo);
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    this.public.postOrdenar = function(){
        var tipo = simpleScript.getParam(arguments[0]);
        var ids  = simpleScript.getParam(arguments[1]);

        switch(tipo){
            case 'DOM': /*ordenear modulos*/
                configurarMenu.postSortDominios(ids);  
                break;
            case 'MOD': /*ordenear modulos*/
                configurarMenu.postSortModulos(ids);  
                break;
            case 'MEP': /*ordenear menu principal*/
                configurarMenu.postSortMenuPrincipal(ids);  
                break;
        }
    };
    
    this.public.postSortDominios = function(){
        var ids  = simpleScript.getParam(arguments[0]);
        var textoAreaDividido = ids.split(",");
        var numeroPalabras = textoAreaDividido.length;
        
        simpleAjax.send({
            flag: 4,
            //data: '&'+tabs.T3+'txt_dominio='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
            fnServerParams: function(sData){
                sData.push({name: tabs.T3+'txt_dominio', value: ids});
                sData.push({name: tabs.T3+'txt_orden', value: numeroPalabras});
            },
            root: _private.config.modulo + 'postSortDominio'
        });
    };
    
    this.public.postSortModulos = function(){
        var ids  = simpleScript.getParam(arguments[0]);
        var textoAreaDividido = ids.split(",");
        var numeroPalabras = textoAreaDividido.length;
        
        simpleAjax.send({
            flag: 4,
            //data: '&'+tabs.T3+'txt_modulo='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
            fnServerParams: function(sData){
                sData.push({name: tabs.T3+'txt_modulo', value: ids});
                sData.push({name: tabs.T3+'txt_orden', value: numeroPalabras});
            },
            root: _private.config.modulo + 'postOrdenarModulo'
        });
    };
    
    this.public.postSortMenuPrincipal = function(){
        var ids  = simpleScript.getParam(arguments[0]);
        var textoAreaDividido = ids.split(",");
        var numeroPalabras = textoAreaDividido.length;
        
        simpleAjax.send({
            flag: 4,
            //data: '&'+tabs.T3+'txt_menu='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
            fnServerParams: function(sData){
                sData.push({name: tabs.T3+'txt_menu', value: ids});
                sData.push({name: tabs.T3+'txt_orden', value: numeroPalabras});
            },
            root: _private.config.modulo + 'postOrdenarMenuPrincipal'
        });
    };
    
    return this.public;
    
};
var configurarMenu = new configurarMenu_();

configurarMenu.main();