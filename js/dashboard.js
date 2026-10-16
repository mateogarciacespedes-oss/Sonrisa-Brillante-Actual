// ==========================================
// DASHBOARD ADMINISTRADOR - DATOS REALES
// ==========================================

// ==========================================
// OBTENER DATOS DE LOCALSTORAGE
// ==========================================

function obtenerDatos(clave) {

    const datos = JSON.parse(
        localStorage.getItem(clave)
    );

    if (!datos || !Array.isArray(datos)) {
        return [];
    }

    return datos;
}


// ==========================================
// CARGAR DATOS
// ==========================================

const pacientes =
    obtenerDatos("pacientes");

const usuarios =
    obtenerDatos("usuarios");

const citas =
    obtenerDatos("citas");

const tratamientos =
    obtenerDatos("tratamientos");


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
// TARJETAS DEL DASHBOARD
// ==========================================

const tarjetas =
    document.querySelectorAll(
        ".stats-grid .stat-card"
    );


// ==========================================
// PACIENTES REGISTRADOS
// ==========================================

if (tarjetas[0]) {

    const numeroPacientes =
        tarjetas[0].querySelector("h3");

    if (numeroPacientes) {

        numeroPacientes.textContent =
            pacientes.length;

    }

}


// ==========================================
// CITAS PROGRAMADAS
// ==========================================

if (tarjetas[1]) {

    const numeroCitas =
        tarjetas[1].querySelector("h3");

    const citasProgramadas =
        citas.filter(function (cita) {

            const estado =
                String(
                    cita.estado || ""
                ).trim().toLowerCase();

            return estado !== "cancelada";

        });

    if (numeroCitas) {

        numeroCitas.textContent =
            citasProgramadas.length;

    }

}


// ==========================================
// ODONTÓLOGOS ACTIVOS
// ==========================================

if (tarjetas[2]) {

    const numeroOdontologos =
        tarjetas[2].querySelector("h3");

    const odontologosActivos =
        usuarios.filter(function (usuario) {

            const rol =
                String(
                    usuario.rol || ""
                ).trim().toLowerCase();

            const estado =
                String(
                    usuario.estado || ""
                ).trim().toLowerCase();

            return (
                rol === "odontólogo" &&
                estado === "activo"
            );

        });

    if (numeroOdontologos) {

        numeroOdontologos.textContent =
            odontologosActivos.length;

    }

}


// ==========================================
// TRATAMIENTOS
// ==========================================

if (tarjetas[3]) {

    const numeroTratamientos =
        tarjetas[3].querySelector("h3");

    if (numeroTratamientos) {

        numeroTratamientos.textContent =
            tratamientos.length;

    }

}


// ==========================================
// TABLA DE PRÓXIMAS CITAS
// ==========================================

const tablaCitas =
    document.querySelector(
        ".appointments-table"
    );


// ==========================================
// CONVERTIR CUALQUIER FORMATO DE FECHA
// ==========================================

function convertirFecha(fecha) {

    if (!fecha) {

        return "";

    }

    fecha = String(fecha).trim();


    // ------------------------------------------
    // FORMATO YYYY-MM-DD
    // ------------------------------------------

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {

        return fecha;

    }


    // ------------------------------------------
    // FORMATO DD/MM/YYYY
    // ------------------------------------------

    if (
        /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)
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


// ==========================================
// OBTENER FECHA ACTUAL
// ==========================================

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


// ==========================================
// NORMALIZAR ESTADO
// ==========================================

function normalizarEstado(estado) {

    return String(
        estado || ""
    )
        .trim()
        .toLowerCase();

}


// ==========================================
// CLASE CSS SEGÚN ESTADO
// ==========================================

function obtenerClaseEstado(estado) {

    const estadoNormalizado =
        normalizarEstado(estado);


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
        "cancelada"
    ) {

        return "cancelled";

    }


    return "";

}


// ==========================================
// MOSTRAR PRÓXIMAS CITAS
// ==========================================

function mostrarProximasCitas() {

    if (!tablaCitas) {

        return;

    }

    const fechaActual =
        obtenerFechaActual();


    // ------------------------------------------
    // OBTENER CITAS DE HOY
    // ------------------------------------------

    const citasHoy =
        citas.filter(function (cita) {

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


    // ------------------------------------------
    // ORDENAR POR HORA
    // ------------------------------------------

    citasHoy.sort(function (a, b) {

        const horaA =
            String(a.hora || "");

        const horaB =
            String(b.hora || "");

        return horaA.localeCompare(
            horaB
        );

    });


    // ------------------------------------------
    // ENCABEZADO
    // ------------------------------------------

    tablaCitas.innerHTML = `

        <div class="table-row table-header">

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

        </div>

    `;


    // ------------------------------------------
    // NO HAY CITAS
    // ------------------------------------------

    if (citasHoy.length === 0) {

        const fila =
            document.createElement(
                "div"
            );

        fila.className =
            "table-row fila-sin-citas";


        fila.innerHTML = `

            <span
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                "
            >
                No hay citas programadas para hoy.
            </span>

        `;


        tablaCitas.appendChild(
            fila
        );

        return;

    }


    // ------------------------------------------
    // MOSTRAR CITAS REALES
    // ------------------------------------------

    citasHoy.forEach(function (cita) {

        const fila =
            document.createElement(
                "div"
            );

        fila.className =
            "table-row";


        const claseEstado =
            obtenerClaseEstado(
                cita.estado
            );


        fila.innerHTML = `

            <span>
                ${cita.paciente || "Sin paciente"}
            </span>

            <span>
                ${cita.odontologo || "Sin asignar"}
            </span>

            <span>
                ${cita.hora || "--:--"}
            </span>

            <span class="status ${claseEstado}">
                ${cita.estado || "Sin estado"}
            </span>

        `;


        tablaCitas.appendChild(
            fila
        );

    });

}


// ==========================================
// BOTÓN "VER TODAS"
// ==========================================

const botonVerTodas =
    document.querySelector(
        ".btn-principal"
    );


if (botonVerTodas) {

    botonVerTodas.addEventListener(
        "click",
        function () {

            window.location.href =
                "citas.html";

        }
    );

}


// ==========================================
// INICIAR DASHBOARD
// ==========================================

mostrarProximasCitas();



