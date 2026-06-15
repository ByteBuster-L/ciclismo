// Registrar el Service Worker para soporte Offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('XicoRutas: Service Worker listo para acción offline.', reg.scope))
            .catch(err => console.error('XicoRutas: Falló la activación offline', err));
    });
}

gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lógica del Menú Responsive (Celulares)
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");

    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active"); // Muestra/oculta el menú
    });

    // 2. Animaciones GSAP
    // Animamos la barra de navegación bajando
    gsap.from(".navbar", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power3.out"
    });

    gsap.from(".titulo-principal", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: "power3.out"
    });

    gsap.from(".subtitulo, .btn-primario", {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.2, // Anima uno y luego el otro
        delay: 0.8,
        ease: "power2.out"
    });

    gsap.from(".tarjeta-servicio", {
        scrollTrigger: {
            trigger: ".seccion-categorias", // Qué sección activa la animación
            start: "top 80%", // Cuándo comienza la animación (cuando el tope de la sección llega al 80% de la ventana)
            toggleActions: "play none none none" // Qué hacer (reproducir una vez al entrar)
        },
        duration: 1,
        y: 60, // Desplazamiento desde abajo
        opacity: 0, // Iniciar transparente
        stagger: 0.3, // Cada tarjeta se anima 0.3s después de la anterior
        ease: "power2.out"
    });
});