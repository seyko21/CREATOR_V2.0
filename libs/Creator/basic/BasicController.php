<?php
class BasicController{
 
    public static function create($ruta,$opcion,$pre){
        /*crear archivo controller BASICO*/
        $capitaleOpcion = Functions::capitalize($opcion);
        
        $contenido='<?php
/*
* ---------------------------------------
* --------- CREATED BY CREATOR ----------
* fecha: '.date('d-m-Y H:m:s').' 
* Descripcion : '.$capitaleOpcion.'Controller.php
* ---------------------------------------
*/    

class '.$capitaleOpcion.'Controller extends Controller{
    
    private static $'.$opcion.'Model;
    
    public function __construct() {
        self::$'.$opcion.'Model = $this->loadModel();
    }
    
    public function indexEvent(){ 
        Obj::run()->View->render();
    }
    
    public function getGrid'.$capitaleOpcion.'(){
        $editar   = Session::getPermiso(\''.$pre.'ED\');
        $eliminar = Session::getPermiso(\''.$pre.'DE\');
        
        $sEcho          =   SimpleForm::getParam(\'sEcho\');
        
        $rResult = self::$'.$opcion.'Model->get'.$capitaleOpcion.'();
        
        $num = self::$'.$opcion.'Model->_iDisplayStart;
        if($num >= 10){
            $num++;
        }else{
            $num = 1;
        }
        
        if(!isset($rResult[\'error\'])){  
            $iTotal         = isset($rResult[0][\'total\'])?$rResult[0][\'total\']:0;
            
            $sOutput = \'{\';
            $sOutput .= \'"sEcho": \'.intval($sEcho).\', \';
            $sOutput .= \'"iTotalRecords": \'.$iTotal.\', \';
            $sOutput .= \'"iTotalDisplayRecords": \'.$iTotal.\', \';
            $sOutput .= \'"aaData": [ \';     
            
            foreach ( $rResult as $aRow ){
                
                /*campo que maneja los estados, para el ejemplo aqui es ACTIVO, coloca tu campo*/
                if($aRow[\'activo\'] == 1){
                    $estado = \'<span class=\"label label-success\">\'.LABEL_ACT.\'</span>\';
                }else{
                    $estado = \'<span class=\"label label-danger\">\'.LABEL_DES.\'</span>\';
                }
                
                /*antes de enviar id se encrypta*/
                $encryptReg = Aes::en($aRow[\'ID_REGISTRO\']);
                
                /*
                 * configurando botones (add/edit/delete etc)
                 * se verifica si tiene permisos para editar
                 */
                $axion = \'"<div class=\"btn-group\">\';
                 
                if($editar[\'permiso\']){
                    $axion .= \'<button type=\"button\" class=\"\'.$editar[\'theme\'].\'\" title=\"\'.$editar[\'accion\'].\'\" onclick=\"'.$opcion.'.getFormEdit'.$capitaleOpcion.'(this,\\\'\'.$encryptReg.\'\\\')\">\';
                    $axion .= \'    <i class=\"\'.$editar[\'icono\'].\'\"></i>\';
                    $axion .= \'</button>\';
                }
                if($eliminar[\'permiso\']){
                    $axion .= \'<button type=\"button\" class=\"\'.$eliminar[\'theme\'].\'\" title=\"\'.$eliminar[\'accion\'].\'\" onclick=\"'.$opcion.'.postDelete'.$capitaleOpcion.'(this,\\\'\'.$encryptReg.\'\\\')\">\';
                    $axion .= \'    <i class=\"\'.$eliminar[\'icono\'].\'\"></i>\';
                    $axion .= \'</button>\';
                }
                
                $axion .= \' </div>" \';
                
                /*registros a mostrar*/
                $sOutput .= \'["\'.($num++).\'",\'.$axion.\',"\'.$aRow[\'CAMPO 1\'].\'","\'.$aRow[\'CAMPO 2\'].\'","\'.$estado.\'" \';

                $sOutput .= \'],\';

            }
            $sOutput = substr_replace( $sOutput, "", -1 );
            $sOutput .= \'] }\';
        }else{
            $sOutput = $rResult[\'error\'];
        }
        
        echo $sOutput;

    }
    
    /*carga formulario (formNew'.$capitaleOpcion.'.phtml) para nuevo registro: '.$capitaleOpcion.'*/
    public function formNew'.$capitaleOpcion.'Event(){
        Obj::run()->View->render();
    }
    
    /*carga formulario (formEdit'.$capitaleOpcion.'.phtml) para editar registro: '.$capitaleOpcion.'*/
    public function formEdit'.$capitaleOpcion.'Event(){
        Obj::run()->View->render();
    }
    
    /*busca data para editar registro: '.$capitaleOpcion.'*/
    public function find'.$capitaleOpcion.'Event(){
        $data = self::$'.$opcion.'Model->find'.$capitaleOpcion.'();
            
        return $data;
    }
    
    /*envia datos para grabar registro: '.$capitaleOpcion.'*/
    public function new'.$capitaleOpcion.'Event(){
        $data = self::$'.$opcion.'Model->new'.$capitaleOpcion.'();
        
        echo json_encode($data);
    }
    
    /*envia datos para editar registro: '.$capitaleOpcion.'*/
    public function edit'.$capitaleOpcion.'Event(){
        $data = self::$'.$opcion.'Model->edit'.$capitaleOpcion.'();
        
        echo json_encode($data);
    }
    
    /*envia datos para eliminar registro: '.$capitaleOpcion.'*/
    public function delete'.$capitaleOpcion.'Event(){
        $data = self::$'.$opcion.'Model->delete'.$capitaleOpcion.'();
        
        echo json_encode($data);
    }
    
    /*envia datos para eliminar registros: '.$capitaleOpcion.'*/
    public function delete'.$capitaleOpcion.'AllEvent(){
        $data = self::$'.$opcion.'Model->delete'.$capitaleOpcion.'All();
        
        echo json_encode($data);
    }
    
}
';
        if(file_exists($ruta['ruta'].$capitaleOpcion.'Controller.php')){
            throw new Exception('Archivo: '.$ruta['ruta'].$capitaleOpcion.'Controller.php ya existe.');
        }else{
            $fp=fopen($ruta['ruta'].$capitaleOpcion.'Controller.php',"x");
            fwrite($fp,$contenido);
            fclose($fp) ;
        }
        
    }
    
}
?>