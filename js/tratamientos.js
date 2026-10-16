// =========================
// ELEMENTOS PRINCIPALES
// =========================
const buscador = document.getElementById("buscarTratamiento");
const tablaTratamientos = document.querySelector(".treatments-table");
const botonNuevo = document.querySelector(".page-heading .btn-principal");


// =========================
// DATOS
// =========================
let tratamientos =
    JSON.parse(localStorage.getItem("tratamientos")) || [];


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
if (tratamientos.length === 0) {

    const filasIniciales = document.querySelectorAll(
        ".treatments-table .table-row:not(.table-header)"
    );

    filasIniciales.forEach(function (fila) {

        const datos = fila.querySelectorAll("span");

        tratamientos.push({
            nombre: datos[0].textContent.trim(),
            paciente: datos[1].textContent.trim(),
            odontologo: datos[2].textContent.trim(),
            fechaInicio: datos[3].textContent.trim(),
            estado: datos[4].textContent.trim()
        });

    });

    guardarTratamientos();
}


// =========================
// GUARDAR DATOS
// =========================
function guardarTratamientos() {

    localStorage.setItem(
        "tratamientos",
        JSON.stringify(tratamientos)
    );
}


// =========================
// MOSTRAR TRATAMIENTOS
// =========================
function mostrarTratamientos(lista = tratamientos) {

    const filas = tablaTratamientos.querySelectorAll(
        ".table-row:not(.table-header)"
    );

    filas.forEach(function (fila) {

        fila.remove();

    });


    lista.forEach(function (tratamiento) {

        const fila = document.createElement("div");

        fila.className = "table-row";


        // CLASE SEGÚN ESTADO
        let claseEstado = "pending-status";

        if (tratamiento.estado === "En curso") {

            claseEstado = "active-status";

        }

        if (tratamiento.estado === "Finalizado") {

            claseEstado = "completed-status";

        }


        fila.innerHTML = `

            <span>
                ${tratamiento.nombre}
            </span>

            <span>
                ${tratamiento.paciente}
            </span>

            <span>
                ${tratamiento.odontologo}
            </span>

            <span>
                ${tratamiento.fechaInicio}
            </span>

            <span class="status ${claseEstado}">
                ${tratamiento.estado}
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

        tablaTratamientos.appendChild(fila);

    });


    agregarEventosBotones();
}


// =========================
// BUSCADOR
// =========================
buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase().trim();


    const resultados = tratamientos.filter(function (tratamiento) {

        return (

            tratamiento.nombre
                .toLowerCase()
                .includes(texto)

            ||

            tratamiento.paciente
                .toLowerCase()
                .includes(texto)

            ||

            tratamiento.odontologo
                .toLowerCase()
                .includes(texto)

            ||

            tratamiento.fechaInicio
                .toLowerCase()
                .includes(texto)

            ||

            tratamiento.estado
                .toLowerCase()
                .includes(texto)

        );

    });


    mostrarTratamientos(resultados);

});


// =========================
// CREAR MODAL
// =========================
function crearModal(contenido) {

    const modal = document.createElement("div");

    modal.className = "modal-tratamiento";

    modal.innerHTML = contenido;

    document.body.appendChild(modal);

    return modal;
}


// =========================
// NUEVO TRATAMIENTO
// =========================
function abrirFormularioNuevo() {

    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Nuevo tratamiento
                    </h2>

                    <p>
                        Registra un nuevo tratamiento odontológico.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <form id="formTratamiento">


                <div class="form-group">

                    <label for="nombreTratamiento">
                        Tratamiento
                    </label>

                    <input
                        type="text"
                        id="nombreTratamiento"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="pacienteTratamiento">
                        Paciente
                    </label>

                    <input
                        type="text"
                        id="pacienteTratamiento"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="odontologoTratamiento">
                        Odontólogo
                    </label>

                    <input
                        type="text"
                        id="odontologoTratamiento"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="fechaInicioTratamiento">
                        Fecha de inicio
                    </label>

                    <input
                        type="date"
                        id="fechaInicioTratamiento"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="estadoTratamiento">
                        Estado
                    </label>

                    <select
                        id="estadoTratamiento"
                        required
                    >

                        <option value="Pendiente">
                            Pendiente
                        </option>

                        <option value="En curso">
                            En curso
                        </option>

                        <option value="Finalizado">
                            Finalizado
                        </option>

                    </select>

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
                        Guardar tratamiento
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
    modal.querySelector("#formTratamiento")
        .addEventListener("submit", function (evento) {

            evento.preventDefault();


            const nombre =
                document.getElementById(
                    "nombreTratamiento"
                ).value.trim();


            const paciente =
                document.getElementById(
                    "pacienteTratamiento"
                ).value.trim();


            const odontologo =
                document.getElementById(
                    "odontologoTratamiento"
                ).value.trim();


            const fecha =
                document.getElementById(
                    "fechaInicioTratamiento"
                ).value;


            const estado =
                document.getElementById(
                    "estadoTratamiento"
                ).value;


            // CONVERTIR FECHA
            const partes = fecha.split("-");

            const fechaFormateada =
                partes[2] + "/" +
                partes[1] + "/" +
                partes[0];


            // VALIDAR REPETIDO
            const existe = tratamientos.some(function (tratamiento) {

                return (

                    tratamiento.nombre.toLowerCase() ===
                    nombre.toLowerCase()

                    &&

                    tratamiento.paciente.toLowerCase() ===
                    paciente.toLowerCase()

                );

            });


            if (existe) {

                alert(
                    "Este tratamiento ya está registrado para ese paciente."
                );

                return;

            }


            // CREAR TRATAMIENTO
            const nuevoTratamiento = {

                nombre: nombre,

                paciente: paciente,

                odontologo: odontologo,

                fechaInicio: fechaFormateada,

                estado: estado

            };


            tratamientos.push(nuevoTratamiento);

            guardarTratamientos();

            mostrarTratamientos();

            modal.remove();


            alert(
                "Tratamiento registrado correctamente."
            );

        });

}


// =========================
// VER TRATAMIENTO
// =========================
function verTratamiento(nombre, paciente) {

    const tratamiento = tratamientos.find(function (tratamiento) {

        return (

            tratamiento.nombre === nombre &&

            tratamiento.paciente === paciente

        );

    });


    if (!tratamiento) {

        return;

    }


    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Información del tratamiento
                    </h2>

                    <p>
                        Datos registrados en el sistema.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <div class="datos-tratamiento">

                <div class="dato">

                    <strong>
                        Tratamiento
                    </strong>

                    <span>
                        ${tratamiento.nombre}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Paciente
                    </strong>

                    <span>
                        ${tratamiento.paciente}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Odontólogo
                    </strong>

                    <span>
                        ${tratamiento.odontologo}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Fecha de inicio
                    </strong>

                    <span>
                        ${tratamiento.fechaInicio}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Estado
                    </strong>

                    <span>
                        ${tratamiento.estado}
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
// EDITAR TRATAMIENTO
// =========================
function editarTratamiento(nombre, paciente) {

    const tratamiento = tratamientos.find(function (tratamiento) {

        return (

            tratamiento.nombre === nombre &&

            tratamiento.paciente === paciente

        );

    });


    if (!tratamiento) {

        return;

    }


    const partesFecha =
        tratamiento.fechaInicio.split("/");


    const fechaParaInput =
        partesFecha[2] + "-" +
        partesFecha[1] + "-" +
        partesFecha[0];


    const modal = crearModal(`

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Editar tratamiento
                    </h2>

                    <p>
                        Actualiza la información del tratamiento.
                    </p>

                </div>

                <button class="modal-cerrar">
                    ×
                </button>

            </div>


            <form id="formEditarTratamiento">


                <div class="form-group">

                    <label>
                        Tratamiento
                    </label>

                    <input
                        type="text"
                        value="${tratamiento.nombre}"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Paciente
                    </label>

                    <input
                        type="text"
                        value="${tratamiento.paciente}"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label for="editarOdontologoTratamiento">
                        Odontólogo
                    </label>

                    <input
                        type="text"
                        id="editarOdontologoTratamiento"
                        value="${tratamiento.odontologo}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="editarFechaTratamiento">
                        Fecha de inicio
                    </label>

                    <input
                        type="date"
                        id="editarFechaTratamiento"
                        value="${fechaParaInput}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="editarEstadoTratamiento">
                        Estado
                    </label>

                    <select
                        id="editarEstadoTratamiento"
                        required
                    >

                        <option value="Pendiente"
                            ${tratamiento.estado === "Pendiente" ? "selected" : ""}>
                            Pendiente
                        </option>

                        <option value="En curso"
                            ${tratamiento.estado === "En curso" ? "selected" : ""}>
                            En curso
                        </option>

                        <option value="Finalizado"
                            ${tratamiento.estado === "Finalizado" ? "selected" : ""}>
                            Finalizado
                        </option>

                    </select>

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
    modal.querySelector("#formEditarTratamiento")
        .addEventListener("submit", function (evento) {

            evento.preventDefault();


            tratamiento.odontologo =
                document.getElementById(
                    "editarOdontologoTratamiento"
                ).value.trim();


            const nuevaFecha =
                document.getElementById(
                    "editarFechaTratamiento"
                ).value;


            const partes =
                nuevaFecha.split("-");


            tratamiento.fechaInicio =
                partes[2] + "/" +
                partes[1] + "/" +
                partes[0];


            tratamiento.estado =
                document.getElementById(
                    "editarEstadoTratamiento"
                ).value;


            guardarTratamientos();

            mostrarTratamientos();

            modal.remove();


            alert(
                "Tratamiento actualizado correctamente."
            );

        });

}


// =========================
// ELIMINAR TRATAMIENTO
// =========================
function eliminarTratamiento(nombre, paciente) {

    const tratamiento = tratamientos.find(function (tratamiento) {

        return (

            tratamiento.nombre === nombre &&

            tratamiento.paciente === paciente

        );

    });


    if (!tratamiento) {

        return;

    }


    const confirmar = confirm(

        "¿Está seguro de eliminar este tratamiento?\n\n" +

        "Tratamiento: " + tratamiento.nombre + "\n" +

        "Paciente: " + tratamiento.paciente

    );


    if (!confirmar) {

        return;

    }


    tratamientos = tratamientos.filter(function (tratamiento) {

        return !(

            tratamiento.nombre === nombre &&

            tratamiento.paciente === paciente

        );

    });


    guardarTratamientos();

    mostrarTratamientos();


    alert(
        "Tratamiento eliminado correctamente."
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


            const datos =
                fila.querySelectorAll("span");


            const nombre =
                datos[0].textContent.trim();


            const paciente =
                datos[1].textContent.trim();


            verTratamiento(nombre, paciente);

        });

    });


    // EDITAR
    botonesEditar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const fila =
                boton.closest(".table-row");


            const datos =
                fila.querySelectorAll("span");


            const nombre =
                datos[0].textContent.trim();


            const paciente =
                datos[1].textContent.trim();


            editarTratamiento(nombre, paciente);

        });

    });


    // ELIMINAR
    botonesEliminar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const fila =
                boton.closest(".table-row");


            const datos =
                fila.querySelectorAll("span");


            const nombre =
                datos[0].textContent.trim();


            const paciente =
                datos[1].textContent.trim();


            eliminarTratamiento(nombre, paciente);

        });

    });

}


// =========================
// BOTÓN NUEVO TRATAMIENTO
// =========================
botonNuevo.addEventListener("click", function () {
    abrirFormularioNuevo();
});


// =========================
// MOSTRAR AL CARGAR
// =========================
mostrarTratamientos();






