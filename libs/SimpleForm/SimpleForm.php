<?php
/*
 * Documento   : SimpleForm
 * Creado      : 09-ago-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class SimpleForm{
    
    private static $_instancias = array();
    
    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) > 1){
            throw new Exception('Error: class Formulario ya se instancio; para acceder a la instancia ejecutar: Obj::run()->NOMBRE_REGISTRO');
        }
    }
    
    public static function getParam($parametro){
                
        if(isset($_POST[$parametro]) && !empty($_POST[$parametro])){
            if(is_array($_POST[$parametro])){
                $p = array();
                foreach ($_POST[$parametro] as $value) {
                    $p[] = htmlspecialchars(trim($value),ENT_QUOTES);;
                }
                $_POST[$parametro] = $p;
                return $_POST[$parametro];
            }else{
                return htmlspecialchars(trim($_POST[$parametro]),ENT_QUOTES);
            }
        }else{
            return false;
        }
    }
    
}