var loginScript_ = function() {

    var _private = {};

    this.public = {};

    this.public.validate = function() {
        $("#login-form").validate({
            // Rules for form validation
            rules: {
                txtUser: {
                    required: true,
                    email: true
                },
                txtClave: {
                    required: true,
                    minlength: 3,
                    maxlength: 20
                }
            },
            // Messages for form validation
            messages: {
                txtEmail: {
                    required: 'Ingrese su correo'
                },
                txtClave: {
                    required: 'Ingrese su clave'
                }
            },
            // Do not change code below
            errorPlacement: function(error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function() {
                login.postEntrar();
            }
        });










        var pr = "'20'";
        var prr = "200";


//        var ot = $('#myGrid').simpleGrid({
//            tWidthFormat: '%',
//            tFilter: true,
//            tPlaceHolderFilter: 'busqueda......',
//            tScrollY: '140px',
//            tOrderField:'modulo desc',
//            tColumns: [
//                {
//                    title: lang.modulo.MOD,
//                    campo: 'modulo', 
//                    width: '25',
//                    sortable: true,
//                    ajax: {
//                        fn: 'ajaxfun',
//                        flag: 1,
//                        serverParams: ['id_modulo','aplicacion'],
//                        clientParams: ["$('#txtUser').val()",pr]
//                    }
//                },
//                {title: lang.modulo.APP,campo: 'aplicacion', width: "20",sortable: true},
//                {title: lang.modulo.USC,campo: 'usuario', width: "20",sortable: true},
//                {title: lang.modulo.FECRE,campo: 'fechac', width: "15",  class: "center",sortable: true}
//            ],
//            pPaginate: true,
//            pDisplayLength: 10,
//            ajaxSource: login.dataGrid(),
//            fnCallback: function(){
//                
//            }
//        });


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
                        serverParams: ['id_modulo', 'aplicacion'],
                        clientParams: ["$('#txtUser').val()", pr]
                    },
                    search: {type: 'select',operator: 'LIKE',url: login.listModulos()}
                },
                {title: lang.modulo.APP, campo: 'aplicacion', width: "20", sortable: true,search:{operator:'LIKE'}},
                {title: lang.modulo.USC, campo: 'usuario', width: "20", sortable: true,search:{operator:'LIKE'}},
                {title: lang.modulo.FECRE, campo: 'fecha_creacion', width: "15", class: "center", sortable: true}
            ],
            pPaginate: true,
            pDisplayLength: 10,
            sCheckbox: {
                start: true,
                possition: 'first',
                serverValues: ['id_modulo', 'aplicacion'],
                clientValues: ["value del cliente", prr]
            },
            sAxions: [{
                icono: 'fa fa-edit fa-lg',
                titulo: 'Editar',
                class: 'btn bg-color-blueDark txt-color-white btn-xs',
                ajax: {
                    fn: 'ajaxfun',
                    flag: 1,
                    serverParams: ['id_modulo', 'aplicacion'],
                    clientParams: ["$('#txtUser').val()", pr]
                }
            }, {
                icono: 'fa fa-trash-o fa-lg',
                titulo: 'Eliminar',
                class: 'btn bg-color-blueDark txt-color-white btn-xs',
                ajax: {
                    fn: 'ajaxfun',
                    flag: 1,
                    serverParams: ['id_modulo', 'aplicacion'],
                    clientParams: ["$('#txtUser').val()", pr]
                }
            }],
            ajaxSource: login.dataGrid(),
            fnCallback: function(oSettings) {
                //oSettings.fnDeleteRow(1);
//                oSettings.fnClickRow(function(fData){
//                    alert(fData[4])
//                });
//                oSettings.fnGetData(function(aData){
//                    for(i in aData){
////                        for(j in aData[i]){
//                            alert(aData[i][2])
////                        }
//                    }
//                });
//                oSettings.fnUpdate({
//                    0: 111,
//                    3: 'otro'
//                },1);
//                oSettings.fnFooterCallback(function(nFoot, aData, iStart, iEnd, aiDisplay){
//                    alert(nFoot+'---'+aData+'---'+iStart+'---'+iEnd+'---'+aiDisplay)
//                });
                oSettings.fnStyleRow({
                    0: '2',
                    5: '17-10-2014 12:10:01'
                },{
                    background: 'orange'
                });
//                oSettings.fnDrawNumber(oSettings);
            }
        });





    };

    return this.public;
};

var loginScript = new loginScript_();

loginScript.validate();
