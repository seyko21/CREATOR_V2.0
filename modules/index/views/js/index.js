var index_ = function(){
    
    var _private = {};
    
    _private.config = {
        modulo: 'index/'
    };
    
    this.public = {};
    
    this.public.postLogout = function(){
        simpleAjax.send({
            element: '#CRDACbtnEditaAccion',
            root: _private.config.modulo + 'login/logout',
            fnCallback: function(data) {
                if(!isNaN(data.result) && parseInt(data.result) === 1){
                    simpleScript.notify.ok({
                        content: lang.mensajes.MSG_11
                    });
                    simpleScript.redirect('index');
                }
            }
        });
    };
    
    this.public.inactividad = function(){
        simpleAjax.send({
            dataType: 'html',
            gifProcess: true,
            root: _private.config.modulo + 'index/getLock',
            fnCallback: function(data){
                $('#cont-allheader').html('');
                $('#main').html(data);
                $(document).off('mousemove');
            }
        });
    };
    
    this.public.getChangeRol = function(idRol){
        simpleAjax.send({
            gifProcess: true,
            root: _private.config.modulo + 'index/changeRol/',
            fnServerParams: function(sData){
                sData.push({name: '_idRol', value: idRol});
            },
            fnCallback: function(){
                simpleScript.redirect('index');
            }
        });
    };
    
    return this.public;
    
};
 var index = new index_();