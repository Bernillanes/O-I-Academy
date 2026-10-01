const params =
    new URLSearchParams(
        window.location.search
    );


const courseId =
    Number(
        params.get("id")
    );


const courses = [

    {
        id: 1,
        name: "Seguridad Industrial",
        description:
            "Capacitación para seguridad dentro de la planta."
    },

    {
        id: 2,
        name: "Calidad",
        description:
            "Buenas prácticas y procesos de calidad."
    },

    {
        id: 3,
        name: "Inducción O-I",
        description:
            "Curso de bienvenida para nuevos colaboradores."
    }

];


const modules =
    JSON.parse(
        localStorage.getItem("oiModules")
    ) || [];


const course =
    courses.find(
        item =>
            Number(item.id) ===
            courseId
    );


const title =
    document.getElementById(
        "courseTitle"
    );


const description =
    document.getElementById(
        "courseDescription"
    );


const modulesContainer =
    document.getElementById(
        "modulesContainer"
    );


const backToCourses =
    document.getElementById(
        "backToCourses"
    );


/* =========================================
   VOLVER
========================================= */

if (backToCourses) {

    backToCourses.addEventListener(
        "click",
        () => {

            window.location.href =
                "cursos.html";

        }
    );

}


/* =========================================
   CURSO
========================================= */

if (!course) {

    title.textContent =
        "Curso no encontrado";

} else {

    title.textContent =
        course.name;


    description.textContent =
        course.description;


    renderCourse();

}


/* =========================================
   PROGRESO
========================================= */

function isCompleted(
    moduleId,
    item
) {

    const id =
        typeof item === "object"
            ? item.id
            : item;


    return (
        localStorage.getItem(
            `oiProgress_${courseId}_${moduleId}_${id}`
        ) === "completed"
    );

}


/* =========================================
   RENDER CURSO
========================================= */

function renderCourse() {

    const courseModules =
        modules.filter(
            module =>
                Number(module.courseId) ===
                courseId
        );


    if (
        courseModules.length === 0
    ) {

        modulesContainer.innerHTML = `

            <div class="empty-state">

                <i class="bi bi-journal-x"></i>

                <h3>
                    Este curso aún no tiene contenido
                </h3>

                <p>
                    El contenido estará disponible próximamente.
                </p>

            </div>

        `;

        return;
    }


    modulesContainer.innerHTML =
        courseModules.map(
            (module, moduleIndex) => `

                <section
                    class="student-module"
                >

                    <div
                        class="student-module-header"
                    >

                        <span>
                            Módulo ${moduleIndex + 1}
                        </span>


                        <h2>
                            ${module.title}
                        </h2>

                    </div>


                    <div
                        class="student-content-list"
                    >

                        ${renderVideos(module)}

                        ${renderDocuments(module)}

                        ${renderQuizzes(module)}

                    </div>

                </section>

            `
        ).join("");


    attachEvents();

}


/* =========================================
   VIDEOS
========================================= */

function renderVideos(module) {

    if (
        !module.videos ||
        module.videos.length === 0
    ) {

        return "";

    }


    return module.videos.map(
        (video, index) => {

            const name =
                typeof video === "object"
                    ? video.name
                    : video;


            const completed =
                isCompleted(
                    module.id,
                    video
                );


            return `

                <div
                    class="student-content-item
                    ${completed ? "completed" : ""}"
                >

                    <div class="content-info">

                        <i
                            class="bi bi-play-circle-fill"
                        ></i>


                        <div>

                            <h3>
                                ${name}
                            </h3>

                            <span>
                                Video
                            </span>

                        </div>

                    </div>


                    <button
                        class="open-video"
                        data-module="${module.id}"
                        data-index="${index}"
                    >

                        ${
                            completed
                                ? "Reproducir"
                                : "Ver video"
                        }

                    </button>

                </div>

            `;

        }
    ).join("");

}


/* =========================================
   DOCUMENTOS
========================================= */
function renderDocuments(module) {

    if (
        !module.documents ||
        module.documents.length === 0
    ) {

        return "";

    }


    return module.documents.map(
        (document, index) => {

            const name =
                typeof document === "object"
                    ? document.name
                    : document;


            const fileName =
                typeof document === "object"
                    ? document.fileName || ""
                    : "";


            const completed =
                isCompleted(
                    module.id,
                    document
                );


            return `

                <div
                    class="student-content-item
                    ${completed ? "completed" : ""}"
                >

                    <div class="content-info">

                        <i
                            class="bi bi-file-earmark-pdf-fill"
                        ></i>


                        <div>

                            <h3>
                                ${name}
                            </h3>

                            <span>
                                ${fileName || "Documento PDF"}
                            </span>

                        </div>

                    </div>


                    <button
                        class="open-document"
                        data-module="${module.id}"
                        data-index="${index}"
                    >

                        Abrir PDF

                    </button>

                </div>

            `;

        }
    ).join("");

}


/* =========================================
   QUIZZES
========================================= */

function renderQuizzes(module) {

    if (
        !module.quizzes ||
        module.quizzes.length === 0
    ) {

        return "";

    }


    return module.quizzes.map(
        (quiz, index) => {

            if (
                typeof quiz !== "object"
            ) {

                return "";

            }


            const completed =
                isCompleted(
                    module.id,
                    quiz
                );


            return `

                <div
                    class="student-content-item
                    ${completed ? "completed" : ""}"
                >

                    <div class="content-info">

                        <i
                            class="bi bi-patch-question-fill"
                        ></i>


                        <div>

                            <h3>
                                ${quiz.name || "Evaluación"}
                            </h3>


                            <span>
                                ${
                                    quiz.questions?.length ||
                                    0
                                }
                                preguntas
                            </span>

                        </div>

                    </div>


                    <button
                        class="open-quiz"
                        data-module="${module.id}"
                        data-index="${index}"
                    >

                        ${
                            completed
                                ? "Repetir"
                                : "Iniciar"
                        }

                    </button>

                </div>

            `;

        }
    ).join("");

}


/* =========================================
   EVENTOS
========================================= */

function attachEvents() {


    /* =====================================
       QUIZ
    ===================================== */

    document.querySelectorAll(
        ".open-quiz"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const moduleId =
                        Number(
                            button.dataset.module
                        );


                    const index =
                        Number(
                            button.dataset.index
                        );


                    const module =
                        modules.find(
                            item =>
                                Number(item.id) ===
                                moduleId
                        );


                    if (!module) {
                        return;
                    }


                    const quiz =
                        module.quizzes[index];


                    localStorage.setItem(
                        "oiQuiz",
                        JSON.stringify(quiz)
                    );


                    localStorage.setItem(
                        "oiQuizCourseId",
                        courseId
                    );


                    localStorage.setItem(
                        "oiQuizModuleId",
                        moduleId
                    );


                    window.location.href =
                        "quiz-player.html";

                }
            );

        }
    );


    /* =====================================
       VIDEO
    ===================================== */

    document
    .querySelectorAll(".open-video")
    .forEach(button => {

        button.addEventListener("click", () => {

            const moduleId =
                Number(button.dataset.module);

            const index =
                Number(button.dataset.index);

            const module =
                modules.find(
                    item =>
                        Number(item.id) === moduleId
                );

            if (!module) {
                return;
            }

            const video =
                module.videos[index];

            if (
                typeof video !== "object" ||
                !video.url
            ) {

                alert(
                    "Este video no tiene una URL disponible."
                );

                return;
            }

            localStorage.setItem(
                "oiCurrentVideo",
                JSON.stringify(video)
            );

            localStorage.setItem(
                "oiVideoCourseId",
                courseId
            );

            localStorage.setItem(
                "oiVideoModuleId",
                moduleId
            );

            window.location.href =
                "video.html";

        });

    });


    /* =====================================
       DOCUMENTO
    ===================================== */

    document
    .querySelectorAll(".open-document")
    .forEach(button => {

        button.addEventListener("click", () => {

            const moduleId =
                Number(button.dataset.module);

            const index =
                Number(button.dataset.index);

            const module =
                modules.find(
                    item => Number(item.id) === moduleId
                );

            if (!module) {
                return;
            }

            const document =
                module.documents[index];

            if (
                typeof document !== "object" ||
                !document.file
            ) {

                alert(
                    "Este documento no tiene un PDF disponible."
                );

                return;
            }

            const pdfWindow = window.open(
                "",
                "_blank"
            );
            
            if (!pdfWindow) {
            
                alert(
                    "El navegador bloqueó la ventana. Permite ventanas emergentes."
                );
            
                return;
            }
            
            fetch(document.file)
                .then(response => response.blob())
                .then(blob => {
            
                    const pdfUrl =
                        URL.createObjectURL(blob);
            
                    pdfWindow.location.href =
                        pdfUrl;
            
                })
                .catch(error => {
            
                    pdfWindow.close();
            
                    alert(
                        "No se pudo abrir el PDF."
                    );
            
                    console.error(error);
            
                });

            localStorage.setItem(

                `oiProgress_${courseId}_${moduleId}_${document.id}`,

                "completed"

            );

            renderCourse();

        });

    });
}