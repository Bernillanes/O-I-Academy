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

const params = new URLSearchParams(window.location.search);
const courseId = Number(params.get("id"));

const course = courses.find(c => c.id === courseId) || courses[0];

document.getElementById("courseTitle").textContent = course.name;
document.getElementById("courseSubtitle").textContent = course.description;

const defaultModules = [
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
            { id: 101, name: "Video 1", description: "", file: "" },
            { id: 102, name: "Video 2", description: "", file: "" },
            { id: 103, name: "Video 3", description: "", file: "" }
        ],
        documents: [
            { id: 201, name: "Manual.pdf", description: "", file: "Manual.pdf" },
            { id: 202, name: "Norma.pdf", description: "", file: "Norma.pdf" }
        ],
        quizzes: [
            {
                id: 301,
                name: "Evaluación",
                description: "",
                questions: []
            }
        ],
        expanded: false
    }
];

const savedModules = JSON.parse(
    localStorage.getItem("oiModules")
);

const modules = Array.isArray(savedModules)
    ? savedModules
    : defaultModules;

function saveModules() {
    localStorage.setItem(
        "oiModules",
        JSON.stringify(modules)
    );
}

const modal =
    document.getElementById("moduleModal");

const contentModal =
    document.getElementById("contentModal");

const contentModalTitle =
    document.getElementById("contentModalTitle");

const secondFieldLabel =
    document.getElementById("secondFieldLabel");

const contentName =
    document.getElementById("contentName");

const contentValue =
    document.getElementById("contentValue");

const questionModal =
    document.getElementById("questionModal");

const closeQuestionModal =
    document.getElementById("closeQuestionModal");

const cancelQuestion =
    document.getElementById("cancelQuestion");

let currentModule = null;
let currentType = null;
let editingContent = null;
let editingModule = null;
let currentQuiz = null;
let editingQuestion = null;
let questions = [];

function renderContentItems(
    items,
    icon,
    type
) {

    if (!items || items.length === 0) {

        return `
            <div class="empty-text">
                No hay contenido agregado.
            </div>
        `;
    }

    return items.map(item => {

        if (typeof item === "string") {

            item = {
                id: "",
                name: item,
                description: "",
                file: ""
            };
        }

        return `
            <div class="content-item">

                <div
                    class="content-info content-open"
                    data-id="${item.id}"
                    data-type="${type}"
                    style="cursor:pointer;"
                >

                    <div>

                        <div class="content-name">

                            <i class="${icon}"></i>

                            ${item.name || "Sin nombre"}

                        </div>

                        ${
                            item.description
                                ? `
                                    <div class="content-description">
                                        ${item.description}
                                    </div>
                                  `
                                : ""
                        }

                        ${
                            item.file
                                ? `
                                    <div class="content-file">
                                        ${item.fileName || "Documento PDF"}
                                    </div>
                                  `
                                : ""
                        }

                    </div>

                </div>
                ${
    type === "quizzes"
        ? `
            <button
                class="mini-btn open-quiz-player"
                data-id="${item.id}"
                data-type="${type}"
                title="Ver cuestionario"
            >
                <i class="bi bi-play-fill"></i>
            </button>
        `
        : ""
}

                <div class="content-actions">

                    <button
                        class="mini-btn edit-content"
                        data-id="${item.id}"
                        data-type="${type}"
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        class="mini-btn delete delete-content"
                        data-id="${item.id}"
                        data-type="${type}"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>
        `;

    }).join("");
}

function renderModules() {

    const container =
        document.getElementById("modulesContainer");

    container.innerHTML = "";

    const courseModules =
        modules.filter(
            m => m.courseId === courseId
        );

    courseModules.forEach(module => {

        const moduleCard =
            document.createElement("div");

        moduleCard.className =
            "module-card";

        moduleCard.dataset.id =
            module.id;

        moduleCard.innerHTML = `

            <div class="module-header">

                <div class="module-title">

                    <i class="bi bi-chevron-${
                        module.expanded
                            ? "down"
                            : "right"
                    }"></i>

                    <span>
                        ${module.title}
                    </span>

                </div>

                <div class="actions">

                    <button
                        class="icon-btn edit edit-module"
                        data-id="${module.id}"
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        class="icon-btn delete delete-module"
                        data-id="${module.id}"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>

            ${
                module.expanded
                    ? `

                        <div class="module-grid">

                            <div class="content-card">

                                <div class="card-header">

                                    <h4>

                                        <i class="bi bi-play-circle-fill"></i>

                                        Videos

                                    </h4>

                                    <button
                                        class="content-btn card-action"
                                        data-type="videos"
                                        data-module-id="${module.id}"
                                    >

                                        <i class="bi bi-plus-lg"></i>

                                    </button>

                                </div>

                                <div class="card-body">

                                    ${renderContentItems(
                                        module.videos,
                                        "bi bi-play-circle-fill",
                                        "videos"
                                    )}

                                </div>

                            </div>


                            <div class="content-card">

                                <div class="card-header">

                                    <h4>

                                        <i class="bi bi-file-earmark-pdf-fill"></i>

                                        Documentos

                                    </h4>

                                    <button
                                        class="content-btn card-action"
                                        data-type="documents"
                                        data-module-id="${module.id}"
                                    >

                                        <i class="bi bi-plus-lg"></i>

                                    </button>

                                </div>

                                <div class="card-body">

                                    ${renderContentItems(
                                        module.documents,
                                        "bi bi-file-earmark-pdf-fill",
                                        "documents"
                                    )}

                                </div>

                            </div>


                            <div class="content-card">

                                <div class="card-header">

                                    <h4>

                                        <i class="bi bi-patch-question-fill"></i>

                                        Cuestionarios

                                    </h4>

                                    <button
                                        class="content-btn card-action"
                                        data-type="quizzes"
                                        data-module-id="${module.id}"
                                    >

                                        <i class="bi bi-plus-lg"></i>

                                    </button>

                                </div>

                                <div class="card-body">

                                    ${renderContentItems(
                                        module.quizzes,
                                        "bi bi-patch-question-fill",
                                        "quizzes"
                                    )}

                                </div>

                            </div>

                        </div>

                    `
                    : ""
            }

        `;

        container.appendChild(moduleCard);

    });
}

renderModules();
document
    .getElementById("newModule")
    .addEventListener("click", () => {

        editingModule = null;

        document
            .getElementById("moduleName")
            .value = "";

        document
            .querySelector("#moduleModal h2")
            .textContent = "Nuevo módulo";

        modal.classList.add("active");

    });


document
    .getElementById("closeModuleModal")
    .addEventListener("click", () => {

        modal.classList.remove("active");

    });


document
    .querySelector("#moduleModal .btn-cancel")
    .addEventListener("click", () => {

        modal.classList.remove("active");

    });


document
    .getElementById("saveModule")
    .addEventListener("click", () => {

        const input =
            document.getElementById("moduleName");

        const title =
            input.value.trim();

        if (title === "") {

            alert("Escribe el nombre del módulo.");

            return;

        }

        if (editingModule) {

            editingModule.title = title;

            editingModule = null;

        } else {

            modules.push({

                id: Date.now(),

                courseId: courseId,

                title: title,

                videos: [],

                documents: [],

                quizzes: [],

                expanded: false

            });

        }

        saveModules();

        input.value = "";

        modal.classList.remove("active");

        renderModules();

    });


/* =====================================
   ACORDEÓN DE MÓDULOS
===================================== */

document.addEventListener("click", e => {

    const header =
        e.target.closest(".module-header");

    if (!header) return;

    if (
        e.target.closest(".actions") ||
        e.target.closest(".icon-btn")
    ) {
        return;
    }

    const moduleCard =
        header.closest(".module-card");

    const id =
        Number(moduleCard.dataset.id);

    const module =
        modules.find(m => m.id === id);

    if (!module) return;

    module.expanded =
        !module.expanded;

    saveModules();

    renderModules();

});


/* =====================================
   EDITAR MÓDULO
===================================== */

document.addEventListener("click", e => {

    const button =
        e.target.closest(".edit-module");

    if (!button) return;

    e.stopPropagation();

    const id =
        Number(button.dataset.id);

    const module =
        modules.find(m => m.id === id);

    if (!module) return;

    editingModule = module;

    document
        .getElementById("moduleName")
        .value = module.title;

    document
        .querySelector("#moduleModal h2")
        .textContent = "Editar módulo";

    modal.classList.add("active");

});


/* =====================================
   ELIMINAR MÓDULO
===================================== */

document.addEventListener("click", e => {

    const button =
        e.target.closest(".delete-module");

    if (!button) return;

    e.stopPropagation();

    const id =
        Number(button.dataset.id);

    const index =
        modules.findIndex(m => m.id === id);

    if (index === -1) return;

    if (
        !confirm(
            "¿Seguro que quieres eliminar este módulo?"
        )
    ) {
        return;
    }

    modules.splice(index, 1);

    saveModules();

    renderModules();

});


/* =====================================
   ABRIR MODAL DE CONTENIDO
===================================== */

document.addEventListener("click", e => {

    const button =
        e.target.closest(".card-action");

    if (!button) return;

    e.stopPropagation();

    const moduleId =
        Number(button.dataset.moduleId);

    const type =
        button.dataset.type;

    currentModule =
        modules.find(m => m.id === moduleId);

    if (!currentModule) return;

    currentType = type;

    editingContent = null;

    contentName.value = "";

    document
        .getElementById("contentDescription")
        .value = "";

    contentValue.value = "";

    if (type === "videos") {

        contentModalTitle.textContent =
            "Agregar video";
    
        secondFieldLabel.textContent =
            "URL del video";
    
        contentValue.type =
            "text";
    
        contentValue.accept = "";
    
        contentValue.placeholder =
            "https://www.youtube.com/watch?v=...";
    
    }

    if (type === "documents") {

        contentModalTitle.textContent =
            "Agregar documento";
    
        secondFieldLabel.textContent =
            "Archivo PDF";
    
        contentValue.type =
            "file";
    
        contentValue.accept =
            ".pdf,application/pdf";
    
        contentValue.placeholder =
            "";
    
    }

    if (type === "quizzes") {

        contentModalTitle.textContent =
            "Agregar cuestionario";
    
        secondFieldLabel.textContent =
            "Descripción";
    
        contentValue.type =
            "text";
    
        contentValue.accept = "";
    
        contentValue.placeholder =
            "Descripción del cuestionario";
    
    }

    contentModal.classList.add("active");

});


/* =====================================
   CERRAR MODAL DE CONTENIDO
===================================== */

document
    .getElementById("closeContentModal")
    .addEventListener("click", () => {

        contentModal.classList.remove("active");

        editingContent = null;

    });


document
    .getElementById("cancelContent")
    .addEventListener("click", () => {

        contentModal.classList.remove("active");

        editingContent = null;

    });


/* =====================================
   GUARDAR CONTENIDO
===================================== */

document
    .getElementById("saveContent")
    .addEventListener("click", () => {

        if (!currentModule || !currentType) {
            return;
        }

        const name =
            contentName.value.trim();

        if (name === "") {

            alert("Escribe un nombre.");

            return;

        }

        const description =
            document
                .getElementById("contentDescription")
                .value
                .trim();


        /* =========================
           VIDEO
        ========================= */

        if (currentType === "videos") {

            const url =
                contentValue.value.trim();

            if (url === "") {

                alert(
                    "Escribe la URL del video."
                );

                return;

            }

            if (editingContent) {

                editingContent.name =
                    name;

                editingContent.url =
                    url;

                editingContent.description =
                    description;

            } else {

                currentModule.videos.push({

                    id: Date.now(),

                    name: name,

                    url: url,

                    description: description

                });

            }

        }


        /* =========================
           DOCUMENTO PDF
        ========================= */

        if (currentType === "documents") {

            const file =
                contentValue.files[0];


            /*
             * Si estamos editando y no
             * seleccionamos otro PDF,
             * conservamos el actual.
             */

            if (editingContent && !file) {

                editingContent.name =
                    name;

                editingContent.description =
                    description;

                saveModules();

                cerrarModalContenido();

                return;

            }


            if (!file) {

                alert(
                    "Selecciona un archivo PDF."
                );

                return;

            }


            if (
                file.type !==
                "application/pdf"
            ) {

                alert(
                    "Solo puedes seleccionar archivos PDF."
                );

                return;

            }


            /*
             * Límite para evitar llenar
             * el localStorage.
             */

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "El PDF no puede superar 5 MB."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload = function () {

                if (editingContent) {

                    editingContent.name =
                        name;

                    editingContent.description =
                        description;

                    editingContent.fileName =
                        file.name;

                    editingContent.file =
                        reader.result;

                } else {

                    currentModule.documents.push({

                        id: Date.now(),

                        name: name,

                        description: description,

                        fileName: file.name,

                        file: reader.result,

                        questions: []

                    });

                }


                guardarYcerrarContenido();

            };


            reader.readAsDataURL(file);

            return;

        }


        /* =========================
           CUESTIONARIO
        ========================= */

        if (currentType === "quizzes") {

            const quizDescription =
                contentValue.value.trim();


            if (editingContent) {

                editingContent.name =
                    name;

                editingContent.description =
                    quizDescription;

            } else {

                currentModule.quizzes.push({

                    id: Date.now(),

                    name: name,

                    description:
                        quizDescription,

                    questions: []

                });

            }

        }


        guardarYcerrarContenido();

    });


/* =====================================
   GUARDAR Y CERRAR CONTENIDO
===================================== */

function guardarYcerrarContenido() {

    saveModules();

    contentName.value = "";

    contentValue.value = "";

    document
        .getElementById("contentDescription")
        .value = "";

    contentModal.classList.remove(
        "active"
    );

    editingContent = null;

    currentModule = null;

    currentType = null;

    renderModules();

}


/* =====================================
   CERRAR MODAL DESPUÉS DE EDITAR PDF
===================================== */

function cerrarModalContenido() {

    contentName.value = "";

    contentValue.value = "";

    document
        .getElementById("contentDescription")
        .value = "";

    contentModal.classList.remove(
        "active"
    );

    editingContent = null;

    currentModule = null;

    currentType = null;

    renderModules();

}


/* =====================================
   EDITAR CONTENIDO
===================================== */

document.addEventListener("click", e => {

    const button =
        e.target.closest(".edit-content");

    if (!button) return;

    e.stopPropagation();

    const id =
        Number(button.dataset.id);

    const type =
        button.dataset.type;

    const moduleCard =
        button.closest(".module-card");

    const moduleId =
        Number(moduleCard.dataset.id);

    const module =
        modules.find(m => m.id === moduleId);

    if (!module) return;

    const item =
        module[type].find(
            content => {

                if (
                    typeof content === "string"
                ) {
                    return false;
                }

                return content.id === id;

            }
        );

    if (!item) return;

    currentModule = module;

    currentType = type;

    editingContent = item;

    contentName.value =
        item.name || "";

    document
        .getElementById("contentDescription")
        .value =
            item.description || "";

    contentValue.value = "";

    contentValue.value = "";


    /* =========================
       EDITAR VIDEO
    ========================= */
    
    if (type === "videos") {
    
        contentModalTitle.textContent =
            "Editar video";
    
        secondFieldLabel.textContent =
            "URL del video";
    
        contentValue.type =
            "text";
    
        contentValue.accept = "";
    
        contentValue.placeholder =
            "https://www.youtube.com/watch?v=...";
    
        contentValue.value =
            item.url || "";
    
    }
    
    
    /* =========================
       EDITAR DOCUMENTO
    ========================= */
    
    if (type === "documents") {
    
        contentModalTitle.textContent =
            "Editar documento";
    
        secondFieldLabel.textContent =
            "Archivo PDF";
    
        contentValue.type =
            "file";
    
        contentValue.accept =
            ".pdf,application/pdf";
    
        contentValue.placeholder =
            "";
    
    }
    
    
    /* =========================
       EDITAR CUESTIONARIO
    ========================= */
    
    if (type === "quizzes") {
    
        contentModalTitle.textContent =
            "Editar cuestionario";
    
        secondFieldLabel.textContent =
            "Descripción";
    
        contentValue.type =
            "text";
    
        contentValue.accept = "";
    
        contentValue.placeholder =
            "Descripción del cuestionario";
    
        contentValue.value =
            item.description || "";
    
    }

    contentModal.classList.add("active");

});


/* =====================================
   ELIMINAR CONTENIDO
===================================== */

document.addEventListener("click", e => {

    const button =
        e.target.closest(".delete-content");

    if (!button) return;

    e.stopPropagation();

    const id =
        Number(button.dataset.id);

    const type =
        button.dataset.type;

    const moduleCard =
        button.closest(".module-card");

    const moduleId =
        Number(moduleCard.dataset.id);

    const module =
        modules.find(m => m.id === moduleId);

    if (!module) return;

    const index =
        module[type].findIndex(
            content =>
                typeof content !== "string" &&
                content.id === id
        );

    if (index === -1) return;

    if (
        !confirm(
            "¿Seguro que quieres eliminar este contenido?"
        )
    ) {
        return;
    }

    module[type].splice(index, 1);

    saveModules();

    renderModules();

});


/* =====================================
   ABRIR CUESTIONARIO
===================================== */

document.addEventListener("click", e => {

    const item =
        e.target.closest(".content-open");

    if (!item) return;

    const type =
        item.dataset.type;

    if (type !== "quizzes") return;

    const id =
        Number(item.dataset.id);

    const moduleCard =
        item.closest(".module-card");

    const moduleId =
        Number(moduleCard.dataset.id);

    const module =
        modules.find(m => m.id === moduleId);

    if (!module) return;

    currentModule = module;

    currentQuiz =
        module.quizzes.find(
            quiz => quiz.id === id
        );

    if (!currentQuiz) return;

    questions =
        [...(currentQuiz.questions || [])];

    editingQuestion = null;

    if (typeof renderQuestionsList === "function") {

        renderQuestionsList();

    }

    questionModal.classList.add("active");

});
/* =====================================
   EDITOR DE PREGUNTAS
===================================== */

function renderQuestionsList() {

    const list =
        document.getElementById("questionsList");

    list.innerHTML = "";

    if (questions.length === 0) {

        list.innerHTML = `
            <div class="empty-text">
                No hay preguntas.
            </div>
        `;

        document
            .getElementById("questionEditor")
            .innerHTML = `
                <div class="empty-text">
                    Crea una nueva pregunta.
                </div>
            `;

        return;
    }

    questions.forEach((question, index) => {

        const card =
            document.createElement("div");

        card.className =
            "question-card" +
            (
                editingQuestion === index
                    ? " active"
                    : ""
            );

        card.innerHTML = `

            <div class="question-header">

                <div>

                    <strong>
                        Pregunta ${index + 1}
                    </strong>

                    <div class="question-type">
                        ${getQuestionTypeName(question.type)}
                    </div>

                </div>

                <button
                    class="delete-question"
                    data-index="${index}"
                >

                    <i class="bi bi-trash-fill"></i>

                </button>

            </div>

        `;

        card.addEventListener("click", e => {

            if (
                e.target.closest(".delete-question")
            ) {
                return;
            }

            if (
                editingQuestion !== null
            ) {
                saveCurrentQuestion();
            }

            editingQuestion = index;

            renderQuestionsList();

            loadQuestion();

        });

        list.appendChild(card);

    });

}


function getQuestionTypeName(type) {

    const names = {

        multiple:
            "Opción múltiple",

        boolean:
            "Verdadero / Falso",

        text:
            "Respuesta abierta",

        checkbox:
            "Selección múltiple",

        order:
            "Ordenar pasos",

        match:
            "Relacionar columnas",

        complete:
            "Completar espacios"

    };

    return names[type] || "Pregunta";

}


/* =====================================
   NUEVA PREGUNTA
===================================== */

document
    .getElementById("newQuestion")
    .addEventListener("click", () => {

        if (
            editingQuestion !== null
        ) {
            saveCurrentQuestion();
        }

        const newQuestion = {

            type: "multiple",

            question: "",

            options: [
                "",
                "",
                "",
                ""
            ],

            correctAnswer: 0

        };

        questions.push(newQuestion);

        editingQuestion =
            questions.length - 1;

        renderQuestionsList();

        loadQuestion();

    });


/* =====================================
   CARGAR PREGUNTA
===================================== */

function loadQuestion() {

    if (
        editingQuestion === null ||
        !questions[editingQuestion]
    ) {
        return;
    }

    const question =
        questions[editingQuestion];

    document
        .getElementById("questionType")
        .value =
            question.type || "multiple";

    renderQuestionEditor(
        question.type || "multiple"
    );

}


/* =====================================
   GENERAR EDITOR SEGÚN TIPO
===================================== */

function renderQuestionEditor(type) {

    const editor =
        document.getElementById(
            "questionEditor"
        );

    const question =
        questions[editingQuestion];

    if (!question) {

        editor.innerHTML = "";

        return;

    }


    if (type === "multiple") {

        question.options =
            question.options || [
                "",
                "",
                "",
                ""
            ];

        editor.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Escribe la pregunta..."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Opciones</label>

                <div id="optionsContainer">

                    ${question.options.map(
                        (option, index) => `

                        <div class="form-group">

                            <input
                                type="text"
                                class="question-option"
                                data-index="${index}"
                                value="${option || ""}"
                                placeholder="Opción ${index + 1}"
                            >

                        </div>

                    `).join("")}

                </div>

            </div>

            <div class="form-group">

                <label>Respuesta correcta</label>

                <select id="correctAnswer">

                    ${question.options.map(
                        (option, index) => `

                        <option
                            value="${index}"
                            ${
                                Number(
                                    question.correctAnswer
                                ) === index
                                    ? "selected"
                                    : ""
                            }
                        >
                            Opción ${index + 1}
                        </option>

                    `).join("")}

                </select>

            </div>

        `;

    }


    if (type === "boolean") {

        editor.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Escribe la pregunta..."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Respuesta correcta</label>

                <select id="correctAnswer">

                    <option
                        value="0"
                        ${
                            Number(
                                question.correctAnswer
                            ) === 0
                                ? "selected"
                                : ""
                        }
                    >
                        Verdadero
                    </option>

                    <option
                        value="1"
                        ${
                            Number(
                                question.correctAnswer
                            ) === 1
                                ? "selected"
                                : ""
                        }
                    >
                        Falso
                    </option>

                </select>

            </div>

        `;

    }


    if (type === "text") {

        editor.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Escribe la pregunta..."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Respuesta esperada</label>

                <input
                    id="correctText"
                    type="text"
                    value="${question.correctText || ""}"
                    placeholder="Escribe la respuesta correcta"
                >

            </div>

        `;

    }


    if (type === "checkbox") {

        question.options =
            question.options || [
                "",
                "",
                "",
                ""
            ];

        question.correctAnswers =
            question.correctAnswers || [];

        editor.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Escribe la pregunta..."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Opciones</label>

                ${question.options.map(
                    (option, index) => `

                    <div
                        class="form-group"
                        style="display:flex;align-items:center;gap:10px;"
                    >

                        <input
                            type="checkbox"
                            class="correct-checkbox"
                            data-index="${index}"
                            ${
                                question.correctAnswers.includes(
                                    index
                                )
                                    ? "checked"
                                    : ""
                            }
                        >

                        <input
                            type="text"
                            class="question-option"
                            data-index="${index}"
                            value="${option || ""}"
                            placeholder="Opción ${index + 1}"
                        >

                    </div>

                `).join("")}

            </div>

        `;

    }


    if (type === "order") {

        question.options =
            question.options || [
                "",
                "",
                "",
                ""
            ];

        editor.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Escribe la instrucción..."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Pasos en orden correcto</label>

                ${question.options.map(
                    (option, index) => `

                    <input
                        type="text"
                        class="question-option"
                        data-index="${index}"
                        value="${option || ""}"
                        placeholder="Paso ${index + 1}"
                        style="margin-bottom:10px;"
                    >

                `).join("")}

            </div>

        `;

    }


if (type === "match") {

    question.left =
        question.left || ["", "", ""];

    question.right =
        question.right || ["", "", ""];

    question.correctMatches =
        question.correctMatches || [0, 1, 2];

    editor.innerHTML = `

        <div class="form-group">

            <label>Pregunta</label>

            <textarea
                id="questionText"
                rows="4"
                placeholder="Escribe la instrucción..."
            >${question.question || ""}</textarea>

        </div>


        <div class="form-group">

            <label>Columna izquierda</label>

            ${question.left.map(
                (item, index) => `

                <input
                    type="text"
                    class="match-left"
                    data-index="${index}"
                    value="${item || ""}"
                    placeholder="Elemento ${index + 1}"
                    style="margin-bottom:10px;"
                >

            `).join("")}

        </div>


        <div class="form-group">

            <label>Columna derecha</label>

            ${question.right.map(
                (item, index) => `

                <input
                    type="text"
                    class="match-right"
                    data-index="${index}"
                    value="${item || ""}"
                    placeholder="Respuesta ${index + 1}"
                    style="margin-bottom:10px;"
                >

            `).join("")}

        </div>


        <div class="form-group">

            <label>Relaciones correctas</label>

            ${question.left.map(
                (item, index) => `

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        margin-bottom:12px;
                    "
                >

                    <span style="flex:1;">
                        ${item || `Elemento ${index + 1}`}
                    </span>


                    <select
                        class="match-correct"
                        data-index="${index}"
                        style="flex:1;"
                    >

                        ${question.right.map(
                            (rightItem, rightIndex) => `

                            <option
                                value="${rightIndex}"
                                ${
                                    Number(
                                        question.correctMatches[index]
                                    ) === rightIndex
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${rightItem || `Respuesta ${rightIndex + 1}`}
                            </option>

                        `).join("")}

                    </select>

                </div>

            `).join("")}

        </div>

    `;

}
    if (type === "complete") {

        editor.innerHTML = `

            <div class="form-group">

                <label>Oración</label>

                <textarea
                    id="questionText"
                    rows="4"
                    placeholder="Ej. El equipo de protección es ______."
                >${question.question || ""}</textarea>

            </div>

            <div class="form-group">

                <label>Respuesta correcta</label>

                <input
                    id="correctText"
                    type="text"
                    value="${question.correctText || ""}"
                    placeholder="Palabra o frase correcta"
                >

            </div>

        `;

    }

}


/* =====================================
   GUARDAR CAMBIOS DE LA PREGUNTA
===================================== */

function saveCurrentQuestion() {

    if (
        editingQuestion === null ||
        !questions[editingQuestion]
    ) {
        return;
    }

    const question =
        questions[editingQuestion];

    const questionText =
        document.getElementById(
            "questionText"
        );

    if (questionText) {

        question.question =
            questionText.value.trim();

    }


    if (
        question.type === "multiple" ||
        question.type === "checkbox" ||
        question.type === "order"
    ) {

        question.options =
            [...document.querySelectorAll(
                ".question-option"
            )].map(
                input => input.value.trim()
            );

    }


    if (question.type === "multiple") {

        const correct =
            document.getElementById(
                "correctAnswer"
            );

        if (correct) {

            question.correctAnswer =
                Number(correct.value);

        }

    }


    if (question.type === "boolean") {

        const correct =
            document.getElementById(
                "correctAnswer"
            );

        if (correct) {

            question.correctAnswer =
                Number(correct.value);

        }

        question.options = [
            "Verdadero",
            "Falso"
        ];

    }


    if (question.type === "text") {

        const correct =
            document.getElementById(
                "correctText"
            );

        question.correctText =
            correct
                ? correct.value.trim()
                : "";

    }


    if (question.type === "checkbox") {

        question.correctAnswers =
            [...document.querySelectorAll(
                ".correct-checkbox:checked"
            )].map(
                checkbox =>
                    Number(checkbox.dataset.index)
            );

    }


if (question.type === "match") {

    question.left =
        [...document.querySelectorAll(
            ".match-left"
        )].map(
            input => input.value.trim()
        );


    question.right =
        [...document.querySelectorAll(
            ".match-right"
        )].map(
            input => input.value.trim()
        );


    question.correctMatches =
        [...document.querySelectorAll(
            ".match-correct"
        )].map(
            select => Number(select.value)
        );

}


    if (question.type === "complete") {

        const correct =
            document.getElementById(
                "correctText"
            );

        question.correctText =
            correct
                ? correct.value.trim()
                : "";

    }

}


/* =====================================
   CAMBIO DE TIPO DE PREGUNTA
===================================== */

document
    .getElementById("questionType")
    .addEventListener("change", e => {

        if (
            editingQuestion === null
        ) {
            return;
        }

        saveCurrentQuestion();

        questions[editingQuestion].type =
            e.target.value;

        renderQuestionsList();

        loadQuestion();

    });


/* =====================================
   ELIMINAR PREGUNTA
===================================== */

document.addEventListener(
    "click",
    e => {

        const button =
            e.target.closest(
                ".delete-question"
            );

        if (!button) return;

        e.stopPropagation();

        const index =
            Number(button.dataset.index);

        if (
            !confirm(
                "¿Seguro que quieres eliminar esta pregunta?"
            )
        ) {
            return;
        }

        questions.splice(index, 1);

        if (questions.length === 0) {

            editingQuestion = null;

        } else if (
            editingQuestion >= questions.length
        ) {

            editingQuestion =
                questions.length - 1;

        }

        renderQuestionsList();

        if (
            editingQuestion !== null
        ) {
            loadQuestion();
        }

    }
);


/* =====================================
   GUARDAR CUESTIONARIO
===================================== */

document
    .getElementById("saveQuestion")
    .addEventListener("click", () => {

        if (!currentQuiz) return;

        saveCurrentQuestion();

        currentQuiz.questions =
            [...questions];

        saveModules();

        alert(
            "Cuestionario guardado correctamente."
        );

        questionModal.classList.remove(
            "active"
        );

        editingQuestion = null;

        currentQuiz = null;

        questions = [];

        renderModules();

    });


/* =====================================
   CERRAR CUESTIONARIO
===================================== */

closeQuestionModal
    .addEventListener("click", () => {

        questionModal.classList.remove(
            "active"
        );

        editingQuestion = null;

        currentQuiz = null;

        questions = [];

    });


cancelQuestion
    .addEventListener("click", () => {

        questionModal.classList.remove(
            "active"
        );

        editingQuestion = null;

        currentQuiz = null;

        questions = [];

    });


/* =====================================
   GUARDAR ANTES DE CERRAR
===================================== */

questionModal.addEventListener(
    "click",
    e => {

        if (e.target !== questionModal) {
            return;
        }

        questionModal.classList.remove(
            "active"
        );

        editingQuestion = null;

        currentQuiz = null;

        questions = [];

    }
);
document.addEventListener("click", e => {

    const button =
        e.target.closest(".open-quiz-player");

    if (!button) return;

    e.stopPropagation();

    const id =
        Number(button.dataset.id);

    const moduleCard =
        button.closest(".module-card");

    const moduleId =
        Number(moduleCard.dataset.id);

    const module =
        modules.find(m => m.id === moduleId);

    if (!module) return;

    const quiz =
        module.quizzes.find(
            q => typeof q !== "string" && q.id === id
        );

    if (!quiz) return;

    localStorage.setItem(
        "oiQuiz",
        JSON.stringify(quiz)
    );

    localStorage.setItem(
        "oiQuiz",
        JSON.stringify(quiz)
    );

    window.location.href =
        "quiz-player.html";
});