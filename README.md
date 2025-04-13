# 坠龙地图 (DragonFall Map)

一个记录从古代到近现代坠龙事件的交互式地图网站。

![坠龙地图预览图](images/preview.jpg)

## 项目简介

坠龙地图是一个使用现代Web技术开发的交互式地图应用，收集并展示了中国历史上记载的坠龙事件。用户可以在地图上查看各个时期的坠龙事件，了解详细信息，并且可以提交新的坠龙事件记录。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **后端**：PHP
- **地图API**：高德地图 API
- **Web服务器**：Nginx
- **数据存储**：JSON文件

## 功能特点

- 交互式地图展示坠龙事件
- 按时间段筛选事件
- 事件详情查看
- 事件列表浏览和搜索
- 用户提交新事件
- 响应式布局，支持移动端访问
- 图片错误处理和占位图显示
- 平滑的动画和过渡效果

## 项目演示

访问 [坠龙地图演示网站](https://yanshanlaosiji.top/DragonfallMap) 查看在线演示。

## 安装部署

### Windows环境

1. 克隆或下载仓库到本地

2. 安装PHP环境（推荐使用XAMPP或WampServer）
   - 下载并安装 [XAMPP](https://www.apachefriends.org/index.html) 或 [WampServer](https://www.wampserver.com/en/)
   - 确保PHP版本 >= 7.4

3. 使用内置PHP服务器运行（开发环境）
   - 双击运行 `start_php_server.bat` 文件
   - 在浏览器中访问：http://localhost:8080

4. 或配置Apache/Nginx（生产环境）
   - 将项目文件复制到Web服务器根目录
   - 配置虚拟主机指向项目目录
   - 确保data、logs和images/events目录有写入权限

### Linux环境

1. 克隆仓库到本地
```
git clone https://github.com/yourusername/dragonfallmap.git
```

2. 配置Nginx
```
cp nginx.conf /etc/nginx/sites-available/dragonfallmap
ln -s /etc/nginx/sites-available/dragonfallmap /etc/nginx/sites-enabled/
```
注意修改nginx.conf中的路径为你的实际路径。

3. 确保PHP已安装并启用
```
apt-get install php-fpm php-json
```

4. 重启Nginx
```
service nginx restart
```

5. 设置文件权限
```
chmod -R 755 .
chmod -R 777 data logs images/events
```

## 高德地图API配置

1. 访问[高德开放平台](https://lbs.amap.com/)注册账号
2. 创建应用并获取API Key
3. 在`api/config.php`文件中更新您的API Key和安全密钥：
```php
define('AMAP_KEY', '您的API Key');
define('AMAP_SECRET', '您的安全密钥');
```

## 数据格式

坠龙事件数据存储在`data/dragon_events.json`文件中，格式如下：

```json
[
  {
    "id": 1,
    "name": "事件名称",
    "year": 1900,
    "dynasty": "朝代",
    "location": "地点",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "description": "事件描述",
    "type": "ancient",
    "image": "images/events/event1.jpg",
    "approved": true
  }
]
```

## 目录结构

- `index.html` - 主页面
- `css/` - 样式文件
  - `style.css` - 主样式表
  - `animate.css` - 动画效果
  - `bilibili-icons.css` - 图标样式
- `js/` - JavaScript文件
  - `app.js` - 主应用脚本
  - `image-handler.js` - 图片处理工具
- `api/` - PHP后端API
  - `config.php` - 配置文件
  - `functions.php` - 通用函数
  - `get_events.php` - 获取事件API
  - `submit_event.php` - 提交事件API
- `images/` - 图片资源
  - `events/` - 事件图片
- `data/` - 数据存储
  - `dragon_events.json` - 事件数据
- `logs/` - 日志文件

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Edge 79+
- Safari 12+
- iOS Safari 12+
- Android Chrome 60+

## 常见问题 (FAQ)

### 地图无法显示
- 检查网络连接
- 确认高德地图API密钥是否有效
- 查看浏览器控制台是否有错误信息

### 无法提交新事件
- 确保data目录有写入权限
- 检查表单是否填写完整
- 查看logs目录下的错误日志

### 图片无法显示
- 确认images/events目录存在并有正确权限
- 检查图片路径是否正确

## 更新日志

### v1.0.0 (2024-04-13)
- 初始版本发布
- 基本地图功能实现
- 事件列表和详情查看

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request


## 许可证

本项目采用MIT许可证。详见 [LICENSE](LICENSE) 文件。
