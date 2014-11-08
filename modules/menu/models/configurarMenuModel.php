<?php
/*
 * Documento   : configurarMenuModel
 * Creado      : 05-jul-2014
 * Autor       : ..... .....
 * Descripcion : 
 */
class configurarMenuModel extends Model{
    private $_flag;
    private $_idDominio;
    private $_idModulo;
    private $_idMenuPrincipal;
    private $_idOpcion;
    private $_dominio;
    private $_modulo;
    private $_menu;
    private $_opcion;
    private $_alias;
    private $_url;
    private $_icono;
    private $_class;
    private $_orden;
    private $_activo;
    private $_usuario;
    
    public function __construct() {
        parent::__construct();
        $this->_set();
    }
    
    private function _set(){
        $this->_flag            = SimpleForm::getParam('_flag');
        $this->_idDominio       = Aes::de(SimpleForm::getParam('_idDominio'));    /*se decifra*/
        $this->_idModulo        = Aes::de(SimpleForm::getParam('_idModulo'));
        $this->_idMenuPrincipal = Aes::de(SimpleForm::getParam('_idMenuPrincipal'));
        $this->_idOpcion        = Aes::de(SimpleForm::getParam('_idOpcion'));
        $this->_dominio         = SimpleForm::getParam(T3.'txt_dominio');
        $this->_modulo          = SimpleForm::getParam(T3.'txt_modulo');
        $this->_menu            = SimpleForm::getParam(T3.'txt_menu');
        $this->_opcion          = SimpleForm::getParam(T3.'txt_opcion');
        $this->_alias           = SimpleForm::getParam(T3.'txt_alias');
        $this->_url             = SimpleForm::getParam(T3.'txt_url');
        $this->_icono           = SimpleForm::getParam(T3.'txt_icono');
        $this->_class           = SimpleForm::getParam(T3.'txt_class');
        $this->_activo          = SimpleForm::getParam(T3.'chk_activo');
        $this->_orden           = SimpleForm::getParam(T3.'txt_orden');
        $this->_usuario         = Session::get('sys_usuario');
    }
    
    public function menuConsultas($flag,$id){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        $parms = array(
            ':flag' => $flag,
            ':criterio' => Aes::de($id)
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $data;
    }
    
    public function getDominios(){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 1,
            ':criterio' => ''
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function getModulos(){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 3,
            ':criterio' => $this->_idDominio
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function getMenuPrincipales(){
        $query = "call sp_menuConfigurarMenuConsultas(:flag,:criterio);";
        
        $parms = array(
            ':flag' => 5,
            ':criterio' => $this->_idModulo
        );
        $data = $this->queryAll($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoDominio(){
        $query = "call sp_menuConfigurarMenuDominioMantenimiento(:flag,:key,:dominio,:icono,:orden,:activo,:usuario);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idDominio,
            ':dominio' => $this->_dominio,
            ':icono' => $this->_icono,
            ':orden' => $this->_orden,
            ':activo' => $this->_activo,
            ':usuario' => $this->_usuario
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoModulo(){
        $query = "call sp_menuConfigurarMenuModuloMantenimiento(:flag,:key,:idDominio,:modulo,:orden,:activo,:usuario);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idModulo,
            ':idDominio' => $this->_idDominio,
            ':modulo' => $this->_modulo,
            ':orden' => $this->_orden,
            ':activo' => $this->_activo,
            ':usuario' => $this->_usuario
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
    public function mantenimientoMenuPrincipal(){
        $query = "call sp_menuConfigurarMenuMenuPrincipalMantenimiento(:flag,:key,:idModulo,:menu,:orden,:url,:alias,:activo,:usuario);";
        $parms = array(
            ':flag' => $this->_flag,
            ':key' => $this->_idMenuPrincipal,
            ':idModulo' => $this->_idModulo,
            ':menu' => $this->_menu,
            ':orden' => $this->_orden,
            ':url' => $this->_url,
            ':alias' => $this->_alias,
            ':activo' => $this->_activo,
            ':usuario' => $this->_usuario
        );
        $data = $this->queryOne($query,$parms);
        if(!isset($data['error'])){  
            $xdata = $data;
        }else{
            $xdata = $data['error'];
        }
        return $xdata;
    }
    
}