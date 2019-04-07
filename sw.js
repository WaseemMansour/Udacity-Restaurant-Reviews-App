if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
const staticCacheName = 'udacity-restaurant-app-cache-v1';
self.addEventListener('install', function(event) {

    const cacheList = [
        '/',
        'css/styles.css',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js'
    ];

    event.waitUntil(
        caches.open(staticCacheName)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(cacheList);
            })
    );
});

self.addEventListener('fetch', function(event){
   event.respondWith(
       caches.match(event.request).then(function(response){
           return response || fetch(event.request).then(function(networkResponse){
                // Check if we received a valid response
                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                   return networkResponse;
                }
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                const responseToCache = networkResponse.clone();
                caches.open(staticCacheName)
                   .then(function(cache) {
                       cache.put(event.request, responseToCache);
                   });

                return networkResponse;
           });
       }).catch(function(error){
         throw  'Error : ' + error;
       })
   );
});
