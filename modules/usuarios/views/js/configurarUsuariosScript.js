var configurarUsuariosScript_ = function(){
    
   
   this.public = {};
   
   this.public.setEmpleado = function (obj,form){
       for(var i in obj){
           $('#'+i).val(obj[i]);
       }
       simpleScript.closeModal('#'+tabs.T4+'formBuscarEmpleado');
   };
   
   this.public.validaFormUser = function(flag){
       var empleado = $('#'+tabs.T4+'txt_empleado').val();
       var mail = $('#'+tabs.T4+'txt_email').val();
       
       if(empleado === ''){
            simpleScript.notify.warning({
                content: lang.confUsuario.BUSEMP
            });
       }else if(mail.indexOf('@', 0) === -1 || mail.indexOf('.', 0) === -1) {
            simpleScript.notify.warning({
                content: lang.confUsuario.EMAREQ
            });
       }else{
            simpleScript.validaCheckBox({
                id: '#s2',
                msn: lang.confUsuario.ROLREQ,
                fnCallback: function(){
                    if(flag === 1){
                        configurarUsuarios.postNuevoUsuario();
                    }else{
                        configurarUsuarios.postEditarUsuario();
                    }
                }
            });
       }
   };
   
   return this.public;
    
};
var configurarUsuariosScript = new configurarUsuariosScript_();