<?php
/*
 * Documento   : Creator
 * Creado      : 08-ago-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
require_once 'Includes.php';

class Creator{
    
    private static $_instancias = array();

    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) > 1){
            throw new Exception('Error: class Creator ya se instancio; para acceder a la instancia ejecutar: Obj::run()->NOMBRE_REGISTRO');
        }
    }
    
    public function createModulo($ruta){
        $ruta = $ruta;
        
        if(!file_exists($ruta)){
            mkdir($ruta, 0700);
            mkdir($ruta.'/controllers', 0700);
            mkdir($ruta.'/models', 0700);
            mkdir($ruta.'/views', 0700);
            mkdir($ruta.'/views/js', 0700);
            return true;
        }else{
            return false;
        }
    }
    
    public function validateModulo($ruta){
        if(file_exists($ruta['app'].'modules/'.$ruta['modulo'])){
            return 1;
        }else{
            return 0;
        }
    }

    public function validateOpcion($ruta){
        if(file_exists($ruta)){
            return true;
        }else{
            return false;
        }
    }
    
    public function createOpcion($ruta,$opcion,$tipo,$pre){
        self::setConstantes($ruta['app'],$pre,$opcion);
        
        switch ($tipo){
            case 'B':
                BasicController::create($ruta,$opcion,$pre);
                BasicModel::create($ruta,$opcion);
                BasicJs::create($ruta,$opcion,$pre);
                BasicIndex::create($ruta, $opcion, $pre);
                BasicFormNew::create($ruta, $opcion, $pre);
                BasicFormEdit::create($ruta, $opcion, $pre);
                break;
        }
    }
    
    /*agrega constantes generales para opciones*/
    private static function setConstantes($ruta,$pre,$opcion){
        $fp = fopen($ruta.'includes/ConstantesPHP.php', 'a');
        fwrite($fp, chr(13).chr(10).'define("'.$pre.'","'.$pre.'");             /*tab opción '.strtoupper($opcion).'*/');
        fclose($fp);
        
        $fpj = fopen($ruta.'includes/ConstantesJs.php', 'a');
        fwrite($fpj,chr(13).chr(10).'tabs.'.$pre." = '<?php echo ".$pre."; ?>';");
        fclose($fpj);
    }

}
