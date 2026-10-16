
document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // SESIÓN
    // ==========================================
    const usuarioSesion = JSON.parse(
        localStorage.getItem("usuarioSesion") || "null"
    );

    const nombreUsuario = document.getElementById("nombreUsuario");
    if (nombreUsuario && usuarioSesion) {
        nombreUsuario.textContent = usuarioSesion.nombre || "";
    }

    // ==========================================
    // ELEMENTOS
    // ==========================================
    const buscador = document.getElementById("buscarHistorial");
    const contenedor = document.querySelector(".clinical-table");
    const modal = document.getElementById("modalHistorial");
    const cerrarModal = document.getElementById("cerrarModalHistorial");
    const botonCerrar = document.getElementById("cerrarHistorial");

    const pacienteModal = document.getElementById("pacienteHistorialModal");
    const documentoModal = document.getElementById("documentoHistorialModal");
    const fechaModal = document.getElementById("fechaHistorialModal");
    const diagnosticoModal = document.getElementById("diagnosticoHistorialModal");
    const tratamientoModal = document.getElementById("tratamientoHistorialModal");

    if (!contenedor) {
        console.error("No se encontró la tabla del historial clínico.");
        return;
    }

    // ==========================================
    // DATOS REALES
    // ==========================================
    function leerLista(clave) {
        try {
            const datos = JSON.parse(localStorage.getItem(clave) || "[]");
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error("Error leyendo " + clave, error);
            return [];
        }
    }

    function normalizar(valor) {
        return String(valor || "")
            .trim()
            .toLocaleLowerCase("es");
    }

    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[caracter];
        });
    }

    function fechaVisible(fecha) {
        if (!fecha) return "No registrada";

        const valor = String(fecha).trim();
        const partesISO = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (partesISO) {
            return partesISO[3] + "/" + partesISO[2] + "/" + partesISO[1];
        }

        return valor;
    }

    function clavePaciente(registro) {
        return normalizar(
            registro.documento ||
            registro.documentoPaciente ||
            registro.pacienteDocumento
        );
    }

    function nombrePaciente(registro) {
        if (typeof registro.paciente === "string") {
            return registro.paciente;
        }

        return registro.paciente?.nombre ||
            registro.nombrePaciente ||
            registro.nombre ||
            "Paciente sin nombre";
    }

    function coincidePaciente(cita, historia) {
        const documentoCita = clavePaciente(cita);
        const documentoHistoria = clavePaciente(historia);

        if (documentoCita && documentoHistoria) {
            return documentoCita === documentoHistoria;
        }

        return normalizar(nombrePaciente(cita)) ===
            normalizar(nombrePaciente(historia));
    }

    // ==========================================
    // FILTRO POR ODONTÓLOGO
    // ==========================================
    let filtroOdontologo;

    function crearFiltroOdontologo() {
        if (!buscador || filtroOdontologo) return;

        filtroOdontologo = document.createElement("select");
        filtroOdontologo.id = "filtroOdontologoHistorial";
        filtroOdontologo.setAttribute("aria-label", "Filtrar por odontólogo");
        filtroOdontologo.innerHTML =
            '<option value="">Todos los odontólogos</option>';

        filtroOdontologo.style.marginTop = "10px";
        filtroOdontologo.style.maxWidth = "100%";
        filtroOdontologo.style.padding = "10px";
        filtroOdontologo.style.borderRadius = "8px";

        buscador.insertAdjacentElement("afterend", filtroOdontologo);

        filtroOdontologo.addEventListener("change", renderizarHistorial);
    }

    // ==========================================
    // CONSTRUIR REGISTROS PARA LA TABLA
    // ==========================================
    function obtenerRegistros() {
        const historiales = leerLista("historiales");
        const citas = leerLista("citas");
        const registros = [];

        // Primero, evoluciones clínicas reales.
        historiales.forEach(function (historia) {
            const citaRelacionada = citas.find(function (cita) {
                return coincidePaciente(cita, historia) &&
                    normalizar(cita.odontologo) ===
                    normalizar(historia.odontologo) &&
                    String(cita.fecha || "") ===
                    String(historia.ultimaConsulta || historia.fecha || "");
            });

            registros.push({
                tipo: "historia",
                id: historia.id,
                documento: historia.documento || "",
                paciente: nombrePaciente(historia),
                fecha: historia.ultimaConsulta || historia.fecha || "",
                odontologo: historia.odontologo || citaRelacionada?.odontologo || "",
                diagnostico: historia.diagnostico || "No registrado",
                tratamiento: historia.tratamiento || "No registrado",
                motivo: historia.motivo || "No registrado",
                evolucion: historia.evolucion || "No registrada",
                recomendaciones: historia.recomendaciones || "No registradas",
                estado: "Atención con evolución clínica"
            });
        });

        // Luego, citas que todavía no tienen una evolución relacionada.
        citas.forEach(function (cita) {
            const tieneHistoria = historiales.some(function (historia) {
                return coincidePaciente(cita, historia) &&
                    normalizar(cita.odontologo) ===
                    normalizar(historia.odontologo) &&
                    String(cita.fecha || "") ===
                    String(historia.ultimaConsulta || historia.fecha || "");
            });

            if (tieneHistoria) return;

            registros.push({
                tipo: "cita",
                id: cita.id,
                documento: clavePaciente(cita),
                paciente: nombrePaciente(cita),
                fecha: cita.fecha || "",
                odontologo: cita.odontologo || "",
                diagnostico: "Sin evolución clínica",
                tratamiento: cita.servicio || "No registrado",
                motivo: "Cita registrada",
                evolucion: "El odontólogo aún no registra una evolución asociada.",
                recomendaciones: "No registradas",
                estado: cita.estado || "Sin estado"
            });
        });

        // Más recientes primero.
        registros.sort(function (a, b) {
            return String(b.fecha).localeCompare(String(a.fecha));
        });

        return registros;
    }

    // ==========================================
    // POBLAR FILTRO
    // ==========================================
    function actualizarOdontologos(registros) {
        if (!filtroOdontologo) return;

        const seleccionActual = filtroOdontologo.value;
        const odontologos = [...new Set(
            registros.map(function (registro) {
                return registro.odontologo;
            }).filter(Boolean)
        )].sort(function (a, b) {
            return a.localeCompare(b, "es");
        });

        filtroOdontologo.innerHTML =
            '<option value="">Todos los odontólogos</option>';

        odontologos.forEach(function (nombre) {
            const opcion = document.createElement("option");
            opcion.value = nombre;
            opcion.textContent = nombre;
            filtroOdontologo.appendChild(opcion);
        });

        if (odontologos.includes(seleccionActual)) {
            filtroOdontologo.value = seleccionActual;
        }
    }

    // ==========================================
    // RENDERIZAR TABLA
    // ==========================================
    function renderizarHistorial() {
        const registros = obtenerRegistros();
        actualizarOdontologos(registros);

        // Conservar encabezado y retirar registros de ejemplo.
        const encabezado = contenedor.querySelector(".table-header");
        contenedor.innerHTML = "";

        if (encabezado) {
            contenedor.appendChild(encabezado);
        }

        const texto = normalizar(buscador?.value);
        const odontologoElegido = normalizar(filtroOdontologo?.value);
        const filtrados = registros.filter(function (registro) {
            const textoRegistro = normalizar([
                registro.documento,
                registro.paciente,
                registro.odontologo,
                registro.diagnostico,
                registro.tratamiento,
                registro.estado
            ].join(" "));

            return textoRegistro.includes(texto) &&
                (!odontologoElegido ||
                    normalizar(registro.odontologo) === odontologoElegido);
        });

        if (filtrados.length === 0) {
            const mensaje = document.createElement("div");
            mensaje.className = "table-row";
            mensaje.style.display = "block";
            mensaje.style.padding = "20px";
            mensaje.textContent = registros.length === 0
                ? "Todavía no hay citas ni evoluciones clínicas registradas."
                : "No hay registros que coincidan con los filtros.";
            contenedor.appendChild(mensaje);
            return;
        }

        filtrados.forEach(function (registro) {
            const fila = document.createElement("div");
            fila.className = "table-row";
            fila.innerHTML = `
                <span>${escapar(registro.documento || "No registrado")}</span>
                <span>${escapar(registro.paciente)}</span>
                <span>${escapar(fechaVisible(registro.fecha))}</span>
                <span>${escapar(registro.diagnostico)}</span>
                <span>${escapar(registro.tratamiento)}</span>
                <span class="actions">
                    <button type="button" class="btn-action">Ver</button>
                </span>
            `;

            fila.querySelector(".btn-action").addEventListener("click", function () {
                mostrarDetalle(registro);
            });

            contenedor.appendChild(fila);
        });
    }

    // ==========================================
    // DETALLE CLÍNICO
    // ==========================================
    function asignarTexto(elemento, valor) {
        if (elemento) elemento.textContent = valor || "No registrado";
    }

    function mostrarDetalle(registro) {
        asignarTexto(pacienteModal, registro.paciente);
        asignarTexto(documentoModal, registro.documento || "No registrado");
        asignarTexto(fechaModal, fechaVisible(registro.fecha));
        asignarTexto(diagnosticoModal, registro.diagnostico);
        asignarTexto(tratamientoModal, registro.tratamiento);

        // Completar el modal con campos adicionales sin modificar el HTML.
        const contenido = modal?.querySelector(".historial-datos");

        if (contenido) {
            ["odontologo", "motivo", "evolucion", "recomendaciones", "estado"].forEach(
                function (campo) {
                    let bloque = contenido.querySelector('[data-campo="' + campo + '"]');

                    if (!bloque) {
                        bloque = document.createElement("div");
                        bloque.className = "historial-dato";
                        bloque.dataset.campo = campo;

                        const etiqueta = document.createElement("span");
                        etiqueta.textContent = {
                            odontologo: "Odontólogo",
                            motivo: "Motivo de consulta",
                            evolucion: "Evolución",
                            recomendaciones: "Recomendaciones",
                            estado: "Estado del registro"
                        }[campo];

                        const valor = document.createElement("strong");
                        bloque.append(etiqueta, valor);
                        contenido.appendChild(bloque);
                    }

                    bloque.querySelector("strong").textContent =
                        registro[campo] || "No registrado";
                }
            );
        }

        if (modal) modal.style.display = "flex";
    }

    // ==========================================
    // CERRAR MODAL
    // ==========================================
    function cerrarHistorialModal() {
        if (modal) modal.style.display = "none";
    }

    cerrarModal?.addEventListener("click", cerrarHistorialModal);
    botonCerrar?.addEventListener("click", cerrarHistorialModal);

    modal?.addEventListener("click", function (evento) {
        if (evento.target === modal) cerrarHistorialModal();
    });

    // ==========================================
    // INICIO
    // ==========================================
    crearFiltroOdontologo();

    if (buscador) {
        buscador.addEventListener("input", renderizarHistorial);
    }

    renderizarHistorial();
});
