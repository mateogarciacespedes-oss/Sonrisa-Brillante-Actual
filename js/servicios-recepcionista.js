// ==========================================
// SERVICIOS - RECEPCIONISTA
// ==========================================

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
    // CARGAR SERVICIOS
    // ==========================================

    let servicios =
        JSON.parse(
            localStorage.getItem("servicios")
        ) || [];


    // ==========================================
    // ASIGNAR ID A SERVICIOS EXISTENTES
    // ==========================================

    let serviciosModificados = false;

    servicios.forEach(function (servicio, indice) {

        if (!servicio.id) {

            servicio.id =
                Date.now() + indice;

            serviciosModificados = true;

        }

    });


    if (serviciosModificados) {

        localStorage.setItem(
            "servicios",
            JSON.stringify(servicios)
        );

    }


    // ==========================================
    // SERVICIOS INICIALES
    // ==========================================

    if (servicios.length === 0) {

        servicios = [

            {
                id: 1,
                nombre: "Limpieza dental",
                descripcion:
                    "Procedimiento para eliminar placa y sarro dental.",
                duracion: "45 minutos",
                precio: 80000,
                icono: "🦷"
            },

            {
                id: 2,
                nombre: "Blanqueamiento dental",
                descripcion:
                    "Tratamiento estético para aclarar el tono de los dientes.",
                duracion: "60 minutos",
                precio: 250000,
                icono: "✨"
            },

            {
                id: 3,
                nombre: "Consulta odontológica",
                descripcion:
                    "Valoración general del estado de salud oral del paciente.",
                duracion: "30 minutos",
                precio: 60000,
                icono: "🩺"
            },

            {
                id: 4,
                nombre: "Radiografía dental",
                descripcion:
                    "Estudio radiográfico para apoyar el diagnóstico odontológico.",
                duracion: "20 minutos",
                precio: 50000,
                icono: "📷"
            }

        ];

        localStorage.setItem(
            "servicios",
            JSON.stringify(servicios)
        );

    }


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const buscador =
        document.getElementById("buscarServicio");

    const botonNuevo =
        document.getElementById("btnNuevoServicio");

    const modal =
        document.getElementById("modalServicio");

    const formulario =
        document.getElementById("formServicio");

    const botonCerrar =
        document.getElementById("cerrarModal");

    const botonCancelar =
        document.getElementById("cancelarServicio");

    const tituloModal =
        document.getElementById("tituloModal");

    const contenedor =
        document.querySelector(".services-grid");


    // ==========================================
    // MOSTRAR SERVICIOS
    // ==========================================

    function mostrarServicios(lista) {

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";


        if (lista.length === 0) {

            contenedor.innerHTML = `
                <div class="empty-message">
                    No se encontraron servicios.
                </div>
            `;

            return;
        }


        lista.forEach(function (servicio) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className =
                "service-card";


            tarjeta.innerHTML = `

                <div class="service-icon">
                    ${servicio.icono || "🦷"}
                </div>

                <div class="service-info">

                    <h3>
                        ${servicio.nombre}
                    </h3>

                    <p>
                        ${servicio.descripcion}
                    </p>

                    <p>
                        <strong>Duración:</strong>
                        ${servicio.duracion}
                    </p>

                    <p>
                        <strong>Precio:</strong>
                        $${Number(servicio.precio).toLocaleString("es-CO")}
                    </p>

                </div>

                <div class="service-actions">

                    <button
                        class="btn-action btn-ver"
                        data-id="${servicio.id}"
                    >
                        Ver
                    </button>

                    <button
                        class="btn-action btn-editar"
                        data-id="${servicio.id}"
                    >
                        Editar
                    </button>

                </div>

            `;


            contenedor.appendChild(tarjeta);

        });


        agregarEventos();

    }


    // ==========================================
    // AGREGAR EVENTOS A LOS BOTONES
    // ==========================================

    function agregarEventos() {

        const botonesVer =
            document.querySelectorAll(".btn-ver");

        const botonesEditar =
            document.querySelectorAll(".btn-editar");


        botonesVer.forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    console.log(
                        "BOTÓN VER PRESIONADO"
                    );

                    const id =
                        this.getAttribute("data-id");

                    verServicio(id);

                }
            );

        });


        botonesEditar.forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    console.log(
                        "BOTÓN EDITAR PRESIONADO"
                    );

                    const id =
                        this.getAttribute("data-id");

                    editarServicio(id);

                }
            );

        });


        console.log(
            "Eventos de botones agregados"
        );

    }


    // ==========================================
    // CONFIGURAR CAMPOS DEL MODAL
    // ==========================================

    function habilitarCampos() {

        const campos = [
            "nombreServicio",
            "descripcionServicio",
            "duracionServicio",
            "precioServicio"
        ];

        campos.forEach(function (id) {

            const campo =
                document.getElementById(id);

            if (campo) {
                campo.disabled = false;
            }

        });


        const botonGuardar =
            formulario.querySelector(
                "button[type='submit']"
            );

        if (botonGuardar) {
            botonGuardar.style.display = "block";
        }


        if (botonCancelar) {
            botonCancelar.textContent = "Cancelar";
        }

    }


    function deshabilitarCampos() {

        const campos = [
            "nombreServicio",
            "descripcionServicio",
            "duracionServicio",
            "precioServicio"
        ];

        campos.forEach(function (id) {

            const campo =
                document.getElementById(id);

            if (campo) {
                campo.disabled = true;
            }

        });


        const botonGuardar =
            formulario.querySelector(
                "button[type='submit']"
            );

        if (botonGuardar) {
            botonGuardar.style.display = "none";
        }


        if (botonCancelar) {
            botonCancelar.textContent = "Cerrar";
        }

    }


    // ==========================================
    // VER SERVICIO
    // ==========================================

    function verServicio(id) {

        console.log(
            "VER SERVICIO - ID:",
            id
        );


        const servicio =
            servicios.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!servicio) {

            console.log(
                "No se encontró el servicio."
            );

            alert(
                "No se encontró la información del servicio."
            );

            return;

        }


        tituloModal.textContent =
            "Información del servicio";


        document.getElementById("servicioId").value =
            servicio.id;


        document.getElementById("nombreServicio").value =
            servicio.nombre;


        document.getElementById("descripcionServicio").value =
            servicio.descripcion;


        document.getElementById("duracionServicio").value =
            servicio.duracion;


        document.getElementById("precioServicio").value =
            servicio.precio;


        // MODO SOLO LECTURA
        deshabilitarCampos();


        modal.style.display =
            "flex";

    }


    // ==========================================
    // EDITAR SERVICIO
    // ==========================================

    function editarServicio(id) {

        console.log(
            "EDITAR SERVICIO - ID:",
            id
        );


        const servicio =
            servicios.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!servicio) {

            alert(
                "No se encontró el servicio."
            );

            return;
        }


        if (!modal || !formulario) {
            return;
        }


        tituloModal.textContent =
            "Editar servicio";


        // VOLVER A HABILITAR EL FORMULARIO
        habilitarCampos();


        document.getElementById("servicioId").value =
            servicio.id;


        document.getElementById("nombreServicio").value =
            servicio.nombre;


        document.getElementById("descripcionServicio").value =
            servicio.descripcion;


        document.getElementById("duracionServicio").value =
            servicio.duracion;


        document.getElementById("precioServicio").value =
            servicio.precio;


        modal.style.display =
            "flex";

    }


    // ==========================================
    // NUEVO SERVICIO
    // ==========================================

    if (botonNuevo) {

        botonNuevo.addEventListener(
            "click",
            function () {

                tituloModal.textContent =
                    "Nuevo servicio";


                // ASEGURAR QUE EL FORMULARIO
                // ESTÉ HABILITADO
                habilitarCampos();


                formulario.reset();


                document.getElementById(
                    "servicioId"
                ).value = "";


                modal.style.display =
                    "flex";

            }
        );

    }


    // ==========================================
    // CERRAR MODAL
    // ==========================================

    function cerrarModal() {

        if (modal) {

            modal.style.display =
                "none";

        }

    }


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarModal
        );

    }


    if (botonCancelar) {

        botonCancelar.addEventListener(
            "click",
            cerrarModal
        );

    }


    // ==========================================
    // GUARDAR SERVICIO
    // ==========================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const id =
                    document.getElementById(
                        "servicioId"
                    ).value;


                const nombre =
                    document.getElementById(
                        "nombreServicio"
                    ).value.trim();


                const descripcion =
                    document.getElementById(
                        "descripcionServicio"
                    ).value.trim();


                const duracion =
                    document.getElementById(
                        "duracionServicio"
                    ).value.trim();


                const precio =
                    document.getElementById(
                        "precioServicio"
                    ).value;


                if (
                    nombre === "" ||
                    descripcion === "" ||
                    duracion === "" ||
                    precio === ""
                ) {

                    alert(
                        "Por favor, completa todos los campos."
                    );

                    return;
                }


                if (id) {

                    // ==================================
                    // EDITAR SERVICIO EXISTENTE
                    // ==================================

                    const indice =
                        servicios.findIndex(
                            function (item) {

                                return String(item.id) ===
                                    String(id);

                            }
                        );


                    if (indice !== -1) {

                        servicios[indice] = {

                            ...servicios[indice],

                            nombre:
                                nombre,

                            descripcion:
                                descripcion,

                            duracion:
                                duracion,

                            precio:
                                Number(precio)

                        };

                    }

                } else {

                    // ==================================
                    // CREAR NUEVO SERVICIO
                    // ==================================

                    const nuevoServicio = {

                        id:
                            Date.now(),

                        nombre:
                            nombre,

                        descripcion:
                            descripcion,

                        duracion:
                            duracion,

                        precio:
                            Number(precio),

                        icono:
                            "🦷"

                    };


                    servicios.push(
                        nuevoServicio
                    );

                }


                localStorage.setItem(
                    "servicios",
                    JSON.stringify(servicios)
                );


                mostrarServicios(
                    servicios
                );


                cerrarModal();


                alert(
                    "Servicio guardado correctamente."
                );

            }
        );

    }


    // ==========================================
    // BUSCADOR
    // ==========================================

    if (buscador) {

        buscador.addEventListener(
            "input",
            function () {

                const texto =
                    this.value
                        .toLowerCase()
                        .trim();


                const resultados =
                    servicios.filter(
                        function (servicio) {

                            return (

                                servicio.nombre
                                    .toLowerCase()
                                    .includes(texto)

                                ||

                                servicio.descripcion
                                    .toLowerCase()
                                    .includes(texto)

                            );

                        }
                    );


                mostrarServicios(
                    resultados
                );

            }
        );

    }


    // ==========================================
    // CERRAR MODAL AL HACER CLIC AFUERA
    // ==========================================

    window.addEventListener(
        "click",
        function (evento) {

            if (
                modal &&
                evento.target === modal
            ) {

                cerrarModal();

            }

        }
    );


    // ==========================================
    // MOSTRAR SERVICIOS AL CARGAR
    // ==========================================

    mostrarServicios(
        servicios
    );

});













