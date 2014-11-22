var configurarMenu_ = function() {

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

    var _public = {};

    _public.resetKey = function() {
        _private.idDominio = 0;
    };

    _public.resetKeyModulo = function() {
        _private.idModulo = 0;
    };

    _public.resetKeyMenuPrincipal = function() {
        _private.idMenuPrincipal = 0;
    };

    _public.resetKeyOpcion = function() {
        _private.idOpcion = 0;
    };

    _public.main = function() {
        try {
            configurarMenu.resetKey();
            configurarMenu.resetKeyModulo();
            configurarMenu.resetKeyMenuPrincipal();
            configurarMenu.resetKeyOpcion();

            simpleScript.addTab({
                id: tabs.T3,
                label: simpleObject.getTitle(),
                fnCallback: function() {
                    configurarMenu.index();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.index = function() {
        try {
            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo,
                fnCallback: function(data) {
                    $('#' + tabs.T3 + '_CONTAINER').html(data);
                    setup_widgets_desktop();
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*listado de dominios*/
    _public.getListaDominios = function() {
        try {
            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'dominios',
                fnCallback: function(data) {
                    $('#cont-listadominios').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*listado de modulos*/
    _public.getModulos = function() {
        try {
            _private.idDominio = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo + 'modulos',
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    $('#cont-listaModulos').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*listado de menu principal*/
    _public.getMenuPrincipal = function() {
        try {
            _private.idModulo = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                root: _private.config.modulo + 'menuPrincipales',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    $('#cont-listaMenuPrincipal').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getNuevoDominio = function() {
        try {
            simpleAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'nuevoDominio',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formNuevoDominio').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getNuevoModulo = function() {
        try {
            if (_private.idDominio === 0) {
                simpleScript.notify.error({
                    content: lang.confMenu.NOSELMOD
                });
            } else {
                simpleAjax.send({
                    gifProcess: true,
                    dataType: 'html',
                    root: _private.config.modulo + 'nuevoModulo',
                    fnCallback: function(data) {
                        $('#cont-modal').append(data);  /*los formularios con append*/
                        $('#' + tabs.T3 + 'formNuevoModulo').modal('show');
                    }
                });
            }
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getNuevoMenuPrincipal = function(btn) {
        try {
            if (_private.idModulo === 0) {
                simpleScript.notify.error({
                    content: lang.confMenu.NOSELMNU
                });
            } else {
                simpleAjax.send({
                    gifProcess: true,
                    dataType: 'html',
                    root: _private.config.modulo + 'nuevoMenuPrincipal',
                    fnCallback: function(data) {
                        $('#cont-modal').append(data);  /*los formularios con append*/
                        $('#' + tabs.T3 + 'formNuevoMenuPrincipal').modal('show');
                    }
                });
            }
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*dominio a editar*/
    _public.getEditarDominio = function() {
        try {
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
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditarDominio').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*modulo a editar*/
    _public.getEditarModulo = function() {
        try {
            /*reset key menupri, opcion y sus contenedores*/
            configurarMenu.resetKeyMenuPrincipal();
            configurarMenu.resetKeyOpcion();
            configurarMenuScript.resetFromModulo();

            _private.idModulo = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'editarModulo',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditarModulo').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*menu principal a editar*/
    _public.getEditarMenuPrincipal = function() {
        try {
            /*reset key opcion y sus contenedores*/
            configurarMenu.resetKeyOpcion();
            configurarMenuScript.resetFromOpcion();

            _private.idMenuPrincipal = simpleScript.getParam(arguments[0]);

            simpleAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'editarMenuPrincipal',
                fnServerParams: function(sData) {
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditarMenuPrincipal').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDominio = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaDominio',
                root: _private.config.modulo + 'postDominio',
                form: '#' + tabs.T3 + 'formNuevoDominio',
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarMenu.getListaDominios();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.DOMSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditarDominio = function() {
        try {
            simpleAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditaDominio',
                root: _private.config.modulo + 'postDominio',
                form: '#' + tabs.T3 + 'formEditarDominio',
                clear: true,
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                _private.idDominio = 0;
                                configurarMenu.getListaDominios();
                                simpleScript.closeModal('#' + tabs.T3 + 'formEditarDominio');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.DOMSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteDominio = function() {
        try {
            var idDominio = simpleScript.getParam(arguments[0]);

            simpleScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    /*reset key modulo, menupri, opcion y sus contenedores*/
                    configurarMenu.resetKeyModulo();
                    configurarMenu.resetKeyMenuPrincipal();
                    configurarMenu.resetKeyOpcion();
                    configurarMenuScript.resetFromDominio();

                    simpleAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'deleteDominio',
                        fnServerParams: function(sData) {
                            sData.push({name: '_idDominio', value: idDominio});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                simpleScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        configurarMenu.getListaDominios();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postModulo = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaModulo',
                root: _private.config.modulo + 'postModulo',
                form: '#' + tabs.T3 + 'formNuevoModulo',
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarMenu.getModulos(_private.idDominio);
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.MODSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditarModulo = function() {
        try {
            simpleAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditarModulo',
                root: _private.config.modulo + 'postModulo',
                form: '#' + tabs.T3 + 'formEditarModulo',
                clear: true,
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarMenu.getModulos(_private.idDominio);
                                _private.idModulo = 0;
                                simpleScript.closeModal('#' + tabs.T3 + 'formEditarModulo');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.MODSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteModulo = function() {
        try {
            var id = simpleScript.getParam(arguments[0]);

            simpleScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    /*reset key menupri, opcion y sus contenedores*/
                    configurarMenu.resetKeyMenuPrincipal();
                    configurarMenu.resetKeyOpcion();
                    configurarMenuScript.resetFromModulo();

                    simpleAjax.send({
                        flag: 3,
                        gifProcess: true,
                        data: '&_idModulo=' + id,
                        root: _private.config.modulo + 'postDeleteModulo',
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                simpleScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        configurarMenu.getModulos(_private.idDominio);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postMenuPrincipal = function() {
        try {
            simpleAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaMenuPri',
                root: _private.config.modulo + 'postMenuPrincipal',
                form: '#' + tabs.T3 + 'formNuevoMenuPrincipal',
                data: '&_idModulo=' + _private.idModulo,
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                clear: true,
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarMenu.getMenuPrincipal(_private.idModulo);
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.MNUSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.confMenu.ALISI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 4) {
                        simpleScript.notify.error({
                            content: lang.confMenu.URLSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditarMenuPrincipal = function() {
        try {
            simpleAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditarMenuPri',
                root: _private.config.modulo + 'postMenuPrincipal',
                form: '#' + tabs.T3 + 'formEditarMenuPrincipal',
                clear: true,
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        simpleScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                configurarMenu.getMenuPrincipal(_private.idModulo);
                                _private.idMenuPrincipal = 0;
                                simpleScript.closeModal('#' + tabs.T3 + 'formEditarMenuPrincipal');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        simpleScript.notify.error({
                            content: lang.confMenu.MNUSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        simpleScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteMenuPrincipal = function() {
        try {
            var id = simpleScript.getParam(arguments[0]);

            simpleScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    /*reset key opcion y sus contenedores*/
                    configurarMenu.resetKeyOpcion();
                    configurarMenuScript.resetFromOpcion();

                    simpleAjax.send({
                        flag: 3,
                        gifProcess: true,
                        data: '&_idMenuPrincipal=' + id,
                        root: _private.config.modulo + 'postDeleteMenuPrincipal',
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                simpleScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        configurarMenu.getMenuPrincipal(_private.idModulo);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postOrdenar = function() {
        try {
            var tipo = simpleScript.getParam(arguments[0]);
            var ids = simpleScript.getParam(arguments[1]);

            switch (tipo) {
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
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortDominios = function() {
        try {
            var ids = simpleScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            simpleAjax.send({
                flag: 4,
                //data: '&'+tabs.T3+'txt_dominio='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_dominio', value: ids});
                    sData.push({name: tabs.T3 + 'txt_orden', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postSortDominio'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortModulos = function() {
        try {
            var ids = simpleScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            simpleAjax.send({
                flag: 4,
                //data: '&'+tabs.T3+'txt_modulo='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_modulo', value: ids});
                    sData.push({name: tabs.T3 + 'txt_orden', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postOrdenarModulo'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortMenuPrincipal = function() {
        try {
            var ids = simpleScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            simpleAjax.send({
                flag: 4,
                //data: '&'+tabs.T3+'txt_menu='+ids+'&'+tabs.T3+'txt_orden='+numeroPalabras,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_menu', value: ids});
                    sData.push({name: tabs.T3 + 'txt_orden', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postOrdenarMenuPrincipal'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return _public;

};
var configurarMenu = new configurarMenu_();

configurarMenu.main();