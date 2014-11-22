<?php

class AuditoriaModel extends Model {
    
    private $_txt;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }

    private function _set(){
        $this->_txt  =   SimpleForm::getParam('_txt'); 
        $this->_usuario = Session::get('sys_idUsuario');
    }
    
    public function insertAuditoria(){
        $query = "INSERT INTO c_auditoria (evento,usuario_evento)"
                . "VALUES(:evento, :usuario);";
        
        $parms = array(
            ':evento' => $this->_txt,
            ':usuario' => $this->_usuario
        );
        $this->execute($query,$parms);
        
        $data = array('result'=>1);
        return $data;
    }
    
}