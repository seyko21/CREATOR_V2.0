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

    public function indexEvent(){
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
    
    public function dominiosEvent(){
        Obj::run()->View->render();
    }
    
    public function modulosEvent(){
        Obj::run()->View->render();
    }
    
    public function menuPrincipalesEvent(){
        Obj::run()->View->render();
    }
    
    public function nuevoDominioEvent(){
        Obj::run()->View->render();
    }
    
    public function nuevoModuloEvent(){
        Obj::run()->View->render();
    }
    
    public function nuevoMenuPrincipalEvent(){
        Obj::run()->View->render();
    }
    
    public function editarDominioEvent(){ 
        Obj::run()->View->render();
    }
    
    public function editarModuloEvent(){ 
        Obj::run()->View->render();
    }
    
    public function editarMenuPrincipalEvent(){ 
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
    
    public function postDominioEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function deleteDominioEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function postModuloEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postDeleteModuloEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postMenuPrincipalEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
    public function postDeleteMenuPrincipalEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
    public function postSortDominioEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoDominio();
        
        echo json_encode($data);
    }
    
    public function postOrdenarModuloEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoModulo();
        
        echo json_encode($data);
    }
    
    public function postOrdenarMenuPrincipalEvent(){ 
        $data = self::$configurarMenuModel->mantenimientoMenuPrincipal();
        
        echo json_encode($data);
    }
    
}