<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * View.php
 * --------------------------------------
 */

class View{
    
    private static $_instancias = array();
    
    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) > 1){
            throw new Exception('Error: class View ya se instancio; para acceder a la instancia ejecutar: Obj::run()->NOMBRE_REGISTRO');
        }
    }

    public function render($vista='',$ajax = true){       
        $c = 0;
        
        $rutaLayout = array(
            '_img' => BASE_URL .'theme/' . DEFAULT_LAYOUT . '/img/',
            '_css' => BASE_URL .'theme/' . DEFAULT_LAYOUT . '/css/',
            '_js' => BASE_URL .'theme/' . DEFAULT_LAYOUT . '/js/'
        );
        
        /*
         * la carpeta de la vista, es el nombre del controlador
         * cada controlador debe tener su propia carpeta para las vistas
         */
        $carpeta = Obj::run()->Request->getControlador();
     
        /*si llamada a vista es via ajax*/
        if($ajax && empty($vista)){
            /*detectar en que metodo se ejecuta render();*/
            $e = new Exception();
            $trace = $e->getTrace();
            $last_call = $trace[1]; /*trae datos de clase donde se ejecuta View->render()*/
            
            $vista = $last_call['function'];
            /*verifica si metodo ajax tiene la palabra Event*/
            $c = substr_compare($vista,APP_PRE_METHOD,APP_COMPARE_INDEX);
        }
        
        /*para las vistas via ajax*/
        if($c && $ajax){
            /*la vista, segun el metodo ejecutado, sin Event*/
            $vista = str_replace(APP_PRE_METHOD,'',$vista);
            
            $rutaVista = ROOT . 'modules' . DS . Obj::run()->Request->getModulo() . DS . 'views' . DS . $carpeta . DS . $vista . '.phtml';
        }else{/*para las vistas sin ajax*/
            $rutaVista = ROOT . 'modules' . DS . Obj::run()->Request->getModulo() . DS . 'views' . DS . $carpeta . DS . $vista . '.phtml';
        }
        
        if(is_readable($rutaVista)){
            /*para las vistas via ajax*/
            if($ajax){
                /*cuando peticion es via ajax no se necesita el header y el footer*/
                require_once ($rutaVista);
            }else{
                require_once (ROOT . 'theme' . DS . DEFAULT_LAYOUT . DS . 'header.php');
                require_once ($rutaVista);
                require_once (ROOT . 'theme' . DS . DEFAULT_LAYOUT . DS . 'footer.php');
            }
        }else{
            throw new Exception('Error de vista: <b>'.$rutaVista.'</b> no encontrada .');
        }
        
    }
    
}