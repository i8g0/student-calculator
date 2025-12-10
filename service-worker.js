
const CACHE_NAME = 'student-calculator-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';


const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './absence-guide.html',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];


const EXTERNAL_RESOURCES = [
  'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];


const NETWORK_FIRST_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/cdnjs\.cloudflare\.com/,
  /^https:\/\/cdn\.jsdelivr\.net/
];


self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
       
        return caches.open(RUNTIME_CACHE).then((cache) => {
          return Promise.allSettled(
            EXTERNAL_RESOURCES.map(url => 
              fetch(url).then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              }).catch(() => {
              
                console.log(`[Service Worker] Failed to cache: ${url}`);
              })
            )
          );
        });
      })
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

 
  if (request.method !== 'GET') {
    return;
  }


  const isExternalResource = NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url));
  
  if (isExternalResource) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

 
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
  
        if (cachedResponse) {
          return cachedResponse;
        }

     
        return fetch(request)
          .then((response) => {
          
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

        
            const responseToCache = response.clone();

         
            const cacheName = url.origin === location.origin ? CACHE_NAME : RUNTIME_CACHE;
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
         e
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }
   
            return caches.match(request);
          });
      })
  );
});


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});


self.addEventListener('updatefound', () => {
  console.log('[Service Worker] Update found');
});

