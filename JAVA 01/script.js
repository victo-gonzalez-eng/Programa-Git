/* =========================================================
   TASKFLOW - DASHBOARD
   ARCHIVO: script.js
   ========================================================= */


/* ================= ELEMENTOS PRINCIPALES ================= */

const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const cancelModalButton = document.getElementById("cancelModal");

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");


/* ================= FECHA ACTUAL ================= */

function mostrarFecha() {

    const fecha = new Date();

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

    const dia = fecha.getDate();

    const mes = meses[fecha.getMonth()];

    const año = fecha.getFullYear();

    const fechaTexto =
        dia + " " + mes + " " + año;

    document.getElementById("currentDate").textContent = fechaTexto;
}

mostrarFecha();


/* ================= ABRIR MODAL ================= */

function abrirModal() {

    modal.classList.add("show");

    document.getElementById("taskName").focus();
}

openModalButton.addEventListener(
    "click",
    abrirModal
);


/* ================= BOTONES SECUNDARIOS ================= */

const quickAdd = document.getElementById("quickAdd");

quickAdd.addEventListener(
    "click",
    abrirModal
);


const secondaryButtons =
    document.querySelectorAll(".open-modal-secondary");

secondaryButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        abrirModal
    );

});


/* ================= CERRAR MODAL ================= */

function cerrarModal() {

    modal.classList.remove("show");

    taskForm.reset();

    document.getElementById("formError").textContent = "";
}

closeModalButton.addEventListener(
    "click",
    cerrarModal
);

cancelModalButton.addEventListener(
    "click",
    cerrarModal
);


/* ================= CERRAR AL HACER CLICK AFUERA ================= */

modal.addEventListener("click", function(event) {

    if (event.target === modal) {

        cerrarModal();

    }

});


/* ================= MOSTRAR MENSAJE ================= */

function mostrarMensaje(titulo, mensaje) {

    toastTitle.textContent = titulo;

    toastMessage.textContent = mensaje;

    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);
}


/* ================= AGREGAR NUEVA TAREA ================= */

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const taskName =
            document.getElementById("taskName").value.trim();

        const taskDescription =
            document.getElementById("taskDescription").value.trim();

        const taskCategory =
            document.getElementById("taskCategory").value;

        const taskPriority =
            document.getElementById("taskPriority").value;

        const taskDate =
            document.getElementById("taskDate").value;


        const formError =
            document.getElementById("formError");


        /* VALIDACIÓN */

        if (taskName === "") {

            formError.textContent =
                "Por favor escribe el nombre de la actividad.";

            return;
        }


        formError.textContent = "";


        /* PRIORIDAD */

        let priorityText = "";
        let priorityClass = "";

        if (taskPriority === "high") {

            priorityText = "Alta";
            priorityClass = "high";

        }

        else if (taskPriority === "medium") {

            priorityText = "Media";
            priorityClass = "medium";

        }

        else {

            priorityText = "Baja";
            priorityClass = "low";

        }


        /* FECHA */

        let fechaTexto = "Sin fecha";

        if (taskDate !== "") {

            const fecha =
                new Date(taskDate + "T00:00:00");

            fechaTexto =
                fecha.getDate() +
                "/" +
                (fecha.getMonth() + 1) +
                "/" +
                fecha.getFullYear();
        }


        /* CREAR ELEMENTO */

        const nuevaTarea =
            document.createElement("div");

        nuevaTarea.className = "task";

        nuevaTarea.setAttribute(
            "data-status",
            "pending"
        );

        nuevaTarea.setAttribute(
            "data-title",
            taskName.toLowerCase()
        );


        nuevaTarea.innerHTML = `

            <button class="task-check">
                ✓
            </button>

            <div class="task-information">

                <h3>
                    ${taskName}
                </h3>

                <div class="task-details">

                    <span>
                        ${taskCategory}
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        ${fechaTexto}
                    </span>

                </div>

            </div>

            <span class="priority ${priorityClass}">
                ${priorityText}
            </span>

            <button
                class="delete-task"
                title="Eliminar"
            >
                ×
            </button>
        `;


        taskList.appendChild(nuevaTarea);


        /* CERRAR */

        cerrarModal();


        /* MOSTRAR MENSAJE */

        mostrarMensaje(
            "Actividad creada",
            "La actividad fue agregada correctamente."
        );


        /* ACTUALIZAR ESTADÍSTICAS */

        actualizarEstadisticas();

    }
);


/* ================= COMPLETAR TAREA ================= */

taskList.addEventListener(
    "click",
    function(event) {

        const boton =
            event.target.closest(".task-check");


        if (!boton) {
            return;
        }


        const tarea =
            boton.closest(".task");


        if (tarea.classList.contains("completed")) {

            tarea.classList.remove("completed");

            tarea.setAttribute(
                "data-status",
                "pending"
            );

            boton.classList.remove("checked");

            mostrarMensaje(
                "Actividad pendiente",
                "La actividad volvió a estar pendiente."
            );

        }

        else {

            tarea.classList.add("completed");

            tarea.setAttribute(
                "data-status",
                "completed"
            );

            boton.classList.add("checked");

            mostrarMensaje(
                "Actividad completada",
                "La actividad fue marcada como completada."
            );

        }


        actualizarEstadisticas();

    }
);


/* ================= ELIMINAR TAREA ================= */

taskList.addEventListener(
    "click",
    function(event) {

        const boton =
            event.target.closest(".delete-task");


        if (!boton) {
            return;
        }


        const tarea =
            boton.closest(".task");


        const confirmar =
            confirm(
                "¿Deseas eliminar esta actividad?"
            );


        if (confirmar) {

            tarea.remove();


            mostrarMensaje(
                "Actividad eliminada",
                "La actividad fue eliminada correctamente."
            );


            actualizarEstadisticas();

        }

    }
);


/* ================= ACTUALIZAR ESTADÍSTICAS ================= */

function actualizarEstadisticas() {

    const tareas =
        document.querySelectorAll(".task");


    const completadas =
        document.querySelectorAll(
            '.task[data-status="completed"]'
        );


    const total =
        tareas.length;


    const totalCompletadas =
        completadas.length;


    const pendientes =
        total - totalCompletadas;


    let porcentaje = 0;


    if (total > 0) {

        porcentaje =
            Math.round(
                (totalCompletadas / total) * 100
            );

    }


    /* TARJETAS */

    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = totalCompletadas;


    document.getElementById(
        "pendingTasks"
    ).textContent = pendientes;


    document.getElementById(
        "progressNumber"
    ).textContent =
        porcentaje + "%";


    /* CÍRCULO */

    document.getElementById(
        "circleProgress"
    ).textContent =
        porcentaje + "%";


    document.getElementById(
        "progressCompleted"
    ).textContent =
        totalCompletadas;


    document.getElementById(
        "progressPending"
    ).textContent =
        pendientes;


    /* ACTUALIZAR CÍRCULO */

    const grados =
        porcentaje * 3.6;


    const progressCircle =
        document.querySelector(
            ".progress-circle"
        );


    progressCircle.style.background =
        `conic-gradient(
            #2563eb 0deg,
            #2563eb ${grados}deg,
            #e8edf3 ${grados}deg,
            #e8edf3 360deg
        )`;

}


/* ================= FILTROS ================= */

const filtros =
    document.querySelectorAll(".filter");


filtros.forEach(function(filtro) {

    filtro.addEventListener(
        "click",
        function() {


            filtros.forEach(function(item) {

                item.classList.remove(
                    "active-filter"
                );

            });


            filtro.classList.add(
                "active-filter"
            );


            const tipo =
                filtro.getAttribute(
                    "data-filter"
                );


            const tareas =
                document.querySelectorAll(
                    ".task"
                );


            tareas.forEach(function(tarea) {

                const estado =
                    tarea.getAttribute(
                        "data-status"
                    );


                if (
                    tipo === "all" ||
                    estado === tipo
                ) {

                    tarea.style.display =
                        "flex";

                }

                else {

                    tarea.style.display =
                        "none";

                }

            });

        }
    );

});


/* ================= BUSCADOR ================= */

searchInput.addEventListener(
    "input",
    function() {

        const texto =
            searchInput.value
                .toLowerCase()
                .trim();


        const tareas =
            document.querySelectorAll(
                ".task"
            );


        tareas.forEach(function(tarea) {

            const titulo =
                tarea.getAttribute(
                    "data-title"
                );


            if (
                titulo.includes(texto)
            ) {

                tarea.style.display =
                    "flex";

            }

            else {

                tarea.style.display =
                    "none";

            }

        });

    }
);


/* ================= MENÚ LATERAL ================= */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


const dashboardSection =
    document.getElementById(
        "dashboardSection"
    );


const sections = {

    dashboard:
        dashboardSection,

    actividades:
        document.getElementById(
            "actividadesSection"
        ),

    calendario:
        document.getElementById(
            "calendarioSection"
        ),

    reportes:
        document.getElementById(
            "reportesSection"
        ),

    configuracion:
        document.getElementById(
            "configuracionSection"
        )

};


menuItems.forEach(function(item) {

    item.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const sectionName =
                item.getAttribute(
                    "data-section"
                );


            /* CAMBIAR BOTÓN ACTIVO */

            menuItems.forEach(
                function(menu) {

                    menu.classList.remove(
                        "active"
                    );

                }
            );


            item.classList.add(
                "active"
            );


            /* OCULTAR DASHBOARD */

            dashboardSection.style.display =
                "none";


            /* OCULTAR OTRAS SECCIONES */

            Object.values(sections)
                .forEach(function(section) {

                    if (
                        section !== dashboardSection
                    ) {

                        section.classList.remove(
                            "show-section"
                        );

                    }

                });


            /* MOSTRAR SECCIÓN */

            if (
                sectionName ===
                "dashboard"
            ) {

                dashboardSection.style.display =
                    "block";

            }

            else {

                sections[
                    sectionName
                ].classList.add(
                    "show-section"
                );

            }


            /* CERRAR SIDEBAR EN CELULAR */

            sidebar.classList.remove(
                "open"
            );

        }
    );

});


/* ================= BOTÓN REPORTE ================= */

const quickReport =
    document.getElementById(
        "quickReport"
    );


quickReport.addEventListener(
    "click",
    function() {

        menuItems.forEach(
            function(menu) {

                menu.classList.remove(
                    "active"
                );

            }
        );


        document.querySelector(
            '[data-section="reportes"]'
        ).classList.add(
            "active"
        );


        dashboardSection.style.display =
            "none";


        Object.values(sections)
            .forEach(function(section) {

                if (
                    section !== dashboardSection
                ) {

                    section.classList.remove(
                        "show-section"
                    );

                }

            });


        sections.reportes.classList.add(
            "show-section"
        );

    }
);


/* ================= NOTIFICACIONES ================= */

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


notificationButton.addEventListener(
    "click",
    function() {

        mostrarMensaje(
            "Notificaciones",
            "Tienes 3 actividades pendientes."
        );

    }
);


/* ================= MENÚ EN CELULAR ================= */

mobileMenu.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* ================= CERRAR MENÚ AL CAMBIAR TAMAÑO ================= */

window.addEventListener(
    "resize",
    function() {

        if (
            window.innerWidth > 800
        ) {

            sidebar.classList.remove(
                "open"
            );

        }

    }
);


/* ================= INICIAR ESTADÍSTICAS ================= */

actualizarEstadisticas();