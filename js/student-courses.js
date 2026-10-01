const courses = [
    {
        id: 1,
        name: "Seguridad Industrial",
        category: "Seguridad",
        description:
            "Capacitación para seguridad dentro de la planta."
    },
    {
        id: 2,
        name: "Calidad",
        category: "Calidad",
        description:
            "Buenas prácticas y procesos de calidad."
    },
    {
        id: 3,
        name: "Inducción O-I",
        category: "Inducción",
        description:
            "Curso de bienvenida para nuevos colaboradores."
    }
];


const modules =
    JSON.parse(
        localStorage.getItem("oiModules")
    ) || [];


/* =========================================
   PROGRESO DEL CURSO
========================================= */

function getCourseProgress(courseId) {

    const courseModules =
        modules.filter(
            module =>
                Number(module.courseId) ===
                Number(courseId)
        );


    if (courseModules.length === 0) {
        return 0;
    }


    let total = 0;
    let completed = 0;


    courseModules.forEach(module => {

        const items = [
            ...(module.videos || []),
            ...(module.documents || []),
            ...(module.quizzes || [])
        ];


        total += items.length;


        items.forEach(item => {

            const id =
                typeof item === "object"
                    ? item.id
                    : item;


            const key =
                `oiProgress_${courseId}_${module.id}_${id}`;


            if (
                localStorage.getItem(key) ===
                "completed"
            ) {

                completed++;

            }

        });

    });


    if (total === 0) {
        return 0;
    }


    return Math.round(
        (completed / total) * 100
    );

}


/* =========================================
   ELEMENTOS
========================================= */

const courseList =
    document.querySelector(".course-list");


const searchInput =
    document.querySelector(".search-box input");


const filterButtons =
    document.querySelectorAll(
        ".filters button"
    );


/* =========================================
   MOSTRAR CURSOS
========================================= */

function renderCourses(
    filter = "all",
    search = ""
) {

    if (!courseList) {
        return;
    }


    const filtered =
        courses.filter(course => {

            const matchesSearch =
                course.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const progress =
                getCourseProgress(
                    course.id
                );


            let matchesFilter = true;


            if (
                filter === "pending"
            ) {

                matchesFilter =
                    progress === 0;

            }


            if (
                filter === "progress"
            ) {

                matchesFilter =
                    progress > 0 &&
                    progress < 100;

            }


            if (
                filter === "completed"
            ) {

                matchesFilter =
                    progress === 100;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    if (filtered.length === 0) {

        courseList.innerHTML = `

            <div class="empty-state">

                <i class="bi bi-search"></i>

                <h3>
                    No se encontraron cursos
                </h3>

                <p>
                    Prueba con otro término de búsqueda.
                </p>

            </div>

        `;

        return;
    }


    courseList.innerHTML =
        filtered.map(course => {

            const progress =
                getCourseProgress(
                    course.id
                );


            const courseModules =
                modules.filter(
                    module =>
                        Number(module.courseId) ===
                        Number(course.id)
                );


            let videos = 0;


            courseModules.forEach(
                module => {

                    videos +=
                        (
                            module.videos ||
                            []
                        ).length;

                }
            );


            let action = "Comenzar";


            if (progress > 0) {
                action = "Continuar";
            }


            if (progress === 100) {
                action = "Ver curso";
            }


            return `

                <div class="course-row">

                    <div>

                        <h3>
                            ${course.name}
                        </h3>

                        <p>
                            ${courseModules.length}
                            módulos
                            •
                            ${videos}
                            videos
                        </p>

                    </div>


                    <div>

                        <span>
                            ${progress}%
                        </span>

                    </div>


                    <a
                        href="student-course.html?id=${course.id}"
                    >
                        ${action}
                    </a>

                </div>

            `;

        }).join("");

}


/* =========================================
   BUSCADOR
========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const activeButton =
                document.querySelector(
                    ".filters button.active"
                );


            renderCourses(
                activeButton?.dataset.filter ||
                "all",
                searchInput.value
            );

        }
    );

}


/* =========================================
   FILTROS
========================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                renderCourses(
                    button.dataset.filter,
                    searchInput?.value || ""
                );

            }
        );

    }
);


/* =========================================
   INICIAR
========================================= */

renderCourses();