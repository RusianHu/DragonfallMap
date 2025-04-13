<?php
// 数据库配置
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'dragonfall_map');

// 高德地图API配置
define('AMAP_KEY', '144484508aa31f6a020e34cdb5b60835');
define('AMAP_SECRET', 'e45529d33d9356e6e7acef5504ec90f5');

// 文件路径配置
define('DATA_FILE', __DIR__ . '/../data/dragon_events.json');
define('IMAGES_DIR', __DIR__ . '/../images/events/');

// 安全配置
define('ENABLE_CSRF_PROTECTION', true);
define('SESSION_TIMEOUT', 1800); // 30分钟

// 错误报告配置
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// 时区设置
date_default_timezone_set('Asia/Shanghai');

// 字符编码
header('Content-Type: text/html; charset=utf-8');
