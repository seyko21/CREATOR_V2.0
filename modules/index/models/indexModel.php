<?php

/*
 * Documento   : indexModel
 * Creado      : 30-ene-2014, 17:38:01
 * Autor       : RDCC
 * Descripcion :
 */

class indexModel extends Model {

    /*para el grid*/
    private $_pDisplayStart;
    private $_pDisplayLength;
    private $_pSortingCols;
    private $_pSearch;
    private $_pOrder;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }

    private function _set(){
        $this->_pDisplayStart  =   SimpleForm::getParam('pDisplayStart'); 
        $this->_pDisplayLength =   SimpleForm::getParam('pDisplayLength'); 
        $this->_pSortingCols   =   SimpleForm::getParam('pSortingCols');
        $this->_pSearch        =   SimpleForm::getParam('pSearch');
        $this->_pOrder        =   SimpleForm::getParam('pOrder');
    }
    
    public function dataGrid(){
//        $aColumns       =   array( 'chk','modulo' ); //para la ordenacion y pintado en html
//        /*
//	 * Ordenando, se verifica por que columna se ordenara
//	 */
//        $sOrder = "";
//        for ( $i=0 ; $i<intval( $this->_iSortingCols ) ; $i++ ){
//                if ( SimpleForm::getParam( 'bSortable_'.intval(SimpleForm::getParam('iSortCol_'.$i)) ) == "true" ){
//                        $sOrder .= " ".$aColumns[ intval( SimpleForm::getParam('iSortCol_'.$i) ) ]." ".
//                                (SimpleForm::getParam('sSortDir_'.$i)==='asc' ? 'asc' : 'desc') ." ";
//                }
//        }
        
        $query = "call sp_consModuloGrid(:iDisplayStart,:iDisplayLength,:sOrder,:sSearch);";
        
        $parms = array(
            ':iDisplayStart' => $this->_pDisplayStart,
            ':iDisplayLength' => $this->_pDisplayLength,
            ':sOrder' => $this->_pOrder,
            ':sSearch' => '',
        );
        $data = $this->queryAll($query,$parms);
        return $data;
    }
    
}