<?php // compress JS

    $etag = '"'.md5($data).'"'; // generate a file Etag
    header('Etag: '.$etag); // output the Etag in the header
    header ("content-type: text/javascript; charset: UTF-8");
    header('Cache-Control: max-age=300, must-revalidate'); //output the cache-control header
    $offset = 365 * 24 * 60 * 60;
    $expires = "Expires: ".gmdate("D, d M Y H:i:s", time() + $offset)." GMT"; // set the expires header to be 1 year in the future
    header($expires); // output the expires header

    ob_start("compress");
    function compress($buffer) {
    /* remove comments */
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    /* remove tabs, spaces, newlines, etc. */
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
    return $buffer;
    }

    include("homepage/homepage.js");

    ob_end_flush();
?>
