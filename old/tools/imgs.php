<?php
/**
 * 照片略缩处理程序
 */

$sizes = array(
	'201_134',
	'900_600'
);


function readArgv($sign, $argv, $argc) {
	$i = 0; $k = -1;
	foreach ($argv as $s) {
		if ($sign === $s) {
			$k = $i;
		}
		$i++;
	}
	return $k;
}

function readPath($argv, $argc) {
	$k = readArgv('-f', $argv, $argc);
	if ($k > 0 && $k + 1 < $argc) {
		return $argv[$k + 1];
	}
	else {
		return getcwd();
	}
}

function createImg($src, $dist, $s1, $s2) {
	list($src_w, $src_h) = getimagesize($src);
	$k = $src_w > $src_h;
	$w = $k ? max($s1, $s2) : min($s1, $s2);
	$h = $k ? min($s1, $s2) : max($s1, $s2);
	$source=imagecreatefromjpeg($src);
	$target = imagecreatetruecolor($w, $h);
	imagecopyresampled($target,$source,0,0,0,0,$w,$h,$src_w,$src_h);
	imagejpeg($target, $dist);
	imagedestroy($target);
	imagedestroy($source);
}


function run($argv, $argc) {
	global $sizes;
	$fs = DIRECTORY_SEPARATOR;
	$base = readPath($argv, $argc);
	$src = $base . DIRECTORY_SEPARATOR . "src";
	if (!is_dir($src)) {
		die("not find dir: $src");
	}
	
	$d = dir($src);
	while (($file = $d->read()) !== false) {
		$fpath = $src . DIRECTORY_SEPARATOR . $file;
		if (is_file($fpath)) {
			foreach ($sizes as $s) {
				list($s1, $s2) = preg_split('/_/', $s);
				$s1 = intval($s1);
				$s2 = intval($s2);
				$ndir = $base . DIRECTORY_SEPARATOR . $s;
				if (!file_exists($ndir)) {
					mkdir($ndir);
				}
				createImg($fpath, $ndir . DIRECTORY_SEPARATOR . $file, $s1, $s2);
			}
		}
	}
	
}

run($argv, $argc);