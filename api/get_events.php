<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'functions.php';

// 初始化示例数据（如果数据文件不存在）
initSampleData();

// 获取已审核的事件
$events = getApprovedDragonEvents();

// 返回JSON格式的事件数据
echo json_encode($events, JSON_UNESCAPED_UNICODE);
