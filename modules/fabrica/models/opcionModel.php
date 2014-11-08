<?php

/*
 * --------------------------------------
 * fecha: 09-08-2014 16:08:37 
 * Descripcion : opcionModel.php
 * --------------------------------------
 */

class opcionModel extends Model {

    protected static $_table = 'c_opcion';
    protected static $_primaryKey = 'id_opcion';
    private $_flag;
    private $_idModulo;
    public  $_opcion;
    public  $_prefijo;
    public  $_tipo;
    private $_database;
    private $_tabla;
    private $_usuario;
    private $_etiquetasFijas;
    private $_valoresFijos;
    private $_campo;

    /* para el grid */
    private $_iDisplayStart;
    private $_iDisplayLength;
    private $_iSortingCols;
    private $_sSearch;

    public function __construct() {
        parent::__construct();
        $this->_set();
    }

    private function _set() {
        $this->_flag = SimpleForm::getParam('_flag');
        $this->_idModulo = Aes::de(SimpleForm::getParam('_idModulo'));    /* se decifra */
        $this->_opcion = SimpleForm::getParam(T6 . 'txt_opcion');
        $this->_prefijo = SimpleForm::getParam(T6 . 'txt_prefijo');
        $this->_tipo = SimpleForm::getParam(T6 . 'rd_tipo');
        $this->_database = SimpleForm::getParam('_db');
        $this->_tabla = SimpleForm::getParam('_tabla');
        $this->_etiquetasFijas = SimpleForm::getParam(T6 . 'txt_etiqueta_campo');    /* array */
        $this->_valoresFijos = SimpleForm::getParam(T6 . 'txt_value_campo');         /* array */
        $this->_campo = SimpleForm::getParam('_campo');
        $this->_usuario = Session::get('sys_idUsuario');

        $this->_iDisplayStart = SimpleForm::getParam('iDisplayStart');
        $this->_iDisplayLength = SimpleForm::getParam('iDisplayLength');
        $this->_iSortingCols = SimpleForm::getParam('iSortingCols');
        $this->_sSearch = SimpleForm::getParam('sSearch');
    }

    public function getRuta() {
        $query2 = "
        SELECT  
                a.`ruta`,
                m.`modulo`,
                a.base_datos
        FROM `c_modulo` m
        INNER JOIN c_aplicacion a ON a.`id_aplicacion`=m.`id_aplicacion`
        WHERE m.`id_modulo` = :idModulo AND m.`estado` <> :estado ";

        $parms2 = array(
            ':idModulo' => $this->_idModulo,
            ':estado' => '0'
        );
        $data2 = $this->queryOne($query2, $parms2);

        $ruta = $data2['ruta'] . 'modules/' . $data2['modulo'] . '/controllers/';

        return array('ruta' => $ruta, 'modulo' => $data2['modulo'], 'app' => $data2['ruta'], 'db' => $data2['base_datos']);
    }

    public function getUniqueOpcion() {
        $query = "SELECT COUNT(*) AS result FROM `c_opcion` WHERE `opcion`= :opcion AND `id_modulo` = :idModulo AND `estado` <> :estado; ";

        $parms = array(
            ':idModulo' => $this->_idModulo,
            ':opcion' => $this->_opcion,
            ':estado' => '0'
        );
        $data = $this->queryOne($query, $parms);

        return $data;
    }

    public function getUniquePrefijo() {
        $query = "SELECT COUNT(*) AS resultpre FROM `c_opcion` WHERE `prefijo`= :prefijo AND `id_modulo` = :idModulo AND `estado` <> :estado; ";

        $parms = array(
            ':idModulo' => $this->_idModulo,
            ':prefijo' => $this->_prefijo,
            ':estado' => '0'
        );
        $data = $this->queryOne($query, $parms);

        return $data;
    }

    public function getTablesDB() {
        $query = "call sp_confUsuarioConsultas(:flag,:db,:pr);";

        $parms = array(
            ':flag' => 5,
            ':db' => $this->_database,
            ':pr' => ''
        );
        $data = $this->queryAll($query, $parms);
        return $data;
    }

    public function getColumnsDB() {
        $query = "call sp_confUsuarioConsultas(:flag,:db,:tabla);";

        $parms = array(
            ':flag' => 6,
            ':db' => $this->_database,
            ':tabla' => $this->_tabla
        );
        $data = $this->queryAll($query, $parms);
        return $data;
    }

    public function postCrear() {
        $query = "INSERT INTO c_opcion(
                    id_modulo,
                    opcion,
                    tipo_opcion,
                    prefijo,
                    usuario_creacion                    
                )VALUES(
                    :idModulo,
                    :opcion,
                    :tipo,
                    :prefijo,
                    :usuario
                ); ";

        $parms = array(
            ':idModulo' => $this->_idModulo,
            ':opcion' => $this->_opcion,
            ':tipo' => $this->_tipo,
            ':prefijo' => $this->_prefijo,
            ':usuario' => $this->_usuario
        );
        $this->execute($query, $parms);

        return 1;
    }

    public function guardarEtiquetasFijas() {
        /* guardo optios fijod configurados en array session */
        $options = array();
        foreach ($this->_etiquetasFijas as $key => $etiq) {
            $options[] = array(
                'etiqueta' => $etiq,
                'valor' => $this->_valoresFijos[$key]
            );
        }
        
        Session::set($this->_campo, $options);
        
        $data = array('result'=>1);
        return $data;
    }

}
