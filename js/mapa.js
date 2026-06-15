document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menú móvil (sin cambios)
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => navMenu.classList.toggle("active"));
    }

    // ==========================================
    // 2. CONFIGURACIÓN DEL MAPA AVANZADO
    // ==========================================
    
    // Definimos las nuevas capas (Tiles)
    
    // Capa 1: Satélite puro y duro (Esri World Imagery)
    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EFE, and the GIS User Community'
    });

    // Capa 2: Contornos de terreno y etiquetas (OpenTopoMap)
    const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17
    });

    // Capa 3: Superposición híbrida (calles y etiquetas sobre el satélite)
    const hybridsOverlay = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    // Inicializamos el mapa con el satélite por defecto
    const map = L.map('mapa', {
        center: [19.4326, -99.1332],
        zoom: 13,
        layers: [esriSatellite] // Arranca con satélite
    });

    // BONUS: Añadimos un control para cambiar entre Satélite y Terreno en la esquina
    const baseMaps = {
        "Vista Satélite": esriSatellite,
        "Vista Terreno": topoMap
    };
    const overlayMaps = {
        "Etiquetas/Calles": hybridsOverlay
    };
    L.control.layers(baseMaps, overlayMaps, {position: 'topright'}).addTo(map);

    // Activamos las etiquetas por defecto sobre el satélite
    hybridsOverlay.addTo(map);


    // ==========================================
    // 3. ICONOS PERSONALIZADOS (ESTILO AVENTURA)
    // ==========================================
    
    const cyclistStartIcon = L.icon({
        iconUrl: 'https://images.vexels.com/content/137637/preview/mountain-bike-silhouette-b072e5.png', // Silhouette estilizada de ciclista (puedes buscar una mejor .png transparente)
        iconSize: [40, 40], // Tamaño [ancho, alto]
        iconAnchor: [20, 40], // Punto de anclaje [centro-ancho, base-alto]
        popupAnchor: [0, -40] // Dónde aparece el popup con respecto al icono
    });

    const endPinIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2885/2885376.png', // Un icono de meta/bandera
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });


    // ==========================================
    // 4. CARGAR Y RENDERIZAR LA RUTA GPX
    // ==========================================
    
    new L.GPX(ARCHIVO_GPX_ACTUAL, {
        async: true,
        marker_options: {
            startIconUrl: cyclistStartIcon.options.iconUrl,
            endIconUrl: endPinIcon.options.iconUrl,
            shadowUrl: 'https://unpkg.com/leaflet-gpx/pin-shadow.png'
        },
        polyline_options: {
            color: '#FFFFFF',
            opacity: 0.9,
            weight: 8,
            lineCap: 'round',
            dashArray: '1, 15'
        }
    }).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());

        // EXTRAER DATOS AUTOMÁTICOS DEL GPX
        const gpx = e.target;
        
        const distanciaKm = (gpx.get_distance() / 1000).toFixed(1);
        document.getElementById('gpx-distancia').innerText = distanciaKm + " km";

        const desnivel = Math.round(gpx.get_elevation_gain());
        document.getElementById('gpx-desnivel').innerText = "+" + desnivel + " m";

        const tiempoTotalMs = gpx.get_moving_time();
        if (tiempoTotalMs > 0) {
            const horas = Math.floor(tiempoTotalMs / 3600000);
            const minutos = Math.floor((tiempoTotalMs % 3600000) / 60000);
            document.getElementById('gpx-tiempo').innerText = `${horas}h ${minutos}m`;
        } else {
            document.getElementById('gpx-tiempo').innerText = "N/A";
        }
    }).addTo(map);


    // ==========================================
    // 5. MARCADOR DE BIFURCACIÓN ESTILIZADO (SIN FOTO)
    // ==========================================
    
    const latDesviacion = 19.4355; // Puntos de ejemplo
    const lonDesviacion = -99.1340; 

    const alertIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        iconSize: [35, 35]
    });

    const marcadorAlerta = L.marker([latDesviacion, lonDesviacion], {icon: alertIcon}).addTo(map);

    // Popup rediseñado para que se vea brutal solo con texto
    const htmlPopup = `
        <div class="popup-alert-card">
            <div class="popup-header">
                <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Icono alerta">
                <h4>¡Atención, ciclista!</h4>
            </div>
            <div class="popup-body" style="padding: 15px;">
                <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #555; font-weight: 600;">
                    Punto de control. Mantén el sendero marcado en el mapa y modera la velocidad en los descensos.
                </p>
            </div>
        </div>
    `;

    marcadorAlerta.bindPopup(htmlPopup, {maxWidth: 250});

    // 6. Animaciones GSAP (sin cambios)
    gsap.from(".info-ruta > *", { duration: 0.8, y: 30, opacity: 0, stagger: 0.1, ease: "power2.out" });
    gsap.from(".mapa-wrapper", { duration: 1, scale: 0.95, opacity: 0, delay: 0.4, ease: "power2.out" });
});