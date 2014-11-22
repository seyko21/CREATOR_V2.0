<?php

class AuditoriaController extends Controller{
    
    private static $auditoriaModel;

    public function __construct() {
        self::$auditoriaModel = $this->loadModel();
    }
    
    public function index(){}
    
    public function logAuditoria() {
        $data = self::$auditoriaModel->insertAuditoria();
        
        echo json_encode($data);
    }
    
    public function logErrors(){
        $txt = SimpleForm::getParam('_txt').'   ('.date('d-m-Y H:m:s').')';
        
        $fp = fopen(ROOT.'log/logErrors.txt', 'a');
        fwrite($fp, chr(13).chr(10).$txt);
        fclose($fp);
        
        $data = array('result'=>1);
        echo json_encode($data);
    }
    
}