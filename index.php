<?php
define('DS',DIRECTORY_SEPARATOR);
define('ROOT',  realpath(dirname(__FILE__)) . DS);

require_once (ROOT . 'bin' . DS . 'Config.php');


Session::init();

try{
    /*registro de clases*/
    Registry::anonimous('Creator');
    Registry::anonimous('Request');
    Registry::anonimous('Database');
    Registry::anonimous('View');
    Registry::anonimous('Autoload');

    Bootstrap::run(Obj::run()->Request);    
}  
catch (Exception $e){
    echo $e->getMessage();
}

