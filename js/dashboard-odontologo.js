document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // VALIDAR SESIÓN
    // ========================================
    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );

    if (!usuarioSesion) {

        window.location.href =
            "../index.html";

        return;

    }


    // ========================================
    // MOSTRAR USUARIO
    // ========================================
    const nombreUsuario =
        document.getElementById(
            "nombreUsuario"
        );

    if (nombreUsuario) {

        nombreUsuario.textContent =
            usuarioSesion.nombre;

    }


    // ========================================
    // OBTENER DATOS
    // ========================================
    const citas =
        JSON.parse(
            localStorage.getItem("citas")
        ) || [];

    const pacientes =
        JSON.parse(
            localStorage.getItem("pacientes")
        ) || [];

    const tratamientos =
        JSON.parse(
            localStorage.getItem("tratamientos")
        ) || [];


    // ========================================
    // DATOS DEL ODONTÓLOGO ACTUAL
    // ========================================
    const nombreOdontologo =
        String(
            usuarioSesion.nombre || ""
        )
        .trim()
        .toLowerCase();


    const documentoOdontologo =
        String(
            usuarioSesion.documento || ""
        )
        .trim();


    // ========================================
    // COMPARAR ODONTÓLOGO
    // ========================================
    function esMiCita(cita) {

        const nombreCita =
            String(
                cita.odontologo || ""
            )
            .trim()
            .toLowerCase();


        const documentoCita =
            String(
                cita.odontologoDocumento || ""
            )
            .trim();


        // Primero intentamos por documento
        if (
            documentoOdontologo &&
            documentoCita
        ) {

            return (
                documentoOdontologo ===
                documentoCita
            );

        }


        // Si no existe documento, comparamos por nombre

        return (
            nombreOdontologo &&
            nombreCita ===
            nombreOdontologo
        );

    }


    // ========================================
    // MIS CITAS
    // ========================================
    const misCitas =
        citas.filter(function (cita) {

            return esMiCita(cita);

        });


    // ========================================
    // FECHA ACTUAL
    // ========================================
    function obtenerFechaActual() {

        const hoy =
            new Date();


        const año =
            hoy.getFullYear();


        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");


        return (
            año +
            "-" +
            mes +
            "-" +
            dia
        );

    }


    // ========================================
    // CONVERTIR FECHA
    // ========================================
    function convertirFecha(fecha) {

        if (!fecha) {

            return "";

        }


        fecha =
            String(fecha).trim();


        // YYYY-MM-DD
        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                fecha
            )
        ) {

            return fecha;

        }


        // DD/MM/YYYY
        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(
                fecha
            )
        ) {

            const partes =
                fecha.split("/");


            return (
                partes[2] +
                "-" +
                partes[1] +
                "-" +
                partes[0]
            );

        }


        return "";

    }


    // ========================================
    // NORMALIZAR ESTADO
    // ========================================
    function normalizarEstado(estado) {

        return String(
            estado || ""
        )
        .trim()
        .toLowerCase();

    }


    // ========================================
    // TARJETAS
    // ========================================
    const tarjetas =
        document.querySelectorAll(
            ".dashboard-cards .dashboard-card"
        );


    // ========================================
    // CITAS DE HOY
    // ========================================
    const fechaActual =
        obtenerFechaActual();


    const citasHoy =
        misCitas.filter(function (cita) {

            const fechaCita =
                convertirFecha(
                    cita.fecha
                );


            const estado =
                normalizarEstado(
                    cita.estado
                );


            return (
                fechaCita === fechaActual &&
                estado !== "cancelada"
            );

        });


    if (tarjetas[0]) {

        const numero =
            tarjetas[0].querySelector(
                "h3"
            );

        if (numero) {

            numero.textContent =
                citasHoy.length;

        }

    }


    // ========================================
    // PACIENTES ATENDIDOS
    // ========================================
    const pacientesAtendidos =
        new Set();


    misCitas.forEach(function (cita) {

        const estado =
            normalizarEstado(
                cita.estado
            );


        /*
          Consideramos atendida una cita
          cuando su estado indica que ya
          fue realizada/atendida.
         */

        if (
            estado === "atendida" ||
            estado === "atendido" ||
            estado === "realizada" ||
            estado === "realizado" ||
            estado === "completada" ||
            estado === "completado"
        ) {

            if (cita.pacienteDocumento) {

                pacientesAtendidos.add(
                    String(
                        cita.pacienteDocumento
                    )
                );

            } else if (cita.paciente) {

                pacientesAtendidos.add(
                    String(
                        cita.paciente
                    )
                    .trim()
                    .toLowerCase()
                );

            }

        }

    });


    if (tarjetas[1]) {

        const numero =
            tarjetas[1].querySelector(
                "h3"
            );

        if (numero) {

            numero.textContent =
                pacientesAtendidos.size;

        }

    }


    // ========================================
    // TRATAMIENTOS DEL ODONTÓLOGO
    // ========================================
    const misTratamientos =
        tratamientos.filter(
            function (tratamiento) {

                const nombreTratamiento =
                    String(
                        tratamiento.odontologo ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const documentoTratamiento =
                    String(
                        tratamiento.odontologoDocumento ||
                        ""
                    )
                    .trim();


                if (
                    documentoOdontologo &&
                    documentoTratamiento
                ) {

                    return (
                        documentoTratamiento ===
                        documentoOdontologo
                    );

                }


                return (
                    nombreTratamiento ===
                    nombreOdontologo
                );

            }
        );


    const tratamientosActivos =
        misTratamientos.filter(
            function (tratamiento) {

                const estado =
                    normalizarEstado(
                        tratamiento.estado
                    );


                return (
                    estado === "activo" ||
                    estado === "en proceso" ||
                    estado === "pendiente"
                );

            }
        );


    if (tarjetas[2]) {

        const numero =
            tarjetas[2].querySelector(
                "h3"
            );

        if (numero) {

            numero.textContent =
                tratamientosActivos.length;

        }

    }


    // ========================================
    // CITAS PENDIENTES
    // ========================================
    const citasPendientes =
        misCitas.filter(
            function (cita) {

                return (
                    normalizarEstado(
                        cita.estado
                    ) === "pendiente"
                );

            }
        );


    if (tarjetas[3]) {

        const numero =
            tarjetas[3].querySelector(
                "h3"
            );

        if (numero) {

            numero.textContent =
                citasPendientes.length;

        }

    }


    // ========================================
    // TABLA DE PRÓXIMAS CITAS
    // ========================================
    const tabla =
        document.querySelector(
            ".appointments-table"
        );


    if (!tabla) {

        return;

    }


    // ========================================
    // CITAS DE HOY
    // ========================================
    const citasParaMostrar =
        misCitas.filter(
            function (cita) {

                const fechaCita =
                    convertirFecha(
                        cita.fecha
                    );


                const estado =
                    normalizarEstado(
                        cita.estado
                    );


                return (
                    fechaCita === fechaActual &&
                    estado !== "cancelada"
                );

            }
        );


    // ========================================
    // ORDENAR POR HORA
    // ========================================
    citasParaMostrar.sort(
        function (a, b) {

            return String(
                a.hora || ""
            ).localeCompare(
                String(
                    b.hora || ""
                )
            );

        }
    );


    // ========================================
    // ENCABEZADO
    // ========================================
    tabla.innerHTML = `

        <div class="table-row table-header">

            <span>
                Paciente
            </span>

            <span>
                Hora
            </span>

            <span>
                Motivo
            </span>

            <span>
                Estado
            </span>

        </div>

    `;


    // ========================================
    // SI NO HAY CITAS
    // ========================================
    if (
        citasParaMostrar.length === 0
    ) {

        const fila =
            document.createElement(
                "div"
            );


        fila.className =
            "table-row";


        fila.innerHTML = `

            <span
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                "
            >
                No tienes citas programadas para hoy.
            </span>

        `;


        tabla.appendChild(
            fila
        );


        return;

    }


    // ========================================
    // MOSTRAR CITAS
    // ========================================
    citasParaMostrar.forEach(
        function (cita) {

            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "table-row";


            const estado =
                normalizarEstado(
                    cita.estado
                );


            let claseEstado =
                "";


            if (
                estado === "confirmada"
            ) {

                claseEstado =
                    "confirmed";

            } else if (
                estado === "pendiente"
            ) {

                claseEstado =
                    "pending";

            } else if (
                estado === "cancelada"
            ) {

                claseEstado =
                    "cancelled";

            }


            fila.innerHTML = `

                <span>
                    ${cita.paciente || "Sin paciente"}
                </span>

                <span>
                    ${cita.hora || "--:--"}
                </span>

                <span>
                    ${cita.motivo ||
                        cita.servicio ||
                        "Sin motivo"}
                </span>

                <span class="status ${claseEstado}">
                    ${cita.estado || "Sin estado"}
                </span>

            `;


            tabla.appendChild(
                fila
            );

        }
    );

});











