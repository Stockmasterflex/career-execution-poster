const CACHE_NAME = 'career-os-v1'
const urlsToCache = [
  '/',
  '/phase-1',
  '/phase-2', 
  '/phase-3',
  '/phase-4',
  '/settings',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})