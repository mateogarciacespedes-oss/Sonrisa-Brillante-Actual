document.addEventListener("DOMContentLoaded", function () {

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
    // DATOS
    // ==========================================
    let tratamientos =
        JSON.parse(
            localStorage.getItem("tratamientos")
        ) || [];


    // ==========================================
    // ASIGNAR ID A TRATAMIENTOS EXISTENTES
    // ==========================================
    let tratamientosModificados = false;

    tratamientos.forEach(function (tratamiento, indice) {

        if (!tratamiento.id) {

            tratamiento.id =
                Date.now() + indice;

            tratamientosModificados = true;

        }

    });


    if (tratamientosModificados) {

        localStorage.setItem(
            "tratamientos",
            JSON.stringify(tratamientos)
        );

    }


    // ==========================================
    // ELEMENTOS
    // ==========================================
    const contenedor =
        document.querySelector(
            ".treatments-grid"
        );

    const buscador =
        document.getElementById(
            "buscarTratamiento"
        );

    const botonNuevo =
        document.querySelector(
            ".page-heading .btn-primary"
        );


    // ==========================================
    // GUARDAR TRATAMIENTOS
    // ==========================================
    function guardarTratamientos() {

        localStorage.setItem(
            "tratamientos",
            JSON.stringify(tratamientos)
        );

    }


    // ==========================================
    // TRATAMIENTOS INICIALES
    // ==========================================
    if (tratamientos.length === 0) {

        tratamientos = [

            {
                id: 1,
                nombre: "Ortodoncia",
                descripcion:
                    "Tratamiento para corregir la posición de los dientes y mejorar la mordida.",
                duracion: "18 meses",
                precio: 2500000,
                icono: "🦷"
            },

            {
                id: 2,
                nombre: "Blanqueamiento",
                descripcion:
                    "Tratamiento estético para aclarar el tono de los dientes.",
                duracion: "2 sesiones",
                precio: 450000,
                icono: "✨"
            },

            {
                id: 3,
                nombre: "Tratamiento de caries",
                descripcion:
                    "Procedimiento para eliminar la caries y restaurar el diente afectado.",
                duracion: "60 minutos",
                precio: 180000,
                icono: "🩺"
            },

            {
                id: 4,
                nombre: "Tratamiento de encías",
                descripcion:
                    "Tratamiento para prevenir y controlar enfermedades periodontales.",
                duracion: "3 sesiones",
                precio: 350000,
                icono: "❤️"
            }

        ];

        guardarTratamientos();

    }


    // ==========================================
    // FORMATEAR PRECIO
    // ==========================================
    function formatearPrecio(precio) {

        return "$" +
            Number(precio).toLocaleString("es-CO");

    }


    // ==========================================
    // MOSTRAR TRATAMIENTOS
    // ==========================================
    function mostrarTratamientos(
        lista = tratamientos
    ) {

        contenedor.innerHTML = "";


        if (lista.length === 0) {

            contenedor.innerHTML = `

                <p>
                    No se encontraron tratamientos.
                </p>

            `;

            return;

        }


        lista.forEach(
            function (tratamiento) {

                const tarjeta =
                    document.createElement(
                        "article"
                    );

                tarjeta.className =
                    "treatment-card";


                tarjeta.innerHTML = `

                    <div class="treatment-icon">
                        ${tratamiento.icono || "🦷"}
                    </div>


                    <div class="treatment-info">

                        <h3>
                            ${tratamiento.nombre}
                        </h3>

                        <p>
                            ${tratamiento.descripcion}
                        </p>

                    </div>


                    <div class="treatment-details">

                        <span>
                            ⏱ ${tratamiento.duracion}
                        </span>

                        <strong>
                            ${formatearPrecio(
                                tratamiento.precio
                            )}
                        </strong>

                    </div>


                    <div class="treatment-actions">

                        <button
                            class="btn-action btn-ver"
                            data-id="${tratamiento.id}"
                        >
                            Ver
                        </button>

                        <button
                            class="btn-action btn-editar"
                            data-id="${tratamiento.id}"
                        >
                            Editar
                        </button>

                    </div>

                `;


                contenedor.appendChild(
                    tarjeta
                );

            }
        );


        agregarEventos();

    }


    // ==========================================
    // BUSCAR TRATAMIENTO
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
                    tratamientos.filter(
                        function (tratamiento) {

                            return (

                                tratamiento.nombre
                                    .toLowerCase()
                                    .includes(texto)

                                ||

                                tratamiento.descripcion
                                    .toLowerCase()
                                    .includes(texto)

                            );

                        }
                    );


                mostrarTratamientos(
                    resultados
                );

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
            "modal-tratamiento";

        modal.innerHTML =
            contenido;

        document.body.appendChild(
            modal
        );

        return modal;

    }


    // ==========================================
    // NUEVO TRATAMIENTO
    // ==========================================
    function nuevoTratamiento() {

        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                Nuevo tratamiento
                            </h2>

                            <p>
                                Registra un nuevo tratamiento odontológico.
                            </p>

                        </div>

                        <button
                            type="button"
                            class="modal-cerrar"
                        >
                            ×
                        </button>

                    </div>


                    <form id="formTratamiento">


                        <div class="form-group">

                            <label>
                                Nombre del tratamiento
                            </label>

                            <input
                                type="text"
                                id="nombreTratamiento"
                                placeholder="Ej: Ortodoncia"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Descripción
                            </label>

                            <textarea
                                id="descripcionTratamiento"
                                rows="4"
                                placeholder="Describe el tratamiento..."
                                required
                            ></textarea>

                        </div>


                        <div class="form-row">

                            <div class="form-group">

                                <label>
                                    Duración
                                </label>

                                <input
                                    type="text"
                                    id="duracionTratamiento"
                                    placeholder="Ej: 18 meses"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    id="precioTratamiento"
                                    min="0"
                                    placeholder="Ej: 2500000"
                                    required
                                >

                            </div>

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
                                Guardar tratamiento
                            </button>

                        </div>


                    </form>

                </div>

            `);


        cerrarEventosModal(
            modal
        );


        modal.querySelector(
            "#formTratamiento"
        ).addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const nombre =
                    modal.querySelector(
                        "#nombreTratamiento"
                    ).value.trim();


                const descripcion =
                    modal.querySelector(
                        "#descripcionTratamiento"
                    ).value.trim();


                const duracion =
                    modal.querySelector(
                        "#duracionTratamiento"
                    ).value.trim();


                const precio =
                    Number(
                        modal.querySelector(
                            "#precioTratamiento"
                        ).value
                    );


                const existe =
                    tratamientos.some(
                        function (tratamiento) {

                            return (
                                tratamiento.nombre
                                    .toLowerCase() ===
                                nombre.toLowerCase()
                            );

                        }
                    );


                if (existe) {

                    alert(
                        "Ya existe un tratamiento con ese nombre."
                    );

                    return;

                }


                const nuevo = {

                    id:
                        Date.now(),

                    nombre:
                        nombre,

                    descripcion:
                        descripcion,

                    duracion:
                        duracion,

                    precio:
                        precio,

                    icono:
                        "🦷"

                };


                tratamientos.push(
                    nuevo
                );


                guardarTratamientos();

                mostrarTratamientos();

                modal.remove();


                alert(
                    "Tratamiento registrado correctamente."
                );

            }
        );

    }


    // ==========================================
    // VER TRATAMIENTO
    // ==========================================
    function verTratamiento(id) {

        const tratamiento =
            tratamientos.find(
                function (tratamiento) {

                    return String(
                        tratamiento.id
                    ) === String(id);

                }
            );


        if (!tratamiento) {

            alert(
                "No se encontró el tratamiento."
            );

            return;

        }


        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                ${tratamiento.nombre}
                            </h2>

                            <p>
                                Información del tratamiento
                            </p>

                        </div>

                        <button
                            type="button"
                            class="modal-cerrar"
                        >
                            ×
                        </button>

                    </div>


                    <div class="datos-tratamiento">

                        <p>

                            <strong>
                                Descripción:
                            </strong>

                            ${tratamiento.descripcion}

                        </p>


                        <p>

                            <strong>
                                Duración:
                            </strong>

                            ${tratamiento.duracion}

                        </p>


                        <p>

                            <strong>
                                Precio:
                            </strong>

                            ${formatearPrecio(
                                tratamiento.precio
                            )}

                        </p>

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


        cerrarEventosModal(
            modal
        );

    }


    // ==========================================
    // EDITAR TRATAMIENTO
    // ==========================================
    function editarTratamiento(id) {

        const tratamiento =
            tratamientos.find(
                function (tratamiento) {

                    return String(
                        tratamiento.id
                    ) === String(id);

                }
            );


        if (!tratamiento) {

            alert(
                "No se encontró el tratamiento."
            );

            return;

        }


        const modal =
            crearModal(`

                <div class="modal-contenido">

                    <div class="modal-header">

                        <div>

                            <h2>
                                Editar tratamiento
                            </h2>

                            <p>
                                Actualiza la información del tratamiento.
                            </p>

                        </div>

                        <button
                            type="button"
                            class="modal-cerrar"
                        >
                            ×
                        </button>

                    </div>


                    <form id="formEditarTratamiento">


                        <div class="form-group">

                            <label>
                                Nombre del tratamiento
                            </label>

                            <input
                                type="text"
                                id="editarNombreTratamiento"
                                value="${tratamiento.nombre}"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Descripción
                            </label>

                            <textarea
                                id="editarDescripcionTratamiento"
                                rows="4"
                                required
                            >${tratamiento.descripcion}</textarea>

                        </div>


                        <div class="form-row">

                            <div class="form-group">

                                <label>
                                    Duración
                                </label>

                                <input
                                    type="text"
                                    id="editarDuracionTratamiento"
                                    value="${tratamiento.duracion}"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    id="editarPrecioTratamiento"
                                    value="${tratamiento.precio}"
                                    min="0"
                                    required
                                >

                            </div>

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


        cerrarEventosModal(
            modal
        );


        modal.querySelector(
            "#formEditarTratamiento"
        ).addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const nombre =
                    modal.querySelector(
                        "#editarNombreTratamiento"
                    ).value.trim();


                const descripcion =
                    modal.querySelector(
                        "#editarDescripcionTratamiento"
                    ).value.trim();


                const duracion =
                    modal.querySelector(
                        "#editarDuracionTratamiento"
                    ).value.trim();


                const precio =
                    Number(
                        modal.querySelector(
                            "#editarPrecioTratamiento"
                        ).value
                    );


                if (
                    nombre === "" ||
                    descripcion === "" ||
                    duracion === "" ||
                    isNaN(precio)
                ) {

                    alert(
                        "Por favor, completa todos los campos."
                    );

                    return;

                }


                const nombreDuplicado =
                    tratamientos.some(
                        function (item) {

                            return (

                                String(item.id) !==
                                String(id)

                                &&

                                item.nombre
                                    .toLowerCase() ===
                                nombre.toLowerCase()

                            );

                        }
                    );


                if (nombreDuplicado) {

                    alert(
                        "Ya existe otro tratamiento con ese nombre."
                    );

                    return;

                }


                tratamiento.nombre =
                    nombre;

                tratamiento.descripcion =
                    descripcion;

                tratamiento.duracion =
                    duracion;

                tratamiento.precio =
                    precio;


                guardarTratamientos();

                mostrarTratamientos();


                modal.remove();


                alert(
                    "Tratamiento actualizado correctamente."
                );

            }
        );

    }


    // ==========================================
    // CERRAR MODAL
    // ==========================================
    function cerrarEventosModal(modal) {

        modal.querySelectorAll(
            ".modal-cerrar"
        ).forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        modal.remove();

                    }
                );

            }
        );


        const cancelar =
            modal.querySelector(
                ".modal-cancelar"
            );


        if (cancelar) {

            cancelar.addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );

        }


        modal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === modal
                ) {

                    modal.remove();

                }

            }
        );

    }


    // ==========================================
    // EVENTOS
    // ==========================================
    function agregarEventos() {

        document
            .querySelectorAll(".btn-ver")
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            verTratamiento(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(".btn-editar")
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            editarTratamiento(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // ==========================================
    // BOTÓN NUEVO TRATAMIENTO
    // ==========================================
    if (botonNuevo) {

        botonNuevo.addEventListener(
            "click",
            nuevoTratamiento
        );

    }


    // ==========================================
    // CARGAR PANTALLA
    // ==========================================
    mostrarTratamientos();

});














