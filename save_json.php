<?php
  $myFile = "js/imgMargins.json";
  $fh = fopen($myFile, 'w') or die("can't open file");
  $stringData = $_GET["data"];
  fwrite($fh, $stringData);
  fclose($fh)
?>