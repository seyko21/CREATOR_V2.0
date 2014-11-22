<?php
/*
 * Documento   : configurarMenuController
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class configurarMenuController extends Controller{
    
    private static $configurarMenuModel;

    public function __construct() {
        self::$configurarMenuModel = $this->loadModel();
    }

    public function index(){
        Obj::run()->View->render();
    }
    
    public static function getDominios(){          
        $rResult = self::$configurarMenuModel->getDominios();
        return $rResult;
    }
    
    public static function getModulos(){          
        $rResult = self::$configurarMenuModel->getModulos();
        return $rResult;
    }
    
    public static function getMenuPrincipales(){          
        $rResult = self::$configurarMenuModel->getMenuPrincipales();
        return $rResult;
    }
    
    public static function getOpciones(){          
        $rResult = self::$configurarMenuModel->getOpciones();
        return $rResult;
    }
    
    public function dominios(){
        Obj::run()->View->render();
    }
    
    public function modulos(){
        Obj::run()->View->render();
    }
    
    public function menuPrincipales(){
        Obj::run()->View->render();
    }
    
    public function nuevoDominio(){
        Obj::run()->View->render();
    }
    
    public function nuevoModulo(){
        Obj::run()->View->render();
    }
    
    public function nuevoMenuPrincipal(){
        Obj::run()->View->render();
    }
    
    public function editarDominio(){ 
        Obj::run()->View->render();
    }
    
    public function editarModulo(){ 
        Obj::run()->View->render();
    }
    
    public function editarMenuPrincipal(){ 
        Obj::run()->View->render();
    }
    
    public static function getDominio($id){ 
        $data = self::$configurarMenuModel->menuConsultas(2,$id);
        
        return $data;
    }
    
    public static function getModulo($id){ 
        $data = self::$configurarMenuModel->menuConsultas(4,$id);
        
        return $data;
    }
    
    public static function getMenuPrincipal($id){ 
        $data = self::$configurarMenuModel->menuConsultas(6,$id);
        
        return $data;
    }
    
    public function postDominio(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function deleteDominio(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function postModulo(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postDeleteModulo(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postMenuPrincipal(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
    public function postDeleteMenuPrincipal(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
    public function postSortDominio(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function postOrdenarModulo(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postOrdenarMenuPrincipal(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
}