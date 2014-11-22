<?php
/*
* --------------------------------------
* fecha: 09-08-2014 16:08:37 
* Descripcion : opcionController.php
* --------------------------------------
*/    

class opcionController extends Controller{    
    
    private static $opcionModel;
    
    public function __construct() {
        self::$opcionModel = $this->loadModel();
    }
    
    public function index(){ 
        Obj::run()->View->render();
    }
    
    public function unique(){ 
        //$t=$mm->find(array('id_opcion'=>27,'id_modulo'=>24),array('id_opcion','opcion'));
//        Obj::$call->opcionModel->find(27);
//        echo Obj::$call->opcionModel->usuario_creacion;
        
//        $all = Obj::$call->opcionModel->all(array('id_opcion','opcion'));
//        print_r($all);
        
//        $allwhere = Obj::$call->opcionModel->where('id_modulo','=','38')
//                ->where('tipo_opcion','<>','A')
//                ->limit('10');
//        print_r($allwhere);
//        exit;
        
        
        $data = self::$opcionModel->getUniqueOpcion();   /*valida si opcion existe en la db*/
        $datap= self::$opcionModel->getUniquePrefijo();  /*valida si prefijo existe en la db*/
        $ruta = self::$opcionModel->getRuta();   /*ruta*/
        
        $r = $ruta['ruta'].self::$opcionModel->_opcion.'Controller.php';
       
        /*validar si existe modulo*/
        $existModulo = Obj::run()->Creator->validateModulo($ruta);
        
        /*valida si opcion existe en modulo de aplicacion*/
        if(!Obj::run()->Creator->validateOpcion($r)){
            $datax = array('result1'=>$data['result'],'result2'=>1,'prefijo'=>$datap['resultpre'],'existModulo'=>$existModulo,'modulo'=>$ruta['modulo'],'db'=>$ruta['db']);
        }else{
            $datax = array('result1'=>$data['result'],'result2'=>3,'prefijo'=>$datap['resultpre'],'existModulo'=>$existModulo,'modulo'=>$ruta['modulo']);
        }
        
        echo json_encode($datax);
    }
    
    public function formTablesDB(){
        Obj::run()->View->render();
    }

    public static function getTablesDB(){
        $data = self::$opcionModel->getTablesDB(); 
        
        return $data;
    }
    
    public function formHtmlColumnas(){
        Obj::run()->View->render();
    }
    
    public static function getColumnsDB(){
        $data = self::$opcionModel->getColumnsDB(); 
        
        return $data;
    }
    
    public function formData(){
        $tipo = SimpleForm::getParam('_tipoData');
        $element = SimpleForm::getParam('_element');
        
        if($element != 'text' && $element != 'textarea'){
            if($tipo == 'F'){//data fija
                Obj::run()->View->render('formDatosFijos');
            }elseif($tipo == 'D'){//data dinamica
                Obj::run()->View->render('formDatosDinamicos');
            }
        }
        
    }
    
    public function crear(){ 
        $data = self::$opcionModel->postCrear();
        
        if($data == 1){
            $ruta = self::$opcionModel->getRuta();   /*ruta,modulo*/
            
            Obj::run()->Creator->createOpcion($ruta,self::$opcionModel->_opcion,self::$opcionModel->_tipo,self::$opcionModel->_prefijo);
        }
        
        $datax = array('result'=>$data);
        echo json_encode($datax);
    }
    
    public function guardarEtiquetasFijas(){ 
        $data = self::$opcionModel->guardarEtiquetasFijas();
        
        echo json_encode($data);
    }
    
}

?>