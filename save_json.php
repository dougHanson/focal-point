<?php
  $filename = "js/imgMargins.json";
  $content = $_GET["data"];
  file_put_contents($filename, $content);
?>