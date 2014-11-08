<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * indexController.php
 * --------------------------------------
 */
class configurarUsuariosController extends Controller{
    
    private static $configurarUsuariosModel;

    public function __construct() {
        self::$configurarUsuariosModel = $this->loadModel();
    }

    public function indexEvent(){ 
        Obj::run()->View->render();
    }

    public function getUsuariosEvent(){ 
        $editar = Session::getPermiso('CUSED');
        $eliminar = Session::getPermiso('CUSDE');
        
        $sEcho          =   SimpleForm::getParam('sEcho');
        
        $rResult = self::$configurarUsuariosModel->getUsuarios();
        
        if(!isset($rResult['error'])){  
            $iTotal         = isset($rResult[0]['total'])?$rResult[0]['total']:0;
            
            $sOutput = '{';
            $sOutput .= '"sEcho": '.intval($sEcho).', ';
            $sOutput .= '"iTotalRecords": '.$iTotal.', ';
            $sOutput .= '"iTotalDisplayRecords": '.$iTotal.', ';
            $sOutput .= '"aaData": [ ';
            foreach ( $rResult as $aRow ){
                
                if($aRow['activo'] == '1'){
                    $estado = '<span class=\"label label-success\">Activo</span>';
                }elseif($aRow['activo'] == '0'){
                    $estado = '<span class=\"label label-danger\">Inactivo</span>';
                }
                
                /*datos de manera manual*/
                $sOutput .= '["'.$aRow['usuario'].'","'.$aRow['nombrecompleto'].'","'.$aRow['roles'].'","'.$estado.'","'.$aRow['fecha_acceso'].'", ';

                /*antes de enviar id se encrypta*/
                $encryptReg = Aes::en($aRow['id_usuario']);

                /*
                 * configurando botones (add/edit/delete etc)
                 * se verifica si tiene permisos para editar
                 */
                $sOutput .= '"<div class=\"btn-group\">';
                
                if($editar['permiso'] == 1){
                    $sOutput .= '<button type=\"button\" class=\"'.$editar['theme'].'\" title=\"'.$editar['accion'].'\" onclick=\"configurarUsuarios.getEditUsuario(this,\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$editar['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                if($eliminar['permiso'] == 1){
                    $sOutput .= '<button type=\"button\" class=\"'.$eliminar['theme'].'\" title=\"'.$eliminar['accion'].'\" onclick=\"configurarUsuarios.postDeleteUsuario(\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$eliminar['icono'].'\"></i>';
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
    
    public function nuevoUsuarioEvent(){ 
        Obj::run()->View->render();
    }
    
    public function editarUsuarioEvent(){ 
        Obj::run()->View->render();
    }
    
    public static function getUsuario(){ 
        $rResult = self::$configurarUsuariosModel->getUsuario();
        return $rResult;
    }
    
    public static function getRolesUser(){ 
        $rResult = self::$configurarUsuariosModel->getRolesUser();
        return $rResult;
    }
    
    public function buscarEmpleadoEvent(){ 
        Obj::run()->View->render();
    }
    
    public static function getRoles(){
        $rResult = self::$configurarUsuariosModel->getRoles();
        return $rResult;
    }
    
    public function getEmpleadosEvent(){ 
        $tab = SimpleForm::getParam('_tab');
        $sEcho          =   SimpleForm::getParam('sEcho');
        
        $rResult = self::$configurarUsuariosModel->getEmpleados();
        
        if(!isset($rResult['error'])){  
            $iTotal         = isset($rResult[0]['total'])?$rResult[0]['total']:0;
            
            $sOutput = '{';
            $sOutput .= '"sEcho": '.intval($sEcho).', ';
            $sOutput .= '"iTotalRecords": '.$iTotal.', ';
            $sOutput .= '"iTotalDisplayRecords": '.$iTotal.', ';
            $sOutput .= '"aaData": [ ';
            foreach ( $rResult as $key=>$aRow ){
                /*antes de enviar id se encrypta*/
                $encryptReg  = Aes::en($aRow['persona']);
                $encryptReg2 = Aes::en($aRow['id_persona']);
                
                $nom = '<a href=\"javascript:;\" onclick=\"configurarUsuariosScript.setEmpleado({'.$tab.'txt_empleado:\''.$encryptReg.'\','.$tab.'txt_idpersona:\''.$encryptReg2.'\', '.$tab.'txt_empleadodesc:\''.$aRow['nombrecompleto'].'\', '.$tab.'txt_email:\''.$aRow['email'].'\'});\" >'.$aRow['nombrecompleto'].'</a>';
                
                /*datos de manera manual*/
                $sOutput .= '["'.(++$key).'","'.$nom.'" ';

                $sOutput .= '],';
            }
            $sOutput = substr_replace( $sOutput, "", -1 );
            $sOutput .= '] }';
        }else{
            $sOutput = $rResult['error'];
        }
        
        echo $sOutput;
    }
    
    public function postNuevoUsuarioEvent(){
        $data = self::$configurarUsuariosModel->mantenimientoUsuario();
        
        echo json_encode($data);
    }
    
    public function postEditarUsuarioEvent(){
        $data = self::$configurarUsuariosModel->editarUsuario();
        
        echo json_encode($data);
    }
    
    public function postDeleteUsuarioEvent(){
        $data = self::$configurarUsuariosModel->deleteUsuario();
        
        echo json_encode($data);
    }
    
}

?>
