<?php
/*
* --------------------------------------
* fecha: 08-08-2014 19:08:43 
* Descripcion : moduloController.php
* --------------------------------------
*/    

class moduloController extends Controller{

    private static $moduloModel;
    
    private static $aplicacionModel;

    public function __construct() {
        self::$moduloModel = $this->loadModel();
        self::$aplicacionModel = $this->loadModel('aplicacion');
    }
    
    public function indexEvent(){ 
        Obj::run()->View->render();
    }
    
    public function getGridModuloEvent(){
        $crearopcion = Session::getPermiso('CREMOCO');
        $veropcion   = Session::getPermiso('CREMOVO');
        
        $sEcho          =   SimpleForm::getParam('sEcho');
        
        $rResult = self::$moduloModel->getModulos();
        
        if(!isset($rResult['error'])){  
            $iTotal         = isset($rResult[0]['total'])?$rResult[0]['total']:0;
            
            $sOutput = '{';
            $sOutput .= '"sEcho": '.intval($sEcho).', ';
            $sOutput .= '"iTotalRecords": '.$iTotal.', ';
            $sOutput .= '"iTotalDisplayRecords": '.$iTotal.', ';
            $sOutput .= '"aaData": [ ';
            foreach ( $rResult as $key=>$aRow ){
                /*antes de enviar id se encrypta*/
                $encryptReg = Aes::en($aRow['id_modulo']);
                
                $chk = '<input id=\"c_'.(++$key).'\" type=\"checkbox\" name=\"'.T5.'chk_delete[]\" value=\"'.$encryptReg.'\">';
                
                /*datos de manera manual*/
                $sOutput .= '["'.$chk.'","'.$aRow['modulo'].'","'.$aRow['aplicacion'].'","'.$aRow['usuario'].'","'.$aRow['fechac'].'", ';

                

                /*
                 * configurando botones (add/edit/delete etc)
                 * se verifica si tiene permisos para editar
                 */
                $sOutput .= '"<div class=\"btn-group\">';
                
               
                if($crearopcion['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$crearopcion['theme'].'\" title=\"'.$crearopcion['accion'].'\" onclick=\"opcion.main(\''.$encryptReg.'\',\''.$aRow['modulo'].'\')\">';
                    $sOutput .= '    <i class=\"'.$crearopcion['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                
                if($veropcion['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$veropcion['theme'].'\" title=\"'.$veropcion['accion'].'\" onclick=\"opcion.getGridOpcion(\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$veropcion['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                
                $sOutput .= ' </div>" ';

                $sOutput = substr_replace( $sOutput, "", -1 );
                $sOutput .= '],';
            }
            $sOutput = substr_replace( $sOutput, "", -1 );
            $sOutput .= '] }';
        }else{
            $sOutput = $rResult['error'];
        }
        
        echo $sOutput;
    }
    
    public static function getAplicaciones(){ 
        $data = self::$moduloModel->getAplicaciones();
        
        return $data;
    }
    
    public function formNuevoModuloEvent(){
        Obj::run()->View->render();
    }
    
    public function postNuevoModuloEvent(){ 
        $app = self::$moduloModel->getRuta();
       
//        $app = aplicacionModel::find(SimpleForm::getParam(T5.'lst_aplicacion'));
       
        //$app = Obj::run()->aplicacionModel->find(SimpleForm::getParam(T5.'lst_aplicacion'));
       
        $ruta = $app['ruta'].'modules/'.self::$moduloModel->_modulo;
            
        if(Obj::run()->Creator->createModulo($ruta)){
            $data = self::$moduloModel->mantenimientoModulo();
        }else{
            $data = array('result'=>3,'duplicado'=>1);
        }
        
        echo json_encode($data);
    }
    
}

?>