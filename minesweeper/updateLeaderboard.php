<?php
//$data = isset($_POST['data']) ? json_decode($_POST['data']): new \stdClass();
$strRequest = file_get_contents('php://input');

$jsonFile = fopen("assets/leaderboard.json", "w") or die("Unable to open file!");
fwrite($jsonFile, $strRequest);
fclose($jsonFile);
?>