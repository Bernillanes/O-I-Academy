const app = document.getElementById("app");

/*=========================================
    DATOS
=========================================*/

let courses = [

    {
        id:1,
        name:"Seguridad Industrial",
        category:"Seguridad",
        modules:8,
        status:"Activo"
    },

    {
        id:2,
        name:"Calidad",
        category:"Producción",
        modules:5,
        status:"Activo"
    },

    {
        id:3,
        name:"Inducción O-I",
        category:"Recursos Humanos",
        modules:10,
        status:"Activo"
    }

];

/*=========================================
    TABLA DE CURSOS
=========================================*/

function renderCourseRows(){

    return courses.map(course => `

        <tr>

            <td>${course.name}</td>

            <td>${course.category}</td>

            <td>${course.modules}</td>

            <td>

                <span class="badge-active">

    <span class="status-dot"></span>

    ${course.status}

</span>

            </td>

           <td class="actions">
           
<button class="icon-btn edit" data-id="${course.id}" title="Editar">

    <i class="bi bi-pencil-fill"></i>

</button>

<button class="icon-btn delete" data-id="${course.id}" title="Eliminar">

    <i class="bi bi-trash-fill"></i>

</button>

<button class="icon-btn more" data-id="${course.id}" title="Más opciones">

    <i class="bi bi-three-dots-vertical"></i>

</button>

</td>

        </tr>

    `).join("");

}

/*=========================================
    PÁGINA CURSOS
=========================================*/

function renderCoursesPage(){

    return `

    <div class="page-title">

        <h1>Gestión de Cursos</h1>

        <p>Administra los cursos disponibles en O-I Academy.</p>

    </div>

    <div class="panel">

        <div class="toolbar">

            <button class="btn-primary">

                <i class="bi bi-plus-circle-fill"></i>

                Nuevo curso

            </button>

            <input
                type="text"
                placeholder="Buscar curso...">

        </div>

        <table class="courses-table">

            <thead>

                <tr>

                    <th>Curso</th>

                    <th>Categoría</th>

                    <th>Módulos</th>

                    <th>Estado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                ${renderCourseRows()}

            </tbody>

        </table>

    </div>

    `;

}
/*=========================================
    PÁGINAS
=========================================*/

const pages = {

    dashboard:`
    
    <div class="page-title">
    
        <h1>Panel de Administración</h1>
    
        <p>Bienvenido a O-I Academy.</p>
    
    </div>
    
    <div class="kpis">
    
        <div class="kpi">
    
            <h2>${courses.length}</h2>
    
            <span>Cursos</span>
    
        </div>
    
        <div class="kpi">
    
            <h2>320</h2>
    
            <span>Empleados</span>
    
        </div>
    
        <div class="kpi">
    
            <h2>98</h2>
    
            <span>Videos</span>
    
        </div>
    
        <div class="kpi">
    
            <h2>48</h2>
    
            <span>Cuestionarios</span>
    
        </div>
    
    </div>
    
    <div class="quick-actions">
    
        <button>Nuevo curso</button>
    
        <button>Asignar curso</button>
    
        <button>Nuevo cuestionario</button>
    
        <button>Ver reportes</button>
    
    </div>
    
    <div class="panel">
    
        <h2>Cursos recientes</h2>
    
        <table>
    
            <thead>
    
                <tr>
    
                    <th>Curso</th>
    
                    <th>Módulos</th>
    
                    <th>Estado</th>
    
                </tr>
    
            </thead>
    
            <tbody>
    
                ${courses.map(course => `
    
                    <tr>
    
                        <td>${course.name}</td>
    
                        <td>${course.modules}</td>
    
                        <td>
    
                            <span class="badge-active">
    
                                ${course.status}
    
                            </span>
    
                        </td>
    
                    </tr>
    
                `).join("")}
    
            </tbody>
    
        </table>
    
    </div>
    
    `,
    
    courses: renderCoursesPage(),
    videos:`

<div class="page-title">

    <h1>Videos</h1>

    <p>Administra los videos de capacitación.</p>

</div>

<div class="panel">

    <h2>Biblioteca de Videos</h2>

    <p>Próximamente podrás subir, editar y eliminar videos.</p>

</div>

`,

quizzes:`

<div class="page-title">

    <h1>Cuestionarios</h1>

    <p>Administra preguntas y evaluaciones.</p>

</div>

<div class="panel">

    <h2>Cuestionarios</h2>

    <p>Próximamente podrás crear y administrar exámenes.</p>

</div>

`,

employees:`

<div class="page-title">

    <h1>Empleados</h1>

    <p>Gestiona los colaboradores de O-I Academy.</p>

</div>

<div class="panel">

    <h2>Lista de Empleados</h2>

    <p>Desde aquí podrás asignar cursos y consultar el avance.</p>

</div>

`,

reports:`

<div class="page-title">

    <h1>Reportes</h1>

    <p>Consulta indicadores y estadísticas.</p>

</div>

<div class="panel">

    <h2>Reportes</h2>

    <p>Próximamente se mostrarán gráficas de avance y cumplimiento.</p>

</div>

`,

settings:`

<div class="page-title">

    <h1>Configuración</h1>

    <p>Opciones generales del sistema.</p>

</div>

<div class="panel">

    <h2>Configuración</h2>

    <p>Administra los parámetros generales de O-I Academy.</p>

</div>

`

};

app.innerHTML = pages.dashboard;
/*=========================================
    NAVEGACIÓN
=========================================*/

const menu = document.querySelectorAll(".sidebar nav a");

function renderPage(page){

    switch(page){

        case "dashboard":

            app.innerHTML = pages.dashboard;

            break;

        case "courses":

            app.innerHTML = renderCoursesPage();

            break;

        case "videos":

            app.innerHTML = pages.videos;

            break;

        case "quizzes":

            app.innerHTML = pages.quizzes;

            break;

        case "employees":

            app.innerHTML = pages.employees;

            break;

        case "reports":

            app.innerHTML = pages.reports;

            break;

        case "settings":

            app.innerHTML = pages.settings;

            break;

    }

}
function renderPage(page){

    switch(page){

        case "dashboard":

            app.innerHTML = pages.dashboard;
            break;

        case "courses":

            app.innerHTML = renderCoursesPage();
            break;

        case "videos":

            app.innerHTML = pages.videos;
            break;

        case "quizzes":

            app.innerHTML = pages.quizzes;
            break;

        case "employees":

            app.innerHTML = pages.employees;
            break;

        case "reports":

            app.innerHTML = pages.reports;
            break;

        case "settings":

            app.innerHTML = pages.settings;
            break;

    }

}

menu.forEach(item=>{

    item.addEventListener("click",()=>{

        menu.forEach(link=>{

            link.classList.remove("active");

        });

        item.classList.add("active");

        renderPage(item.dataset.page);

    });

});
/*=========================================
    MODAL
=========================================*/

function openModal(){

    document.getElementById("courseModal").classList.add("active");

}

function closeModal(){

    document.getElementById("courseModal").classList.remove("active");

}

function clearForm(){

    document.getElementById("courseName").value = "";

    document.getElementById("courseCategory").selectedIndex = 0;

    document.getElementById("courseDescription").value = "";

    document.getElementById("courseDuration").value = "";

}

/*=========================================
    CRUD CURSOS
=========================================*/

function addCourse(){

    const name = document.getElementById("courseName").value.trim();

    const category = document.getElementById("courseCategory").value;

    const description = document.getElementById("courseDescription").value.trim();

    const duration = document.getElementById("courseDuration").value.trim();

    if(name === ""){

        alert("Ingresa el nombre del curso.");

        return;

    }

    courses.push({

        id: Date.now(),

        name,

        category,

        modules:0,

        status:"Activo",

        description,

        duration

    });

    closeModal();

    clearForm();

    renderPage("courses");

    document.querySelector('[data-page="courses"]').classList.add("active");

}
/*=========================================
    EVENTOS
=========================================*/

document.addEventListener("click", function(e){

    // Abrir modal
    if(e.target.closest(".btn-primary")){

        openModal();

    }

    // Cerrar con X
    if(e.target.closest("#closeModal")){

        closeModal();

    }

    // Cancelar
    if(e.target.closest(".btn-cancel")){

        closeModal();

    }

    // Guardar curso
    if(e.target.closest("#saveCourse")){

        addCourse();

    }

    // Editar (próximamente)
    if(e.target.closest(".edit")){

        const id = Number(e.target.closest(".edit").dataset.id);

        console.log("Editar curso:", id);

    }

    // Eliminar
    if(e.target.closest(".delete")){

        const id = Number(e.target.closest(".delete").dataset.id);

        if(confirm("¿Deseas eliminar este curso?")){

            courses = courses.filter(course => course.id !== id);

            renderPage("courses");

        }

    }
// Administrar módulos
if(e.target.closest(".more")){

    const id = e.target.closest(".more").dataset.id;

    window.location.href = `course-editor.html?id=${id}`;

}
});