<?php
/*
 * --------------------------------------
 * creado por:  ...
 * fecha: 03.01.2014
 * configurarRolesController.php
 * --------------------------------------
 */
class configurarRolesController extends Controller{
    
    private static $configurarRolesModel;

    public function __construct() {
        self::$configurarRolesModel = $this->loadModel();
    }

    public function indexEvent(){
        Obj::run()->View->render();
    }

    public function getRolesEvent(){ 
        $accesos  = Session::getPermiso('CROAC');
        $eliminar = Session::getPermiso('CRODE');
        $editar   = Session::getPermiso('CROED');
        
        $sEcho          =   SimpleForm::getParam('sEcho');
        
        $rResult = self::$configurarRolesModel->getRoles();
        
        if(!isset($rResult['error'])){  
            $iTotal         = isset($rResult[0]['total'])?$rResult[0]['total']:0;
            
            $sOutput = '{';
            $sOutput .= '"sEcho": '.intval($sEcho).', ';
            $sOutput .= '"iTotalRecords": '.$iTotal.', ';
            $sOutput .= '"iTotalDisplayRecords": '.$iTotal.', ';
            $sOutput .= '"aaData": [ ';
            foreach ( $rResult as $aRow ){
                
                if($aRow['activo'] == 1){
                    $estado = '<span class=\"label label-success\">'.$aRow['estado'].'</span>';
                }else{
                    $estado = '<span class=\"label label-danger\">'.$aRow['estado'].'</span>';
                }
                
                /*datos de manera manual*/
                $sOutput .= '["'.$aRow['id_rol'].'","'.$aRow['rol'].'","'.$estado.'", ';

                /*antes de enviar id se encrypta*/
                $encryptReg = Aes::en($aRow['id_rol']);

                /*
                 * configurando botones (add/edit/delete etc)
                 * se verifica si tiene permisos para editar
                 */
                $sOutput .= '"<div data-key=\"'.$encryptReg.'\" class=\"btn-group\">';
                
                
                if($editar['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$editar['theme'].'\" title=\"'.$editar['accion'].'\" onclick=\"configurarRoles.getRol(\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$editar['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                if($eliminar['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$eliminar['theme'].'\" title=\"'.$eliminar['accion'].'\" onclick=\"configurarRoles.postDeleteRol(\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$eliminar['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                
                if($accesos['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$accesos['theme'].'\" title=\"'.$accesos['accion'].'\" onclick=\"configurarRoles.getAccesos(\''.$encryptReg.'\',\''.$aRow['rol'].'\')\">';
                    $sOutput .= '    <i class=\"'.$accesos['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                
                $sOutput .= '<button type=\"button\" class=\"btn bg-color-blue txt-color-white btn-xs\" title=\"Duplicar\" onclick=\"configurarRoles.postDuplicarRol(this,\''.$encryptReg.'\')\">';
                $sOutput .= '    <i class=\"fa fa-copy\"></i>';
                $sOutput .= '</button>';
                
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
    
    public function nuevoRolEvent(){ 
        Obj::run()->View->render();
    }
    
    public function editarRolEvent(){ 
        Obj::run()->View->key = SimpleForm::getParam('_key'); 
        Obj::run()->View->render();
    }
    
    public static function getRol($idRol){ 
        $data = self::$configurarRolesModel->getRol($idRol);
        
        return $data;
    }
    
    public static function getDominios($idRol){ 
        $data = self::$configurarRolesModel->consultasRol(2,$idRol);
        
        return $data;
    }
    
    public static function getModulos($idDominio){ 
        $data = self::$configurarRolesModel->consultasRol(3,$idDominio);
        
        return $data;
    }
    
    public static function getMenuPrincipal($idModulo){ 
        $data = self::$configurarRolesModel->consultasRol(4,$idModulo);
        
        return $data;
    }
    
    public static function getMenuOpciones($idRol,$idMenuPrincipal){ 
        $data = self::$configurarRolesModel->consultarMenuOpciones(5,$idRol,$idMenuPrincipal);
        
        return $data;
    }
    
    public static function getAcciones($idRolOpciones){ 
        $data = self::$configurarRolesModel->consultasRol(6,$idRolOpciones);
        
        return $data;
    }
    
    public function accesosEvent(){ 
        Obj::run()->View->keyRol = SimpleForm::getParam('_key');
        Obj::run()->View->render();
    }
    
    public function accesosRolOpcionEvent(){ 
        Obj::run()->View->_rolOpcion = SimpleForm::getParam('_rolOpcion');
        Obj::run()->View->render();
    }
    
    public function postRolEvent(){ 
        $data = self::$configurarRolesModel->mantenimientoRol();
        
        echo json_encode($data);
    }
    
    public function postDeleteRolEvent(){ 
        $data = self::$configurarRolesModel->mantenimientoRol();
        
        echo json_encode($data);
    }
    
    public function postOpcionEvent(){ 
        $data = self::$configurarRolesModel->mantenimientoRolOpcion();
        
        echo json_encode($data);
    }
    
    public function postAccionOpcionRolEvent(){ 
        $data = self::$configurarRolesModel->mantenimientoRolOpcionAccion();
        
        echo json_encode($data); 
    }
    
    public function duplicarRolEvent(){ 
        $data = self::$configurarRolesModel->postDuplicarRol();
        
        echo json_encode($data); 
    }
    
}

?>
