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
function renderContentItems(items, icon){

    if(items.length===0){

        return `<div class="empty-text">Sin elementos</div>`;

    }

    return items.map(item=>`

        <div class="content-item" data-id="${item.id}">

            <div class="content-info content-open" data-id="${item.id}">

<div
    class="content-name ${icon === "bi bi-patch-question-fill" ? "open-quiz" : ""}"
    data-id="${item.id}">

    <i class="${icon}"></i>

    ${item.name}

</div>

                <div class="content-description">

                    ${item.description || "Sin descripción"}

                </div>

                <div class="content-file">

                    ${item.file || ""}

                </div>

            </div>

            <div class="content-actions">

                <button
    class="mini-btn edit-content"
    data-id="${item.id}">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
    class="mini-btn delete delete-content"
    data-id="${item.id}">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </div>

        </div>

    `).join("");

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

                       ${renderContentItems(
                       module.videos,
                     "bi bi-play-circle-fill"
                         )}

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

    ${renderContentItems(
        module.documents,
        "bi bi-file-earmark-fill"
    )}

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

    ${renderContentItems(
        module.quizzes,
        "bi bi-patch-question-fill"
    )}

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

const questionModal = document.getElementById("questionModal");

const closeQuestionModal = document.getElementById("closeQuestionModal");

const cancelQuestion = document.getElementById("cancelQuestion");

let currentModule = null;

let currentType = null;

let editingContent = null;

let editingModule = null;

let currentQuiz = null;

let editingQuestion = null;

let questions = [];

document.getElementById("newModule").addEventListener("click", () => {

    modal.classList.add("active");

});

document.getElementById("closeModuleModal").addEventListener("click", () => {

    modal.classList.remove("active");

});

document.querySelector(".btn-cancel").addEventListener("click", () => {

    modal.classList.remove("active");

});
document.getElementById("questionType").addEventListener("change",(e)=>{

    if(editingQuestion === null) return;

    questions[editingQuestion].type = e.target.value;

    renderQuestionsList();

    loadQuestion();

});

document.getElementById("saveModule").addEventListener("click", () => {

    const input = document.getElementById("moduleName");

    const title = input.value.trim();

    if(title === ""){

        alert("Escribe el nombre del módulo.");

        return;

    }
    if(editingModule){

        editingModule.title = title;
    
        editingModule = null;
    
    }else{

    if(editingModule){

        editingModule.title = title;

        editingModule = null;

    }else{

        modules.push({

            id: Date.now(),

            courseId: courseId,

            title: title,

            videos: [],

            documents: [],

            quizzes: [],

            expanded: false

        });

    }}

    input.value = "";

    document.querySelector("#moduleModal h2").textContent = "Nuevo módulo";

    modal.classList.remove("active");

    renderModules();

});

/*=====================================
=       EVENTOS DE LAS TARJETAS       =
=====================================*/
document.getElementById("closeContentModal").addEventListener("click",()=>{

    contentModal.classList.remove("active");

});
closeQuestionModal.addEventListener("click", () => {

    questionModal.classList.remove("active");

});

cancelQuestion.addEventListener("click", () => {

    questionModal.classList.remove("active");

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

        const descriptionGroup = document.getElementById("descriptionGroup");
        const valueGroup = secondFieldLabel.parentElement;
        
        if (section === "Videos") {
        
            currentType = "videos";
        
            contentModalTitle.textContent = "Agregar video";
        
            secondFieldLabel.textContent = "Archivo de video";
        
            valueGroup.style.display = "block";
        
            descriptionGroup.style.display = "block";
        
        }
        
        if (section === "Documentos") {
        
            currentType = "documents";
        
            contentModalTitle.textContent = "Agregar documento";
        
            secondFieldLabel.textContent = "Archivo PDF o URL";
        
            contentValue.placeholder = "Manual.pdf";
        
            valueGroup.style.display = "block";
        
            descriptionGroup.style.display = "block";
        
        }
        
        if (section === "Cuestionarios") {
        
            currentType = "quizzes";
        
            contentModalTitle.textContent = "Agregar cuestionario";
        
            valueGroup.style.display = "none";
        
            descriptionGroup.style.display = "block";
        
        }

        editingContent = null;

        contentName.value = "";
        
        document.getElementById("contentDescription").value = "";
        
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
    
        editingModule = modules.find(m => m.id === moduleId);
    
        if (!editingModule) return;
    
        document.querySelector("#moduleModal h2").textContent = "Editar módulo";
    
        document.getElementById("moduleName").value = editingModule.title;
    
        modal.classList.add("active");
    
        return;
    
    }
/*=========================
  ABRIR CONTENIDO
=========================*/
const openQuiz = e.target.closest(".open-quiz");

if(openQuiz){
    const id = Number(openQuiz.dataset.id);
    currentQuiz = currentModule.quizzes.find(q => q.id === id);
    if(!currentQuiz) return;
    renderQuestionEditor("multiple");
    questions = currentQuiz.questions || [];
    editingQuestion = null;
    renderQuestionsList();
    questionModal.classList.add("active");

    return;

}

const openContent = e.target.closest(".content-open");

if(openContent){

    const id = Number(openContent.dataset.id);

    alert("Abrir contenido: " + id);

    return;

}

    //EDITAR CONTENIDO
    const editContent = e.target.closest(".edit-content");

    if (editContent) {
    
        e.stopPropagation();
    
        const moduleCard = editContent.closest(".module-card");
    
        const moduleId = Number(moduleCard.dataset.id);
    
        currentModule = modules.find(m => m.id === moduleId);
    
        const id = Number(editContent.dataset.id);
    
        editingContent = null;
    
        for (const type of ["videos","documents","quizzes"]) {
    
            const found = currentModule[type].find(item => item.id === id);
    
            if (found) {
    
                editingContent = found;
                currentType = type;
                break;
    
            }
    
        }
    
        if (!editingContent) return;
    
        contentName.value = editingContent.name;
        document.getElementById("contentDescription").value =
            editingContent.description || "";
        document.getElementById("contentValue").value = "";
    
        contentModalTitle.textContent =
            currentType === "videos"
                ? "Editar video"
                : currentType === "documents"
                    ? "Editar documento"
                    : "Editar cuestionario";
    
        secondFieldLabel.textContent =
            currentType === "videos"
                ? "Archivo de video"
                : "Archivo";
    
        valueGroup.style.display =
            currentType === "quizzes" ? "none" : "block";
    
        descriptionGroup.style.display = "block";
    
        contentModal.classList.add("active");
    
        return;
    
    }

/*=========================
  ELIMINAR CONTENIDO
=========================*/

const deleteContent = e.target.closest(".delete-content");

if (deleteContent) {

    e.stopPropagation();

    if(!confirm("¿Eliminar este elemento?")){

        return;

    }

    const id = Number(deleteContent.dataset.id);

    for(const type of ["videos","documents","quizzes"]){

        const index = currentModule[type].findIndex(item => item.id === id);

        if(index !== -1){

            currentModule[type].splice(index,1);

            break;

        }

    }

    renderModules();

    return;

}

});

document.getElementById("saveContent").addEventListener("click",()=>{

    const name = contentName.value.trim();

    if(name===""){

        alert("Escribe un nombre.");

        return;

    }

    const description =
        document.getElementById("contentDescription").value.trim();

    const file =
        document.getElementById("contentValue").files[0];

        if(editingContent){

            editingContent.name = name;
        
            editingContent.description = description;
        
            if(file){
        
                editingContent.file = file.name;
        
            }
        
            editingContent = null;
        
        }else{
        
            currentModule[currentType].push({
        
                id: Date.now(),
        
                name: name,
        
                description: description,
        
                file: file ? file.name : "",

                questions: []
        
            });
        
        }

    contentName.value = "";

    document.getElementById("contentDescription").value = "";

    document.getElementById("contentValue").value = "";

    contentModal.classList.remove("active");

    editingContent = null;
    
    renderModules();

});
function renderQuestionEditor(type){

    const container = document.getElementById("questionEditor");

    if(type === "multiple"){

        container.innerHTML = `

            <div class="form-group">

                <label>Pregunta</label>

                <textarea id="questionText"></textarea>

            </div>

            <div class="form-group">

                <label>Opción A</label>

                <input type="text" id="optionA">

            </div>

            <div class="form-group">

                <label>Opción B</label>

                <input type="text" id="optionB">

            </div>

            <div class="form-group">

                <label>Opción C</label>

                <input type="text" id="optionC">

            </div>

            <div class="form-group">

                <label>Opción D</label>

                <input type="text" id="optionD">

            </div>

            <div class="form-group">

                <label>Respuesta correcta</label>

                <select id="correctAnswer">

                    <option value="A">A</option>

                    <option value="B">B</option>

                    <option value="C">C</option>

                    <option value="D">D</option>

                </select>

            </div>

        `;

    }
    if(type === "boolean"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Pregunta</label>
    
                <textarea id="questionText"></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Respuesta correcta</label>
    
                <select id="correctAnswer">
    
                    <option value="true">Verdadero</option>
    
                    <option value="false">Falso</option>
    
                </select>
    
            </div>
    
        `;
    
    }
    if(type === "text"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Pregunta</label>
    
                <textarea id="questionText"></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Respuesta esperada (opcional)</label>
    
                <textarea id="expectedAnswer"></textarea>
    
            </div>
    
        `;
    
    }
    if(type === "checkbox"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Pregunta</label>
    
                <textarea id="questionText"></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Opción A</label>
    
                <input type="text" id="optionA">
    
            </div>
    
            <div class="form-group">
    
                <label>Opción B</label>
    
                <input type="text" id="optionB">
    
            </div>
    
            <div class="form-group">
    
                <label>Opción C</label>
    
                <input type="text" id="optionC">
    
            </div>
    
            <div class="form-group">
    
                <label>Opción D</label>
    
                <input type="text" id="optionD">
    
            </div>
    
            <div class="form-group">
    
                <label>Selecciona las respuestas correctas</label>
    
                <label><input type="checkbox"> A</label><br>
    
                <label><input type="checkbox"> B</label><br>
    
                <label><input type="checkbox"> C</label><br>
    
                <label><input type="checkbox"> D</label>
    
            </div>
    
        `;
    
    }
    if(type === "complete"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Pregunta</label>
    
                <textarea
                    placeholder="Ej. El ______ es obligatorio."></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Respuesta correcta</label>
    
                <input
                    type="text"
                    placeholder="Casco">
    
            </div>
    
        `;
    
    }
    if(type === "match"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Instrucción</label>
    
                <textarea></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Columna izquierda</label>
    
                <input type="text" placeholder="Casco">
    
            </div>
    
            <div class="form-group">
    
                <label>Columna derecha</label>
    
                <input type="text" placeholder="Protección de cabeza">
    
            </div>
    
        `;
    
    }
    if(type === "order"){

        container.innerHTML = `
    
            <div class="form-group">
    
                <label>Instrucción</label>
    
                <textarea></textarea>
    
            </div>
    
            <div class="form-group">
    
                <label>Paso 1</label>
    
                <input type="text">
    
            </div>
    
            <div class="form-group">
    
                <label>Paso 2</label>
    
                <input type="text">
    
            </div>
    
            <div class="form-group">
    
                <label>Paso 3</label>
    
                <input type="text">
    
            </div>
    
            <div class="form-group">
    
                <label>Paso 4</label>
    
                <input type="text">
    
            </div>
    
        `;
    
    }
}
function renderQuestionsList(){

    const list = document.getElementById("questionsList");

    const typeNames = {

        multiple: "Opción múltiple",
    
        boolean: "Verdadero / Falso",
    
        text: "Respuesta abierta",
    
        checkbox: "Selección múltiple",
    
        order: "Ordenar pasos",
    
        match: "Relacionar columnas",
    
        complete: "Completar espacios"
    
    };

    list.innerHTML = questions.map((question,index)=>`

       <div
    class="question-card ${index===editingQuestion?"active":""}"
    data-index="${index}">

    <div class="question-header">

        <div>

            <strong>Pregunta ${index+1}</strong>

            <div class="question-type">

                ${typeNames[question.type]}

            </div>

        </div>

        <button
            class="delete-question"
            data-index="${index}">

            <i class="bi bi-trash-fill"></i>

        </button>

    </div>

</div>

    `).join("");

}
document.getElementById("newQuestion").addEventListener("click",()=>{

    questions.push({

        type: "multiple",
    
        question: "",
    
        options: ["", "", "", ""],
    
        answer: "",
    
        points: 10
    
    });

    editingQuestion = questions.length-1;

    renderQuestionsList();

    loadQuestion();

});
document.addEventListener("click",(e)=>{

    const card = e.target.closest(".question-card");

    if(!card) return;

    saveCurrentQuestion();

    editingQuestion = Number(card.dataset.index);

    renderQuestionsList();
    
    loadQuestion();

});
function loadQuestion(){

    if(editingQuestion===null) return;

    const q = questions[editingQuestion];

    document.getElementById("questionType").value = q.type;

    renderQuestionEditor(q.type);

    const question =
        document.getElementById("questionText");

    if(question){

        question.value = q.question;

    }

    if(q.type==="multiple"){

        optionA.value = q.options[0];
        optionB.value = q.options[1];
        optionC.value = q.options[2];
        optionD.value = q.options[3];

        correctAnswer.value = q.answer;

    }

}
function saveCurrentQuestion(){

    if(editingQuestion===null) return;

    const q = questions[editingQuestion];

    const question =
        document.getElementById("questionText");

    if(question){

        q.question = question.value;

    }

    if(q.type==="multiple"){

        q.options[0] = optionA.value;

        q.options[1] = optionB.value;

        q.options[2] = optionC.value;

        q.options[3] = optionD.value;

        q.answer = correctAnswer.value;

    }

}