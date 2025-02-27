<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Hoặc chỉ rõ ['GET', 'POST', 'PUT', 'DELETE']

    'allowed_origins' => ['http://localhost:5173'], // Chỉ định domain cụ thể

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Hoặc chỉ rõ ['Content-Type', 'Authorization']

    'exposed_headers' => ['Authorization'], // Nếu cần expose Authorization header

    'max_age' => 3600, // Cache preflight trong 1 giờ

    'supports_credentials' => true, // Cho phép cookie và thông tin xác thực

];
