<?php
/*
* --------------------------------------
* fecha: 08-08-2014 19:08:43 
* Descripcion : moduloModel.php
* --------------------------------------
*/ 

class moduloModel extends Model{
    
    private $_flag;
    private $_idModulo;
    private $_idAplicacion;
    public  $_modulo;
//    private $_creadb;
    private $_usuario;
    
    /*para el grid*/
    private $_iDisplayStart;
    private $_iDisplayLength;
    private $_iSortingCols;
    private $_sSearch;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }
    
    private function _set(){
        $this->_flag    = SimpleForm::getParam('_flag');
        $this->_idModulo     = Aes::de(SimpleForm::getParam('_idModulo'));    /*se decifra*/
        $this->_idAplicacion    = SimpleForm::getParam(T5.'lst_aplicacion');
        $this->_modulo    = strtolower (SimpleForm::getParam(T5.'txt_descripcion'));
//        $this->_creadb    = strtolower (SimpleForm::getParam(T5.'rd_db'));
        $this->_usuario = Session::get('sys_idUsuario');
        
        $this->_iDisplayStart  =   SimpleForm::getParam('iDisplayStart'); 
        $this->_iDisplayLength =   SimpleForm::getParam('iDisplayLength'); 
        $this->_iSortingCols   =   SimpleForm::getParam('iSortingCols');
        $this->_sSearch        =   SimpleForm::getParam('sSearch');
    }
    
    public function getModulos(){
        $aColumns       =   array( 'chk','modulo' ); //para la ordenacion y pintado en html
        /*
	 * Ordenando, se verifica por que columna se ordenara
	 */
        $sOrder = "";
        for ( $i=0 ; $i<intval( $this->_iSortingCols ) ; $i++ ){
                if ( SimpleForm::getParam( 'bSortable_'.intval(SimpleForm::getParam('iSortCol_'.$i)) ) == "true" ){
                        $sOrder .= " ".$aColumns[ intval( SimpleForm::getParam('iSortCol_'.$i) ) ]." ".
                                (SimpleForm::getParam('sSortDir_'.$i)==='asc' ? 'asc' : 'desc') ." ";
                }
        }
        
        $query = "call sp_consModuloGrid(:iDisplayStart,:iDisplayLength,:sOrder,:sSearch);";
        
        $parms = array(
            ':iDisplayStart' => $this->_iDisplayStart,
            ':iDisplayLength' => $this->_iDisplayLength,
            ':sOrder' => $sOrder,
            ':sSearch' => $this->_sSearch,
        );
        $data = $this->queryAll($query,$parms);
        return $data;
    }
    
    public function getAplicaciones(){
        $query = "SELECT id_aplicacion,aplicacion FROM c_aplicacion; ";
        
        $parms = array();
        $data = $this->queryAll($query,$parms);
        return $data;
    }
    
    public function getRuta(){
        $query = "SELECT `ruta`,base_datos FROM `c_aplicacion` WHERE `id_aplicacion`=:idAplicacion";
        
        $parms = array(
            ':idAplicacion' => $this->_idAplicacion
        );
        $data = $this->queryOne($query,$parms);
        return $data;
    }
    
    public function mantenimientoModulo(){
        $query = "call sp_consModuloMantenimiento(:flag,:idModulo,:modulo,:idAplicacion,:grabarDB,:usuario);";
        $parms = array(
            ':flag' => $this->_flag,
            ':idModulo' => $this->_idModulo,
            ':modulo' => $this->_modulo,
            ':idAplicacion' => $this->_idAplicacion,
            ':grabarDB'=>  '',
            ':usuario' => $this->_usuario
        );
        $data = $this->queryOne($query,$parms);
        return $data;
    }
    
}
