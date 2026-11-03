<?php
define('DB_HOST',    getenv('DB_HOST')    ?: 'localhost');
define('DB_PORT',    getenv('DB_PORT')    ?: '3306');
define('DB_NAME',    getenv('DB_NAME')    ?: 'nexaumkm');
define('DB_USER',    getenv('DB_USER')    ?: 'root');
define('DB_PASS',    getenv('DB_PASS')    ?: '');
define('DB_CHARSET', 'utf8mb4');
define('APP_ENV',    getenv('APP_ENV')    ?: 'development');
define('APP_DEBUG',  APP_ENV === 'development');
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: '*');
$jwtSecret = getenv('JWT_SECRET');
$appEnv = getenv('APP_ENV') ?: 'development';

if (!$jwtSecret && $appEnv === 'production') {
    throw new RuntimeException('JWT_SECRET must be configured in production.');
}

define('JWT_SECRET', $jwtSecret ?: 'local-development-only-change-me');
define('JWT_EXPIRE', 60 * 60 * 8);
define('PAGE_LIMIT_DEFAULT', 15);
define('PAGE_LIMIT_MAX',    100);
