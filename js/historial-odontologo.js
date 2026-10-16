// =========================
// ELEMENTOS PRINCIPALES
// =========================
const buscador =
    document.getElementById("buscarPaciente");

const tablaHistorial =
    document.querySelector(".clinical-table");


// =========================
// DATOS
// =========================
const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuarioSesion")
    );


// =========================
// MOSTRAR USUARIO ACTUAL
// =========================
const nombreUsuario =
    document.getElementById("nombreUsuario");

if (nombreUsuario) {

    nombreUsuario.textContent =
        usuarioSesion.nombre;

}


const pacientes =
    JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

const citas =
    JSON.parse(
        localStorage.getItem("citas")
    ) || [];

const historiales =
    JSON.parse(
        localStorage.getItem("historiales")
    ) || [];


// =========================
// VALIDAR SESIÓN
// =========================
if (!usuarioSesion) {

    alert(
        "No hay una sesión activa."
    );

    window.location.href =
        "../index.html";
}


// =========================
// ODONTÓLOGO ACTUAL
// =========================
const odontologoActual =
    usuarioSesion.nombre
        .trim()
        .toLowerCase();


// =========================
// ELEMENTOS DE INFORMACIÓN
// =========================
const nombrePaciente =
    document.getElementById(
        "nombrePaciente"
    );

const documentoPaciente =
    document.getElementById(
        "documentoPaciente"
    );

const telefonoPaciente =
    document.getElementById(
        "telefonoPaciente"
    );

const ultimaConsultaPaciente =
    document.getElementById(
        "ultimaConsultaPaciente"
    );


// =========================
// OBTENER MIS PACIENTES
// =========================
function obtenerMisPacientes() {

    const misCitas =
        citas.filter(function (cita) {

            return (
                cita.odontologo &&
                cita.odontologo
                    .trim()
                    .toLowerCase() ===
                odontologoActual
            );

        });


    const nombresPacientes =
        misCitas.map(function (cita) {

            return cita.paciente
                ? cita.paciente
                    .trim()
                    .toLowerCase()
                : "";

        });


    const misPacientes =
        pacientes.filter(function (paciente) {

            return nombresPacientes.includes(
                paciente.nombre
                    .trim()
                    .toLowerCase()
            );

        });


    return misPacientes;
}


// =========================
// OBTENER HISTORIALES DEL PACIENTE
// =========================
function obtenerHistorialPaciente(
    paciente
) {

    if (!paciente) {
        return [];
    }


    return historiales.filter(
        function (historial) {

            return (
                historial.documento ===
                paciente.documento
            );

        }
    );

}


// =========================
// MOSTRAR INFORMACIÓN
// =========================
function mostrarInformacionPaciente(
    paciente
) {

    if (!paciente) {

        nombrePaciente.textContent =
            "Selecciona un paciente";

        documentoPaciente.textContent =
            "-";

        telefonoPaciente.textContent =
            "-";

        ultimaConsultaPaciente.textContent =
            "-";

        return;
    }


    nombrePaciente.textContent =
        paciente.nombre;

    documentoPaciente.textContent =
        paciente.documento;

    telefonoPaciente.textContent =
        paciente.telefono;


    const registros =
        obtenerHistorialPaciente(
            paciente
        );


    if (registros.length > 0) {

        // Ordenar por fecha más reciente

        registros.sort(
            function (a, b) {

                return (
                    new Date(b.ultimaConsulta) -
                    new Date(a.ultimaConsulta)
                );

            }
        );


        ultimaConsultaPaciente.textContent =
            registros[0].ultimaConsulta;

    } else {

        ultimaConsultaPaciente.textContent =
            "-";

    }

}


// =========================
// MOSTRAR HISTORIAL
// =========================
function mostrarHistorial(
    paciente
) {

    const filas =
        tablaHistorial.querySelectorAll(
            ".history-row"
        );


    filas.forEach(function (fila) {

        fila.remove();

    });


    // =========================
    // SIN PACIENTE
    // =========================
    if (!paciente) {

        const fila =
            document.createElement("div");

        fila.className =
            "table-row history-row";

        fila.innerHTML = `
            <span>-</span>
            <span>Selecciona un paciente</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
        `;

        tablaHistorial.appendChild(
            fila
        );

        return;
    }


    // =========================
    // OBTENER REGISTROS
    // =========================
    const registros =
        obtenerHistorialPaciente(
            paciente
        );


    // =========================
    // SIN REGISTROS
    // =========================
    if (registros.length === 0) {

        const fila =
            document.createElement("div");

        fila.className =
            "table-row history-row";

        fila.innerHTML = `
            <span>-</span>
            <span>No hay registros</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
        `;

        tablaHistorial.appendChild(
            fila
        );

        return;
    }


    // =========================
    // ORDENAR POR FECHA
    // =========================
    registros.sort(
        function (a, b) {

            return (
                new Date(b.ultimaConsulta) -
                new Date(a.ultimaConsulta)
            );

        }
    );


    // =========================
    // MOSTRAR REGISTROS
    // =========================

    registros.forEach(
        function (historial) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row history-row";

            fila.innerHTML = `
                <span>
                    ${historial.ultimaConsulta || "-"}
                </span>

                <span>
                    ${historial.motivo || "-"}
                </span>

                <span>
                    ${historial.diagnostico || "-"}
                </span>

                <span>
                    ${historial.tratamiento || "-"}
                </span>

                <span class="actions">

                    <button
                        class="btn-action btn-ver"
                        data-id="${historial.id || ""}"
                        data-documento="${historial.documento}"
                    >
                        Ver
                    </button>

                </span>
            `;

            tablaHistorial.appendChild(
                fila
            );

        }
    );


    agregarEventosBotones();
}


// =========================
// SELECCIONAR PACIENTE
// =========================
function seleccionarPaciente(
    documento
) {

    const misPacientes =
        obtenerMisPacientes();


    const paciente =
        misPacientes.find(
            function (paciente) {

                return (
                    paciente.documento ===
                    documento
                );

            }
        );


    if (!paciente) {

        mostrarInformacionPaciente(
            null
        );

        mostrarHistorial(
            null
        );

        return;
    }


    localStorage.setItem(
        "pacienteSeleccionado",
        paciente.documento
    );


    mostrarInformacionPaciente(
        paciente
    );

    mostrarHistorial(
        paciente
    );

}


// =========================
// BUSCADOR
// =========================
buscador.addEventListener(
    "input",
    function () {

        const texto =
            buscador.value
                .toLowerCase()
                .trim();


        const misPacientes =
            obtenerMisPacientes();


        const resultados =
            misPacientes.filter(
                function (paciente) {

                    return (
                        paciente.documento
                            .toLowerCase()
                            .includes(texto)
                        ||
                        paciente.nombre
                            .toLowerCase()
                            .includes(texto)
                    );

                }
            );


        // =========================
        // UN SOLO RESULTADO
        // =========================
        if (resultados.length === 1) {

            seleccionarPaciente(
                resultados[0].documento
            );

            return;
        }


        // =========================
        // SIN RESULTADOS
        // =========================
        if (resultados.length === 0) {

            mostrarInformacionPaciente(
                null
            );

            mostrarHistorial(
                null
            );

            return;
        }


        // =========================
        // VARIOS RESULTADOS
        // =========================
        mostrarInformacionPaciente(
            null
        );

        mostrarHistorial(
            null
        );

    }
);


// =========================
// CREAR MODAL
// =========================
function crearModal(
    contenido
) {

    const modal =
        document.createElement("div");

    modal.className =
        "modal-paciente";

    modal.innerHTML =
        contenido;

    document.body.appendChild(
        modal
    );

    return modal;
}


// =========================
// VER REGISTRO COMPLETO
// =========================
function verHistorial(
    id,
    documento
) {

    let historial;


    // =========================
    // BUSCAR POR ID
    // =========================
    if (id) {

        historial =
            historiales.find(
                function (registro) {

                    return (
                        String(
                            registro.id
                        ) ===
                        String(id)
                    );

                }
            );

    }


    // =========================
    // COMPATIBILIDAD CON
    // REGISTROS ANTIGUOS
    // =========================
    if (!historial) {

        historial =
            historiales.find(
                function (registro) {

                    return (
                        registro.documento ===
                        documento
                    );

                }
            );

    }


    if (!historial) {

        alert(
            "No se encontró el historial clínico."
        );

        return;
    }


    // =========================
    // MODAL
    // =========================

    const modal =
        crearModal(`

            <div class="modal-contenido">

                <div class="modal-header">

                    <div>

                        <h2>
                            Evolución clínica
                        </h2>

                        <p>
                            Información del registro clínico.
                        </p>

                    </div>

                    <button
                        class="modal-cerrar"
                    >
                        ×
                    </button>

                </div>


                <div class="datos-paciente">


                    <div class="dato">

                        <strong>
                            Documento
                        </strong>

                        <span>
                            ${historial.documento || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Paciente
                        </strong>

                        <span>
                            ${historial.paciente || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Fecha de consulta
                        </strong>

                        <span>
                            ${historial.ultimaConsulta || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Motivo de consulta
                        </strong>

                        <span>
                            ${historial.motivo || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Diagnóstico
                        </strong>

                        <span>
                            ${historial.diagnostico || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Tratamiento realizado
                        </strong>

                        <span>
                            ${historial.tratamiento || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Evolución / Observaciones
                        </strong>

                        <span>
                            ${historial.evolucion || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Recomendaciones
                        </strong>

                        <span>
                            ${historial.recomendaciones || "-"}
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


    // =========================
    // CERRAR MODAL
    // =========================
    modal
        .querySelectorAll(
            ".modal-cerrar"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        modal.remove();

                    }
                );

            }
        );

}


// =========================
// EVENTOS DE BOTONES
// =========================
function agregarEventosBotones() {

    const botonesVer =
        document.querySelectorAll(
            ".btn-ver"
        );


    botonesVer.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const id =
                        boton.dataset.id;

                    const documento =
                        boton.dataset.documento;


                    verHistorial(
                        id,
                        documento
                    );

                }
            );

        }
    );

}


// =========================
// CARGAR PACIENTE SELECCIONADO
// =========================
function cargarPacienteSeleccionado() {

    const documentoSeleccionado =
        localStorage.getItem(
            "pacienteSeleccionado"
        );


    if (!documentoSeleccionado) {

        mostrarInformacionPaciente(
            null
        );

        mostrarHistorial(
            null
        );

        return;
    }


    seleccionarPaciente(
        documentoSeleccionado
    );

}


// =========================
// INICIO
// =========================
cargarPacienteSeleccionado();










