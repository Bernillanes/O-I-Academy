const params = new URLSearchParams(window.location.search);

const courseId = Number(params.get("id"));

const courses = [
    {
        id: 1,
        name: "Seguridad Industrial",
        description: "Capacitación para seguridad dentro de la planta."
    },
    {
        id: 2,
        name: "Calidad",
        description: "Buenas prácticas y procesos de calidad."
    },
    {
        id: 3,
        name: "Inducción O-I",
        description: "Curso de bienvenida para nuevos colaboradores."
    }
];

const modules = [
    {
        id: 1,
        courseId: 1,
        title: "Introducción",
        videos: [],
        documents: [],
        quizzes: [],
        expanded: true
    },
    {
        id: 2,
        courseId: 1,
        title: "Equipo de Protección Personal",
        videos: [
            "Video 1",
            "Video 2",
            "Video 3"
        ],
        documents: [
            "Manual.pdf",
            "Norma.pdf"
        ],
        quizzes: [
            "Evaluación"
        ],
        expanded: false
    }
];

const course = courses.find(c => c.id === courseId);

if (course) {
    document.getElementById("courseTitle").textContent = course.name;
    document.getElementById("courseSubtitle").textContent = course.description;
}

function renderModules() {

    const container = document.getElementById("modulesContainer");

    const courseModules = modules.filter(module => module.courseId === courseId);

    if (courseModules.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="bi bi-journal-bookmark"></i>

                <h3>No hay módulos</h3>

                <p>Crea el primer módulo del curso.</p>

            </div>
        `;

        return;

    }

    container.innerHTML = courseModules.map(module => `

        <div class="module-card" data-id="${module.id}">

            <div class="module-header">

                <div class="module-title">

                    <h3>

                        <i class="bi bi-chevron-${module.expanded ? "down" : "right"}"></i>

                        ${module.title}

                    </h3>

                    <span>

                        ${module.videos.length} Videos ·
                        ${module.documents.length} Documentos ·
                        ${module.quizzes.length} Cuestionarios

                    </span>

                </div>

                <div class="actions">

                    <button class="icon-btn edit">

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button class="icon-btn delete">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>

            ${module.expanded ? `

            <div class="module-grid">

                <div class="content-card">

                    <h4>Videos</h4>

                    <div class="card-counter">

                        ${module.videos.length}

                    </div>

                    <div class="card-list">

                        ${
                            module.videos.length
                            ?
                            module.videos.map(video => `

                                <div class="content-item">

                                    <i class="bi bi-play-circle-fill"></i>

                                    ${video}

                                </div>

                            `).join("")
                            :
                            `<div class="empty-text">Sin videos</div>`
                        }

                    </div>

                    <button class="card-action">

                        <i class="bi bi-plus-lg"></i>

                        Agregar video

                    </button>

                </div>

                <div class="content-card">

                    <h4>Documentos</h4>

                    <div class="card-counter">

                        ${module.documents.length}

                    </div>

                    <div class="card-list">

                        ${
                            module.documents.length
                            ?
                            module.documents.map(doc => `

                                <div class="content-item">

                                    <i class="bi bi-file-earmark-fill"></i>

                                    ${doc}

                                </div>

                            `).join("")
                            :
                            `<div class="empty-text">Sin documentos</div>`
                        }

                    </div>

                    <button class="card-action">

                        <i class="bi bi-plus-lg"></i>

                        Agregar documento

                    </button>

                </div>

                <div class="content-card">

                    <h4>Cuestionarios</h4>

                    <div class="card-counter">

                        ${module.quizzes.length}

                    </div>

                    <div class="card-list">

                        ${
                            module.quizzes.length
                            ?
                            module.quizzes.map(quiz => `

                                <div class="content-item">

                                    <i class="bi bi-patch-question-fill"></i>

                                    ${quiz}

                                </div>

                            `).join("")
                            :
                            `<div class="empty-text">Sin cuestionarios</div>`
                        }

                    </div>

                    <button class="card-action">

                        <i class="bi bi-plus-lg"></i>

                        Agregar cuestionario

                    </button>

                </div>

            </div>

            ` : ""}

        </div>

    `).join("");

    document.querySelectorAll(".module-header").forEach((header, index) => {

        header.addEventListener("click", () => {

            const module = courseModules[index];

            module.expanded = !module.expanded;

            renderModules();

        });

    });

}

renderModules();
const modal = document.getElementById("moduleModal");
const contentModal = document.getElementById("contentModal");

const contentModalTitle = document.getElementById("contentModalTitle");

const secondFieldLabel = document.getElementById("secondFieldLabel");

const contentName = document.getElementById("contentName");

const contentValue = document.getElementById("contentValue");

let currentModule = null;

let currentType = null;

document.getElementById("newModule").addEventListener("click", () => {

    modal.classList.add("active");

});

document.getElementById("closeModuleModal").addEventListener("click", () => {

    modal.classList.remove("active");

});

document.querySelector(".btn-cancel").addEventListener("click", () => {

    modal.classList.remove("active");

});

document.getElementById("saveModule").addEventListener("click", () => {

    const input = document.getElementById("moduleName");

    const title = input.value.trim();

    if (title === "") {

        alert("Escribe el nombre del módulo.");

        return;

    }

    modules.push({

        id: Date.now(),

        courseId: courseId,

        title: title,

        videos: [],

        documents: [],

        quizzes: [],

        expanded: false

    });

    input.value = "";

    modal.classList.remove("active");

    renderModules();

});

/*=====================================
=       EVENTOS DE LAS TARJETAS       =
=====================================*/
document.getElementById("closeContentModal").addEventListener("click",()=>{

    contentModal.classList.remove("active");

});

document.getElementById("cancelContent").addEventListener("click",()=>{

    contentModal.classList.remove("active");

});

document.addEventListener("click", (e) => {

    /*=========================
      AGREGAR CONTENIDO
    =========================*/

    const addButton = e.target.closest(".card-action");

    if (addButton) {

        const card = addButton.closest(".content-card");

        const moduleCard = addButton.closest(".module-card");

        const moduleId = Number(moduleCard.dataset.id);

        currentModule = modules.find(m => m.id === moduleId);

        const section = card.querySelector("h4").textContent;

        if (section === "Videos") {

            currentType = "videos";

            contentModalTitle.textContent = "Agregar video";

            secondFieldLabel.textContent = "URL del video";

            contentValue.placeholder = "https://...";

        }

        if (section === "Documentos") {

            currentType = "documents";

            contentModalTitle.textContent = "Agregar documento";

            secondFieldLabel.textContent = "Archivo o URL";

            contentValue.placeholder = "Manual.pdf";

        }

        if (section === "Cuestionarios") {

            currentType = "quizzes";

            contentModalTitle.textContent = "Agregar cuestionario";

            secondFieldLabel.textContent = "Descripción";

            contentValue.placeholder = "";

        }

        contentName.value = "";

        contentValue.value = "";

        contentModal.classList.add("active");

        return;

    }

    /*=========================
      EDITAR MÓDULO
    =========================*/

    const editButton = e.target.closest(".icon-btn.edit");

    if (editButton) {

        e.stopPropagation();

        const moduleCard = editButton.closest(".module-card");

        const moduleId = Number(moduleCard.dataset.id);

        const module = modules.find(m => m.id === moduleId);

        console.log("Editar:", module);

        return;

    }

    /*=========================
      ELIMINAR MÓDULO
    =========================*/

    const deleteButton = e.target.closest(".icon-btn.delete");

    if (deleteButton) {

        e.stopPropagation();

        const moduleCard = deleteButton.closest(".module-card");

        const moduleId = Number(moduleCard.dataset.id);

        const index = modules.findIndex(m => m.id === moduleId);

        if (index >= 0) {

            modules.splice(index, 1);

            renderModules();

        }

        return;

    }

});
document.getElementById("saveContent").addEventListener("click",()=>{

    const name=contentName.value.trim();

    if(name===""){

        alert("Escribe un nombre.");

        return;

    }

    currentModule[currentType].push(name);

    contentModal.classList.remove("active");

    renderModules();

});