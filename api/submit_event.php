<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'functions.php';

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => '无效的请求方法'
    ]);
    exit;
}

// 收集并验证表单数据
$event = [
    'name' => isset($_POST['event_name']) ? sanitizeInput($_POST['event_name']) : '',
    'description' => isset($_POST['event_desc']) ? sanitizeInput($_POST['event_desc']) : '',
    'year' => isset($_POST['event_date']) ? intval(substr($_POST['event_date'], 0, 4)) : null,
    'dynasty' => isset($_POST['event_dynasty']) ? sanitizeInput($_POST['event_dynasty']) : '',
    'location' => isset($_POST['event_location_name']) ? sanitizeInput($_POST['event_location_name']) : '',
    'latitude' => isset($_POST['event_lat']) ? floatval($_POST['event_lat']) : null,
    'longitude' => isset($_POST['event_lng']) ? floatval($_POST['event_lng']) : null,
    'source' => isset($_POST['event_source']) ? sanitizeInput($_POST['event_source']) : '',
    'submitter_name' => isset($_POST['submitter_name']) ? sanitizeInput($_POST['submitter_name']) : '',
    'submitter_contact' => isset($_POST['submitter_contact']) ? sanitizeInput($_POST['submitter_contact']) : '',
    'type' => ($year && $year >= 1912) ? 'modern' : 'ancient'
];

// 添加事件
$result = addDragonEvent($event);

if ($result === true) {
    echo json_encode([
        'success' => true,
        'message' => '事件提交成功，等待审核'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => $result
    ]);
}
