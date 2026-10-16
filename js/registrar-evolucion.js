// =====================================================
// ELEMENTOS PRINCIPALES
// =====================================================

const formulario =
    document.querySelector(".evolution-form");

const selectorPaciente =
    document.getElementById("paciente");

const campoFecha =
    document.getElementById("fecha");

const campoMotivo =
    document.getElementById("motivo");

const campoDiagnostico =
    document.getElementById("diagnostico");

const campoTratamiento =
    document.getElementById("tratamiento");

const campoEvolucion =
    document.getElementById("evolucion");

const campoRecomendaciones =
    document.getElementById("recomendaciones");


// =====================================================
// SESIÓN
// =====================================================

const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuarioSesion")
    );


// =====================================================
// VALIDAR SESIÓN
// =====================================================

if (!usuarioSesion) {

    window.location.href =
        "../index.html";

    throw new Error(
        "No hay una sesión activa."
    );
}


// =====================================================
// VALIDAR ROL
// =====================================================

if (
    usuarioSesion.rol !==
    "Odontólogo"
) {

    window.location.href =
        "dashboard-odontologo.html";

    throw new Error(
        "Usuario sin permisos."
    );
}


// =====================================================
// MOSTRAR USUARIO ACTUAL
// =====================================================

const nombreUsuario =
    document.getElementById(
        "nombreUsuario"
    );

if (nombreUsuario) {

    nombreUsuario.textContent =
        usuarioSesion.nombre;

}


// =====================================================
// DATOS
// =====================================================

const pacientes =
    JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

const citas =
    JSON.parse(
        localStorage.getItem("citas")
    ) || [];


// =====================================================
// ODONTÓLOGO ACTUAL
// =====================================================

const odontologoActual =
    usuarioSesion.nombre
        .trim()
        .toLowerCase();


// =====================================================
// MODAL
// =====================================================

function mostrarModal(
    titulo,
    mensaje,
    tipo = "info",
    mostrarCancelar = false,
    callbackAceptar = null
) {

    const modalExistente =
        document.querySelector(
            ".modal-evolucion"
        );

    if (modalExistente) {
        modalExistente.remove();
    }


    const modal =
        document.createElement("div");

    modal.className =
        "modal-evolucion";


    let icono = "ℹ️";

    if (tipo === "success") {
        icono = "✅";
    }

    if (tipo === "error") {
        icono = "⚠️";
    }


    modal.innerHTML = `

        <div class="modal-evolucion-contenido">

            <div class="modal-evolucion-header">

                <div class="modal-evolucion-titulo">

                    <span class="modal-evolucion-icono">
                        ${icono}
                    </span>

                    <h2>
                        ${titulo}
                    </h2>

                </div>

                <button
                    type="button"
                    class="modal-evolucion-cerrar"
                >
                    ×
                </button>

            </div>


            <div class="modal-evolucion-body">

                <p>
                    ${mensaje}
                </p>

            </div>


            <div class="modal-evolucion-acciones">

                ${
                    mostrarCancelar
                        ? `
                            <button
                                type="button"
                                class="btn btn-secondary modal-btn-cancelar"
                            >
                                Cancelar
                            </button>
                          `
                        : ""
                }

                <button
                    type="button"
                    class="btn btn-primary modal-btn-aceptar"
                >
                    Aceptar
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const cerrar =
        function () {

            modal.remove();

        };


    const botonCerrar =
        modal.querySelector(
            ".modal-evolucion-cerrar"
        );

    const botonAceptar =
        modal.querySelector(
            ".modal-btn-aceptar"
        );

    const botonCancelar =
        modal.querySelector(
            ".modal-btn-cancelar"
        );


    botonCerrar.addEventListener(
        "click",
        cerrar
    );


    if (botonCancelar) {

        botonCancelar.addEventListener(
            "click",
            cerrar
        );

    }


    botonAceptar.addEventListener(
        "click",
        function () {

            if (callbackAceptar) {

                callbackAceptar();

            } else {

                cerrar();

            }

        }
    );


    modal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === modal
            ) {

                cerrar();

            }

        }
    );

}


// =====================================================
// OBTENER MIS PACIENTES
// =====================================================

function obtenerMisPacientes() {

    const misCitas =
        citas.filter(
            function (cita) {

                return (
                    cita.odontologo &&
                    cita.odontologo
                        .trim()
                        .toLowerCase() ===
                    odontologoActual
                );

            }
        );


    const nombresPacientes =
        misCitas.map(
            function (cita) {

                return cita.paciente
                    ? cita.paciente
                        .trim()
                        .toLowerCase()
                    : "";

            }
        );


    const misPacientes =
        pacientes.filter(
            function (paciente) {

                return nombresPacientes.includes(
                    paciente.nombre
                        .trim()
                        .toLowerCase()
                );

            }
        );


    return misPacientes;

}


// =====================================================
// CARGAR PACIENTES
// =====================================================

function cargarPacientes() {

    const misPacientes =
        obtenerMisPacientes();


    selectorPaciente.innerHTML = `
        <option value="">
            Seleccionar paciente
        </option>
    `;


    misPacientes.forEach(
        function (paciente) {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                paciente.documento;


            opcion.textContent =
                paciente.nombre;


            selectorPaciente.appendChild(
                opcion
            );

        }
    );


    // =================================================
    // PACIENTE SELECCIONADO PREVIAMENTE
    // =================================================

    const pacienteSeleccionado =
        localStorage.getItem(
            "pacienteSeleccionado"
        );


    if (pacienteSeleccionado) {

        const pacienteExiste =
            misPacientes.some(
                function (paciente) {

                    return (
                        String(
                            paciente.documento
                        ) ===
                        String(
                            pacienteSeleccionado
                        )
                    );

                }
            );


        if (pacienteExiste) {

            selectorPaciente.value =
                pacienteSeleccionado;

        }

    }

}


// =====================================================
// FECHA ACTUAL
// =====================================================

function establecerFechaActual() {

    const fecha =
        new Date();


    const anio =
        fecha.getFullYear();


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    campoFecha.value =
        `${anio}-${mes}-${dia}`;

}


// =====================================================
// GUARDAR EVOLUCIÓN
// =====================================================

formulario.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        // =============================================
        // OBTENER DATOS
        // =============================================

        const documentoPaciente =
            selectorPaciente.value;

        const fecha =
            campoFecha.value;

        const motivo =
            campoMotivo.value.trim();

        const diagnostico =
            campoDiagnostico.value.trim();

        const tratamiento =
            campoTratamiento.value.trim();

        const evolucion =
            campoEvolucion.value.trim();

        const recomendaciones =
            campoRecomendaciones.value.trim();


        // =============================================
        // VALIDACIONES
        // =============================================

        if (
            documentoPaciente === "" ||
            fecha === "" ||
            motivo === "" ||
            diagnostico === "" ||
            tratamiento === "" ||
            evolucion === ""
        ) {

            mostrarModal(
                "Campos incompletos",
                "Por favor, completa todos los campos obligatorios antes de guardar la evolución.",
                "error"
            );

            return;

        }


        // =============================================
        // BUSCAR PACIENTE
        // =============================================

        const paciente =
            pacientes.find(
                function (paciente) {

                    return (
                        String(
                            paciente.documento
                        ) ===
                        String(
                            documentoPaciente
                        )
                    );

                }
            );


        if (!paciente) {

            mostrarModal(
                "Paciente no encontrado",
                "No se encontró el paciente seleccionado. Verifica la información e inténtalo nuevamente.",
                "error"
            );

            return;

        }


        // =============================================
        // OBTENER HISTORIALES
        // =============================================

        const historiales =
            JSON.parse(
                localStorage.getItem(
                    "historiales"
                )
            ) || [];


        // =============================================
        // CREAR NUEVA EVOLUCIÓN
        // =============================================

        const nuevaEvolucion = {

            id:
                Date.now(),

            documento:
                paciente.documento,

            paciente:
                paciente.nombre,

            odontologo:
                usuarioSesion.nombre,

            ultimaConsulta:
                fecha,

            motivo:
                motivo,

            diagnostico:
                diagnostico,

            tratamiento:
                tratamiento,

            evolucion:
                evolucion,

            recomendaciones:
                recomendaciones

        };


        // =============================================
        // GUARDAR
        // =============================================

        historiales.push(
            nuevaEvolucion
        );


        localStorage.setItem(
            "historiales",
            JSON.stringify(
                historiales
            )
        );


        // =============================================
        // GUARDAR PACIENTE SELECCIONADO
        // =============================================

        localStorage.setItem(
            "pacienteSeleccionado",
            paciente.documento
        );


        // =============================================
        // CONFIRMACIÓN
        // =============================================

        mostrarModal(
            "Evolución registrada",
            `La evolución clínica de <strong>${paciente.nombre}</strong> fue registrada correctamente.`,
            "success",
            false,
            function () {

                window.location.href =
                    "historial-odontologo.html";

            }
        );

    }
);


// =====================================================
// INICIO
// =====================================================

cargarPacientes();

establecerFechaActual();






