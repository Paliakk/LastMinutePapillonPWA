// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).
const CACHE_NAME = 'lastminute-cache-v1'; // Nom du cache
const assetsToCache = [
    '/', // Page d'accueil
    '/index.html',
    '/manifest.webmanifest',
    '/images/icons/icon-192.png',
    '/images/icons/icon-512.png',
    '/css/style.css', // Votre fichier CSS
    '/js/app.js', // Votre fichier JS principal
    '/offline.html', // Fichier HTML qui sera servi lorsqu'il est hors ligne
];
self.addEventListener('fetch', () => { });
self.addEventListener('install', (event) => {
    console.log('Service Worker installé');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});
// Activation du service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activé');
    const cacheWhitelist = [CACHE_NAME];

    // Supprimer les anciens caches non utilisés
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
// Interception des requêtes réseau pour les servir à partir du cache (si disponible)
self.addEventListener('fetch', (event) => {
    // Si la requête est pour une page, servir la page hors ligne si elle est en cache
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Si la ressource est en cache, renvoyer la version en cache
            }

            // Sinon, fetcher la ressource depuis le réseau
            return fetch(event.request).catch(() => {
                // Si la requête échoue (pas de connexion), renvoyer une page hors ligne
                if (event.request.url.endsWith('.html')) {
                    return caches.match('/offline.html');
                }
            });
        })
    );
});
/* Manifest version: CZcRWwfs */
