// Service Worker for PWA Offline Functionality

const CACHE_VERSION = 'v1';
const CACHE_NAME = `tea-restaurant-${CACHE_VERSION}`;
const urlsToCache = [
    './',
    './index.html',
    './admin.html',
    './login.html',
    './forgot-password.html',
    './daily-turnover.html',
    './monthly-turnover.html',
    './css/style.css',
    './css/admin.css',
    './css/responsive.css',
    './js/app.js',
    './js/db.js',
    './js/menu.js',
    './js/cart.js',
    './js/turnover.js',
    './js/auth.js',
    './js/admin.js',
    './js/pdf.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache install failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((response) => {
                        // Don't cache non-GET requests
                        if (event.request.method !== 'GET') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page if available
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// Background sync for offline data (future enhancement)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-bills') {
        event.waitUntil(syncBills());
    }
});

async function syncBills() {
    // This would sync bills to a server when online
    console.log('Syncing bills...');
}

