<?php
/*
 * Documento   : accionesController
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class accionesController extends Controller{
    
    private static $accionesModel;

    public function __construct() {
        self::$accionesModel = $this->loadModel();
    }

    public function index(){
        Obj::run()->View->render();
    }
    
    public function getAcciones(){ 
        $editar   = Session::getPermiso('ACCED');
        $eliminar = Session::getPermiso('ACCDE');
        
        $sEcho          =   SimpleForm::getParam('sEcho');
        
        $rResult = self::$accionesModel->getAcciones();
        
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
                $t='<button type=\"button\" class=\"'.$aRow['theme'].'\"><i class=\"'.$aRow['icono'].'\"></i></button>';
                /*datos de manera manual*/
                $sOutput .= '["'.$aRow['id_acciones'].'","'.$aRow['accion'].'","'.$t.'","'.$aRow['alias'].'","'.$estado.'", ';

                /*antes de enviar id se encrypta*/
                $encryptReg = Aes::en($aRow['id_acciones']);

                /*
                 * configurando botones (add/edit/delete etc)
                 * se verifica si tiene permisos para editar
                 */
                $sOutput .= '"<div class=\"btn-group\">';
                
                if($editar['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$editar['theme'].'\" title=\"'.$editar['accion'].'\" onclick=\"acciones.getAccion(\''.$encryptReg.'\')\">';
                    $sOutput .= '    <i class=\"'.$editar['icono'].'\"></i>';
                    $sOutput .= '</button>';
                }
                if($eliminar['permiso']){
                    $sOutput .= '<button type=\"button\" class=\"'.$eliminar['theme'].'\" title=\"'.$eliminar['accion'].'\" onclick=\"acciones.postDeleteAccion(\''.$encryptReg.'\')\">';
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
    
    public function nuevaAccion(){
        Obj::run()->View->render();
    }
    
    public function editAccion(){ 
        Obj::run()->View->render();
    }
    
    public function getAccion(){ 
        $data = self::$accionesModel->getAccion();
        
        return $data;
    }
    
    public function postAccion(){ 
        $data = self::$accionesModel->mantenimientoAccion();
        
        echo json_encode($data);
    }
    
    public function postDeleteAccion(){ 
        $data = self::$accionesModel->mantenimientoAccion();
        
        echo json_encode($data);
    }
    
}
?>
