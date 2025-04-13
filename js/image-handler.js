// 图片处理工具

// 当图片加载失败时，显示占位图片
function handleImageError(img, type = 'event') {
    // 根据类型设置不同的占位图片
    let placeholderSrc = '';

    if (type === 'event') {
        placeholderSrc = 'images/dragon-illustration.jpg';
    } else if (type === 'marker') {
        placeholderSrc = 'images/dragon-marker-default.svg';
    }

    // 如果占位图片也不存在，则使用内联SVG
    img.onerror = function() {
        this.onerror = null; // 防止无限循环
        this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                <rect width="200" height="150" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dominant-baseline="middle">图片未找到</text>
                <path d="M100,30 C120,30 140,40 150,60 C160,80 150,110 130,120 C110,130 80,120 70,100 C60,80 70,50 90,40 C93,38 97,37 100,37" stroke="#ff6b81" stroke-width="2" fill="none"/>
            </svg>
        `);
    };

    // 设置占位图片
    img.src = placeholderSrc;
}

// 初始化页面中所有图片的错误处理
function initImageErrorHandling() {
    // 处理事件卡片中的图片
    document.querySelectorAll('.event-card-image img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'event');
        });
    });

    // 处理事件详情中的图片
    const detailImage = document.getElementById('event-image');
    if (detailImage) {
        detailImage.addEventListener('error', function() {
            handleImageError(this, 'event');
        });
    }

    // 处理地图标记中的图片
    document.querySelectorAll('.dragon-marker img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'marker');
        });
    });
}

// 导出函数
window.handleImageError = handleImageError;
window.initImageErrorHandling = initImageErrorHandling;
