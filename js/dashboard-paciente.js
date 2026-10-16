// ==========================================
// DASHBOARD PACIENTE
// ==========================================
// DATOS DE SESIÓN
// ==========================================
const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuarioSesion")
    );


// ==========================================
// DATOS DEL SISTEMA
// ==========================================
const usuarios =
    JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

const pacientes =
    JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

const citas =
    JSON.parse(
        localStorage.getItem("citas")
    ) || [];


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================
const nombreUsuario =
    document.getElementById(
        "nombreUsuario"
    );

const tituloBienvenida =
    document.querySelector(
        ".page-heading h2"
    );


// ==========================================
// MOSTRAR NOMBRE DEL PACIENTE
// ==========================================
if (
    usuarioSesion &&
    usuarioSesion.nombre
) {

    if (nombreUsuario) {

        nombreUsuario.textContent =
            usuarioSesion.nombre;

    }


    if (tituloBienvenida) {

        tituloBienvenida.textContent =
            `Bienvenido, ${usuarioSesion.nombre}`;

    }

}


// ==========================================
// IDENTIFICAR PACIENTE
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


    /*
        Por seguridad, si todavía no existe
        el paciente en la colección de pacientes,
        también intentamos encontrarlo por
        correo electrónico.
    */

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
let citasPaciente = [];


if (pacienteActual) {

    citasPaciente =
        citas.filter(
            function (cita) {

                // Nueva estructura:
                // pacienteDocumento

                if (
                    cita.pacienteDocumento &&
                    cita.pacienteDocumento ===
                    pacienteActual.documento
                ) {
                    return true;
                }


                // Compatibilidad con citas antiguas
                // que solamente tengan el nombre.

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
// FECHA ACTUAL
// ==========================================
const hoy =
    new Date();


// ==========================================
// CONVERTIR FECHA DE CITA
// ==========================================
function convertirFecha(
    fecha
) {

    if (!fecha) {
        return null;
    }


    /*
        La aplicación puede guardar fechas
        en diferentes formatos.

        Intentamos primero YYYY-MM-DD.
    */

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


    /*
        También soportamos DD/MM/YYYY.
    */
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
// COMPARAR SOLAMENTE FECHAS
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


// ==========================================
// OBTENER CITAS FUTURAS
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


                return (
                    inicioDelDia(
                        item.fecha
                    ) >=
                    inicioDelDia(
                        hoy
                    )
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


// ==========================================
// PRÓXIMA CITA
// ==========================================

const proximaCita =
    citasFuturas.length > 0
        ? citasFuturas[0].cita
        : null;


// ==========================================
// TARJETAS DEL DASHBOARD
// ==========================================

const tarjetas =
    document.querySelectorAll(
        ".dashboard-card"
    );


// ==========================================
// TARJETA: PRÓXIMA CITA
// ==========================================

if (tarjetas.length >= 1) {

    const tarjeta =
        tarjetas[0];

    const titulo =
        tarjeta.querySelector(
            "h3"
        );

    const detalle =
        tarjeta.querySelector(
            "small"
        );


    if (proximaCita) {

        const fecha =
            convertirFecha(
                proximaCita.fecha
            );


        if (titulo && fecha) {

            titulo.textContent =
                fecha.toLocaleDateString(
                    "es-CO",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                )
                .replace(
                    ".",
                    ""
                );

        }


        if (
            detalle &&
            proximaCita.hora
        ) {

            detalle.textContent =
                proximaCita.hora;

        }

    } else {

        if (titulo) {

            titulo.textContent =
                "--";

        }


        if (detalle) {

            detalle.textContent =
                "No tienes citas próximas";

        }

    }

}


// ==========================================
// CITAS PENDIENTES
// ==========================================

const citasPendientes =
    citasPaciente.filter(
        function (cita) {

            const fecha =
                convertirFecha(
                    cita.fecha
                );


            if (!fecha) {
                return false;
            }


            const estado =
                cita.estado
                    ? cita.estado
                        .toLowerCase()
                        .trim()
                    : "";


            /*
                Consideramos pendientes las citas
                futuras que no estén canceladas
                ni atendidas.
            */

            return (
                inicioDelDia(fecha) >=
                inicioDelDia(hoy)
                &&
                estado !== "cancelada"
                &&
                estado !== "cancelado"
                &&
                estado !== "atendida"
                &&
                estado !== "atendido"
            );

        }
    );


if (tarjetas.length >= 2) {

    const titulo =
        tarjetas[1].querySelector(
            "h3"
        );


    if (titulo) {

        titulo.textContent =
            citasPendientes.length;

    }

}


// ==========================================
// TRATAMIENTOS ACTIVOS
// ==========================================

/*
    Todavía no tenemos una estructura definitiva
    de tratamientos para Paciente.

    Por eso no inventamos datos.

    Si existe localStorage "tratamientos",
    intentamos utilizarlo.
*/

const tratamientos =
    JSON.parse(
        localStorage.getItem("tratamientos")
    ) || [];


let tratamientosPaciente = [];


if (pacienteActual) {

    tratamientosPaciente =
        tratamientos.filter(
            function (tratamiento) {

                if (
                    tratamiento.pacienteDocumento &&
                    tratamiento.pacienteDocumento ===
                    pacienteActual.documento
                ) {
                    return true;
                }


                if (
                    tratamiento.paciente &&
                    tratamiento.paciente ===
                    pacienteActual.nombre
                ) {
                    return true;
                }


                return false;

            }
        );

}


const tratamientosActivos =
    tratamientosPaciente.filter(
        function (tratamiento) {

            const estado =
                tratamiento.estado
                    ? tratamiento.estado
                        .toLowerCase()
                        .trim()
                    : "";


            return (
                estado === "activo" ||
                estado === "en curso" ||
                estado === "en progreso"
            );

        }
    );


if (tarjetas.length >= 3) {

    const titulo =
        tarjetas[2].querySelector(
            "h3"
        );


    if (titulo) {

        titulo.textContent =
            tratamientosActivos.length;

    }

}


// ==========================================
// CONSULTAS REALIZADAS
// ==========================================

const consultasRealizadas =
    citasPaciente.filter(
        function (cita) {

            const estado =
                cita.estado
                    ? cita.estado
                        .toLowerCase()
                        .trim()
                    : "";


            return (
                estado === "atendida" ||
                estado === "atendido" ||
                estado === "realizada" ||
                estado === "realizado" ||
                estado === "finalizada" ||
                estado === "finalizado"
            );

        }
    );


if (tarjetas.length >= 4) {

    const titulo =
        tarjetas[3].querySelector(
            "h3"
        );


    if (titulo) {

        titulo.textContent =
            consultasRealizadas.length;

    }

}


// ==========================================
// INFORMACIÓN DE LA PRÓXIMA CITA
// ==========================================
const appointmentInfo =
    document.querySelector(
        ".appointment-info"
    );


if (appointmentInfo) {

    const elementos =
        appointmentInfo.querySelectorAll(
            ".info-item"
        );


    // ======================================
    // FECHA
    // ======================================
    if (elementos.length >= 1) {

        const elementoFecha =
            elementos[0].querySelector(
                "p"
            );


        if (
            elementoFecha &&
            proximaCita
        ) {

            const fecha =
                convertirFecha(
                    proximaCita.fecha
                );


            if (fecha) {

                elementoFecha.textContent =
                    fecha.toLocaleDateString(
                        "es-CO",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );

            }

        } else if (elementoFecha) {

            elementoFecha.textContent =
                "No tienes una próxima cita";

        }

    }


    // ======================================
    // HORA
    // ======================================
    if (elementos.length >= 2) {

        const elementoHora =
            elementos[1].querySelector(
                "p"
            );


        if (
            elementoHora &&
            proximaCita
        ) {

            elementoHora.textContent =
                proximaCita.hora ||
                "Por confirmar";

        } else if (elementoHora) {

            elementoHora.textContent =
                "--";

        }

    }


    // ======================================
    // ODONTÓLOGO
    // ======================================
    if (elementos.length >= 3) {

        const elementoOdontologo =
            elementos[2].querySelector(
                "p"
            );


        if (
            elementoOdontologo &&
            proximaCita
        ) {

            elementoOdontologo.textContent =
                proximaCita.odontologo ||
                "Por asignar";

        } else if (elementoOdontologo) {

            elementoOdontologo.textContent =
                "--";

        }

    }


    // ======================================
    // SERVICIO
    // ======================================
    if (elementos.length >= 4) {

        const elementoServicio =
            elementos[3].querySelector(
                "p"
            );


        if (
            elementoServicio &&
            proximaCita
        ) {

            elementoServicio.textContent =
                proximaCita.servicio ||
                "Consulta odontológica";

        } else if (elementoServicio) {

            elementoServicio.textContent =
                "--";

        }

    }


    // ======================================
    // ESTADO
    // ======================================
    const estadoElemento =
        appointmentInfo.querySelector(
            ".info-status .status"
        );


    if (
        estadoElemento &&
        proximaCita
    ) {

        estadoElemento.textContent =
            proximaCita.estado ||
            "Pendiente";

    } else if (estadoElemento) {

        estadoElemento.textContent =
            "Sin cita";

    }

}


// ==========================================
// PROTEGER EL DASHBOARD
// ==========================================

/*
  Si no existe sesión de usuario regresamos al login.
*/

if (!usuarioSesion) {

    window.location.href =
        "../index.html";

}