const boton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const enlaces = document.querySelectorAll("#menu a");

if (boton && menu) {

    boton.addEventListener("click", () => {
        menu.classList.toggle("open");
        boton.setAttribute("aria-expanded", menu.classList.contains("open"));
    });

    enlaces.forEach(enlace => {

        enlace.addEventListener("click", () => {
            menu.classList.remove("open");
            boton.setAttribute("aria-expanded", "false");
        });

    });

}

const secciones = document.querySelectorAll("section[id]");

if (secciones.length && enlaces.length) {
    const actualizarEnlaceActivo = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;

            enlaces.forEach((enlace) => {
                enlace.classList.toggle("is-active", enlace.getAttribute("href") === `#${entrada.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    secciones.forEach((seccion) => actualizarEnlaceActivo.observe(seccion));
}
