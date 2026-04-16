// Predix PWA Service Worker
const CACHE_NAME = 'predix-v1.0.0';
const STATIC_CACHE = 'predix-static-v1';
const DYNAMIC_CACHE = 'predix-dynamic-v1';
const API_CACHE = 'predix-api-v1'; // Added missing constant

// Archivos a cachear inmediatamente
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// APIs que se pueden cachear
const CACHEABLE_APIS = [
  '/api/trends',
  '/api/hashtags',
  '/api/music',
  '/api/analytics'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Rutas de la aplicación para cache
const APP_ROUTES = [
  '/',
  '/login',
  '/dashboard',
  '/explore',
  '/actions',
  '/alerts',
  '/settings'
];

// 🚀 INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    Promise.all([
      // Cache recursos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_FILES); // Fixed: was STATIC_ASSETS
      }),

      // Pre-cache datos críticos
      caches.open(API_CACHE).then(cache => {
        console.log('[SW] Pre-caching critical API data');
        return Promise.all(
          CACHEABLE_APIS.map(url =>
            fetch(url)
              .then(response => response.ok ? cache.put(url, response) : null)
              .catch(() => null)
          )
        );
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Tomar control inmediatamente
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) return;

  // Estrategia Cache First para archivos estáticos
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estrategia Network First para rutas de la app
  if (isAppRoute(url.pathname)) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Estrategia Network First para APIs
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: Network First
  event.respondWith(networkFirst(request));
});

// Funciones auxiliares
function isStaticAsset(url) {
  return url.includes('/static/') ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.svg') ||
    url.includes('fonts.googleapis.com');
}

function isAppRoute(pathname) {
  return APP_ROUTES.includes(pathname) || pathname.startsWith('/trend/');
}

// Estrategia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Estrategia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cachear respuestas exitosas
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Estrategia Network First con fallback a página offline
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for app route, trying cache');

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback a la página principal si está en cache
    const fallbackResponse = await caches.match('/');
    if (fallbackResponse) {
      return fallbackResponse;
    }

    // Última opción: página offline básica
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Predix - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Inter, sans-serif; 
              background: #0b0c10; 
              color: white; 
              text-align: center; 
              padding: 50px 20px; 
            }
            .offline-container {
              max-width: 400px;
              margin: 0 auto;
            }
            .logo { 
              font-size: 2rem; 
              font-weight: bold; 
              background: linear-gradient(45deg, #007bff, #00ff9d);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 20px;
            }
            .message { margin-bottom: 30px; }
            .retry-btn {
              background: linear-gradient(45deg, #007bff, #00ff9d);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              color: white;
              font-weight: 600;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="logo">Predix</div>
            <div class="message">
              <h2>Sin conexión</h2>
              <p>Parece que no tienes conexión a internet. Algunas funciones pueden estar limitadas.</p>
            </div>
            <button class="retry-btn" onclick="window.location.reload()">
              Reintentar
            </button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones Push (preparado para futuro)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.url,
    actions: [
      {
        action: 'view',
        title: 'Ver tendencia'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' && event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
