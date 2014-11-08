<?php
/*
 * --------------------------------------
 * creado por:  RDCC
 * fecha: 03.01.2014
 * Config.php
 * --------------------------------------
 */
define('BASE_URL','http://'.$_SERVER['HTTP_HOST'].'/CREATOR_V2/');#accede a las vistas delusuario
define('DEFAULT_CONTROLLER','index');
define('DEFAULT_METHOD','index');
define('DEFAULT_LAYOUT','smartadmin');

define('APP_NAME','CREATOR V2');
define('APP_SLOGAN','MY CREACION');
define('APP_COMPANY','www.creator.pe');
define('APP_KEY','adABKCDLZEFXGHIJ');               /*llave para AES*/
define('APP_PASS_KEY','99}dF7EZbnbXOkojf&dzvxd5q#guPbPK1spU75Jm|N79Ii7PK');
define('APP_EXPORT_FILES',ROOT . 'public' . DS . 'files' . DS);
define('APP_COD_SADM','0001');
define('APP_COD_ADM','0002');
define('APP_PRE_METHOD','Event');
define('APP_COMPARE_INDEX',-6);

define('DB_ENTORNO','D');  /*D=DESARROLLO, P=PRODUCCION*/
define('DB_MOTOR','mysql');

define('DB_HOST','localhost');
define('DB_USER','root');
define('DB_PASS','');
define('DB_NAME','creator_v2');

define('DB_PORT','3306');
define('DB_CHARSET','utf8');
define('DB_COLLATION','utf8_unicode_ci');

/*__autoload es obsoleta*/
function autoloadCore($class){
    if(file_exists(ROOT . 'bin' . DS . $class.'.php')){
        require_once (ROOT . 'bin' . DS . $class.'.php');
    }
}

function autoloadLibs($class){
    if(file_exists(ROOT . 'libs' . DS . $class . DS . $class.'.php')){
        require_once (ROOT . 'libs' . DS . $class . DS . $class.'.php');
    }
}

/*se registra la funcion autoload*/
spl_autoload_register('autoloadCore'); 
spl_autoload_register('autoloadLibs');


//CONFIGURACION ORM ELOQUENT

//Importamos de nuestro directorio vendor, el archivo autoload.php que
//cargará todas las dependencias en nuestro archivo de configuración
require 'vendor/autoload.php';
 
//Luego importamos y declaramos una nueva Capsule, que nos
//permitirá configurar el uso de la biblioteca por fuera de Laravel
use Illuminate\Database\Capsule\Manager as Capsule;
 
$capsule = new Capsule;
 
//Acá llenamos el array con los datos de configuración
//de nuestra BD
$capsule->addConnection([
 'driver' => DB_MOTOR,
 'host' => DB_HOST,
 'database' => DB_NAME,
 'username' => DB_USER,
 'password' => '',
 'charset' => DB_CHARSET,
 'collation' => DB_COLLATION,
 'prefix' => '',
]);
 
//E iniciamos Eloquent
$capsule->bootEloquent();

require_once (ROOT . 'includes' . DS . 'ConstantesPHP.php');
require_once (ROOT . 'includes' . DS . 'Etiquetas.php');