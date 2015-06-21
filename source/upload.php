<?php
if(session_status() == PHP_SESSION_ACTIVE) session_destroy(); //to clear any data left from previous file 
session_start();

/* Zhanelya Subebayeva */

if($_FILES['csv']['tmp_name']){
    $fileName = explode(".",$_FILES['csv']['name']);
    if($fileName[1]=='csv'){ //check extension
        $tmpName = $_FILES['csv']['tmp_name'];
        $_SESSION["csvArr"] = array();

        $rows = file($tmpName, FILE_SKIP_EMPTY_LINES | FILE_IGNORE_NEW_LINES);
        
        $i = 0; 
        foreach ($rows as $row) {
            $csvrow = str_getcsv($row);
            $i++;
            array_push ($_SESSION["csvArr"], $csvrow);
        }
        
        $_SESSION["csvRowsCnt"] = count($rows);
        $_SESSION["csvColsCnt"] = count($_SESSION["csvArr"][0]);
        
        header( 'Location: sonification.php') ; 
    }else {
        header( 'Location: sonification.php?err=2');
        $_SESSION["csvArr"] = array();
    }
}else{
    header( 'Location: sonification.php?err=1'); 
    $_SESSION["csvArr"] = array();
}
?>
