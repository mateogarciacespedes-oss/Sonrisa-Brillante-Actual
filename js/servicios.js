// =========================
// ELEMENTOS PRINCIPALES
// =========================
const buscador = document.getElementById("buscarServicio");
const tablaServicios = document.querySelector(".services-table");
const botonNuevo = document.querySelector(".page-heading .btn-principal");


// =========================
// DATOS
// =========================
let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

// =========================
// MOSTRAR USUARIO ACTUAL
// =========================
const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuarioSesion")
    );

const nombreUsuario =
    document.getElementById("nombreUsuario");

if (nombreUsuario && usuarioSesion) {
    
    nombreUsuario.textContent =
        usuarioSesion.nombre;

}


// =========================
// CARGAR DATOS INICIALES
// =========================
if (servicios.length === 0) {

    const filasIniciales = document.querySelectorAll(
        ".services-table .table-row:not(.table-header)"
    );

    filasIniciales.forEach(function (fila) {

        const datos = fila.querySelectorAll("span");

        servicios.push({

            nombre: datos[0].textContent.trim(),
            descripcion: datos[1].textContent.trim(),
            duracion: datos[2].textContent.trim(),
            precio: datos[3].textContent.trim()

        });

    });

    guardarServicios();
}


// =========================
// GUARDAR DATOS
// =========================
function guardarServicios() {

    localStorage.setItem(
        "servicios",
        JSON.stringify(servicios)
    );
}


// =========================
// MOSTRAR SERVICIOS
// =========================
function mostrarServicios(lista = servicios) {

    const filas = tablaServicios.querySelectorAll(
        ".table-row:not(.table-header)"
    );

    filas.forEach(function (fila) {

        fila.remove();

    });


    lista.forEach(function (servicio) {

        const fila = document.createElement("div");

        fila.className = "table-row";

        fila.innerHTML = `

            <span>
                ${servicio.nombre}
            </span>

            <span>
                ${servicio.descripcion}
            </span>

            <span>
                ${servicio.duracion}
            </span>

            <span>
                ${servicio.precio}
            </span>

            <span class="actions">

                <button class="btn-action btn-ver">
                    Ver
                </button>

                <button class="btn-action btn-editar">
                    Editar
                </button>

                <button class="btn-action btn-eliminar">
                    Eliminar
                </button>

            </span>
        `;

        tablaServicios.appendChild(fila);

    });


    agregarEventosBotones();
}


// =========================
// BUSCADOR
// =========================
buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase().trim();

    const resultados = servicios.filter(function (servicio) {

        return (

            servicio.nombre.toLowerCase().includes(texto) ||

            servicio.descripcion.toLowerCase().includes(texto) ||

            servicio.duracion.toLowerCase().includes(texto) ||

            servicio.precio.toLowerCase().includes(texto)

        );

    });


    mostrarServicios(resultados);

});


// =========================
// CREAR MODAL
// =========================
function crearModal(contenido) {

    const modal = document.createElement("div");

    modal.className = "modal-servicio";

    modal.innerHTML = contenido;

    document.body.appendChild(modal);

    return modal;
}


// =========================
// NUEVO SERVICIO
// =========================
function abrirFormularioNuevo() {

    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Nuevo servicio
                    </h2>

                    <p>
                        Registra un nuevo servicio odontológico.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <form id="formServicio">


                <div class="form-group">

                    <label for="nombreServicio">
                        Nombre del servicio
                    </label>

                    <input
                        type="text"
                        id="nombreServicio"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="descripcionServicio">
                        Descripción
                    </label>

                    <textarea
                        id="descripcionServicio"
                        required
                    ></textarea>

                </div>


                <div class="form-group">

                    <label for="duracionServicio">
                        Duración
                    </label>

                    <input
                        type="text"
                        id="duracionServicio"
                        placeholder="Ejemplo: 45 min"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="precioServicio">
                        Precio
                    </label>

                    <input
                        type="text"
                        id="precioServicio"
                        placeholder="Ejemplo: $80.000"
                        required
                    >

                </div>


                <div class="modal-acciones">

                    <button
                        type="button"
                        class="btn btn-secondary modal-cancelar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                    >
                        Guardar servicio
                    </button>

                </div>

            </form>

        </div>
    `);


    // CERRAR
    modal.querySelector(".modal-cerrar")
        .addEventListener("click", function () {

            modal.remove();

        });


    modal.querySelector(".modal-cancelar")
        .addEventListener("click", function () {

            modal.remove();

        });


    // GUARDAR
    modal.querySelector("#formServicio")
        .addEventListener("submit", function (evento) {

            evento.preventDefault();


            const nombre =
                document.getElementById("nombreServicio")
                    .value.trim();

            const descripcion =
                document.getElementById("descripcionServicio")
                    .value.trim();

            const duracion =
                document.getElementById("duracionServicio")
                    .value.trim();

            const precio =
                document.getElementById("precioServicio")
                    .value.trim();


            // VALIDAR NOMBRE REPETIDO
            const existe = servicios.some(function (servicio) {

                return servicio.nombre.toLowerCase() ===
                       nombre.toLowerCase();

            });


            if (existe) {

                alert(
                    "Ya existe un servicio registrado con ese nombre."
                );

                return;

            }


            // CREAR SERVICIO
            const nuevoServicio = {

                nombre: nombre,
                descripcion: descripcion,
                duracion: duracion,
                precio: precio

            };


            servicios.push(nuevoServicio);

            guardarServicios();

            mostrarServicios();

            modal.remove();


            alert(
                "Servicio registrado correctamente."
            );

        });

}


// =========================
// VER SERVICIO
// =========================
function verServicio(nombre) {

    const servicio = servicios.find(function (servicio) {

        return servicio.nombre === nombre;

    });


    if (!servicio) {

        return;

    }


    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Información del servicio
                    </h2>

                    <p>
                        Datos registrados en el sistema.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <div class="datos-servicio">

                <div class="dato">

                    <strong>
                        Servicio
                    </strong>

                    <span>
                        ${servicio.nombre}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Descripción
                    </strong>

                    <span>
                        ${servicio.descripcion}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Duración
                    </strong>

                    <span>
                        ${servicio.duracion}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Precio
                    </strong>

                    <span>
                        ${servicio.precio}
                    </span>

                </div>

            </div>


            <div class="modal-acciones">

                <button
                    type="button"
                    class="btn btn-primary modal-cerrar"
                >
                    Cerrar
                </button>

            </div>

        </div>
    `);


    modal.querySelectorAll(".modal-cerrar")
        .forEach(function (boton) {

            boton.addEventListener("click", function () {

                modal.remove();

            });

        });

}


// =========================
// EDITAR SERVICIO
// =========================
function editarServicio(nombre) {

    const servicio = servicios.find(function (servicio) {

        return servicio.nombre === nombre;

    });


    if (!servicio) {

        return;

    }


    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Editar servicio
                    </h2>

                    <p>
                        Actualiza la información del servicio.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <form id="formEditarServicio">


                <div class="form-group">

                    <label>
                        Servicio
                    </label>

                    <input
                        type="text"
                        value="${servicio.nombre}"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label for="editarDescripcionServicio">
                        Descripción
                    </label>

                    <textarea
                        id="editarDescripcionServicio"
                        required
                    >${servicio.descripcion}</textarea>

                </div>


                <div class="form-group">

                    <label for="editarDuracionServicio">
                        Duración
                    </label>

                    <input
                        type="text"
                        id="editarDuracionServicio"
                        value="${servicio.duracion}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="editarPrecioServicio">
                        Precio
                    </label>

                    <input
                        type="text"
                        id="editarPrecioServicio"
                        value="${servicio.precio}"
                        required
                    >

                </div>


                <div class="modal-acciones">

                    <button
                        type="button"
                        class="btn btn-secondary modal-cancelar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                    >
                        Guardar cambios
                    </button>

                </div>

            </form>

        </div>
    `);


    // CERRAR
    modal.querySelector(".modal-cerrar")
        .addEventListener("click", function () {

            modal.remove();

        });


    modal.querySelector(".modal-cancelar")
        .addEventListener("click", function () {

            modal.remove();

        });


    // GUARDAR CAMBIOS
    modal.querySelector("#formEditarServicio")
        .addEventListener("submit", function (evento) {

            evento.preventDefault();


            servicio.descripcion =
                document.getElementById(
                    "editarDescripcionServicio"
                ).value.trim();


            servicio.duracion =
                document.getElementById(
                    "editarDuracionServicio"
                ).value.trim();


            servicio.precio =
                document.getElementById(
                    "editarPrecioServicio"
                ).value.trim();


            guardarServicios();

            mostrarServicios();

            modal.remove();


            alert(
                "Servicio actualizado correctamente."
            );

        });

}


// =========================
// ELIMINAR SERVICIO
// =========================
function eliminarServicio(nombre) {

    const servicio = servicios.find(function (servicio) {
        return servicio.nombre === nombre;
    });


    if (!servicio) {
        return;
    }


    const confirmar = confirm(
        "¿Está seguro de eliminar este servicio?\n\n" +
        "Servicio: " + servicio.nombre
    );


    if (!confirmar) {
        return;
    }


    servicios = servicios.filter(function (servicio) {
        return servicio.nombre !== nombre;
    });


    guardarServicios();

    mostrarServicios();


    alert(
        "Servicio eliminado correctamente."
    );

}


// =========================
// EVENTOS DE LOS BOTONES
// =========================
function agregarEventosBotones() {

    const botonesVer =
        document.querySelectorAll(".btn-ver");


    const botonesEditar =
        document.querySelectorAll(".btn-editar");


    const botonesEliminar =
        document.querySelectorAll(".btn-eliminar");


    // VER
    botonesVer.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const fila =
                boton.closest(".table-row");


            const nombre =
                fila.querySelector("span")
                    .textContent.trim();


            verServicio(nombre);

        });

    });


    // EDITAR
    botonesEditar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const fila =
                boton.closest(".table-row");


            const nombre =
                fila.querySelector("span")
                    .textContent.trim();


            editarServicio(nombre);

        });

    });


    // ELIMINAR
    botonesEliminar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const fila =
                boton.closest(".table-row");


            const nombre =
                fila.querySelector("span")
                    .textContent.trim();


            eliminarServicio(nombre);

        });

    });

}


// =========================
// BOTÓN NUEVO SERVICIO
// =========================
botonNuevo.addEventListener("click", function () {
    abrirFormularioNuevo();
});


// =========================
// MOSTRAR AL CARGAR
// =========================
mostrarServicios();








