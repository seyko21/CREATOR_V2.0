<?php
/*
* ---------------------------------------
* --------- CREATED BY CREATOR ----------
* fecha: 18-08-2014 19:08:36 
* Descripcion : aplicacionController.php
* ---------------------------------------
*/    

class aplicacionController extends Controller{

    private static $moduloModel;
    
    public function __construct() {
        self::$moduloModel = $this->loadModel();
    }
    
    public function index(){ 
        Obj::run()->View->render();
    }
    
    public function getGridAplicacion(){
        /*-----------CONFIGURAR DATA PARA GRID---------*/
    }
    
    /*carga formulario (newAplicacion.phtml) para nuevo registro: Aplicacion*/
    public function formNewAplicacion(){
        Obj::run()->View->render();
    }
    
    /*envia datos para grabar registro: Aplicacion*/
    public function postNewAplicacion(){
        $data = Obj::run()->aplicacionModel->newAplicacion();
        
        echo json_encode($data);
    }
    
    /*envia datos para editar registro: Aplicacion*/
    public function postEditAplicacion(){
        $data = Obj::run()->aplicacionModel->editAplicacion();
        
        echo json_encode($data);
    }
    
    /*envia datos para eliminar registro: Aplicacion*/
    public function postDeleteAplicacionAll(){
        $data = Obj::run()->aplicacionModel->deleteAplicacionAll();
        
        echo json_encode($data);
    }
    
}

?>