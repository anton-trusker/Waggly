self.addEventListener('install', (event) => {
    // Skip waiting to ensure the new service worker activates immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim clients immediately so the service worker controls the page
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Default fetch behavior (network-only) for now
    // We can add caching strategies here later if needed
});
