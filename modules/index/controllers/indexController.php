<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * indexController.php
 * --------------------------------------
 */
class indexController extends Controller{
    
    private static $indexModel;

    private static $loginModel;

    public function __construct() {        
        self::$indexModel = $this->loadModel('index');
        self::$loginModel = $this->loadModel('login');
    }

    public function indexEvent(){
        if(Session::get('sys_idUsuario')){  
            Session::set('sys_menu', $this->getMenu());
            Obj::run()->View->render('index',false);
        }else{
            Obj::run()->View->render('login',false);
        }
    }

    private function getMenu(){
        return self::$loginModel->getMenu();
    }
    
    public function getAccionesOpcion($opcion){
        return self::$loginModel->getAccionesOpcion($opcion);
    }
    
    public function menuEvent(){
        Obj::run()->View->render();
    }
    
    public function getLock(){
        Session::destroy();
        Obj::run()->View->usuario = Session::get('sys_usuario');
        Obj::run()->View->nameUsuario = Session::get('sys_nombreUsuario');
        Obj::run()->View->render('lock');
    }
    
    public function changeRolEvent(){
        
        $idRol = SimpleForm::getParam('_idRol');
         
        foreach (Session::get('sys_roles') as $value) {
            if($value['id_rol'] == $idRol){
                Session::set('sys_defaultRol', $value['id_rol']);
            }
        }
        $result = array('result'=> 1);
        echo json_encode($result);
    }
    
    /*para la demo de mi dataGrid*/
    function dataGridEvent(){
        $data =  self::$indexModel->dataGrid();
        echo json_encode($data);
    }
    
}
