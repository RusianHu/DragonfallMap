<?php
require_once 'config.php';

/**
 * 获取所有坠龙事件
 * 
 * @return array 坠龙事件数组
 */
function getDragonEvents() {
    if (file_exists(DATA_FILE)) {
        $jsonData = file_get_contents(DATA_FILE);
        return json_decode($jsonData, true) ?: [];
    }
    return [];
}

/**
 * 保存坠龙事件数据
 * 
 * @param array $events 坠龙事件数组
 * @return bool 保存是否成功
 */
function saveDragonEvents($events) {
    // 确保数据目录存在
    $dataDir = dirname(DATA_FILE);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    
    $jsonData = json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(DATA_FILE, $jsonData) !== false;
}

/**
 * 添加新的坠龙事件
 * 
 * @param array $event 新事件数据
 * @return bool|string 成功返回true，失败返回错误信息
 */
function addDragonEvent($event) {
    // 验证必填字段
    if (empty($event['name']) || empty($event['description'])) {
        return '事件名称和描述不能为空';
    }
    
    if (empty($event['latitude']) || empty($event['longitude'])) {
        return '事件位置不能为空';
    }
    
    // 获取现有事件
    $events = getDragonEvents();
    
    // 生成新ID
    $maxId = 0;
    foreach ($events as $existingEvent) {
        if ($existingEvent['id'] > $maxId) {
            $maxId = $existingEvent['id'];
        }
    }
    $event['id'] = $maxId + 1;
    
    // 设置审核状态
    $event['approved'] = false;
    
    // 添加提交时间
    $event['submitted_at'] = date('Y-m-d H:i:s');
    
    // 添加到事件列表
    $events[] = $event;
    
    // 保存更新后的事件列表
    if (saveDragonEvents($events)) {
        return true;
    } else {
        return '保存事件数据失败';
    }
}

/**
 * 获取已审核的坠龙事件
 * 
 * @return array 已审核的坠龙事件数组
 */
function getApprovedDragonEvents() {
    $events = getDragonEvents();
    return array_filter($events, function($event) {
        return isset($event['approved']) && $event['approved'] === true;
    });
}

/**
 * 根据ID获取坠龙事件
 * 
 * @param int $id 事件ID
 * @return array|null 找到返回事件数据，未找到返回null
 */
function getDragonEventById($id) {
    $events = getDragonEvents();
    foreach ($events as $event) {
        if ($event['id'] == $id) {
            return $event;
        }
    }
    return null;
}

/**
 * 更新坠龙事件
 * 
 * @param int $id 事件ID
 * @param array $data 更新的数据
 * @return bool 更新是否成功
 */
function updateDragonEvent($id, $data) {
    $events = getDragonEvents();
    $updated = false;
    
    foreach ($events as &$event) {
        if ($event['id'] == $id) {
            $event = array_merge($event, $data);
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        return saveDragonEvents($events);
    }
    
    return false;
}

/**
 * 删除坠龙事件
 * 
 * @param int $id 事件ID
 * @return bool 删除是否成功
 */
function deleteDragonEvent($id) {
    $events = getDragonEvents();
    $index = -1;
    
    foreach ($events as $i => $event) {
        if ($event['id'] == $id) {
            $index = $i;
            break;
        }
    }
    
    if ($index >= 0) {
        array_splice($events, $index, 1);
        return saveDragonEvents($events);
    }
    
    return false;
}

/**
 * 过滤和验证输入数据
 * 
 * @param string $data 输入数据
 * @return string 过滤后的数据
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * 生成CSRF令牌
 * 
 * @return string CSRF令牌
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * 验证CSRF令牌
 * 
 * @param string $token 提交的令牌
 * @return bool 验证是否通过
 */
function validateCsrfToken($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        return false;
    }
    return true;
}

/**
 * 记录错误日志
 * 
 * @param string $message 错误信息
 * @param string $level 错误级别
 */
function logError($message, $level = 'ERROR') {
    $logFile = __DIR__ . '/../logs/error.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] [$level] $message" . PHP_EOL;
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

/**
 * 初始化示例数据（如果数据文件不存在）
 */
function initSampleData() {
    if (!file_exists(DATA_FILE)) {
        $sampleEvents = [
            [
                'id' => 1,
                'name' => '夏朝孔甲天降二龙',
                'year' => -1900,
                'dynasty' => '夏朝',
                'location' => '河南偃师',
                'latitude' => 34.7172,
                'longitude' => 112.7894,
                'description' => '夏朝第十四任帝王孔甲在位时期，有一雌一雄两条龙从天而降，孔甲不会饲养，找来刘累帮忙饲养。后来雌龙死亡，刘累将雄龙杀死，烹制给孔甲食用。',
                'type' => 'ancient',
                'image' => 'images/events/xia-dynasty-dragon.jpg',
                'approved' => true
            ],
            [
                'id' => 2,
                'name' => '辽太祖射杀水中龙',
                'year' => 920,
                'dynasty' => '辽朝',
                'location' => '内蒙古巴林左旗',
                'latitude' => 43.9712,
                'longitude' => 119.3644,
                'description' => '《辽史》记载：神册五年（920年），一条龙出现在拽刺山阳水之中，有人向皇帝报告。耶律阿保机非常惊喜，率卫队来到现场，一箭射死了那条龙。',
                'type' => 'ancient',
                'image' => 'images/events/liao-dynasty-dragon.jpg',
                'approved' => true
            ],
            [
                'id' => 3,
                'name' => '明成祖时期青州龙马',
                'year' => 1420,
                'dynasty' => '明朝',
                'location' => '山东青州府诸城县',
                'latitude' => 36.0346,
                'longitude' => 119.4097,
                'description' => '《双槐岁钞》记载：永乐十八年（公元1420年）十二月，山东青州府诸城县百姓崔友谅家的一匹母马，产下遍体鳞片的青黑色小马驹，四肢如同麒麟一样，身有龙纹。',
                'type' => 'ancient',
                'image' => 'images/events/ming-dynasty-dragon-horse.jpg',
                'approved' => true
            ],
            [
                'id' => 4,
                'name' => '河南府无头巨龙坠落',
                'year' => 1667,
                'dynasty' => '清朝康熙年间',
                'location' => '河南洛阳',
                'latitude' => 34.6321,
                'longitude' => 112.4470,
                'description' => '1667年7月25日，河南府（今洛阳）发生坠龙事件，一条无头巨龙从天而降，身长约七八十米。此事被比利时传教士鲁日满在《鞑靼中国史》中记录，但清朝官方史书无记载。',
                'type' => 'ancient',
                'image' => 'images/events/qing-dynasty-dragon.jpg',
                'approved' => true
            ],
            [
                'id' => 5,
                'name' => '营口河川坠龙事件',
                'year' => 1934,
                'dynasty' => '民国时期',
                'location' => '辽宁营口',
                'latitude' => 40.6730,
                'longitude' => 122.2351,
                'description' => '1934年，辽宁营口河川及盘锦大洼一带天降"巨龙"尸体，引发无数民众围观，史称"营川河湾坠龙"事件。《盛京时报》对此事进行了详细报道，刊登了骨骸照片。',
                'type' => 'modern',
                'image' => 'images/events/yingkou-dragon.jpg',
                'approved' => true
            ],
            [
                'id' => 6,
                'name' => '松花江黑龙事件',
                'year' => 1944,
                'dynasty' => '民国时期',
                'location' => '黑龙江肇源县陈家围子村',
                'latitude' => 45.5184,
                'longitude' => 125.0781,
                'description' => '1944年8月，黑龙江省肇源县陈家围子村松花江沙滩上出现一条巨大黑色生物。据目击者描述，它全身漆黑，身长十几米，全身长鳞，头大如牛，四只脚，颈略微呈现方形，前额长角，嘴边有胡须。上百名村民目睹了这一事件。',
                'type' => 'modern',
                'image' => 'images/events/songhua-river-dragon.jpg',
                'approved' => true
            ],
            [
                'id' => 7,
                'name' => '贵州安顺"新中国龙"化石',
                'year' => 1996,
                'dynasty' => '现代',
                'location' => '贵州安顺市关岭县',
                'latitude' => 25.9423,
                'longitude' => 105.6421,
                'description' => '公元1996年，考古人员在贵州安顺市关岭县新铺乡，挖出了一块"龙"化石。这条"龙"形状的爬行动物长七点六米，龙身宽六十八厘米，头部最宽处为三十二厘米。化石中的"龙"距今约两亿多年，保存完整，头部最宽的地方生有一对"龙角"。',
                'type' => 'modern',
                'image' => 'images/events/guizhou-dragon-fossil.jpg',
                'approved' => true
            ]
        ];
        
        saveDragonEvents($sampleEvents);
    }
}
