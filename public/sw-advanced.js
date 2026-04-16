// 📱 SERVICE WORKER AVANZADO PARA PWA COMPLETA
const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `predix-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `predix-dynamic-${CACHE_VERSION}`;
const API_CACHE = `predix-api-${CACHE_VERSION}`;

// Recursos estáticos críticos
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
];

// APIs que se pueden cachear
const CACHEABLE_APIS = [
  '/api/trends',
  '/api/hashtags', 
  '/api/music',
  '/api/analytics'
];

// 🚀 INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 🔄 ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 🌐 INTERCEPCIÓN DE REQUESTS
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (!request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// 🔔 PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva tendencia detectada',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'explore', title: 'Explorar' },
      { action: 'close', title: 'Cerrar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Predix - Tendencia Viral', options)
  );
});

// 🎯 NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/trends'));
  } else {
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
