const boton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const enlaces = document.querySelectorAll("#menu a");

if (boton && menu) {

    boton.addEventListener("click", () => {
        menu.classList.toggle("open");
    });

    enlaces.forEach(enlace => {

        enlace.addEventListener("click", () => {
            menu.classList.remove("open");
        });

    });

}