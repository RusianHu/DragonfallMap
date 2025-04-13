// 坠龙地图主应用脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航
    initNavigation();

    // 初始化地图
    initMap();

    // 初始化事件列表
    initEventsList();

    // 初始化提交表单
    initSubmitForm();

    // 初始化事件详情弹窗
    initEventDetail();

    // 初始化图片错误处理
    if (window.initImageErrorHandling) {
        window.initImageErrorHandling();
    }
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const footerLinks = document.querySelectorAll('.footer-links a');
    const allLinks = [...navLinks, ...footerLinks];
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // 初始化汉堡菜单
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 获取目标部分
            const targetSection = this.getAttribute('data-section');

            // 更新导航激活状态
            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-section') === targetSection) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });

            // 处理特殊部分：追龙指南
            if (targetSection === 'guide') {
                // 显示主导航区域中的追龙指南部分
                const sections = document.querySelectorAll('main section');
                sections.forEach(section => {
                    if (section.id === 'guide-section') {
                        section.classList.add('active-section');
                        // 添加动画效果
                        section.classList.add('animate__fadeInUp');
                        setTimeout(() => {
                            section.classList.remove('animate__fadeInUp');
                        }, 1000);
                    } else {
                        section.classList.remove('active-section');
                    }
                });

                // 滚动到顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // 显示目标部分，隐藏其他部分
                const sections = document.querySelectorAll('main section');
                sections.forEach(section => {
                    if (section.id === targetSection + '-section') {
                        section.classList.add('active-section');
                        // 添加动画效果
                        section.classList.add('animate__fadeInUp');
                        setTimeout(() => {
                            section.classList.remove('animate__fadeInUp');
                        }, 1000);
                    } else {
                        section.classList.remove('active-section');
                    }
                });

                // 如果是地图部分，重新调整地图大小
                if (targetSection === 'map' && map) {
                    map.resize();
                }

                // 滚动到顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            // 关闭移动端菜单
            if (menuToggle && mainNav) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });

    // 初始化鼠标跟随效果
    initCursorEffect();
}

// 高德地图相关功能
let map = null;
let markers = [];
let dragonEvents = [];

function initMap() {
    try {
        // 检查地图API是否加载
        if (typeof AMap === 'undefined') {
            console.error('高德地图API未加载，请检查网络连接和API密钥');
            showMapError();
            return;
        }

        // 创建地图实例
        map = new AMap.Map('map', {
            zoom: 5,
            center: [104.195397, 35.86166], // 中国中心点
            mapStyle: 'amap://styles/whitesmoke'
        });

    // 添加控件
    map.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.HawkEye',
        'AMap.MapType',
        'AMap.Geolocation'
    ], function() {
        // 添加工具条
        map.addControl(new AMap.ToolBar({
            position: 'RB'
        }));

        // 添加比例尺
        map.addControl(new AMap.Scale());

        // 添加鹰眼
        map.addControl(new AMap.HawkEye({
            opened: false
        }));

        // 添加地图类型切换
        map.addControl(new AMap.MapType());

        // 添加定位
        map.addControl(new AMap.Geolocation({
            position: 'RB',
            offset: [10, 90]
        }));
    });

    // 加载坠龙事件数据
    loadDragonEvents();

    // 初始化时间滑块
    initTimeSlider();

    // 初始化筛选按钮
    initFilterButtons();
    } catch (error) {
        console.error('初始化地图时出错:', error);
        showMapError();
    }
}

// 显示地图错误提示
function showMapError() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f8f9fa; padding: 20px; text-align: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff6b81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="margin-top: 20px; color: #333;">地图加载失败</h3>
                <p style="margin-top: 10px; color: #666;">无法加载高德地图API，请检查网络连接或刷新页面重试。</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 8px 16px; background-color: #5352ed; color: white; border: none; border-radius: 4px; cursor: pointer;">刷新页面</button>
            </div>
        `;
    }

    // 禁用地图相关功能
    const mapControls = document.querySelector('.map-controls');
    if (mapControls) {
        mapControls.style.display = 'none';
    }
}

// 加载坠龙事件数据
function loadDragonEvents() {
    // 显示加载中状态
    const eventsListContainer = document.getElementById('events-list');
    if (eventsListContainer) {
        eventsListContainer.innerHTML = '<div class="loading-events"><div class="spinner"></div><p>正在加载坠龙事件数据...</p></div>';
    }

    // 直接使用静态JSON文件
    fetch('data/dragon_events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error('数据格式错误');
            }

            dragonEvents = data;
            renderMarkers(dragonEvents);
            renderEventsList(dragonEvents);
        })
        .catch(error => {
            console.error('获取事件数据失败:', error);

            // 显示错误提示
            if (eventsListContainer) {
                eventsListContainer.innerHTML = `
                    <div class="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h3>加载数据失败</h3>
                        <p>无法加载坠龙事件数据，正在使用模拟数据。</p>
                    </div>
                `;
            }

            // 使用模拟数据
            dragonEvents = getMockDragonEvents();
            renderMarkers(dragonEvents);
            renderEventsList(dragonEvents);
        });
}

// 渲染地图标记
function renderMarkers(events) {
    // 清除现有标记
    markers.forEach(marker => {
        map.remove(marker);
    });
    markers = [];

    // 添加新标记
    events.forEach(event => {
        // 创建自定义标记内容
        const markerContent = document.createElement('div');
        markerContent.className = 'dragon-marker';
        markerContent.innerHTML = `
            <img src="images/dragon-marker-${event.type || 'default'}.svg"
                 alt="${event.name}"
                 style="width: 32px; height: 32px;"
                 onerror="handleImageError(this, 'marker')">
        `;

        // 创建标记
        const marker = new AMap.Marker({
            position: [event.longitude, event.latitude],
            content: markerContent,
            title: event.name,
            offset: new AMap.Pixel(-16, -16),
            zIndex: event.year ? 2000 - event.year : 100, // 较早的事件显示在上层
            extData: event
        });

        // 添加点击事件
        marker.on('click', function() {
            showEventDetail(event);
        });

        // 添加到地图
        marker.setMap(map);
        markers.push(marker);
    });

    // 调整地图视野以包含所有标记
    if (markers.length > 0) {
        map.setFitView(markers);
    }
}

// 初始化时间滑块
function initTimeSlider() {
    const slider = document.getElementById('time-slider');
    const display = document.getElementById('time-display');

    slider.addEventListener('input', function() {
        const value = parseInt(this.value);
        let timeText = '';
        let filteredEvents = [];

        if (value === 0) {
            timeText = '远古时期';
            filteredEvents = dragonEvents.filter(event => event.year < 0 || !event.year);
        } else if (value <= 20) {
            timeText = '夏商周时期';
            filteredEvents = dragonEvents.filter(event => event.year < 220 || !event.year);
        } else if (value <= 40) {
            timeText = '秦汉至隋唐';
            filteredEvents = dragonEvents.filter(event => event.year < 960 || !event.year);
        } else if (value <= 60) {
            timeText = '宋元明清';
            filteredEvents = dragonEvents.filter(event => event.year < 1912 || !event.year);
        } else if (value <= 80) {
            timeText = '民国时期';
            filteredEvents = dragonEvents.filter(event => event.year < 1949 || !event.year);
        } else if (value <= 99) {
            timeText = '现代';
            filteredEvents = dragonEvents.filter(event => event.year >= 1949 || !event.year);
        } else {
            timeText = '全部时期';
            filteredEvents = dragonEvents;
        }

        display.textContent = timeText;
        renderMarkers(filteredEvents);
    });
}

// 初始化筛选按钮
function initFilterButtons() {
    const allBtn = document.getElementById('filter-all');
    const ancientBtn = document.getElementById('filter-ancient');
    const modernBtn = document.getElementById('filter-modern');

    allBtn.addEventListener('click', function() {
        setActiveFilter(this);
        renderMarkers(dragonEvents);
    });

    ancientBtn.addEventListener('click', function() {
        setActiveFilter(this);
        const ancientEvents = dragonEvents.filter(event => event.year < 1912 || !event.year);
        renderMarkers(ancientEvents);
    });

    modernBtn.addEventListener('click', function() {
        setActiveFilter(this);
        const modernEvents = dragonEvents.filter(event => event.year >= 1912);
        renderMarkers(modernEvents);
    });
}

// 设置激活的筛选按钮
function setActiveFilter(button) {
    const buttons = document.querySelectorAll('.map-filter button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

// 初始化事件列表
function initEventsList() {
    const searchInput = document.getElementById('search-events');
    const sortSelect = document.getElementById('sort-events');

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredEvents = dragonEvents.filter(event =>
            event.name.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            (event.location && event.location.toLowerCase().includes(searchTerm))
        );
        renderEventsList(filteredEvents);
    });

    // 排序功能
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedEvents = [...dragonEvents];

        if (sortValue === 'time-asc') {
            sortedEvents.sort((a, b) => (a.year || 0) - (b.year || 0));
        } else if (sortValue === 'time-desc') {
            sortedEvents.sort((a, b) => (b.year || 0) - (a.year || 0));
        } else if (sortValue === 'location') {
            sortedEvents.sort((a, b) => {
                const locA = a.location || '';
                const locB = b.location || '';
                return locA.localeCompare(locB, 'zh-CN');
            });
        }

        renderEventsList(sortedEvents);
    });
}

// 渲染事件列表
function renderEventsList(events) {
    const container = document.getElementById('events-list');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = '<p class="no-events">没有找到符合条件的坠龙事件</p>';
        return;
    }

    events.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'event-card animate-fadeInUp';
        card.style.animationDelay = `${index * 0.05}s`;

        const yearText = event.year ? `${event.year}年` : (event.dynasty || '未知年代');
        const locationText = event.location || '未知地点';

        card.innerHTML = `
            <div class="event-card-image">
                <img src="${event.image || 'images/event-placeholder.jpg'}" alt="${event.name}" onerror="handleImageError(this, 'event')">
            </div>
            <div class="event-card-content">
                <div class="event-card-title">${event.name}</div>
                <div class="event-card-info">${yearText} | ${locationText}</div>
                <div class="event-card-desc">${event.description}</div>
                <a href="#" class="event-card-link" data-event-id="${event.id}">查看详情</a>
            </div>
        `;

        // 添加点击事件
        const link = card.querySelector('.event-card-link');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showEventDetail(event);
        });

        container.appendChild(card);
    });
}

// 初始化事件详情弹窗
function initEventDetail() {
    const closeBtn = document.querySelector('.event-detail .close-btn');
    closeBtn.addEventListener('click', function() {
        hideEventDetail();
    });

    // 点击弹窗外部关闭
    document.addEventListener('click', function(e) {
        const detail = document.querySelector('.event-detail');
        if (detail.classList.contains('active') && !detail.contains(e.target) && !e.target.closest('.dragon-marker')) {
            hideEventDetail();
        }
    });
}

// 显示事件详情
function showEventDetail(event) {
    const detail = document.querySelector('.event-detail');
    const title = document.getElementById('event-title');
    const time = document.getElementById('event-time');
    const location = document.getElementById('event-location');
    const description = document.getElementById('event-description');
    const image = document.getElementById('event-image');

    title.textContent = event.name;

    const yearText = event.year ? `${event.year}年` : (event.dynasty || '未知年代');
    time.textContent = `时间：${yearText}`;

    location.textContent = `地点：${event.location || '未知地点'}`;
    description.textContent = event.description;

    if (event.image) {
        image.src = event.image;
        image.onerror = function() {
            handleImageError(this, 'event');
        };
        image.style.display = 'block';
    } else {
        image.style.display = 'none';
    }

    detail.classList.add('active');
}

// 隐藏事件详情
function hideEventDetail() {
    const detail = document.querySelector('.event-detail');
    detail.classList.remove('active');
}

// 滚动到追龙指南部分
function scrollToGuide() {
    // 显示主导航区域中的追龙指南部分
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        if (section.id === 'guide-section') {
            section.classList.add('active-section');
            // 添加动画效果
            section.classList.add('animate__fadeInUp');
            setTimeout(() => {
                section.classList.remove('animate__fadeInUp');
            }, 1000);
        } else {
            section.classList.remove('active-section');
        }
    });

    // 滚动到顶部
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // 更新导航激活状态
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(navLink => {
        if (navLink.getAttribute('data-section') === 'guide') {
            navLink.classList.add('active');
        } else {
            navLink.classList.remove('active');
        }
    });
}

// 初始化鼠标跟随效果
function initCursorEffect() {
    const cursorEffect = document.getElementById('cursor-effect');
    if (!cursorEffect) return;

    // 只在非触摸设备上显示
    if (!window.matchMedia("(pointer: fine)").matches) {
        cursorEffect.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', function(e) {
        cursorEffect.style.display = 'block';
        cursorEffect.style.left = e.clientX + 'px';
        cursorEffect.style.top = e.clientY + 'px';
    });

    // 鼠标悬停在可点击元素上时的效果
    const clickableElements = document.querySelectorAll('a, button, .event-card, .logo, .dragon-marker');
    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorEffect.classList.add('cursor-hover');
            cursorEffect.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorEffect.style.backgroundColor = 'rgba(251, 114, 153, 0.4)';
        });

        el.addEventListener('mouseleave', function() {
            cursorEffect.classList.remove('cursor-hover');
            cursorEffect.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorEffect.style.backgroundColor = 'rgba(251, 114, 153, 0.3)';
        });
    });
}

// 初始化提交表单
function initSubmitForm() {
    const form = document.getElementById('submit-form');
    let submitMap = null;
    let submitMarker = null;

    // 初始化提交表单中的地图
    if (document.getElementById('submit-map')) {
        try {
            // 检查地图API是否加载
            if (typeof AMap === 'undefined') {
                console.error('高德地图API未加载，无法初始化提交表单地图');
                showSubmitMapError();
                return;
            }

            submitMap = new AMap.Map('submit-map', {
                zoom: 4,
                center: [104.195397, 35.86166] // 中国中心点
            });

        // 点击地图添加标记
        submitMap.on('click', function(e) {
            const lnglat = e.lnglat;

            // 更新隐藏字段
            document.getElementById('event-lat').value = lnglat.getLat();
            document.getElementById('event-lng').value = lnglat.getLng();

            // 添加或移动标记
            if (!submitMarker) {
                submitMarker = new AMap.Marker({
                    position: lnglat,
                    map: submitMap,
                    draggable: true
                });

                // 拖动标记更新坐标
                submitMarker.on('dragend', function(e) {
                    const newPos = e.target.getPosition();
                    document.getElementById('event-lat').value = newPos.getLat();
                    document.getElementById('event-lng').value = newPos.getLng();
                });
            } else {
                submitMarker.setPosition(lnglat);
            }
        });
        } catch (error) {
            console.error('初始化提交表单地图时出错:', error);
            showSubmitMapError();
        }
    }

    // 显示提交表单地图错误
    function showSubmitMapError() {
        const mapContainer = document.getElementById('submit-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="margin-top: 15px; color: #333;">地图加载失败</h3>
                    <p style="margin-top: 10px; color: #666;">无法加载地图，请检查网络连接或刷新页面重试。</p>
                </div>
            `;

            // 禁用地图相关字段
            document.getElementById('event-lat').value = '';
            document.getElementById('event-lng').value = '';
        }
    }

    // 表单提交
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 验证表单
            if (!validateForm()) {
                return;
            }

            // 收集表单数据
            const formData = new FormData(form);

            // 发送到服务器
            fetch('api/submit_event.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('坠龙事件提交成功！我们会尽快审核。');
                    form.reset();
                    if (submitMarker) {
                        submitMap.remove(submitMarker);
                        submitMarker = null;
                    }
                } else {
                    alert('提交失败：' + data.message);
                }
            })
            .catch(error => {
                console.error('提交错误:', error);
                alert('提交时发生错误，请稍后再试。');
            });
        });
    }

    // 表单验证
    function validateForm() {
        const eventName = document.getElementById('event-name').value;
        const eventDesc = document.getElementById('event-desc').value;
        const eventLat = document.getElementById('event-lat').value;
        const eventLng = document.getElementById('event-lng').value;

        if (!eventName) {
            alert('请输入事件名称');
            return false;
        }

        if (!eventDesc) {
            alert('请输入事件描述');
            return false;
        }

        if (!eventLat || !eventLng) {
            alert('请在地图上选择事件发生的位置');
            return false;
        }

        return true;
    }
}

// 模拟数据
function getMockDragonEvents() {
    return [
        {
            id: 1,
            name: '夏朝孔甲天降二龙',
            year: -1900,
            dynasty: '夏朝',
            location: '河南偃师',
            latitude: 34.7172,
            longitude: 112.7894,
            description: '夏朝第十四任帝王孔甲在位时期，有一雌一雄两条龙从天而降，孔甲不会饲养，找来刘累帮忙饲养。后来雌龙死亡，刘累将雄龙杀死，烹制给孔甲食用。',
            type: 'ancient',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 2,
            name: '辽太祖射杀水中龙',
            year: 920,
            dynasty: '辽朝',
            location: '内蒙古巴林左旗',
            latitude: 43.9712,
            longitude: 119.3644,
            description: '《辽史》记载：神册五年（920年），一条龙出现在拽刺山阳水之中，有人向皇帝报告。耶律阿保机非常惊喜，率卫队来到现场，一箭射死了那条龙。',
            type: 'ancient',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 3,
            name: '明成祖时期青州龙马',
            year: 1420,
            dynasty: '明朝',
            location: '山东青州府诸城县',
            latitude: 36.0346,
            longitude: 119.4097,
            description: '《双槐岁钞》记载：永乐十八年（公元1420年）十二月，山东青州府诸城县百姓崔友谅家的一匹母马，产下遍体鳞片的青黑色小马驹，四肢如同麒麟一样，身有龙纹。',
            type: 'ancient',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 4,
            name: '河南府无头巨龙坠落',
            year: 1667,
            dynasty: '清朝康熙年间',
            location: '河南洛阳',
            latitude: 34.6321,
            longitude: 112.4470,
            description: '1667年7月25日，河南府（今洛阳）发生坠龙事件，一条无头巨龙从天而降，身长约七八十米。此事被比利时传教士鲁日满在《鞑靼中国史》中记录，但清朝官方史书无记载。',
            type: 'ancient',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 5,
            name: '营口河川坠龙事件',
            year: 1934,
            dynasty: '民国时期',
            location: '辽宁营口',
            latitude: 40.6730,
            longitude: 122.2351,
            description: '1934年，辽宁营口河川及盘锦大洼一带天降"巨龙"尸体，引发无数民众围观，史称"营川河湾坠龙"事件。《盛京时报》对此事进行了详细报道，刊登了骨骸照片。',
            type: 'modern',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 6,
            name: '松花江黑龙事件',
            year: 1944,
            dynasty: '民国时期',
            location: '黑龙江肇源县陈家围子村',
            latitude: 45.5184,
            longitude: 125.0781,
            description: '1944年8月，黑龙江省肇源县陈家围子村松花江沙滩上出现一条巨大黑色生物。据目击者描述，它全身漆黑，身长十几米，全身长鳞，头大如牛，四只脚，颈略微呈现方形，前额长角，嘴边有胡须。上百名村民目睹了这一事件。',
            type: 'modern',
            image: 'images/dragon-illustration.jpg'
        },
        {
            id: 7,
            name: '贵州安顺"新中国龙"化石',
            year: 1996,
            dynasty: '现代',
            location: '贵州安顺市关岭县',
            latitude: 25.9423,
            longitude: 105.6421,
            description: '公元1996年，考古人员在贵州安顺市关岭县新铺乡，挖出了一块"龙"化石。这条"龙"形状的爬行动物长七点六米，龙身宽六十八厘米，头部最宽处为三十二厘米。化石中的"龙"距今约两亿多年，保存完整，头部最宽的地方生有一对"龙角"。',
            type: 'modern',
            image: 'images/dragon-illustration.jpg'
        }
    ];
}
