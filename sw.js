const CACHE_NAME = 'xicorutas-v3'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './ruta-carranza.html',
  './ruta-tepezintla.html',
  './ruta-union.html',
  
  './css/styles.css',
  './animation/animaciones.js',
  './js/mapa.js',
  
  './Rutas/Carranza.gpx',
  './Rutas/Xico-Tepetzintla.gpx',
  './Rutas/xico-union.gpx',

  './img/portada.jpg',
  './img/principiantes.jpg',
  './img/intermedios.jpg',
  './img/avanzados.jpg',
  
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('XicoRutas: Guardando archivos uno por uno...');
      
      // EL TRUCO SALVA-VIDAS: Guardar uno por uno e ignorar los que den error 404
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(error => {
            console.error('Archivo rebelde que no se encontró (ignorado):', url);
            // No hacemos que la promesa falle, así el caché sigue guardando lo demás
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('XicoRutas: Limpiando caché antiguo');
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      console.log('XicoRutas: Modo offline activo y recurso no encontrado.');
    })
  );
});