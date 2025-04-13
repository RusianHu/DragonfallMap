// 缓存名称
const CACHE_NAME = 'dragonfall-map-cache-v1';

// 需要缓存的资源
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animate.css',
  '/js/app.js',
  '/manifest.json',
  '/favicon.ico'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求并从缓存中响应
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果找到缓存的响应，则返回缓存的值
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request).then(
          response => {
            // 检查是否收到有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应
            const responseToCache = response.clone();

            // 检查URL协议，只缓存http和https请求
            const url = event.request.url;
            const isCacheable = url.startsWith('http://') || url.startsWith('https://');

            if (isCacheable) {
              // 将响应添加到缓存
              caches.open(CACHE_NAME)
                .then(cache => {
                  try {
                    cache.put(event.request, responseToCache);
                  } catch (error) {
                    console.error('缓存请求失败:', error);
                  }
                });
            }

            return response;
          }
        );
      })
  );
});
