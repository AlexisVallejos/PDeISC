<?php
declare(strict_types=1);

$html = file_get_contents(__DIR__ . '/pages/index.html');

$html = str_replace(
    [
        'href="/styles/main.css"',
        'src="/scripts/main.js"',
    ],
    [
        'href="styles/main.css"',
        'src="scripts/main.js"',
    ],
    $html
);

echo $html;
