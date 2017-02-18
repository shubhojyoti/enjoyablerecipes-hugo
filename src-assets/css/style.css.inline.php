<?php
    //http://www.catswhocode.com/blog/3-ways-to-compress-css-files-using-php
    // $etag = '"'.md5($data).'"'; // generate a file Etag
    // header('Etag: '.$etag); // output the Etag in the header
    // header ("content-type: text/css; charset: UTF-8");
    // header('Cache-Control: max-age=300, must-revalidate'); //output the cache-control header
    // $offset = 60 * 60;
    // $expires = 'Expires: ' . gmdate('D, d M Y H:i:s',time() + $offset) . ' GMT'; // set the expires header to be 1 hour in the future
    // header($expires); // output the expires header

    // ob_start("compress");
    function dominify($buffer) {
    /* remove comments */
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    /* remove tabs, spaces, newlines, etc. */
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
    return $buffer;
    }

    /* css files to minify */
    // include('foundation.css');
    // include('font-awesome.min.css');
    // include('style.css');

    function showminify() {
        $out = '';
        $csspath = PERCH_SITEPATH . '/assets/css/';
        $files = array('foundation.css', 'font-awesome.min.css', 'style.css');
        foreach ($files as &$cssfile) {
            $css = fopen($csspath . $cssfile, 'r');
            $out .= dominify(fread($css, filesize($csspath . $cssfile)));
            fclose($css);
        }

        echo '<style>'.$out.'</style>';
    }

    // ob_end_flush();
?>
