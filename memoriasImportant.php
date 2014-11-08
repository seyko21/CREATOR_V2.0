<script src="theme/smartadmin/js/libs/jquery-2.0.2.min.js"></script>

<button type="button" id="btn">xxxx</button>

<button type="button" onclick="r.nn(this)">vvvvv</button>

<button type="button" onclick="r.mm(this)">bbb</button>

<script>
    (function($) {
        $.fn.extend({
            hola: function(msn) {
                this.each(function() {

                    $(this).click(function() {
                        alert(arguments.callee)
                    });
                });
            }
        });

        $.fn.holas = function(msn) {
            for (var i in this) {
                alert(i + '---' + this[i])
            }
        };
    })(jQuery);

    $('#btn').hola('loooo');


    var ajaxxx = function(vv,el) {
        
        if($)
        for (var attr in vv) {
            alert(attr)

        }
    };



    var r_ = function r_() {
        return {
            nn: function(el) {
                
                ajaxxx(this,el);
            },
            mm: function(el) {
                ajaxxx(this,el);
            }
        }
    };
    var r = new r_();





var x = new XMLHttpRequest();

x.open("GET","index.php",false);
x.send();

 if(x.responseText.indexOf('encontrado') == -1){
     alert('ok')
 }else{
     alert('error')
 }
        


// the string variable "myTextFile" now has the contents of login.txt, parse it and perform your logic



</script>
<?php
//$files = glob('bin/*.php'); busca todos los .php
//$files = glob('*.{php,txt}', GLOB_BRACE);
//$files = glob('../images/a*.jpg'); busca todas las imagenes q empiesan con:: a
//echo "Bytes iniciales: ".memory_get_usage()."n";
///* mostrará por ejemploo
//Bytes iniciales: 361400
//*/
// 
//// vamos a forzar el uso de memoria
//for ($i = 0; $i < 100000; $i++) {
//    $array []= md5($i);
//}
//	 
//// vamos a eliminar la mitad del array
//for ($i = 0; $i < 100000; $i++) {
//    unset($array[$i]);
//}
//
//echo "Final: ".memory_get_usage()." bytes n";
///* imprime
//Final: 885912 bytes
//*/
//
//echo "Peak: ".memory_get_peak_usage()." bytes n";
//OBTIENE RECURSOS DE CPU
//	sleep(3);
//	 
//	$data = getrusage();
//	echo "User time: ".
//	    ($data['ru_utime.tv_sec'] +
//	    $data['ru_utime.tv_usec'] / 1000000);
//	echo "System time: ".
//	    ($data['ru_stime.tv_sec'] +
//	    $data['ru_stime.tv_usec'] / 1000000);
//crea is unico
//echo uniqid('foo_');
//echo strlen(gzcompress('gggggggggg gggggggggg gggggggggg'));
//detecta click en document.body
//    $(document.body).click(function(e){
//     var id = e.target.id;
//     var idc = e.target.click;
//     var idx = e.target.submit;
//     //alert(id+'---'+idc+'---'+idx)
//     
//     alert($('#'+id).attr('click')+'--'+id+'--'+$('#'+id).attr('onclick'))
//      
//    });
?>


