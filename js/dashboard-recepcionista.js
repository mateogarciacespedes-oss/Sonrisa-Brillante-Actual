// ==========================================
// DASHBOARD RECEPCIONISTA
// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================
const botonNuevaCita =
    document.querySelector(".page-heading .btn-primary");

const nombreUsuario =
    document.getElementById("nombreUsuario");

const tarjetas =
    document.querySelectorAll(".dashboard-card");

const tablaCitas =
    document.querySelector(".appointments-table");


    // ==========================================
    // OBTENER DATOS DE LOCALSTORAGE
    // ==========================================
    function obtenerDatos(clave) {

        const datos =
            JSON.parse(
                localStorage.getItem(clave)
            );

        if (!Array.isArray(datos)) {
            return [];
        }

        return datos;
    }


    // ==========================================
    // MOSTRAR USUARIO ACTUAL
    // ==========================================
    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );

    if (nombreUsuario && usuarioSesion) {

        nombreUsuario.textContent =
            usuarioSesion.nombre || "Recepcionista";

    }


    // ==========================================
    // OBTENER DATOS
    // ==========================================
    let pacientes =
        obtenerDatos("pacientes");

    let citas =
        obtenerDatos("citas");


    // ==========================================
    // CONVERTIR FECHA
    // Soporta:
    // YYYY-MM-DD
    // DD/MM/YYYY
    // ==========================================
    function convertirFecha(fecha) {

        if (!fecha) {
            return "";
        }

        fecha =
            String(fecha).trim();


        // DD/MM/YYYY

        if (fecha.includes("/")) {

            const partes =
                fecha.split("/");

            if (partes.length === 3) {

                const dia =
                    partes[0].padStart(2, "0");

                const mes =
                    partes[1].padStart(2, "0");

                const anio =
                    partes[2];

                return `${anio}-${mes}-${dia}`;
            }
        }


        // YYYY-MM-DD
        if (fecha.includes("-")) {

            const partes =
                fecha.split("-");

            if (
                partes.length === 3 &&
                partes[0].length === 4
            ) {

                return (
                    partes[0] +
                    "-" +
                    partes[1].padStart(2, "0") +
                    "-" +
                    partes[2].padStart(2, "0")
                );
            }
        }


        return fecha;
    }


    // ==========================================
    // FECHA ACTUAL
    // ==========================================
    function obtenerFechaActual() {

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

        return `${anio}-${mes}-${dia}`;
    }


    // ==========================================
    // OBTENER ESTADO
    // ==========================================
    function obtenerEstado(cita) {

        if (!cita || !cita.estado) {
            return "";
        }

        return String(
            cita.estado
        )
            .trim()
            .toLowerCase();
    }


    // ==========================================
    // VERIFICAR CANCELACIÓN
    // ==========================================
    function esCitaCancelada(cita) {

        const estado =
            obtenerEstado(cita);

        return (
            estado === "cancelada" ||
            estado === "cancelado"
        );
    }


    // ==========================================
    // VERIFICAR PENDIENTE
    // ==========================================
    function esCitaPendiente(cita) {

        const estado =
            obtenerEstado(cita);

        return (
            estado === "pendiente" ||
            estado === "pendientes"
        );
    }


    // ==========================================
    // VERIFICAR CONFIRMADA
    // ==========================================
    function esCitaConfirmada(cita) {

        const estado =
            obtenerEstado(cita);

        return (
            estado === "confirmada" ||
            estado === "confirmado"
        );
    }


    // ==========================================
    // OBTENER CITAS DE HOY
    // ==========================================
    function obtenerCitasDeHoy() {

        const hoy =
            obtenerFechaActual();

        return citas.filter(function (cita) {

            return (
                convertirFecha(cita.fecha) ===
                hoy
            );

        });
    }


    // ==========================================
    // OBTENER PRÓXIMAS CITAS
    // Incluye hoy y fechas futuras
    // No incluye citas canceladas
    // ==========================================
    function obtenerProximasCitas() {

        const hoy =
            obtenerFechaActual();

        return citas
            .filter(function (cita) {

                const fechaCita =
                    convertirFecha(cita.fecha);

                return (
                    fechaCita &&
                    fechaCita >= hoy &&
                    !esCitaCancelada(cita)
                );

            })
            .sort(function (a, b) {

                const fechaA =
                    convertirFecha(a.fecha);

                const fechaB =
                    convertirFecha(b.fecha);


                // Primero por fecha
                if (fechaA !== fechaB) {

                    return fechaA.localeCompare(
                        fechaB
                    );

                }


                // Después por hora
                return String(
                    a.hora || ""
                ).localeCompare(
                    String(b.hora || "")
                );

            });
    }


    // ==========================================
    // OBTENER NOMBRE DEL ODONTÓLOGO
    // ==========================================
    function obtenerNombreOdontologo(cita) {

        if (cita.odontologo) {

            return cita.odontologo;

        }

        if (cita.nombreOdontologo) {

            return cita.nombreOdontologo;

        }

        if (cita.doctor) {

            return cita.doctor;

        }

        return "Sin asignar";
    }


    // ==========================================
    // OBTENER CLASE DEL ESTADO
    // ==========================================
    function obtenerClaseEstado(cita) {

        const estado =
            obtenerEstado(cita);


        if (
            estado === "confirmada" ||
            estado === "confirmado"
        ) {

            return "confirmed";
        }


        if (
            estado === "pendiente" ||
            estado === "pendientes"
        ) {

            return "pending";
        }


        if (
            estado === "cancelada" ||
            estado === "cancelado"
        ) {

            return "cancelled";
        }


        return "";
    }


    // ==========================================
    // ESCAPAR TEXTO
    // ==========================================
    function escaparTexto(texto) {

        if (
            texto === null ||
            texto === undefined
        ) {

            return "";
        }

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // ACTUALIZAR TARJETAS
    // ==========================================
    function actualizarTarjetas() {

        pacientes =
            obtenerDatos("pacientes");

        citas =
            obtenerDatos("citas");


        const citasHoy =
            obtenerCitasDeHoy();


        const citasPendientes =
            citasHoy.filter(function (cita) {

                return (
                    !esCitaCancelada(cita) &&
                    esCitaPendiente(cita)
                );

            });


        const citasConfirmadas =
            citasHoy.filter(function (cita) {

                return (
                    !esCitaCancelada(cita) &&
                    esCitaConfirmada(cita)
                );

            });


        // PACIENTES
        if (tarjetas[0]) {

            const numero =
                tarjetas[0].querySelector("h3");

            if (numero) {

                numero.textContent =
                    pacientes.length;

            }
        }


        // CITAS DE HOY
        if (tarjetas[1]) {

            const numero =
                tarjetas[1].querySelector("h3");

            if (numero) {

                numero.textContent =
                    citasHoy.length;

            }
        }


        // CITAS PENDIENTES DE HOY
        if (tarjetas[2]) {

            const numero =
                tarjetas[2].querySelector("h3");

            if (numero) {

                numero.textContent =
                    citasPendientes.length;

            }
        }


        // CITAS CONFIRMADAS DE HOY
        if (tarjetas[3]) {

            const numero =
                tarjetas[3].querySelector("h3");

            if (numero) {

                numero.textContent =
                    citasConfirmadas.length;

            }
        }
    }


    // ==========================================
    // MOSTRAR PRÓXIMAS CITAS
    // ==========================================
    function mostrarProximasCitas() {

        if (!tablaCitas) {
            return;
        }


        const proximasCitas =
            obtenerProximasCitas();


        // ======================================
        // LIMPIAR TABLA
        // ======================================
        tablaCitas.innerHTML = "";


        // ======================================
        // ENCABEZADO
        // ======================================
        const encabezado =
            document.createElement("div");

        encabezado.className =
            "table-row table-header";

        encabezado.innerHTML = `

            <span>
                Paciente
            </span>

            <span>
                Odontólogo
            </span>

            <span>
                Hora
            </span>

            <span>
                Estado
            </span>

        `;

        tablaCitas.appendChild(encabezado);


        // ======================================
        // NO HAY CITAS
        // ======================================
        if (proximasCitas.length === 0) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row";

            fila.innerHTML = `

                <span>
                    No hay citas programadas
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

            tablaCitas.appendChild(fila);

            return;
        }


        // ======================================
        // MOSTRAR MÁXIMO 4
        // ======================================
        const citasMostrar =
            proximasCitas.slice(0, 4);


        citasMostrar.forEach(function (cita) {

            const fila =
                document.createElement("div");

            fila.className =
                "table-row";


            const paciente =
                escaparTexto(
                    cita.paciente ||
                    cita.nombrePaciente ||
                    "Sin paciente"
                );


            const odontologo =
                escaparTexto(
                    obtenerNombreOdontologo(cita)
                );


            const hora =
                escaparTexto(
                    cita.hora ||
                    "Sin hora"
                );


            const estado =
                escaparTexto(
                    cita.estado ||
                    "Sin estado"
                );


            const claseEstado =
                obtenerClaseEstado(cita);


            fila.innerHTML = `

                <span>
                    ${paciente}
                </span>

                <span>
                    ${odontologo}
                </span>

                <span>
                    ${hora}
                </span>

                <span class="status ${claseEstado}">
                    ${estado}
                </span>

            `;


            tablaCitas.appendChild(fila);

        });
}


// ==========================================
// BOTÓN NUEVA CITA
// ==========================================
if (botonNuevaCita) {

    botonNuevaCita.addEventListener(
        "click",
        function () {

            window.location.href =
                "citas-recepcionista.html";

        }
    );
}


// ==========================================
// CARGA INICIAL
// ==========================================
actualizarTarjetas();

mostrarProximasCitas();














