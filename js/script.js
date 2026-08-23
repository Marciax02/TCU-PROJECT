// =========================================
// 1. Menú adaptable para celulares
// =========================================
const botonMenu = document.querySelector("#botonMenu");
const menuNavegacion = document.querySelector("#menuNavegacion");
const enlacesMenu = document.querySelectorAll("#menuNavegacion a");

function cambiarMenu() {
    const menuEstaAbierto = menuNavegacion.classList.toggle("abierto");

    botonMenu.classList.toggle("activo");
    botonMenu.setAttribute("aria-expanded", menuEstaAbierto);
    botonMenu.setAttribute("aria-label", menuEstaAbierto ? "Cerrar menú" : "Abrir menú");
}

botonMenu.addEventListener("click", cambiarMenu);

enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        menuNavegacion.classList.remove("abierto");
        botonMenu.classList.remove("activo");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.setAttribute("aria-label", "Abrir menú");
    });
});

// =========================================
// 2. Modo oscuro con almacenamiento local
// =========================================
const botonTema = document.querySelector("#botonTema");
const temaGuardado = localStorage.getItem("temaPuraRuta");

function actualizarBotonTema() {
    const modoOscuroActivo = document.body.classList.contains("modo-oscuro");

    botonTema.textContent = modoOscuroActivo ? "☀" : "☾";
    botonTema.setAttribute(
        "aria-label",
        modoOscuroActivo ? "Activar modo claro" : "Activar modo oscuro"
    );
}

if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
}

actualizarBotonTema();

botonTema.addEventListener("click", function () {
    document.body.classList.toggle("modo-oscuro");

    const nuevoTema = document.body.classList.contains("modo-oscuro")
        ? "oscuro"
        : "claro";

    localStorage.setItem("temaPuraRuta", nuevoTema);
    actualizarBotonTema();
});

// =========================================
// 3. Carrusel automático
// =========================================
const carrusel = document.querySelector("#carrusel");
const diapositivas = document.querySelectorAll(".diapositiva");
const indicadores = document.querySelectorAll(".indicador");
const botonAnterior = document.querySelector("#anterior");
const botonSiguiente = document.querySelector("#siguiente");
const estadoCarrusel = document.querySelector("#estadoCarrusel");
const nombresRutas = ["La Fortuna y Arenal", "Monteverde", "Caribe Sur"];

let indiceActual = 0;
let temporizadorCarrusel;

function mostrarDiapositiva(nuevoIndice) {
    if (nuevoIndice >= diapositivas.length) {
        indiceActual = 0;
    } else if (nuevoIndice < 0) {
        indiceActual = diapositivas.length - 1;
    } else {
        indiceActual = nuevoIndice;
    }

    diapositivas.forEach(function (diapositiva, indice) {
        const esActual = indice === indiceActual;

        diapositiva.classList.toggle("activa", esActual);
        diapositiva.setAttribute("aria-hidden", !esActual);
    });

    indicadores.forEach(function (indicador, indice) {
        const esActual = indice === indiceActual;

        indicador.classList.toggle("activo", esActual);
        indicador.setAttribute("aria-current", esActual);
    });

    estadoCarrusel.textContent =
        "Ruta " + (indiceActual + 1) + " de " + diapositivas.length + ": " + nombresRutas[indiceActual];
}

function detenerCarrusel() {
    clearInterval(temporizadorCarrusel);
}

function iniciarCarrusel() {
    detenerCarrusel();
    temporizadorCarrusel = setInterval(function () {
        mostrarDiapositiva(indiceActual + 1);
    }, 5500);
}

function reiniciarCarrusel() {
    iniciarCarrusel();
}

botonSiguiente.addEventListener("click", function () {
    mostrarDiapositiva(indiceActual + 1);
    reiniciarCarrusel();
});

botonAnterior.addEventListener("click", function () {
    mostrarDiapositiva(indiceActual - 1);
    reiniciarCarrusel();
});

indicadores.forEach(function (indicador) {
    indicador.addEventListener("click", function () {
        const nuevoIndice = Number(indicador.dataset.indice);
        mostrarDiapositiva(nuevoIndice);
        reiniciarCarrusel();
    });
});

carrusel.addEventListener("mouseenter", detenerCarrusel);
carrusel.addEventListener("mouseleave", iniciarCarrusel);

carrusel.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowLeft") {
        mostrarDiapositiva(indiceActual - 1);
    }

    if (evento.key === "ArrowRight") {
        mostrarDiapositiva(indiceActual + 1);
    }
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        detenerCarrusel();
    } else {
        iniciarCarrusel();
    }
});

iniciarCarrusel();

// =========================================
// 4. Hora de Costa Rica con actualización
// =========================================
const horaCostaRica = document.querySelector("#horaCostaRica");
const fechaCostaRica = document.querySelector("#fechaCostaRica");

function actualizarHora() {
    const fechaActual = new Date();

    horaCostaRica.textContent = fechaActual.toLocaleTimeString("es-CR", {
        timeZone: "America/Costa_Rica",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    fechaCostaRica.textContent = fechaActual.toLocaleDateString("es-CR", {
        timeZone: "America/Costa_Rica",
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

actualizarHora();
setInterval(actualizarHora, 1000);

// =========================================
// 5. Experiencias favoritas con localStorage
// =========================================
const botonesGuardar = document.querySelectorAll(".boton-guardar");
const listaFavoritos = document.querySelector("#listaFavoritos");
const cantidadGuardados = document.querySelector("#cantidadGuardados");
const limpiarFavoritos = document.querySelector("#limpiarFavoritos");
const notificacion = document.querySelector("#notificacion");

let favoritos = [];
let temporizadorNotificacion;

try {
    favoritos = JSON.parse(localStorage.getItem("favoritosPuraRuta")) || [];
} catch (error) {
    favoritos = [];
}

function mostrarNotificacion(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);
    temporizadorNotificacion = setTimeout(function () {
        notificacion.classList.remove("visible");
    }, 2300);
}

function guardarFavoritos() {
    localStorage.setItem("favoritosPuraRuta", JSON.stringify(favoritos));
}

function actualizarFavoritos() {
    listaFavoritos.innerHTML = "";
    cantidadGuardados.textContent = favoritos.length;
    limpiarFavoritos.disabled = favoritos.length === 0;

    botonesGuardar.forEach(function (boton) {
        const estaGuardado = favoritos.some(function (favorito) {
            return favorito.id === boton.dataset.id;
        });

        boton.classList.toggle("guardado", estaGuardado);
        boton.setAttribute("aria-pressed", estaGuardado);
        boton.innerHTML = estaGuardado
            ? "<span>♥</span> Guardado"
            : "<span>♡</span> Guardar";
    });

    if (favoritos.length === 0) {
        const elementoVacio = document.createElement("li");
        elementoVacio.className = "lista-vacia";
        elementoVacio.textContent = "Todavía no guardaste experiencias.";
        listaFavoritos.appendChild(elementoVacio);
        return;
    }

    favoritos.forEach(function (favorito) {
        const elementoLista = document.createElement("li");
        elementoLista.textContent = favorito.nombre;
        listaFavoritos.appendChild(elementoLista);
    });
}

botonesGuardar.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;
        const indiceFavorito = favoritos.findIndex(function (favorito) {
            return favorito.id === id;
        });

        if (indiceFavorito === -1) {
            favoritos.push({ id: id, nombre: nombre });
            mostrarNotificacion(nombre + " se agregó a tu ruta");
        } else {
            favoritos.splice(indiceFavorito, 1);
            mostrarNotificacion(nombre + " se eliminó de tu ruta");
        }

        guardarFavoritos();
        actualizarFavoritos();
    });
});

limpiarFavoritos.addEventListener("click", function () {
    favoritos = [];
    guardarFavoritos();
    actualizarFavoritos();
    mostrarNotificacion("Tu ruta quedó vacía");
});

actualizarFavoritos();

// =========================================
// 6. Validación sencilla del formulario
// =========================================
const formularioVisita = document.querySelector("#formularioVisita");
const inputNombre = document.querySelector("#nombre");
const inputCorreo = document.querySelector("#correo");
const tipoPaseo = document.querySelector("#tipoPaseo");
const mensajeFormulario = document.querySelector("#mensajeFormulario");

function correoEsValido(correo) {
    return correo.includes("@") && correo.includes(".");
}

formularioVisita.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const paseo = tipoPaseo.value;

    inputNombre.classList.remove("campo-error");
    inputCorreo.classList.remove("campo-error");
    tipoPaseo.classList.remove("campo-error");

    if (nombre === "" || correo === "" || paseo === "") {
        mensajeFormulario.textContent = "Por favor, completá todos los campos.";
        mensajeFormulario.className = "mensaje-formulario error";

        if (nombre === "") inputNombre.classList.add("campo-error");
        if (correo === "") inputCorreo.classList.add("campo-error");
        if (paseo === "") tipoPaseo.classList.add("campo-error");
        return;
    }

    if (!correoEsValido(correo)) {
        inputCorreo.classList.add("campo-error");
        mensajeFormulario.textContent = "Escribí un correo electrónico válido.";
        mensajeFormulario.className = "mensaje-formulario error";
        return;
    }

    localStorage.setItem("ultimoVisitantePuraRuta", nombre);
    mensajeFormulario.textContent = "¡Gracias, " + nombre + "! Tu idea fue recibida correctamente.";
    mensajeFormulario.className = "mensaje-formulario exito";
    formularioVisita.reset();
});

const ultimoVisitante = localStorage.getItem("ultimoVisitantePuraRuta");

if (ultimoVisitante) {
    inputNombre.placeholder = "Hola de nuevo, " + ultimoVisitante;
}

// Año automático del pie de página.
document.querySelector("#anioActual").textContent = new Date().getFullYear();
