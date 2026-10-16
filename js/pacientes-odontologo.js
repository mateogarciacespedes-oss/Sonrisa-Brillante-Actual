// =========================
// ELEMENTOS PRINCIPALES
// =========================
const buscador =
    document.getElementById("buscarPaciente");

const tablaPacientes =
    document.querySelector(".patients-table");


    // =========================
    // DATOS
    // =========================
    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );

    const pacientes =
        JSON.parse(
            localStorage.getItem("pacientes")
        ) || [];

    const citas =
        JSON.parse(
            localStorage.getItem("citas")
        ) || [];

        // =========================
    // MOSTRAR USUARIO ACTUAL
    // =========================
    const nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario) {

        nombreUsuario.textContent =
            usuarioSesion.nombre;

    }


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
    // OBTENER PACIENTES DEL
    // ODONTÓLOGO
    // =========================
    function obtenerMisPacientes() {

        // Obtener las citas del odontólogo actual
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


        // Obtener los nombres de los pacientes
        // registrados en sus citas
        const nombresPacientes =
            misCitas.map(function (cita) {

                return cita.paciente
                    ? cita.paciente.trim().toLowerCase()
                    : "";

            });


        // Buscar esos pacientes dentro
        // del registro general
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
    // MOSTRAR PACIENTES
    // =========================
    function mostrarPacientes(
        lista = obtenerMisPacientes()
    ) {

        // Eliminar filas anteriores
        const filas =
            tablaPacientes.querySelectorAll(
                ".patient-row"
            );

        filas.forEach(function (fila) {

            fila.remove();

        });


        // Mensaje si no existen pacientes
        if (lista.length === 0) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row patient-row";

            fila.innerHTML = `

                <span>
                    -
                </span>

                <span>
                    No hay pacientes registrados.
                </span>

                <span>
                    -
                </span>

                <span>
                    -
                </span>

                <span>
                    -
                </span>

            `;

            tablaPacientes.appendChild(fila);

            return;
        }


        // Crear filas
        lista.forEach(function (paciente) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row patient-row";


            fila.innerHTML = `

                <span>
                    ${paciente.documento}
                </span>

                <span>
                    ${paciente.nombre}
                </span>

                <span>
                    ${paciente.telefono}
                </span>

                <span>
                    ${paciente.correo}
                </span>

                <span class="actions">

                    <button
                        class="btn-action btn-ver"
                        data-documento="${paciente.documento}"
                    >
                        Ver información
                    </button>

                    <button
                        class="btn-action btn-historial"
                        data-documento="${paciente.documento}"
                    >
                        Ver historial
                    </button>

                </span>

            `;


            tablaPacientes.appendChild(fila);

        });


        agregarEventosBotones();
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


            mostrarPacientes(resultados);

        }
    );


    // =========================
    // MODAL
    // =========================
    function crearModal(contenido) {

        const modal =
            document.createElement("div");

        modal.className =
            "modal-paciente";

        modal.innerHTML =
            contenido;

        document.body.appendChild(modal);

        return modal;
    }


    // =========================
    // VER INFORMACIÓN
    // =========================
    function verPaciente(documento) {

        const paciente =
            pacientes.find(
                function (paciente) {

                    return (
                        paciente.documento ===
                        documento
                    );

                }
            );


        if (!paciente) {

            alert(
                "No se encontró la información del paciente."
            );

            return;
        }


        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                Información del paciente
                            </h2>

                            <p>
                                Datos registrados en el sistema.
                            </p>

                        </div>

                        <button class="modal-cerrar">
                            ×
                        </button>

                    </div>


                    <div class="datos-paciente">

                        <div class="dato">

                            <strong>
                                Documento
                            </strong>

                            <span>
                                ${paciente.documento}
                            </span>

                        </div>


                        <div class="dato">

                            <strong>
                                Nombre completo
                            </strong>

                            <span>
                                ${paciente.nombre}
                            </span>

                        </div>


                        <div class="dato">

                            <strong>
                                Teléfono
                            </strong>

                            <span>
                                ${paciente.telefono}
                            </span>

                        </div>


                        <div class="dato">

                            <strong>
                                Correo electrónico
                            </strong>

                            <span>
                                ${paciente.correo}
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


        modal
            .querySelectorAll(".modal-cerrar")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        modal.remove();

                    }
                );

            });

    }


    // =========================
    // VER HISTORIAL
    // =========================
    function verHistorial(documento) {

        localStorage.setItem(
            "pacienteSeleccionado",
            documento
        );


        window.location.href =
            "historial-odontologo.html";
    }


    // =========================
    // EVENTOS DE BOTONES
    // =========================
    function agregarEventosBotones() {

        const botonesVer =
            document.querySelectorAll(
                ".btn-ver"
            );


        const botonesHistorial =
            document.querySelectorAll(
                ".btn-historial"
            );


        // VER INFORMACIÓN
        botonesVer.forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const documento =
                        boton.dataset.documento;

                    verPaciente(documento);

                }
            );

        });


        // VER HISTORIAL
        botonesHistorial.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const documento =
                            boton.dataset.documento;

                        verHistorial(documento);

                    }
                );

            }
        );

    }


    // =========================
    // MOSTRAR AL CARGAR
    // =========================
    mostrarPacientes();







