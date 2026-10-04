<?php
declare(strict_types=1);

$html = file_get_contents(__DIR__ . '/pages/json.html');

$html = str_replace(
    [
        'href="/styles/main.css"',
        'src="/scripts/json.js"',
    ],
    [
        'href="styles/main.css"',
        'src="scripts/json.js"',
    ],
    $html
);

echo $html;
