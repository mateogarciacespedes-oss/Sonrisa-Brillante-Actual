// ==========================================
// PACIENTES - RECEPCIONISTA
// ==========================================

// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================
const buscador =
    document.getElementById("buscarPaciente");

const tablaPacientes =
    document.querySelector(".patients-table");

const botonNuevo =
    document.querySelector(".page-heading .btn-primary");


    // ==========================================
    // DATOS
    // ==========================================
    let pacientes =
        JSON.parse(
            localStorage.getItem("pacientes")
        ) || [];


    // ==========================================
    // MOSTRAR USUARIO ACTUAL
    // ==========================================
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


    // ==========================================
    // GUARDAR PACIENTES
    // ==========================================
    function guardarPacientes() {

        localStorage.setItem(
            "pacientes",
            JSON.stringify(pacientes)
        );

    }


    // ==========================================
    // CARGAR DATOS INICIALES
    // ==========================================
    if (pacientes.length === 0) {

        const filasIniciales =
            document.querySelectorAll(
                ".patients-table .table-row:not(.table-header)"
            );


        filasIniciales.forEach(function (fila) {

            const datos =
                fila.querySelectorAll("span");


            pacientes.push({

                documento:
                    datos[0].textContent.trim(),

                nombre:
                    datos[1].textContent.trim(),

                telefono:
                    datos[2].textContent.trim(),

                ultimaCita:
                    datos[3].textContent.trim(),

                estado:
                    datos[4].textContent.trim()

            });

        });


        guardarPacientes();

    }


    // ==========================================
    // MOSTRAR PACIENTES
    // ==========================================
    function mostrarPacientes(
        lista = pacientes
    ) {

        const filas =
            tablaPacientes.querySelectorAll(
                ".table-row:not(.table-header)"
            );


        filas.forEach(function (fila) {

            fila.remove();

        });


        if (lista.length === 0) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row";


            fila.innerHTML = `

                <span>
                    -
                </span>

                <span>
                    No hay pacientes registrados
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

                <span class="actions">
                    -
                </span>

            `;


            tablaPacientes.appendChild(fila);

            return;

        }


        lista.forEach(function (paciente) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row";


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
                    ${paciente.ultimaCita || "Sin citas"}
                </span>

                <span class="status confirmed">
                    ${paciente.estado || "Activo"}
                </span>

                <span class="actions">

                    <button
                        class="btn-action btn-ver"
                    >
                        Ver
                    </button>

                    <button
                        class="btn-action btn-editar"
                    >
                        Editar
                    </button>

                </span>

            `;


            tablaPacientes.appendChild(fila);

        });


        agregarEventosBotones();

    }


    // ==========================================
    // BUSCADOR
    // ==========================================
    if (buscador) {

        buscador.addEventListener(
            "input",
            function () {

                const texto =
                    buscador.value
                        .toLowerCase()
                        .trim();


                const resultados =
                    pacientes.filter(function (paciente) {

                        return (

                            paciente.documento
                                .toLowerCase()
                                .includes(texto)

                            ||

                            paciente.nombre
                                .toLowerCase()
                                .includes(texto)

                            ||

                            paciente.telefono
                                .toLowerCase()
                                .includes(texto)

                        );

                    });


                mostrarPacientes(resultados);

            }
        );

    }


    // ==========================================
    // CREAR MODAL
    // ==========================================
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


    // ==========================================
    // NUEVO PACIENTE
    // ==========================================
    function abrirFormularioNuevo() {

        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                Nuevo paciente
                            </h2>

                            <p>
                                Registra la información del paciente.
                            </p>

                        </div>

                        <button
                            type="button"
                            class="modal-cerrar"
                        >
                            ×
                        </button>

                    </div>


                    <form id="formPaciente">


                        <div class="form-group">

                            <label for="documentoPaciente">
                                Documento
                            </label>

                            <input
                                type="text"
                                id="documentoPaciente"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="nombrePaciente">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                id="nombrePaciente"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="telefonoPaciente">
                                Teléfono
                            </label>

                            <input
                                type="text"
                                id="telefonoPaciente"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="ultimaCitaPaciente">
                                Última cita
                            </label>

                            <input
                                type="date"
                                id="ultimaCitaPaciente"
                            >

                        </div>


                        <div class="modal-acciones">

                            <button
                                type="button"
                                class="btn-modal-secondary modal-cancelar"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                class="btn-modal-primary"
                            >
                                Guardar paciente
                            </button>

                        </div>


                    </form>

                </div>

            `);


        // ==========================================
        // CERRAR MODAL
        // ==========================================
        modal.querySelector(".modal-cerrar")
            .addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );


        modal.querySelector(".modal-cancelar")
            .addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );


        modal.addEventListener(
            "click",
            function (evento) {

                if (evento.target === modal) {

                    modal.remove();

                }

            }
        );


        // ==========================================
        // GUARDAR PACIENTE
        // ==========================================
        modal.querySelector("#formPaciente")
            .addEventListener(
                "submit",
                function (evento) {

                    evento.preventDefault();


                    const documento =
                        modal.querySelector(
                            "#documentoPaciente"
                        ).value.trim();


                    const nombre =
                        modal.querySelector(
                            "#nombrePaciente"
                        ).value.trim();


                    const telefono =
                        modal.querySelector(
                            "#telefonoPaciente"
                        ).value.trim();


                    const ultimaCita =
                        modal.querySelector(
                            "#ultimaCitaPaciente"
                        ).value;


                    // VALIDAR DOCUMENTO

                    const existe =
                        pacientes.some(
                            function (paciente) {

                                return (
                                    paciente.documento ===
                                    documento
                                );

                            }
                        );


                    if (existe) {

                        alert(
                            "Ya existe un paciente registrado con este documento."
                        );

                        return;

                    }


                    // FORMATEAR FECHA

                    let fechaFormateada =
                        "Sin citas";


                    if (ultimaCita !== "") {

                        const partes =
                            ultimaCita.split("-");


                        fechaFormateada =
                            partes[2] +
                            "/" +
                            partes[1] +
                            "/" +
                            partes[0];

                    }


                    // CREAR PACIENTE

                    const nuevoPaciente = {

                        documento:
                            documento,

                        nombre:
                            nombre,

                        telefono:
                            telefono,

                        ultimaCita:
                            fechaFormateada,

                        estado:
                            "Activo"

                    };


                    pacientes.push(
                        nuevoPaciente
                    );


                    guardarPacientes();

                    mostrarPacientes();


                    modal.remove();


                    alert(
                        "Paciente registrado correctamente."
                    );

                }
            );

    }


    // ==========================================
    // VER PACIENTE
    // ==========================================
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

                        <button
                            type="button"
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
                                ${paciente.documento}
                            </span>

                        </div>


                        <div class="dato">

                            <strong>
                                Nombre
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
                                Última cita
                            </strong>

                            <span>
                                ${paciente.ultimaCita || "Sin citas"}
                            </span>

                        </div>


                        <div class="dato">

                            <strong>
                                Estado
                            </strong>

                            <span>
                                ${paciente.estado || "Activo"}
                            </span>

                        </div>

                    </div>


                    <div class="modal-acciones">

                        <button
                            type="button"
                            class="btn-modal-primary modal-cerrar"
                        >
                            Cerrar
                        </button>

                    </div>

                </div>

            `);


        modal.querySelectorAll(".modal-cerrar")
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


        modal.addEventListener(
            "click",
            function (evento) {

                if (evento.target === modal) {

                    modal.remove();

                }

            }
        );

    }


    // ==========================================
    // EDITAR PACIENTE
    // ==========================================
    function editarPaciente(documento) {

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

            return;

        }


        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                Editar paciente
                            </h2>

                            <p>
                                Actualiza la información del paciente.
                            </p>

                        </div>

                        <button
                            type="button"
                            class="modal-cerrar"
                        >
                            ×
                        </button>

                    </div>


                    <form id="formEditarPaciente">


                        <div class="form-group">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                value="${paciente.documento}"
                                disabled
                            >

                        </div>


                        <div class="form-group">

                            <label for="editarNombrePaciente">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                id="editarNombrePaciente"
                                value="${paciente.nombre}"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="editarTelefonoPaciente">
                                Teléfono
                            </label>

                            <input
                                type="text"
                                id="editarTelefonoPaciente"
                                value="${paciente.telefono}"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="editarFechaPaciente">
                                Última cita
                            </label>

                            <input
                                type="text"
                                id="editarFechaPaciente"
                                value="${paciente.ultimaCita || ""}"
                            >

                        </div>


                        <div class="modal-acciones">

                            <button
                                type="button"
                                class="btn-modal-secondary modal-cancelar"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                class="btn-modal-primary"
                            >
                                Guardar cambios
                            </button>

                        </div>


                    </form>

                </div>

            `);


        // ==========================================
        // CERRAR MODAL
        // ==========================================
        modal.querySelector(".modal-cerrar")
            .addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );


        modal.querySelector(".modal-cancelar")
            .addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );


        modal.addEventListener(
            "click",
            function (evento) {

                if (evento.target === modal) {

                    modal.remove();

                }

            }
        );


        // ==========================================
        // GUARDAR CAMBIOS
        // ==========================================
        modal.querySelector("#formEditarPaciente")
            .addEventListener(
                "submit",
                function (evento) {

                    evento.preventDefault();


                    paciente.nombre =
                        modal.querySelector(
                            "#editarNombrePaciente"
                        ).value.trim();


                    paciente.telefono =
                        modal.querySelector(
                            "#editarTelefonoPaciente"
                        ).value.trim();


                    paciente.ultimaCita =
                        modal.querySelector(
                            "#editarFechaPaciente"
                        ).value.trim();


                    guardarPacientes();

                    mostrarPacientes();


                    modal.remove();


                    alert(
                        "Paciente actualizado correctamente."
                    );

                }
            );

    }


    // ==========================================
    // EVENTOS DE BOTONES
    // ==========================================
    function agregarEventosBotones() {

        const botonesVer =
            document.querySelectorAll(
                ".btn-ver"
            );


        const botonesEditar =
            document.querySelectorAll(
                ".btn-editar"
            );


        // ==========================================
        // VER
        // ==========================================
        botonesVer.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const fila =
                            boton.closest(
                                ".table-row"
                            );


                        const documento =
                            fila
                                .querySelector("span")
                                .textContent
                                .trim();


                        verPaciente(
                            documento
                        );

                    }
                );

            }
        );


        // ==========================================
        // EDITAR
        // ==========================================
        botonesEditar.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const fila =
                            boton.closest(
                                ".table-row"
                            );


                        const documento =
                            fila
                                .querySelector("span")
                                .textContent
                                .trim();


                        editarPaciente(
                            documento
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // BOTÓN NUEVO PACIENTE
    // ==========================================
    if (botonNuevo) {

        botonNuevo.addEventListener(
            "click",
            function () {

                abrirFormularioNuevo();

            }
        );

    }


    // ==========================================
    // MOSTRAR AL CARGAR
    // ==========================================
    mostrarPacientes();










