const quiz = JSON.parse(
    localStorage.getItem("oiQuiz")
) || {
    name: "Evaluación",
    questions: []
};

let currentQuestion = 0;
let answers = [];

const questionTitle = document.getElementById("questionTitle");
const quizTitle = document.getElementById("quizTitle");
const answersContainer = document.getElementById("answersContainer");
const quizProgress = document.getElementById("quizProgress");
const progressBar = document.getElementById("progressBar");
const previousQuestion = document.getElementById("previousQuestion");
const nextQuestion = document.getElementById("nextQuestion");
const counter = document.getElementById("counter");
const resultView = document.getElementById("resultView");
const resultPercentage = document.getElementById("resultPercentage");
const resultCorrect = document.getElementById("resultCorrect");
const resultMessage = document.getElementById("resultMessage");
const continueCourse = document.getElementById("continueCourse");
const backToPlatform = document.getElementById("backToPlatform");
const toolbar = document.querySelector(".toolbar");


/* =========================================
   TÍTULO
========================================= */

if (quizTitle) {
    quizTitle.textContent = quiz.name || "Evaluación";
}


/* =========================================
   NAVEGACIÓN
========================================= */

if (backToPlatform) {

    backToPlatform.addEventListener("click", () => {

        window.location.href = "cursos.html";

    });

}


if (continueCourse) {

    continueCourse.addEventListener("click", () => {

        const courseId =
            localStorage.getItem(
                "oiQuizCourseId"
            );

        window.location.href =
            `student-course.html?id=${courseId}`;

    });

}


/* =========================================
   RENDERIZAR PREGUNTA
========================================= */

function renderQuestion() {

    const questions = quiz.questions || [];

    if (questions.length === 0) {

        questionTitle.textContent =
            "Este cuestionario no tiene preguntas.";

        answersContainer.innerHTML = "";

        quizProgress.textContent =
            "Sin preguntas";

        counter.textContent =
            "0 / 0";

        progressBar.style.width =
            "0%";

        previousQuestion.disabled = true;
        nextQuestion.disabled = true;

        return;
    }


    const question =
        questions[currentQuestion];


    questionTitle.textContent =
        question.question ||
        "Pregunta sin texto";


    quizProgress.textContent =
        `Pregunta ${currentQuestion + 1} de ${questions.length}`;


    counter.textContent =
        `${currentQuestion + 1} / ${questions.length}`;


    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    previousQuestion.style.visibility =
        currentQuestion === 0
            ? "hidden"
            : "visible";


    previousQuestion.disabled =
        currentQuestion === 0;


    nextQuestion.textContent =
        currentQuestion === questions.length - 1
            ? "Finalizar"
            : "Siguiente →";


    renderAnswers(question);

}


/* =========================================
   RENDERIZAR RESPUESTAS
========================================= */

function renderAnswers(question) {

    answersContainer.innerHTML = "";


    /* =====================================
       OPCIÓN MÚLTIPLE
    ===================================== */

    if (question.type === "multiple") {

        const selected =
            answers[currentQuestion];

        (question.options || []).forEach(
            (option, index) => {

                const label =
                    document.createElement("label");

                label.className =
                    "answer-item";


                const input =
                    document.createElement("input");

                input.type =
                    "radio";

                input.name =
                    "question";

                input.value =
                    index;

                input.checked =
                    Number(selected) === index;


                input.addEventListener(
                    "change",
                    () => {

                        answers[currentQuestion] =
                            index;

                    }
                );


                label.appendChild(input);

                label.appendChild(
                    document.createTextNode(option)
                );


                answersContainer.appendChild(label);

            }
        );

    }


    /* =====================================
       VERDADERO / FALSO
    ===================================== */

    else if (question.type === "boolean") {

        const selected =
            answers[currentQuestion];


        const options = [
            "Verdadero",
            "Falso"
        ];


        options.forEach(
            (option, index) => {

                const label =
                    document.createElement("label");

                label.className =
                    "answer-item";


                const input =
                    document.createElement("input");

                input.type =
                    "radio";

                input.name =
                    "question";

                input.value =
                    index;

                input.checked =
                    Number(selected) === index;


                input.addEventListener(
                    "change",
                    () => {

                        answers[currentQuestion] =
                            index;

                    }
                );


                label.appendChild(input);

                label.appendChild(
                    document.createTextNode(option)
                );


                answersContainer.appendChild(label);

            }
        );

    }


    /* =====================================
       SELECCIÓN MÚLTIPLE
    ===================================== */

    else if (question.type === "checkbox") {

        const selected =
            answers[currentQuestion] || [];


        (question.options || []).forEach(
            (option, index) => {

                const label =
                    document.createElement("label");

                label.className =
                    "answer-item";


                const input =
                    document.createElement("input");

                input.type =
                    "checkbox";

                input.value =
                    index;

                input.checked =
                    selected.includes(index);


                input.addEventListener(
                    "change",
                    () => {

                        let current =
                            answers[currentQuestion] || [];


                        if (input.checked) {

                            if (!current.includes(index)) {

                                current.push(index);

                            }

                        } else {

                            current =
                                current.filter(
                                    value =>
                                        value !== index
                                );

                        }


                        answers[currentQuestion] =
                            current;

                    }
                );


                label.appendChild(input);

                label.appendChild(
                    document.createTextNode(option)
                );


                answersContainer.appendChild(label);

            }
        );

    }


    /* =====================================
       RESPUESTA ABIERTA
    ===================================== */

    else if (question.type === "text") {

        const input =
            document.createElement("textarea");


        input.className =
            "quiz-text-answer";


        input.placeholder =
            "Escribe tu respuesta...";


        input.value =
            answers[currentQuestion] || "";


        input.addEventListener(
            "input",
            () => {

                answers[currentQuestion] =
                    input.value;

            }
        );


        answersContainer.appendChild(input);

    }


    /* =====================================
       COMPLETAR ESPACIOS
    ===================================== */

    else if (question.type === "complete") {

        const input =
            document.createElement("input");


        input.type =
            "text";


        input.className =
            "quiz-text-answer";


        input.placeholder =
            "Escribe la respuesta...";


        input.value =
            answers[currentQuestion] || "";


        input.addEventListener(
            "input",
            () => {

                answers[currentQuestion] =
                    input.value;

            }
        );


        answersContainer.appendChild(input);

    }


    /* =====================================
       ORDENAR PASOS
    ===================================== */

    else if (question.type === "order") {

        let currentOrder =
            answers[currentQuestion];


        if (!Array.isArray(currentOrder)) {

            currentOrder =
                [...(question.options || [])];

            answers[currentQuestion] =
                [...currentOrder];

        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "order-list";


        currentOrder.forEach(
            (option, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "answer-item";


                item.style.cursor =
                    "default";


                const text =
                    document.createElement("span");


                text.textContent =
                    `${index + 1}. ${option}`;


                text.style.flex =
                    "1";


                const buttons =
                    document.createElement("div");


                buttons.style.display =
                    "flex";

                buttons.style.gap =
                    "8px";


                const up =
                    document.createElement("button");


                up.type =
                    "button";

                up.textContent =
                    "↑";


                const down =
                    document.createElement("button");


                down.type =
                    "button";

                down.textContent =
                    "↓";


                up.addEventListener(
                    "click",
                    () => {

                        if (index === 0) return;


                        const newOrder =
                            [...answers[currentQuestion]];


                        [
                            newOrder[index - 1],
                            newOrder[index]
                        ] = [
                            newOrder[index],
                            newOrder[index - 1]
                        ];


                        answers[currentQuestion] =
                            newOrder;


                        renderQuestion();

                    }
                );


                down.addEventListener(
                    "click",
                    () => {

                        const current =
                            answers[currentQuestion];


                        if (
                            index ===
                            current.length - 1
                        ) return;


                        const newOrder =
                            [...current];


                        [
                            newOrder[index],
                            newOrder[index + 1]
                        ] = [
                            newOrder[index + 1],
                            newOrder[index]
                        ];


                        answers[currentQuestion] =
                            newOrder;


                        renderQuestion();

                    }
                );

                buttons.appendChild(up);

                buttons.appendChild(down);


                item.appendChild(text);

                item.appendChild(buttons);


                wrapper.appendChild(item);

            }
        );


        answersContainer.appendChild(wrapper);

    }


    /* =====================================
       RELACIONAR COLUMNAS
    ===================================== */

    else if (question.type === "match") {

        const left =
            question.left || [];


        const right =
            question.right || [];


        let selected =
            answers[currentQuestion] || [];


        if (!Array.isArray(selected)) {

            selected = [];

        }


        left.forEach(
            (leftItem, index) => {

                const row =
                    document.createElement("div");


                row.className =
                    "answer-item";


                row.style.cursor =
                    "default";


                const text =
                    document.createElement("span");


                text.textContent =
                    leftItem;


                text.style.flex =
                    "1";


                const select =
                    document.createElement("select");


                select.style.padding =
                    "10px";

                select.style.borderRadius =
                    "8px";

                select.style.border =
                    "1px solid #DCE5E9";


                const empty =
                    document.createElement("option");


                empty.value =
                    "";

                empty.textContent =
                    "Seleccionar...";


                select.appendChild(empty);


                right.forEach(
                    (rightItem, rightIndex) => {

                        const option =
                            document.createElement("option");


                        option.value =
                            rightIndex;


                        option.textContent =
                            rightItem;


                        if (
                            Number(selected[index]) ===
                            rightIndex
                        ) {

                            option.selected =
                                true;

                        }


                        select.appendChild(option);

                    }
                );


                select.addEventListener(
                    "change",
                    () => {

                        const current =
                            answers[currentQuestion] || [];


                        current[index] =
                            select.value === ""
                                ? null
                                : Number(select.value);


                        answers[currentQuestion] =
                            current;

                    }
                );


                row.appendChild(text);

                row.appendChild(select);


                answersContainer.appendChild(row);

            }
        );

    }

}


/* =========================================
   ANTERIOR
========================================= */

previousQuestion.addEventListener(
    "click",
    () => {

        if (currentQuestion > 0) {

            currentQuestion--;

            renderQuestion();

        }

    }
);


/* =========================================
   SIGUIENTE / FINALIZAR
========================================= */

nextQuestion.addEventListener(
    "click",
    () => {

        if (
            currentQuestion <
            quiz.questions.length - 1
        ) {

            currentQuestion++;

            renderQuestion();

        } else {

            finishQuiz();

        }

    }
);


/* =========================================
   COMPARAR ARRAYS
========================================= */

function arraysEqual(a, b) {

    if (!Array.isArray(a) ||
        !Array.isArray(b)) {

        return false;

    }


    if (a.length !== b.length) {

        return false;

    }


    return a.every(
        (value, index) =>
            value === b[index]
    );

}


/* =========================================
   FINALIZAR QUIZ
========================================= */

function finishQuiz() {

    let correct = 0;


    quiz.questions.forEach(
        (question, index) => {

            const userAnswer =
                answers[index];


            /* ==============================
               OPCIÓN MÚLTIPLE
            ============================== */

            if (
                question.type === "multiple" ||
                question.type === "boolean"
            ) {

                if (
                    Number(userAnswer) ===
                    Number(question.correctAnswer)
                ) {

                    correct++;

                }

            }


            /* ==============================
               SELECCIÓN MÚLTIPLE
            ============================== */

            else if (
                question.type === "checkbox"
            ) {

                const expected =
                    question.correctAnswers || [];


                const actual =
                    userAnswer || [];


                const expectedSorted =
                    [...expected].sort(
                        (a, b) => a - b
                    );


                const actualSorted =
                    [...actual].sort(
                        (a, b) => a - b
                    );


                if (
                    arraysEqual(
                        expectedSorted,
                        actualSorted
                    )
                ) {

                    correct++;

                }

            }


            /* ==============================
               RESPUESTA ABIERTA
            ============================== */

            else if (
                question.type === "text"
            ) {

                const actual =
                    String(userAnswer || "")
                        .trim()
                        .toLowerCase();


                const expected =
                    String(
                        question.correctText || ""
                    )
                        .trim()
                        .toLowerCase();


                if (
                    actual === expected &&
                    expected !== ""
                ) {

                    correct++;

                }

            }


            /* ==============================
               COMPLETAR
            ============================== */

            else if (
                question.type === "complete"
            ) {

                const actual =
                    String(userAnswer || "")
                        .trim()
                        .toLowerCase();


                const expected =
                    String(
                        question.correctText || ""
                    )
                        .trim()
                        .toLowerCase();


                if (
                    actual === expected &&
                    expected !== ""
                ) {

                    correct++;

                }

            }


            /* ==============================
               ORDENAR PASOS
            ============================== */

            else if (
                question.type === "order"
            ) {

                const actual =
                    userAnswer || [];


                const expected =
                    question.options || [];


                if (
                    arraysEqual(
                        actual,
                        expected
                    )
                ) {

                    correct++;

                }

            }


            /* ==============================
               RELACIONAR COLUMNAS
            ============================== */

            else if (
                question.type === "match"
            ) {

                const actual =
                    userAnswer || [];


                const expected =
                    question.correctMatches || [];


                if (
                    arraysEqual(
                        actual,
                        expected
                    )
                ) {

                    correct++;

                }

            }

        }
    );


    const total =
        quiz.questions.length;


    const score =
        total > 0
            ? Math.round(
                (correct / total) * 100
            )
            : 0;


    /* =====================================
       GUARDAR RESULTADO
    ===================================== */

    localStorage.setItem(
        "quizScore",
        score
    );


    localStorage.setItem(
        "quizCorrectAnswers",
        correct
    );


    localStorage.setItem(
        "quizTotalQuestions",
        total
    );
    const courseId =
    localStorage.getItem(
        "oiQuizCourseId"
    );


const moduleId =
    localStorage.getItem(
        "oiQuizModuleId"
    );


const quizId =
    quiz.id;

if (
    courseId &&
    moduleId &&
    quizId
) {

    localStorage.setItem(
        `oiProgress_${courseId}_${moduleId}_${quizId}`,
        "completed"
    );

}

    /* =====================================
       MOSTRAR RESULTADO
    ===================================== */

    const message =
        score >= 90
            ? "¡Excelente trabajo! Has demostrado un gran dominio del contenido."
            : score >= 70
                ? "Buen trabajo. Has aprobado la evaluación."
                : "Necesitas reforzar algunos conocimientos antes de continuar.";

    if (resultPercentage) {

        resultPercentage.textContent =
            `${score}%`;

    }

    if (resultCorrect) {

        resultCorrect.textContent =
            `${correct} de ${total} respuestas correctas`;

    }

    if (resultMessage) {

        resultMessage.textContent =
            message;

    }


/* Ocultar preguntas */

const questionView =
    document.querySelector(".question-view");

if (questionView) {
    questionView.style.display = "none";
}


/* Ocultar navegación */

if (toolbar) {

    toolbar.style.display = "none";

    toolbar.style.visibility = "hidden";

}


/* Mostrar resultado */

if (resultView) {

    resultView.style.display = "block";

}
document
    .querySelector(".quiz-page")
    ?.classList.add("result-active");


/* Ocultar encabezado */

const quizHeader =
    document.querySelector(".quiz-header");

if (quizHeader) {

    quizHeader.style.display = "none";

}


quizProgress.textContent =
    "Evaluación completada";

progressBar.style.width =
    "100%";

}

/* =========================================
   INICIAR
========================================= */

renderQuestion();