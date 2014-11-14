var loginScript_ = function(){
    
    var _private = {};
    
    this.public = {};
    
    this.public.validate = function(){
        $("#login-form").validate({
            // Rules for form validation
            rules : {
                    txtUser : {
                            required : true,
                            email: true
                    },
                    txtClave : {
                            required : true,
                            minlength : 3,
                            maxlength : 20
                    }
            },

            // Messages for form validation
            messages : {
                    txtEmail : {
                            required : 'Ingrese su correo'
                    },
                    txtClave : {
                            required : 'Ingrese su clave'
                    }
            },

            // Do not change code below
            errorPlacement : function(error, element) {
                    error.insertAfter(element.parent());
            },
                    
            submitHandler: function(){
                login.postEntrar();
            }   
        });
        
        
        
        
        
        
        
        
        
        
        var pr = "'20'";
        
        
        var ot = $('#myGrid').simpleGrid({
            tWidthFormat: '%',
            tFilter: true,
            tPlaceHolderFilter: 'busqueda......',
            tScrollY: '140px',
            tOrderField:'modulo desc',
            tColumns: [
                {
                    title: lang.modulo.MOD,
                    campo: 'modulo', 
                    width: '25',
                    sortable: true,
                    ajax: {
                        fn: 'ajaxfun',
                        flag: 1,
                        serverParams: ['id_modulo','aplicacion'],
                        clientParams: ["$('#txtUser').val()",pr]
                    }
                },
                {title: lang.modulo.APP,campo: 'aplicacion', width: "20",sortable: true},
                {title: lang.modulo.USC,campo: 'usuario', width: "20",sortable: true},
                {title: lang.modulo.FECRE,campo: 'fechac', width: "15",  class: "center",sortable: true}
            ],
            pPaginate: true,
            pDisplayLength: 10,
            ajaxSource: login.dataGrid(),
            fnCallback: function(){
                
            }
        });
   
        
        $('#myGrid2').simpleGrid({
            tWidthFormat: 'px',
            tFilter: true,
            tScrollY: '150px',
            tColumns: [
                {
                    title: lang.modulo.MOD,
                    campo: 'modulo', 
                    width: '25',
                    sortable: true,
                    ajax: {
                        fn: 'ajaxfun',
                        flag: 1,
                        serverParams: ['id_modulo','aplicacion'],
                        clientParams: ["$('#txtUser').val()",pr]
                    }
                },
                {title: lang.modulo.APP,campo: 'aplicacion', width: "20",sortable: true},
                {title: lang.modulo.USC,campo: 'usuario', width: "20",sortable: true},
                {title: lang.modulo.FECRE,campo: 'fechac', width: "15",  class: "center",sortable: true}
            ],
            pPaginate: true,
            pDisplayLength: 10,
            ajaxSource: login.dataGrid(),
            fnCallback: function(){
                
            }
        });
        
        
        
        
        
    
    };
    
    return this.public;
};

var loginScript = new loginScript_();

loginScript.validate();
