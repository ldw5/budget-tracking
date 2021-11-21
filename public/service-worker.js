const CACHE_NAME ='budget-cache';
const DATA_CACHE_NAME = 'data-budget-cache';
const getCache =[
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('cached successfully');
            return cache,addAll(getCache)
        })
    );
});

self.addEventListener('fetch',function(event) {
    if(event.request.url.includes('/api/')){
        event.respondWith(caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return fetch(event.request)
                .then((response) => {
                // if network request good clone it to the cache
                    if(response,status === 200){
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                // if network request fails get it from the cache
                .catch((err) => {
                    return cache.match(event.request);
                });
            })).catch((err) => console.log(err))
            return;
    } 
    event.respondWith(
        caches.match(event.request).then(function (response) {
          return response || fetch(event.request);
        })
      );
});


