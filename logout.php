<?php
if(array_key_exists('logout',$_GET))
{
    session_start();
    unset($_SESSION['userdata']);
    setcookie('cReaded', "", time()-3600);
    setcookie('cNotReaded', "", time()-3600);
    setcookie('cFavorite', "", time()-3600);
    session_destroy();


    header("Location:index.php");
}
?>