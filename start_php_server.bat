@echo off
echo 启动坠龙地图网站本地服务器...
echo 请确保已安装PHP 7.4或更高版本

REM 设置编码为UTF-8
chcp 65001

REM 创建必要的目录
if not exist data mkdir data
if not exist images\events mkdir images\events
if not exist logs mkdir logs

REM 启动PHP内置服务器
php -S localhost:8080

echo 服务器已停止运行
pause
