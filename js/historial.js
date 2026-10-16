
document.addEventListener("DOMContentLoaded", function () {
    const buscador = document.getElementById("buscarHistorial");
    const tabla = document.querySelector(".clinical-table");
    const botonNuevo = document.querySelector(".page-heading .btn-principal");
    const usuarioSesion = JSON.parse(
        localStorage.getItem("usuarioSesion") || "null"
    );

    const nombreUsuario = document.getElementById("nombreUsuario");
    if (nombreUsuario && usuarioSesion) {
        nombreUsuario.textContent = usuarioSesion.nombre || "Administrador";
    }

    if (!tabla) {
        console.error("No se encontró la tabla del historial clínico.");
        return;
    }

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
        return String(valor ?? "").trim().toLocaleLowerCase("es");
    }

    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#39;"
            }[c];
        });
    }

    function documentoDe(registro) {
        return String(
            registro.documento ||
            registro.documentoPaciente ||
            registro.pacienteDocumento ||
            ""
        );
    }

    function pacienteDe(registro) {
        if (typeof registro.paciente === "string") {
            return registro.paciente;
        }

        return registro.paciente?.nombre ||
            registro.nombrePaciente ||
            registro.nombre ||
            "Paciente sin nombre";
    }

    function fechaDe(registro) {
        return registro.ultimaConsulta || registro.fecha || "";
    }

    function fechaVisible(fecha) {
        if (!fecha) return "No registrada";

        const iso = String(fecha).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;

        return String(fecha);
    }

    function coinciden(cita, historia) {
        const docCita = documentoDe(cita);
        const docHistoria = documentoDe(historia);

        if (docCita && docHistoria) {
            return docCita === docHistoria;
        }

        return normalizar(pacienteDe(cita)) === normalizar(pacienteDe(historia));
    }

    // Relacionar citas y evoluciones por paciente, odontólogo y fecha.
    // La relación es aproximada mientras las evoluciones no guarden el id de cita.
    function obtenerRegistros() {
        const historiales = leerLista("historiales");
        const citas = leerLista("citas");
        const registros = [];

        historiales.forEach(function (h, indice) {
            const fechaHistoria = String(fechaDe(h));

            registros.push({
                clave: "historia-" + String(h.id ?? indice),
                tipo: "historia",
                documento: documentoDe(h),
                paciente: pacienteDe(h),
                fecha: fechaHistoria,
                odontologo: h.odontologo || "",
                diagnostico: h.diagnostico || "No registrado",
                tratamiento: h.tratamiento || "No registrado",
                motivo: h.motivo || "No registrado",
                evolucion: h.evolucion || "No registrada",
                recomendaciones: h.recomendaciones || "No registradas",
                estado: "Evolución clínica registrada"
            });
        });

        citas.forEach(function (cita, indice) {
            const yaTieneHistoria = historiales.some(function (h) {
                return coinciden(cita, h) &&
                    normalizar(cita.odontologo) === normalizar(h.odontologo) &&
                    String(cita.fecha || "") === String(fechaDe(h));
            });

            if (yaTieneHistoria) return;

            registros.push({
                clave: "cita-" + String(cita.id ?? indice),
                tipo: "cita",
                documento: documentoDe(cita),
                paciente: pacienteDe(cita),
                fecha: String(cita.fecha || ""),
                odontologo: cita.odontologo || "",
                diagnostico: "Sin evolución clínica",
                tratamiento: cita.servicio || cita.tratamiento || "No registrado",
                motivo: "Cita registrada",
                evolucion: "No hay una evolución clínica asociada a este registro.",
                recomendaciones: "No registradas",
                estado: cita.estado || "Sin estado"
            });
        });

        registros.sort(function (a, b) {
            return b.fecha.localeCompare(a.fecha);
        });

        return registros;
    }

    // Crear filtro por odontólogo.
    let filtroOdontologo = document.getElementById("filtroOdontologoHistorial");

    if (!filtroOdontologo && buscador) {
        filtroOdontologo = document.createElement("select");
        filtroOdontologo.id = "filtroOdontologoHistorial";
        filtroOdontologo.setAttribute("aria-label", "Filtrar por odontólogo");
        filtroOdontologo.innerHTML =
            '<option value="">Todos los odontólogos</option>';

        filtroOdontologo.style.marginTop = "10px";
        filtroOdontologo.style.padding = "10px";
        filtroOdontologo.style.borderRadius = "8px";

        buscador.insertAdjacentElement("afterend", filtroOdontologo);
    }

    function mostrarDetalle(registro) {
        const contenido = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <div>
                        <h2>${escapar(
                            registro.tipo === "historia"
                                ? "Detalle de evolución clínica"
                                : "Detalle de cita"
                        )}</h2>
                        <p>Información registrada en el sistema.</p>
                    </div>
                    <button type="button" class="modal-cerrar"
                        aria-label="Cerrar">×</button>
                </div>

                <div class="datos-historial">
                    <div class="dato"><strong>Documento</strong>
                        <span>${escapar(registro.documento || "No registrado")}</span></div>
                    <div class="dato"><strong>Paciente</strong>
                        <span>${escapar(registro.paciente)}</span></div>
                    <div class="dato"><strong>Fecha</strong>
                        <span>${escapar(fechaVisible(registro.fecha))}</span></div>
                    <div class="dato"><strong>Odontólogo</strong>
                        <span>${escapar(registro.odontologo || "No registrado")}</span></div>
                    <div class="dato"><strong>Estado</strong>
                        <span>${escapar(registro.estado)}</span></div>
                    <div class="dato"><strong>Motivo</strong>
                        <span>${escapar(registro.motivo)}</span></div>
                    <div class="dato"><strong>Diagnóstico</strong>
                        <span>${escapar(registro.diagnostico)}</span></div>
                    <div class="dato"><strong>Tratamiento</strong>
                        <span>${escapar(registro.tratamiento)}</span></div>
                    <div class="dato"><strong>Evolución</strong>
                        <span>${escapar(registro.evolucion)}</span></div>
                    <div class="dato"><strong>Recomendaciones</strong>
                        <span>${escapar(registro.recomendaciones)}</span></div>
                </div>

                <div class="modal-acciones">
                    <button type="button" class="btn btn-primary modal-cerrar">
                        Cerrar
                    </button>
                </div>
            </div>`;

        const modal = document.createElement("div");
        modal.className = "modal-historial";
        modal.innerHTML = contenido;
        document.body.appendChild(modal);

        modal.querySelectorAll(".modal-cerrar").forEach(function (boton) {
            boton.addEventListener("click", function () {
                modal.remove();
            });
        });

        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) modal.remove();
        });
    }

    function renderizar() {
        const registros = obtenerRegistros();
        const seleccionado = filtroOdontologo?.value || "";

        if (filtroOdontologo) {
            const anterior = filtroOdontologo.value;
            const odontologos = [...new Set(
                registros.map(r => r.odontologo).filter(Boolean)
            )].sort((a, b) => a.localeCompare(b, "es"));

            filtroOdontologo.innerHTML =
                '<option value="">Todos los odontólogos</option>';

            odontologos.forEach(function (nombre) {
                const opcion = document.createElement("option");
                opcion.value = nombre;
                opcion.textContent = nombre;
                filtroOdontologo.appendChild(opcion);
            });

            if (odontologos.includes(anterior)) {
                filtroOdontologo.value = anterior;
            }
        }

        const texto = normalizar(buscador?.value);
        const odontologoElegido = normalizar(filtroOdontologo?.value);

        const resultados = registros.filter(function (r) {
            const contenido = normalizar([
                r.documento, r.paciente, r.odontologo,
                r.diagnostico, r.tratamiento, r.estado
            ].join(" "));

            return contenido.includes(texto) &&
                (!odontologoElegido ||
                    normalizar(r.odontologo) === odontologoElegido);
        });

        const encabezado = tabla.querySelector(".table-header");
        tabla.innerHTML = "";
        if (encabezado) tabla.appendChild(encabezado);

        if (!resultados.length) {
            const mensaje = document.createElement("div");
            mensaje.className = "table-row";
            mensaje.style.display = "block";
            mensaje.style.padding = "20px";
            mensaje.textContent = registros.length
                ? "No hay registros que coincidan con la búsqueda."
                : "Todavía no hay citas ni evoluciones clínicas registradas.";
            tabla.appendChild(mensaje);
            return;
        }

        resultados.forEach(function (r) {
            const fila = document.createElement("div");
            fila.className = "table-row";
            fila.innerHTML = `
                <span>${escapar(r.documento || "No registrado")}</span>
                <span>${escapar(r.paciente)}</span>
                <span>${escapar(fechaVisible(r.fecha))}</span>
                <span>${escapar(r.diagnostico)}</span>
                <span>${escapar(r.tratamiento)}</span>
                <span class="actions">
                    <button type="button" class="btn-action btn-ver">Ver</button>
                </span>`;

            fila.querySelector(".btn-ver").addEventListener("click", function () {
                mostrarDetalle(r);
            });

            tabla.appendChild(fila);
        });
    }

    buscador?.addEventListener("input", renderizar);
    filtroOdontologo?.addEventListener("change", renderizar);

    // El historial clínico debe crearse desde Registrar evolución del odontólogo.
    // Se evita crear registros clínicos manuales ficticios desde administración.
    if (botonNuevo) {
        botonNuevo.addEventListener("click", function (evento) {
            evento.preventDefault();
            alert(
                "Las evoluciones clínicas deben registrarse desde el módulo del odontólogo. " +
                "Aquí puedes consultar las citas y los historiales existentes."
            );
        });
    }

    renderizar();
});










