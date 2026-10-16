// ==========================================
// CITAS DEL ODONTÓLOGO
// ==========================================
const usuarioSesion =
    JSON.parse(localStorage.getItem("usuarioSesion"));


// ==========================================
// VALIDAR SESIÓN
// ==========================================
if (!usuarioSesion) {

    alert("No hay una sesión activa.");

    window.location.href = "../login.html";

}


// ==========================================
// MOSTRAR USUARIO ACTUAL
// ==========================================
const nombreUsuario =
    document.getElementById("nombreUsuario");

if (nombreUsuario) {

    nombreUsuario.textContent =
        usuarioSesion.nombre;

}


const tablaCitas =
    document.getElementById("appointmentsTable");

const filtroFecha =
    document.getElementById("fechaCita");

const filtroEstado =
    document.getElementById("estadoCita");

const buscarPaciente =
    document.getElementById("buscarPaciente");


// ==========================================
// OBTENER CITAS
// ==========================================
const citas =
    JSON.parse(localStorage.getItem("citas")) || [];


// ==========================================
// NOMBRE DEL ODONTÓLOGO ACTUAL
// ==========================================
const odontologoActual =
    usuarioSesion.nombre.trim().toLowerCase();


// ==========================================
// RENDERIZAR CITAS
// ==========================================
function renderizarCitas(lista) {

    tablaCitas.innerHTML = `

        <div class="table-row table-header">

            <span>
                Paciente
            </span>

            <span>
                Fecha
            </span>

            <span>
                Hora
            </span>

            <span>
                Estado
            </span>

            <span>
                Acciones
            </span>

        </div>

    `;


    if (lista.length === 0) {

        const filaVacia =
            document.createElement("div");

        filaVacia.className =
            "table-row fila-vacia";

        filaVacia.innerHTML = `

            <span
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                "
            >
                No tienes citas registradas.
            </span>

        `;

        tablaCitas.appendChild(filaVacia);

        return;
    }


    lista.forEach(function (cita) {

        const fila =
            document.createElement("div");

        fila.className =
            "table-row";


        fila.innerHTML = `

            <span>
                ${cita.paciente}
            </span>

            <span>
                ${cita.fecha}
            </span>

            <span>
                ${cita.hora}
            </span>

            <span class="status ${obtenerClaseEstado(cita.estado)}">
                ${cita.estado}
            </span>

            <span>

                <button
                    class="btn-accion btn-ver"
                    data-id="${cita.id}"
                >
                    Ver
                </button>

                ${
                    cita.estado !== "Cancelada" && !esCitaPasada(cita)
                        ? `
                            <button
                                class="btn-accion btn-reprogramar"
                                data-id="${cita.id}"
                            >
                                Reprogramar
                            </button>
                        `
                        : ""
                }

            </span>

        `;


        tablaCitas.appendChild(fila);

    });


    activarBotonesVer();

}


// ==========================================
// CLASE DEL ESTADO
// ==========================================
function obtenerClaseEstado(estado) {

    if (estado === "Confirmada") {
        return "confirmed";
    }

    if (estado === "Pendiente") {
        return "pending";
    }

    if (estado === "Cancelada") {
        return "cancelled";
    }

    return "";

}


// ==========================================
// FILTRAR CITAS DEL ODONTÓLOGO
// ==========================================
function obtenerMisCitas() {

    let resultado =
        citas.filter(function (cita) {

            if (!cita.odontologo) {
                return false;
            }

            return (
                cita.odontologo.trim().toLowerCase() ===
                odontologoActual
            );

        });


    // ==========================================
    // FILTRO POR FECHA
    // ==========================================
    if (filtroFecha.value !== "") {

        resultado =
            resultado.filter(function (cita) {

                const partes =
                    cita.fecha.split("/");

                const fechaCita =
                    partes[2] +
                    "-" +
                    partes[1] +
                    "-" +
                    partes[0];

                return (
                    fechaCita ===
                    filtroFecha.value
                );

            });

    }


    // ==========================================
    // FILTRO POR ESTADO
    // ==========================================
    if (filtroEstado.value !== "") {

        resultado =
            resultado.filter(function (cita) {

                return (
                    cita.estado.toLowerCase() ===
                    filtroEstado.value.toLowerCase()
                );

            });

    }


    // ==========================================
    // BÚSQUEDA POR PACIENTE
    // ==========================================
    const textoBusqueda =
        buscarPaciente.value.trim().toLowerCase();


    if (textoBusqueda !== "") {

        resultado =
            resultado.filter(function (cita) {

                return cita.paciente
                    .toLowerCase()
                    .includes(textoBusqueda);

            });

    }


    return resultado;

}


// ==========================================
// VER CITA
// ==========================================
function verCita(id) {

    const cita =
        citas.find(function (item) {

            return item.id == id;

        });


    if (!cita) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.className =
        "modal-cita";


    modal.innerHTML = `

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Detalle de la cita
                    </h2>

                    <p>
                        Información de la cita.
                    </p>

                </div>

                <button
                    type="button"
                    class="modal-cerrar"
                >
                    ×
                </button>

            </div>


            <div class="datos-cita">

                <div class="dato">

                    <strong>
                        Paciente
                    </strong>

                    <span>
                        ${cita.paciente}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Odontólogo
                    </strong>

                    <span>
                        ${cita.odontologo}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Fecha
                    </strong>

                    <span>
                        ${cita.fecha}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Hora
                    </strong>

                    <span>
                        ${cita.hora}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Estado
                    </strong>

                    <span>
                        ${cita.estado}
                    </span>

                </div>

            </div>


            <div class="modal-acciones">

                <button
                    type="button"
                    class="btn btn-secondary btn-cerrar-modal"
                >
                    Cerrar
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal.querySelector(".modal-cerrar")
        .addEventListener("click", function () {

            modal.remove();

        });


    modal.querySelector(".btn-cerrar-modal")
        .addEventListener("click", function () {

            modal.remove();

        });


    modal.addEventListener("click", function (e) {

        if (e.target === modal) {
            modal.remove();
        }

    });

}


// ==========================================
// VALIDAR SI LA CITA YA PASÓ
// ==========================================
function esCitaPasada(cita) {

    if (!cita.fecha || !cita.hora) {
        return false;
    }


    const partes =
        cita.fecha.split("/");


    if (partes.length !== 3) {
        return false;
    }


    const partesHora =
        String(cita.hora).split(":");


    const fechaHora =
        new Date(
            Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0]),
            Number(partesHora[0]) || 0,
            Number(partesHora[1]) || 0
        );


    return fechaHora < new Date();

}


// ==========================================
// FORMATEAR FECHA PARA INPUT DATE
// ==========================================
function convertirFechaInput(fecha) {

    const partes =
        fecha.split("/");


    if (partes.length !== 3) {
        return "";
    }


    return (
        partes[2] +
        "-" +
        partes[1] +
        "-" +
        partes[0]
    );

}


// ==========================================
// FORMATEAR FECHA PARA LA CITA
// ==========================================
function convertirFechaCita(fecha) {

    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return "";
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ==========================================
// REPROGRAMAR CITA
// ==========================================
function reprogramarCita(id) {

    const cita =
        citas.find(function (item) {

            return item.id == id;

        });


    if (!cita) {
        return;
    }


    if (cita.estado === "Cancelada") {

        alert(
            "Una cita cancelada no puede ser reprogramada."
        );

        return;
    }


    if (esCitaPasada(cita)) {

        alert(
            "Esta cita ya pasó y no puede ser reprogramada."
        );

        return;
    }


    const modal =
        document.createElement("div");

    modal.className =
        "modal-cita";


    // ==========================================
    // FECHA MÍNIMA = FECHA ACTUAL
    // ==========================================
    const ahora =
        new Date();

    const anio =
        ahora.getFullYear();

    const mes =
        String(ahora.getMonth() + 1).padStart(2, "0");

    const dia =
        String(ahora.getDate()).padStart(2, "0");

    const fechaMinima =
        anio +
        "-" +
        mes +
        "-" +
        dia;


    modal.innerHTML = `

        <div class="modal-contenido">

            <div class="modal-header">

                <div>

                    <h2>
                        Reprogramar cita
                    </h2>

                    <p>
                        Modifica la fecha y hora de la cita.
                    </p>

                </div>

                <button
                    type="button"
                    class="modal-cerrar"
                >
                    ×
                </button>

            </div>


            <div class="datos-cita">

                <div class="dato">

                    <strong>
                        Paciente
                    </strong>

                    <span>
                        ${cita.paciente}
                    </span>

                </div>


                <div class="dato">

                    <strong>
                        Odontólogo
                    </strong>

                    <span>
                        ${cita.odontologo}
                    </span>

                </div>


                <div class="dato">

                    <label for="fechaReprogramar">
                        Nueva fecha
                    </label>

                    <input
                        type="date"
                        id="fechaReprogramar"
                        min="${fechaMinima}"
                        value="${convertirFechaInput(cita.fecha)}"
                    >

                </div>


                <div class="dato">

                    <label for="horaReprogramar">
                        Nuevo horario
                    </label>

                    <input
                        type="time"
                        id="horaReprogramar"
                        value="${cita.hora}"
                    >

                </div>

            </div>


            <div class="modal-acciones">

                <button
                    type="button"
                    class="btn btn-secondary btn-cerrar-modal"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    class="btn-principal btn-guardar-reprogramacion"
                >
                    Guardar cambios
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const fechaInput =
        modal.querySelector("#fechaReprogramar");

    const horaInput =
        modal.querySelector("#horaReprogramar");


    // ==========================================
    // CERRAR MODAL
    // ==========================================
    function cerrarModal() {

        modal.remove();

    }


    modal.querySelector(".modal-cerrar")
        .addEventListener(
            "click",
            cerrarModal
        );


    modal.querySelector(".btn-cerrar-modal")
        .addEventListener(
            "click",
            cerrarModal
        );


    modal.addEventListener("click", function (e) {

        if (e.target === modal) {
            cerrarModal();
        }

    });


    // ==========================================
    // GUARDAR REPROGRAMACIÓN
    // ==========================================
    modal.querySelector(".btn-guardar-reprogramacion")
        .addEventListener("click", function () {

            const nuevaFecha =
                fechaInput.value;

            const nuevaHora =
                horaInput.value;


            if (!nuevaFecha || !nuevaHora) {

                alert(
                    "Debes seleccionar una nueva fecha y un nuevo horario."
                );

                return;
            }


            // ==========================================
            // VALIDAR QUE NO SEA UNA FECHA PASADA
            // ==========================================
            const fechaSeleccionada =
                new Date(
                    nuevaFecha +
                    "T" +
                    nuevaHora
                );


            if (fechaSeleccionada < new Date()) {

                alert(
                    "La nueva fecha y hora no pueden ser anteriores a la fecha y hora actual."
                );

                return;
            }


            const fechaFormateada =
                convertirFechaCita(nuevaFecha);


            // ==========================================
            // VALIDAR CONFLICTO DE HORARIO
            // ==========================================
            const existeConflicto =
                citas.some(function (otraCita) {

                    if (otraCita.id == cita.id) {
                        return false;
                    }


                    if (otraCita.estado === "Cancelada") {
                        return false;
                    }


                    if (!otraCita.odontologo) {
                        return false;
                    }


                    return (

                        otraCita.odontologo
                            .trim()
                            .toLowerCase() ===
                        cita.odontologo
                            .trim()
                            .toLowerCase()

                        &&

                        otraCita.fecha ===
                        fechaFormateada

                        &&

                        String(otraCita.hora) ===
                        nuevaHora

                    );

                });


            if (existeConflicto) {

                alert(
                    "Ya tienes otra cita asignada para ese mismo día y horario."
                );

                return;
            }


            // ==========================================
            // ACTUALIZAR CITA
            // ==========================================
            cita.fecha =
                fechaFormateada;

            cita.hora =
                nuevaHora;


            // ==========================================
            // GUARDAR EN LOCALSTORAGE
            // ==========================================
            localStorage.setItem(
                "citas",
                JSON.stringify(citas)
            );


            // ==========================================
            // ACTUALIZAR PANTALLA
            // ==========================================
            cerrarModal();

            renderizarCitas(
                obtenerMisCitas()
            );


            alert(
                "La cita fue reprogramada correctamente."
            );

        });

}


// ==========================================
// ACTIVAR BOTONES
// ==========================================
function activarBotonesVer() {


    // ==========================================
    // BOTONES VER
    // ==========================================
    const botonesVer =
        document.querySelectorAll(".btn-ver");


    botonesVer.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                verCita(
                    boton.dataset.id
                );

            }
        );

    });


    // ==========================================
    // BOTONES REPROGRAMAR
    // ==========================================
    const botonesReprogramar =
        document.querySelectorAll(".btn-reprogramar");


    botonesReprogramar.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                reprogramarCita(
                    boton.dataset.id
                );

            }
        );

    });

}


// ==========================================
// EVENTOS DE FILTROS
// ==========================================
filtroFecha.addEventListener(
    "change",
    function () {

        renderizarCitas(
            obtenerMisCitas()
        );

    }
);


filtroEstado.addEventListener(
    "change",
    function () {

        renderizarCitas(
            obtenerMisCitas()
        );

    }
);


buscarPaciente.addEventListener(
    "input",
    function () {

        renderizarCitas(
            obtenerMisCitas()
        );

    }
);


// ==========================================
// CARGA INICIAL
// ==========================================
renderizarCitas(
    obtenerMisCitas()
);



