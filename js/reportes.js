
// ==========================================
// REPORTES - DATOS DINÁMICOS
// ==========================================
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const tipoReporte = document.getElementById("tipoReporte");

const botonConsultar = document.querySelector(".filter-btn");
const botonGenerar = document.querySelector(".page-heading .btn-principal");

let pacientes = obtenerDatos("pacientes");
let citas = obtenerDatos("citas");
let tratamientos = obtenerDatos("tratamientos");
let servicios = obtenerDatos("servicios");

let reporteActual = null;


    // ==========================================
    // CARGAR DATOS
    // ==========================================
    function obtenerDatos(clave) {

        try {
            const datos = JSON.parse(localStorage.getItem(clave));

            if (!Array.isArray(datos)) {
                return [];
            }

            return datos;

        } catch (error) {
            console.error("Error al cargar " + clave, error);
            return [];
        }
    }


    // =========================
    // MOSTRAR USUARIO ACTUAL
    // =========================
    const usuarioSesion =
        JSON.parse(localStorage.getItem("usuarioSesion") || "null");

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario && usuarioSesion) {
        nombreUsuario.textContent = usuarioSesion.nombre;
    }


    // ==========================================
    // ELEMENTOS DE LA INTERFAZ
    // ==========================================
    const tarjetas = document.querySelectorAll(".stat-card");

    const tarjetaPacientes = tarjetas[0];
    const tarjetaCitas = tarjetas[1];
    const tarjetaTratamientos = tarjetas[2];
    const tarjetaIngresos = tarjetas[3];

    const totalPacientes = tarjetaPacientes.querySelector("h3");
    const totalCitas = tarjetaCitas.querySelector("h3");
    const totalTratamientos = tarjetaTratamientos.querySelector("h3");
    const totalIngresos = tarjetaIngresos.querySelector("h3");

    const resumenItems = document.querySelectorAll(".summary-item");

    const confirmadas = resumenItems[0].querySelector("strong");
    const pendientes = resumenItems[1].querySelector("strong");
    const canceladas = resumenItems[2].querySelector("strong");

    const listaServicios = document.querySelector(".services-list");


    // ==========================================
    // MODAL PERSONALIZADO
    // ==========================================
    function crearModalReporte() {

        if (document.getElementById("modalReporte")) {
            return;
        }

        const estilos = document.createElement("style");

        estilos.id = "estilosModalReporte";

        estilos.textContent = `
            .modal-reporte-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(15, 23, 42, 0.55);
                backdrop-filter: blur(3px);
                opacity: 0;
                visibility: hidden;
                transition: opacity .25s ease, visibility .25s ease;
            }

            .modal-reporte-overlay.activo {
                opacity: 1;
                visibility: visible;
            }

            .modal-reporte {
                width: 100%;
                max-width: 480px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 32px;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,.2);
                text-align: center;
                transform: translateY(15px) scale(.97);
                transition: transform .25s ease;
                font-family: inherit;
            }

            .modal-reporte-overlay.activo .modal-reporte {
                transform: translateY(0) scale(1);
            }

            .modal-reporte-icono {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 68px;
                height: 68px;
                margin: 0 auto 20px;
                border-radius: 50%;
                font-size: 32px;
                font-weight: bold;
            }

            .modal-reporte-icono.exito {
                color: #16803d;
                background: #dcfce7;
            }

            .modal-reporte-icono.advertencia {
                color: #b45309;
                background: #fef3c7;
            }

            .modal-reporte-icono.informacion {
                color: #2563eb;
                background: #dbeafe;
            }

            .modal-reporte-titulo {
                margin: 0 0 12px;
                color: #1e293b;
                font-size: 23px;
                font-weight: 700;
            }

            .modal-reporte-mensaje {
                margin: 0;
                color: #64748b;
                font-size: 15px;
                line-height: 1.7;
                white-space: pre-line;
                overflow-wrap: anywhere;
            }

            .modal-reporte-acciones {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin-top: 26px;
            }

            .modal-reporte-boton {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 125px;
                min-height: 42px;
                padding: 10px 20px;
                color: #fff;
                background: #2563eb;
                border: 1px solid #2563eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: background .2s, transform .1s;
            }

            .modal-reporte-boton:hover {
                background: #1d4ed8;
                border-color: #1d4ed8;
            }

            .modal-reporte-boton:active {
                transform: scale(.98);
            }

            .modal-reporte-boton.secundario {
                color: #2563eb;
                background: #fff;
            }

            .modal-reporte-boton.secundario:hover {
                background: #eff6ff;
            }

            @media (max-width: 480px) {
                .modal-reporte {
                    padding: 25px 20px;
                }

                .modal-reporte-titulo {
                    font-size: 20px;
                }
            }
        `;

        document.head.appendChild(estilos);

        const modal = document.createElement("div");

        modal.id = "modalReporte";
        modal.className = "modal-reporte-overlay";
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div
                class="modal-reporte"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalReporteTitulo"
                aria-describedby="modalReporteMensaje"
            >
                <div
                    class="modal-reporte-icono exito"
                    id="modalReporteIcono"
                    aria-hidden="true"
                >✓</div>

                <h2 class="modal-reporte-titulo" id="modalReporteTitulo"></h2>

                <p class="modal-reporte-mensaje" id="modalReporteMensaje"></p>

                <div class="modal-reporte-acciones" id="modalReporteAcciones">
                    <button
                        type="button"
                        class="modal-reporte-boton"
                        id="modalReporteAceptar"
                    >Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("modalReporteAceptar")
            .addEventListener("click", cerrarModalReporte);

        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) {
                cerrarModalReporte();
            }
        });

        document.addEventListener("keydown", function (evento) {
            if (
                evento.key === "Escape" &&
                modal.classList.contains("activo")
            ) {
                cerrarModalReporte();
            }
        });
    }


    function mostrarModalReporte(titulo, mensaje, tipo = "exito", mostrarDescargas = false) {

        crearModalReporte();

        const modal = document.getElementById("modalReporte");
        const icono = document.getElementById("modalReporteIcono");
        const tituloModal = document.getElementById("modalReporteTitulo");
        const mensajeModal = document.getElementById("modalReporteMensaje");
        const acciones = document.getElementById("modalReporteAcciones");

        tituloModal.textContent = titulo;
        mensajeModal.textContent = mensaje;

        icono.className = "modal-reporte-icono";

        if (tipo === "advertencia") {
            icono.classList.add("advertencia");
            icono.textContent = "!";

        } else if (tipo === "informacion") {
            icono.classList.add("informacion");
            icono.textContent = "i";

        } else {
            icono.classList.add("exito");
            icono.textContent = "✓";
        }

        acciones.innerHTML = "";

        if (mostrarDescargas && reporteActual) {

            const botonCSV = document.createElement("button");
            botonCSV.type = "button";
            botonCSV.className = "modal-reporte-boton";
            botonCSV.textContent = "Descargar CSV";

            botonCSV.addEventListener("click", descargarCSV);

            acciones.appendChild(botonCSV);

            const botonPDF = document.createElement("button");
            botonPDF.type = "button";
            botonPDF.className = "modal-reporte-boton secundario";
            botonPDF.textContent = "Guardar como PDF";

            botonPDF.addEventListener("click", descargarPDF);

            acciones.appendChild(botonPDF);
        }

        const botonAceptar = document.createElement("button");
        botonAceptar.type = "button";
        botonAceptar.className = "modal-reporte-boton secundario";
        botonAceptar.textContent = "Aceptar";
        botonAceptar.addEventListener("click", cerrarModalReporte);

        acciones.appendChild(botonAceptar);

        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        botonAceptar.focus();
    }


    function cerrarModalReporte() {

        const modal = document.getElementById("modalReporte");

        if (!modal) {
            return;
        }

        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    }


    // ==========================================
    // CONVERTIR FECHA DD/MM/YYYY
    // ==========================================
    function convertirFecha(fecha) {

        if (!fecha) {
            return "";
        }

        if (fecha.includes("/")) {
            const partes = fecha.split("/");

            return partes[2] + "-" + partes[1] + "-" + partes[0];
        }

        return fecha;
    }


    // ==========================================
    // FORMATO DE FECHA PARA EL INFORME
    // ==========================================
    function mostrarFecha(fecha) {

        if (!fecha) {
            return "";
        }

        const fechaISO = convertirFecha(fecha);
        const partes = fechaISO.split("-");

        if (partes.length === 3) {
            return partes[2] + "/" + partes[1] + "/" + partes[0];
        }

        return fecha;
    }


    // ==========================================
    // OBTENER FECHA DE UNA CITA
    // ==========================================
    function fechaDentroDelPeriodo(cita) {

        const inicio = fechaInicio.value;
        const fin = fechaFin.value;
        const fechaCita = convertirFecha(cita.fecha);

        if (inicio === "" && fin === "") {
            return true;
        }

        if (!fechaCita) {
            return false;
        }

        if (inicio !== "" && fechaCita < inicio) {
            return false;
        }

        if (fin !== "" && fechaCita > fin) {
            return false;
        }

        return true;
    }


    // ==========================================
    // OBTENER DATOS DEL PERÍODO
    // ==========================================
    function obtenerCitasDelPeriodo() {

        return citas.filter(function (cita) {
            return fechaDentroDelPeriodo(cita);
        });
    }


    // ==========================================
    // CONTAR TRATAMIENTOS ACTIVOS
    // ==========================================
    function contarTratamientosActivos() {

        return tratamientos.filter(function (tratamiento) {
            return (
                tratamiento.estado &&
                tratamiento.estado.toLowerCase() === "en curso"
            );
        }).length;
    }


    // ==========================================
    // ACTUALIZAR INDICADORES
    // ==========================================
    function actualizarIndicadores(citasPeriodo) {

        totalPacientes.textContent = pacientes.length;
        totalCitas.textContent = citasPeriodo.length;
        totalTratamientos.textContent = contarTratamientosActivos();

        // Actualmente las citas no tienen precio asociado.
        // Por eso los ingresos no pueden calcularse todavía.

        totalIngresos.textContent = "$0";
    }


    // ==========================================
    // ACTUALIZAR RESUMEN DE CITAS
    // ==========================================
    function actualizarResumen(citasPeriodo) {

        const cantidadConfirmadas = citasPeriodo.filter(function (cita) {
            return cita.estado && cita.estado.toLowerCase() === "confirmada";
        }).length;

        const cantidadPendientes = citasPeriodo.filter(function (cita) {
            return cita.estado && cita.estado.toLowerCase() === "pendiente";
        }).length;

        const cantidadCanceladas = citasPeriodo.filter(function (cita) {
            return cita.estado && cita.estado.toLowerCase() === "cancelada";
        }).length;

        confirmadas.textContent = cantidadConfirmadas;
        pendientes.textContent = cantidadPendientes;
        canceladas.textContent = cantidadCanceladas;
    }


    // ==========================================
    // SERVICIOS MÁS UTILIZADOS
    // ==========================================
    function actualizarServicios() {

        listaServicios.innerHTML = "";

        if (servicios.length === 0) {

            listaServicios.innerHTML = `
                <div class="service-item">
                    <div>
                        <strong>No hay servicios registrados</strong>
                        <span>0 servicios</span>
                    </div>
                </div>
            `;

            return;
        }

        /*
            Actualmente las citas no tienen un campo
            "servicio", por lo que no podemos saber
            cuántas veces se utilizó cada servicio.

            Mostramos los servicios registrados en el
            sistema para que el reporte sea dinámico.
        */

        servicios.forEach(function (servicio, indice) {

            const item = document.createElement("div");

            item.className = "service-item";

            const nombre = document.createElement("strong");
            nombre.textContent = servicio.nombre || "Servicio sin nombre";

            const precio = document.createElement("span");
            precio.textContent = "Precio: " + (servicio.precio ?? "No disponible");

            const informacion = document.createElement("div");
            informacion.appendChild(nombre);
            informacion.appendChild(precio);

            const barra = document.createElement("div");
            barra.className = "progress-bar";

            const progreso = document.createElement("div");
            progreso.className = "progress";
            progreso.style.width = Math.max(15, 100 - (indice * 15)) + "%";

            barra.appendChild(progreso);

            item.appendChild(informacion);
            item.appendChild(barra);

            listaServicios.appendChild(item);
        });
    }


    // ==========================================
    // NOMBRE DEL REPORTE
    // ==========================================
    function obtenerNombreReporte() {

        if (tipoReporte.value === "general") {
            return "Reporte general";
        }

        if (tipoReporte.value === "citas") {
            return "Reporte de citas";
        }

        if (tipoReporte.value === "pacientes") {
            return "Reporte de pacientes";
        }

        if (tipoReporte.value === "servicios") {
            return "Reporte de servicios";
        }

        if (tipoReporte.value === "ingresos") {
            return "Reporte de ingresos";
        }

        return "Reporte";
    }


    // ==========================================
    // PREPARAR DATOS DEL REPORTE
    // ==========================================
    function prepararReporte() {

        pacientes = obtenerDatos("pacientes");
        citas = obtenerDatos("citas");
        tratamientos = obtenerDatos("tratamientos");
        servicios = obtenerDatos("servicios");

        const citasPeriodo = obtenerCitasDelPeriodo();

        actualizarIndicadores(citasPeriodo);
        actualizarResumen(citasPeriodo);
        actualizarServicios();

        return citasPeriodo;
    }


    // ==========================================
    // CONSTRUIR FILAS DEL REPORTE
    // ==========================================
    function obtenerFilasReporte(citasPeriodo) {

        const tipo = tipoReporte.value;

        if (tipo === "pacientes") {

            return {
                encabezados: [
                    "Documento",
                    "Nombre",
                    "Correo",
                    "Teléfono"
                ],
                filas: pacientes.map(function (paciente) {
                    return [
                        paciente.documento || paciente.documentoIdentidad || "",
                        paciente.nombre || "",
                        paciente.correo || paciente.email || "",
                        paciente.telefono || paciente.celular || ""
                    ];
                })
            };
        }

        if (tipo === "citas") {

            return {
                encabezados: [
                    "ID",
                    "Documento paciente",
                    "Paciente",
                    "Odontólogo",
                    "Fecha",
                    "Hora",
                    "Estado"
                ],
                filas: citasPeriodo.map(function (cita) {
                    return [
                        cita.id || "",
                        cita.documentoPaciente || cita.pacienteDocumento || "",
                        cita.paciente || cita.nombrePaciente || "",
                        cita.odontologo || cita.nombreOdontologo || "",
                        mostrarFecha(cita.fecha),
                        cita.hora || "",
                        cita.estado || ""
                    ];
                })
            };
        }

        if (tipo === "servicios") {

            return {
                encabezados: [
                    "ID",
                    "Servicio",
                    "Descripción",
                    "Duración",
                    "Precio"
                ],
                filas: servicios.map(function (servicio) {
                    return [
                        servicio.id || "",
                        servicio.nombre || "",
                        servicio.descripcion || "",
                        servicio.duracion || "",
                        servicio.precio ?? ""
                    ];
                })
            };
        }

        if (tipo === "ingresos") {

            return {
                encabezados: [
                    "Concepto",
                    "Información"
                ],
                filas: [
                    ["Ingresos calculados", "No disponibles"],
                    ["Motivo", "Las citas no tienen un valor económico asociado en el sistema."],
                    ["Citas del período", citasPeriodo.length]
                ]
            };
        }

        return {
            encabezados: [
                "Indicador",
                "Valor"
            ],
            filas: [
                ["Total de pacientes registrados", pacientes.length],
                ["Citas del período", citasPeriodo.length],
                ["Citas confirmadas", citasPeriodo.filter(function (cita) {
                    return cita.estado && cita.estado.toLowerCase() === "confirmada";
                }).length],
                ["Citas pendientes", citasPeriodo.filter(function (cita) {
                    return cita.estado && cita.estado.toLowerCase() === "pendiente";
                }).length],
                ["Citas canceladas", citasPeriodo.filter(function (cita) {
                    return cita.estado && cita.estado.toLowerCase() === "cancelada";
                }).length],
                ["Tratamientos en curso", contarTratamientosActivos()],
                ["Servicios registrados", servicios.length],
                ["Ingresos", "No disponibles: las citas no tienen precio asociado"]
            ]
        };
    }


    // ==========================================
    // DESCARGAR ARCHIVO CSV
    // ==========================================
    function descargarCSV() {

        if (!reporteActual) {
            return;
        }

        const contenido = [
            [reporteActual.titulo],
            ["Período", reporteActual.periodo],
            [],
            reporteActual.encabezados,
            ...reporteActual.filas
        ];

        const csv = contenido.map(function (fila) {

            return fila.map(function (valor) {

                let texto = String(valor ?? "");

                // Evitar que Excel interprete contenido como fórmulas.
                if (/^[=+\-@\t\r]/.test(texto)) {
                    texto = "'" + texto;
                }

                return '"' + texto.replace(/"/g, '""') + '"';

            }).join(";");

        }).join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = reporteActual.archivo + ".csv";

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        URL.revokeObjectURL(url);
    }


    // ==========================================
    // GENERAR VISTA PARA GUARDAR COMO PDF
    // ==========================================
    function descargarPDF() {

        if (!reporteActual) {
            return;
        }

        const ventana = window.open("", "_blank");

        if (!ventana) {

            mostrarModalReporte(
                "Ventana bloqueada",
                "El navegador bloqueó la ventana del informe. Permite las ventanas emergentes para esta página e inténtalo nuevamente.",
                "advertencia"
            );

            return;
        }

        function escaparHTML(valor) {

            return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
                const equivalencias = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };

                return equivalencias[caracter];
            });
        }

        const encabezados = reporteActual.encabezados.map(function (valor) {
            return "<th>" + escaparHTML(valor) + "</th>";
        }).join("");

        const filas = reporteActual.filas.length
            ? reporteActual.filas.map(function (fila) {
                return "<tr>" + fila.map(function (valor) {
                    return "<td>" + escaparHTML(valor) + "</td>";
                }).join("") + "</tr>";
            }).join("")
            : `<tr><td colspan="${reporteActual.encabezados.length}">No hay datos para mostrar.</td></tr>`;

        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escaparHTML(reporteActual.titulo)}</title>

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 35px;
                        color: #1e293b;
                    }

                    header {
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 15px;
                        margin-bottom: 25px;
                    }

                    h1 {
                        color: #1d4ed8;
                        margin-bottom: 8px;
                    }

                    p {
                        color: #64748b;
                    }

                    .periodo {
                        margin: 20px 0;
                        padding: 12px;
                        background: #eff6ff;
                        border-radius: 6px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-size: 12px;
                    }

                    th, td {
                        border: 1px solid #dbe2ea;
                        padding: 9px;
                        text-align: left;
                        overflow-wrap: anywhere;
                    }

                    th {
                        background: #2563eb;
                        color: #fff;
                    }

                    tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    footer {
                        margin-top: 30px;
                        font-size: 11px;
                        color: #64748b;
                    }

                    .acciones {
                        margin-bottom: 25px;
                    }

                    .acciones button {
                        padding: 10px 18px;
                        border: none;
                        border-radius: 6px;
                        background: #2563eb;
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    @media print {
                        body {
                            margin: 10mm;
                        }

                        .acciones {
                            display: none;
                        }

                        th {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                    }
                </style>
            </head>

            <body>
                <div class="acciones">
                    <button onclick="window.print()">Imprimir / Guardar como PDF</button>
                </div>

                <header>
                    <h1>Sonrisa Brillante</h1>
                    <p>Sistema de Gestión Odontológica</p>
                </header>

                <h2>${escaparHTML(reporteActual.titulo)}</h2>

                <div class="periodo">
                    <strong>Período:</strong>
                    ${escaparHTML(reporteActual.periodo)}
                </div>

                <table>
                    <thead>
                        <tr>${encabezados}</tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>

                <footer>
                    Informe generado desde el sistema Sonrisa Brillante.
                </footer>

                <script>
                    window.onload = function () {
                        window.focus();
                    };
                <\/script>
            </body>
            </html>
        `);

        ventana.document.close();
    }


    // ==========================================
    // VALIDAR PERÍODO
    // ==========================================
    function validarPeriodo() {

        const inicio = fechaInicio.value;
        const fin = fechaFin.value;

        if (inicio !== "" && fin !== "" && inicio > fin) {

            mostrarModalReporte(
                "Fechas inválidas",
                "La fecha inicial no puede ser posterior a la fecha final.",
                "advertencia"
            );

            return false;
        }

        return true;
    }


    // ==========================================
    // MOSTRAR INFORMACIÓN DEL REPORTE
    // ==========================================
    function consultarReporte() {

        if (!validarPeriodo()) {
            return;
        }

        const citasPeriodo = prepararReporte();

        const inicio = fechaInicio.value;
        const fin = fechaFin.value;

        let periodo = "Todo el período";

        if (inicio !== "" && fin !== "") {
            periodo = "Desde " + mostrarFecha(inicio) + " hasta " + mostrarFecha(fin);

        } else if (inicio !== "") {
            periodo = "Desde " + mostrarFecha(inicio);

        } else if (fin !== "") {
            periodo = "Hasta " + mostrarFecha(fin);
        }

        mostrarModalReporte(
            obtenerNombreReporte(),
            periodo + "\n\nLa información se actualizó correctamente.",
            "exito"
        );
    }


    // ==========================================
    // GENERAR REPORTE
    // ==========================================
    function generarReporte() {

        if (!validarPeriodo()) {
            return;
        }

        const citasPeriodo = prepararReporte();

        let periodo = "Todo el período";

        if (fechaInicio.value !== "" && fechaFin.value !== "") {

            periodo =
                "Desde " + mostrarFecha(fechaInicio.value) +
                " hasta " + mostrarFecha(fechaFin.value);

        } else if (fechaInicio.value !== "") {

            periodo = "Desde " + mostrarFecha(fechaInicio.value);

        } else if (fechaFin.value !== "") {

            periodo = "Hasta " + mostrarFecha(fechaFin.value);
        }

        const datos = obtenerFilasReporte(citasPeriodo);

        const nombreArchivo = obtenerNombreReporte()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "");

        reporteActual = {
            titulo: obtenerNombreReporte(),
            periodo: periodo,
            archivo: nombreArchivo + "_" + new Date().toISOString().slice(0, 10),
            encabezados: datos.encabezados,
            filas: datos.filas
        };

        mostrarModalReporte(
            "Reporte preparado",
            obtenerNombreReporte() +
            "\n\nPeríodo: " + periodo +
            "\n\nRegistros incluidos: " + datos.filas.length +
            "\n\nSelecciona CSV para abrirlo en Excel o PDF para imprimirlo y guardarlo.",
            "exito",
            true
        );
    }


    // ==========================================
    // EVENTOS
    // ==========================================
    botonConsultar.addEventListener(
        "click",
        consultarReporte
    );

    botonGenerar.addEventListener(
        "click",
        generarReporte

    );


// ==========================================
// CARGA INICIAL
// ==========================================
const citasIniciales = obtenerCitasDelPeriodo();

actualizarIndicadores(citasIniciales);
actualizarResumen(citasIniciales);
actualizarServicios();







