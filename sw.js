const CACHE_NAME = 'xicorutas-v1';

// Todos los archivos que la app necesita para sobrevivir sin internet
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/ruta-carranza.html',
  '/ruta-tepetzintla.html',
  '/ruta-union.html',
  '/styles.css',
  '/animaciones.js',
  '/mapa.js',
  '/Carranza.gpx',
  '/Xico-Tepetzintla.gpx',
  '/xico-union.gpx',
  // Guardamos también las librerías de los servidores web (CDNs) en la caché local
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;800&display=swap'
];

// 1. Evento de Instalación: Descarga y guarda todo en el caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('XicoRutas: Guardando archivos en caché de emergencia...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Evento de Activación: Limpia versiones viejas de caché si haces cambios
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

// 3. Evento Fetch: Intercepta las peticiones de la app. 
// Si el archivo está en el caché, lo da de inmediato (¡así funciona offline!).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si existe en caché, lo devolvemos; si no, intentamos buscarlo en internet
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Aquí podrías mostrar una página de error si intentan entrar a algo no guardado
      console.log('XicoRutas: Modo offline activo y recurso no encontrado.');
    })
  );
});