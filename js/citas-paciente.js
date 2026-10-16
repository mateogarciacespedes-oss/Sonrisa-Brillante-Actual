// ==========================================
// CITAS PACIENTE
// ==========================================


// ==========================================
// SESIÓN ACTUAL
// ==========================================
const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuarioSesion")
    );


    // ==========================================
    // DATOS
    // ==========================================
    const pacientes =
        JSON.parse(
            localStorage.getItem("pacientes")
        ) || [];

    let citas =
        JSON.parse(
            localStorage.getItem("citas")
        ) || [];


    // ==========================================
    // VALIDAR SESIÓN
    // ==========================================
    if (!usuarioSesion) {

        window.location.href =
            "../index.html";

    }


    // ==========================================
    // MOSTRAR NOMBRE DEL PACIENTE
    // ==========================================
    const nombreUsuario =
        document.getElementById(
            "nombreUsuario"
        );


    if (
        nombreUsuario &&
        usuarioSesion
    ) {

        nombreUsuario.textContent =
            usuarioSesion.nombre;

    }


    // ==========================================
    // BUSCAR PACIENTE
    // ==========================================
    let pacienteActual = null;


    if (usuarioSesion) {

        pacienteActual =
            pacientes.find(
                function (paciente) {

                    return (
                        paciente.documento ===
                        usuarioSesion.documento
                    );

                }
            );


        // Compatibilidad por correo

        if (!pacienteActual) {

            pacienteActual =
                pacientes.find(
                    function (paciente) {

                        return (
                            paciente.correo &&
                            usuarioSesion.correo &&
                            paciente.correo.toLowerCase() ===
                            usuarioSesion.correo.toLowerCase()
                        );

                    }
                );

        }

    }


    // ==========================================
    // FILTRAR CITAS DEL PACIENTE
    // ==========================================
    function obtenerCitasPaciente() {

        if (!pacienteActual) {
            return [];
        }


        return citas.filter(
            function (cita) {

                // Nueva estructura

                if (
                    cita.pacienteDocumento &&
                    cita.pacienteDocumento ===
                    pacienteActual.documento
                ) {

                    return true;

                }


                // Compatibilidad con citas antiguas

                if (
                    cita.paciente &&
                    cita.paciente ===
                    pacienteActual.nombre
                ) {

                    return true;

                }


                return false;

            }
        );

    }


    // ==========================================
    // CONVERTIR FECHA
    // ==========================================
    function convertirFecha(
        fecha
    ) {

        if (!fecha) {
            return null;
        }


        // YYYY-MM-DD

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                fecha
            )
        ) {

            const partes =
                fecha.split("-");


            return new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            );

        }


        // DD/MM/YYYY

        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(
                fecha
            )
        ) {

            const partes =
                fecha.split("/");


            return new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            );

        }


        const fechaConvertida =
            new Date(fecha);


        if (
            !isNaN(
                fechaConvertida.getTime()
            )
        ) {

            return fechaConvertida;

        }


        return null;
    }


    // ==========================================
    // FORMATEAR FECHA
    // ==========================================
    function formatearFecha(
        fecha
    ) {

        const fechaConvertida =
            convertirFecha(
                fecha
            );


        if (!fechaConvertida) {
            return "--";
        }


        const dia =
            String(
                fechaConvertida.getDate()
            ).padStart(
                2,
                "0"
            );


        const mes =
            String(
                fechaConvertida.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const anio =
            fechaConvertida.getFullYear();


        return `${dia}/${mes}/${anio}`;
    }


    // ==========================================
    // FORMATEAR MES
    // ==========================================
    function obtenerMes(
        fecha
    ) {

        const fechaConvertida =
            convertirFecha(
                fecha
            );


        if (!fechaConvertida) {
            return "--";
        }


        const meses = [
            "ENE",
            "FEB",
            "MAR",
            "ABR",
            "MAY",
            "JUN",
            "JUL",
            "AGO",
            "SEP",
            "OCT",
            "NOV",
            "DIC"
        ];


        return meses[
            fechaConvertida.getMonth()
        ];
    }


    // ==========================================
    // OBTENER DÍA
    // ==========================================
    function obtenerDia(
        fecha
    ) {

        const fechaConvertida =
            convertirFecha(
                fecha
            );


        if (!fechaConvertida) {
            return "--";
        }


        return String(
            fechaConvertida.getDate()
        ).padStart(
            2,
            "0"
        );
    }


    // ==========================================
    // NORMALIZAR ESTADO
    // ==========================================
    function normalizarEstado(
        estado
    ) {

        if (!estado) {
            return "";
        }


        return estado
            .toLowerCase()
            .trim();

    }


    // ==========================================
    // FECHA DE HOY
    // ==========================================
    function inicioDelDia(
        fecha
    ) {

        const nuevaFecha =
            new Date(fecha);


        nuevaFecha.setHours(
            0,
            0,
            0,
            0
        );


        return nuevaFecha;

    }


    const hoy =
        inicioDelDia(
            new Date()
        );


    // ==========================================
    // OBTENER CITAS DEL PACIENTE
    // ==========================================
    let citasPaciente =
        obtenerCitasPaciente();


    // ==========================================
    // PRÓXIMA CITA
    // ==========================================
    const citasFuturas =
        citasPaciente
            .map(
                function (cita) {

                    return {

                        cita: cita,

                        fecha:
                            convertirFecha(
                                cita.fecha
                            )

                    };

                }
            )
            .filter(
                function (item) {

                    if (!item.fecha) {
                        return false;
                    }


                    const estado =
                        normalizarEstado(
                            item.cita.estado
                        );


                    if (
                        estado === "cancelada" ||
                        estado === "cancelado" ||
                        estado === "atendida" ||
                        estado === "atendido"
                    ) {

                        return false;

                    }


                    return (
                        inicioDelDia(
                            item.fecha
                        ) >= hoy
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        a.fecha -
                        b.fecha
                    );

                }
            );


    const proximaCita =
        citasFuturas.length > 0
            ? citasFuturas[0].cita
            : null;


    // ==========================================
    // ACTUALIZAR PRÓXIMA CITA
    // ==========================================
    function mostrarProximaCita() {

        const contenedor =
            document.querySelector(
                ".next-appointment"
            );


        if (!contenedor) {
            return;
        }


        const fecha =
            contenedor.querySelector(
                ".date-day"
            );


        const mes =
            contenedor.querySelector(
                ".date-month"
            );


        const detalles =
            contenedor.querySelector(
                ".appointment-details"
            );


        const estado =
            contenedor.querySelector(
                ".appointment-status .status"
            );


        if (!proximaCita) {

            if (fecha) {
                fecha.textContent = "--";
            }


            if (mes) {
                mes.textContent = "---";
            }


            if (detalles) {

                detalles.innerHTML = `
                    <h3>
                        No tienes citas próximas
                    </h3>

                    <p>
                        Puedes solicitar una nueva cita.
                    </p>
                `;

            }


            if (estado) {

                estado.textContent =
                    "Sin cita";

                estado.className =
                    "status pending";

            }


            return;
        }


        if (fecha) {

            fecha.textContent =
                obtenerDia(
                    proximaCita.fecha
                );

        }


        if (mes) {

            mes.textContent =
                obtenerMes(
                    proximaCita.fecha
                );

        }


        if (detalles) {

            detalles.innerHTML = `

                <h3>
                    ${
                        proximaCita.servicio ||
                        "Consulta odontológica"
                    }
                </h3>

                <p>
                    🦷 ${
                        proximaCita.odontologo ||
                        "Odontólogo por asignar"
                    }
                </p>

                <p>
                    🕘 ${
                        proximaCita.hora ||
                        "Hora por confirmar"
                    }
                </p>

            `;

        }


        if (estado) {

            estado.textContent =
                proximaCita.estado ||
                "Pendiente";


            estado.className =
                "status " +
                obtenerClaseEstado(
                    proximaCita.estado
                );

        }

    }


    // ==========================================
    // CLASE VISUAL DEL ESTADO
    // ==========================================
    function obtenerClaseEstado(
        estado
    ) {

        const estadoNormalizado =
            normalizarEstado(
                estado
            );


        if (
            estadoNormalizado ===
            "confirmada"
        ) {

            return "confirmed";

        }


        if (
            estadoNormalizado ===
            "pendiente"
        ) {

            return "pending";

        }


        if (
            estadoNormalizado ===
            "atendida" ||
            estadoNormalizado ===
            "atendido" ||
            estadoNormalizado ===
            "realizada"
        ) {

            return "completed";

        }


        if (
            estadoNormalizado ===
            "cancelada" ||
            estadoNormalizado ===
            "cancelado"
        ) {

            return "cancelled";

        }


        return "pending";

    }


    // ==========================================
    // CREAR FILA DE CITA
    // ==========================================
    function crearFilaCita(
        cita,
        mostrarAcciones
    ) {

        const fila =
            document.createElement(
                "div"
            );


        fila.className =
            "table-row";


        const servicio =
            cita.servicio ||
            "Consulta odontológica";


        const odontologo =
            cita.odontologo ||
            "Por asignar";


        const hora =
            cita.hora ||
            "Por confirmar";


        const estado =
            cita.estado ||
            "Pendiente";


        fila.innerHTML = `

            <span>
                ${formatearFecha(
                    cita.fecha
                )}
            </span>

            <span>
                ${servicio}
            </span>

            <span>
                ${odontologo}
            </span>

            <span>
                ${hora}
            </span>

            <span>

                <span
                    class="status ${obtenerClaseEstado(
                        estado
                    )}"
                >
                    ${estado}
                </span>

            </span>

            ${
                mostrarAcciones
                    ? `
                        <span class="actions">

                            <button
                                class="btn-action btn-ver-cita"
                                data-id="${cita.id}"
                            >
                                Ver
                            </button>

                            ${
                                puedeCancelar(
                                    cita
                                )
                                    ? `
                                        <button
                                            class="btn-action cancel btn-cancelar-cita"
                                            data-id="${cita.id}"
                                        >
                                            Cancelar
                                        </button>
                                    `
                                    : ""
                            }

                        </span>
                    `
                    : ""
            }

        `;


        return fila;
    }


    // ==========================================
    // VALIDAR SI SE PUEDE CANCELAR
    // ==========================================
    function puedeCancelar(
        cita
    ) {

        const estado =
            normalizarEstado(
                cita.estado
            );


        if (
            estado === "cancelada" ||
            estado === "cancelado" ||
            estado === "atendida" ||
            estado === "atendido"
        ) {

            return false;

        }


        const fecha =
            convertirFecha(
                cita.fecha
            );


        if (!fecha) {
            return false;
        }


        return (
            inicioDelDia(fecha) >=
            hoy
        );

    }


    // ==========================================
    // MOSTRAR CITAS PROGRAMADAS
    // ==========================================
    function mostrarCitasProgramadas() {

        const tablas =
            document.querySelectorAll(
                ".appointments-table"
            );


        if (tablas.length < 1) {
            return;
        }


        const tablaProgramadas =
            tablas[0];


        const encabezado =
            tablaProgramadas.querySelector(
                ".table-header"
            );


        tablaProgramadas.innerHTML = "";


        if (encabezado) {

            tablaProgramadas.appendChild(
                encabezado
            );

        }


        const programadas =
            citasPaciente
                .filter(
                    function (cita) {

                        const fecha =
                            convertirFecha(
                                cita.fecha
                            );


                        if (!fecha) {
                            return false;
                        }


                        const estado =
                            normalizarEstado(
                                cita.estado
                            );


                        return (
                            inicioDelDia(fecha) >=
                            hoy
                            &&
                            estado !==
                            "cancelada"
                            &&
                            estado !==
                            "cancelado"
                            &&
                            estado !==
                            "atendida"
                            &&
                            estado !==
                            "atendido"
                        );

                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            convertirFecha(
                                a.fecha
                            ) -
                            convertirFecha(
                                b.fecha
                            )
                        );

                    }
                );


        if (
            programadas.length === 0
        ) {

            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "table-row";


            fila.innerHTML = `

                <span>
                    --
                </span>

                <span>
                    No tienes citas programadas
                </span>

                <span>
                    --
                </span>

                <span>
                    --
                </span>

                <span>
                    --
                </span>

                <span>
                    --
                </span>

            `;


            tablaProgramadas.appendChild(
                fila
            );


            return;
        }


        programadas.forEach(
            function (cita) {

                tablaProgramadas.appendChild(
                    crearFilaCita(
                        cita,
                        true
                    )
                );

            }
        );

    }


    // ==========================================
    // MOSTRAR HISTORIAL
    // ==========================================
    function mostrarHistorial() {

        const tablas =
            document.querySelectorAll(
                ".appointments-table"
            );


        if (tablas.length < 2) {
            return;
        }


        const tablaHistorial =
            tablas[1];


        const encabezado =
            tablaHistorial.querySelector(
                ".table-header"
            );


        tablaHistorial.innerHTML = "";


        if (encabezado) {

            tablaHistorial.appendChild(
                encabezado
            );

        }


        const historial =
            citasPaciente
                .filter(
                    function (cita) {

                        const fecha =
                            convertirFecha(
                                cita.fecha
                            );


                        const estado =
                            normalizarEstado(
                                cita.estado
                            );


                        return (

                            (
                                fecha &&
                                inicioDelDia(fecha) <
                                hoy
                            )

                            ||

                            estado ===
                            "atendida"

                            ||

                            estado ===
                            "atendido"

                            ||

                            estado ===
                            "cancelada"

                            ||

                            estado ===
                            "cancelado"

                        );

                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            convertirFecha(
                                b.fecha
                            ) -
                            convertirFecha(
                                a.fecha
                            )
                        );

                    }
                );


        if (
            historial.length === 0
        ) {

            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "table-row";


            fila.innerHTML = `

                <span>
                    --
                </span>

                <span>
                    No tienes historial de citas
                </span>

                <span>
                    --
                </span>

                <span>
                    --
                </span>

                <span>
                    --
                </span>

            `;


            tablaHistorial.appendChild(
                fila
            );


            return;
        }


        historial.forEach(
            function (cita) {

                tablaHistorial.appendChild(
                    crearFilaCita(
                        cita,
                        false
                    )
                );

            }
        );

    }


    // ==========================================
    // MODAL VER CITA
    // ==========================================
    function verCita(
        id
    ) {

        const cita =
            citas.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(id)
                    );

                }
            );


        if (!cita) {
            return;
        }


        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "modal-cita-paciente";


        modal.innerHTML = `

            <div class="modal-cita-contenido">

                <div class="modal-cita-header">

                    <div>

                        <h2>
                            Detalle de la cita
                        </h2>

                        <p>
                            Información de tu consulta odontológica.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="modal-cita-cerrar"
                    >
                        ×
                    </button>

                </div>


                <div class="datos-cita">

                    <div class="dato-cita">

                        <strong>
                            Fecha
                        </strong>

                        <span>
                            ${formatearFecha(
                                cita.fecha
                            )}
                        </span>

                    </div>


                    <div class="dato-cita">

                        <strong>
                            Hora
                        </strong>

                        <span>
                            ${
                                cita.hora ||
                                "Por confirmar"
                            }
                        </span>

                    </div>


                    <div class="dato-cita">

                        <strong>
                            Servicio
                        </strong>

                        <span>
                            ${
                                cita.servicio ||
                                "Consulta odontológica"
                            }
                        </span>

                    </div>


                    <div class="dato-cita">

                        <strong>
                            Odontólogo
                        </strong>

                        <span>
                            ${
                                cita.odontologo ||
                                "Por asignar"
                            }
                        </span>

                    </div>


                    <div class="dato-cita">

                        <strong>
                            Estado
                        </strong>

                        <span>
                            <span
                                class="status ${obtenerClaseEstado(
                                    cita.estado
                                )}"
                            >
                                ${
                                    cita.estado ||
                                    "Pendiente"
                                }
                            </span>
                        </span>

                    </div>

                </div>


                <div class="modal-cita-acciones">

                    <button
                        type="button"
                        class="btn btn-primary modal-cita-cerrar"
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        modal
            .querySelectorAll(
                ".modal-cita-cerrar"
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


    // ==========================================
    // CANCELAR CITA
    // ==========================================
    function cancelarCita(
        id
    ) {

        const indice =
            citas.findIndex(
                function (cita) {

                    return (
                        String(cita.id) ===
                        String(id)
                    );

                }
            );


        if (indice === -1) {
            return;
        }


        const cita =
            citas[indice];


        if (
            !puedeCancelar(
                cita
            )
        ) {

            alert(
                "Esta cita no puede ser cancelada."
            );

            return;
        }


        const confirmar =
            confirm(
                "¿Está seguro de cancelar esta cita?"
            );


        if (!confirmar) {
            return;
        }


        citas[indice].estado =
            "Cancelada";


        localStorage.setItem(
            "citas",
            JSON.stringify(
                citas
            )
        );


        // Volver a cargar las citas
        citasPaciente =
            obtenerCitasPaciente();


        mostrarCitasProgramadas();

        mostrarHistorial();

        mostrarProximaCita();


        alert(
            "La cita fue cancelada correctamente."
        );

    }


    // ==========================================
    // EVENTOS
    // ==========================================
    function agregarEventosCitas() {

        const botonesVer =
            document.querySelectorAll(
                ".btn-ver-cita"
            );


        botonesVer.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        verCita(
                            boton.dataset.id
                        );

                    }
                );

            }
        );


        const botonesCancelar =
            document.querySelectorAll(
                ".btn-cancelar-cita"
            );


        botonesCancelar.forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        cancelarCita(
                            boton.dataset.id
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // OBSERVAR CAMBIOS EN LAS TABLAS
    // ==========================================
    function actualizarEventos() {

        agregarEventosCitas();

    }


    // ==========================================
    // INICIALIZAR
    // ==========================================
    mostrarProximaCita();

    mostrarCitasProgramadas();

    mostrarHistorial();

    actualizarEventos();