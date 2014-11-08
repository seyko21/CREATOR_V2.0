<?php
/**
 * Description of BasicFormNew
 *
 * @author RDCC
 */
class BasicFormNew {
    
    /*crear archivo base para formulario nuevo*/
    public static function create($ruta, $opcion, $pre){
        $capitaleOpcion = Functions::capitalize($opcion);
        
        $contenido = '<?php /*
* ---------------------------------------
* --------- CREATED BY CREATOR ----------
* fecha: '.date('d-m-Y H:m:s').' 
* Descripcion : formNew'.$capitaleOpcion.'.phtml
* ---------------------------------------
*/

/*prefijo: '.$pre.' debe ser alias en tabla men_menuprincipal*/
$grabar = Session::getPermiso("'.$pre.'GR");
    
?>
<form id="<?php echo '.$pre.'; ?>formNew'.$capitaleOpcion.'" name="<?php echo '.$pre.'; ?>formNew'.$capitaleOpcion.'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"  aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title">TITULO DE FORMULARIO</h4>
            </div>
            <div class="modal-body smart-form"> 
                CONTENIDO DEL FORM (utilizar constantes en Labels.php)
            </div>
            <div class="modal-footer">
                <div class="foot-obligar"></div>
                <?php if($grabar["permiso"]):?>
                <button id="<?php echo '.$pre.'; ?>btnGr'.$capitaleOpcion.'" type="submit" class="<?php echo $grabar["theme"]; ?>">
                    <i class="<?php echo $grabar["icono"]; ?>"></i> <?php echo $grabar["accion"]; ?>
                </button>
                <?php endif; ?>
                <button type="button" class="<?php echo THEME_CLOSE; ?>">
                    <i class="<?php echo ICON_CLOSE; ?>"></i> <?php echo BTN_CLOSE; ?>
                </button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->

<!-- si no tiene permiso se anula submit desde cualquier input -->
<?php if(!$grabar["permiso"]): ?>
<script>
    simpleScript.noSubmit("#<?php echo '.$pre.'; ?>formNew'.$capitaleOpcion.'");
</script>
<?php endif; ?>
<script>
/*configurar validacion de formulario -- este codigo es de ejemplo*/
$("#<?php echo '.$pre.'; ?>formNew'.$capitaleOpcion.'").validate({
    // Rules for form validation
    rules : {
        <?php echo '.$pre.'; ?>txt_campo : {
            required : true,
            minlength: 3
        }
    },

    // Msn para validacion -- es opcional -- se puede eliminar, validate tiene los msn configurados por defecto
    messages : {
        <?php echo '.$pre.'; ?>txt_campo : {
            required : "Campo requerido",
            regular: "No se permite caracteres inválidos"
        }
    },

    // No cambie el código de abajo
    errorPlacement : function(error, element) {
        error.insertAfter(element.parent());
    },

    submitHandler: function(){
        '.$opcion.'.postNew'.$capitaleOpcion.'();
    }   
});
</script>
</form>';
        
        $r = $ruta['app'].'/modules/'.$ruta['modulo'].'/views/'.$opcion;
        
        /*validar que carpeta de opcion exista*/
        if(file_exists($r)){
            if(file_exists($r.'/formNew'.$capitaleOpcion.'.phtml')){
                throw new Exception('Archivo: '.$r.'/formNew'.$capitaleOpcion.'.phtml ya existe.');
            }else{
                $fp=fopen($r.'/formNew'.$capitaleOpcion.'.phtml',"x");
                fwrite($fp,$contenido);
                fclose($fp) ;
            }
        }else{
            throw new Exception('Carpeta: '.$r.' no existe');
        }
    }
    
}
