const quiz = JSON.parse(localStorage.getItem("oiQuiz"));

let currentQuestion = 0;

let userAnswers = [];

renderQuestion();
function renderQuestion(){

    const question = quiz.questions[currentQuestion];

    document.getElementById("quizProgress").textContent =

        `Pregunta ${currentQuestion+1} de ${quiz.questions.length}`;

    document.getElementById("progressBar").style.width =

        `${((currentQuestion+1)/quiz.questions.length)*100}%`;

    document.getElementById("counter").textContent =

        `${currentQuestion+1} / ${quiz.questions.length}`;
    
        const nextButton = document.getElementById("nextQuestion");

        if(currentQuestion === quiz.questions.length - 1){
        
            nextButton.textContent = "Finalizar evaluación";
        
        }else{
        
            nextButton.textContent = "Siguiente →";
        
        }

    document.getElementById("questionTitle").textContent =

        question.question;

        const container = document.getElementById("answersContainer");

        container.innerHTML = "";

    question.options.forEach((option,index)=>{

        container.innerHTML += `

            <label class="answer-item">

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                ${userAnswers[currentQuestion] === index ? "checked" : ""}>

                ${option}

            </label>

        `;

    });

}
document.getElementById("nextQuestion").addEventListener("click",()=>{

    const selected = document.querySelector(
        'input[name="answer"]:checked'
    );

    if(!selected){

        alert("Selecciona una respuesta.");

        return;

    }

    userAnswers[currentQuestion] = Number(selected.value);

    if(currentQuestion < quiz.questions.length - 1){

        currentQuestion++;

        renderQuestion();

    }else{

        finalizarEvaluacion();

    }

});
function finalizarEvaluacion(){

    let correctas = 0;

    quiz.questions.forEach((question,index)=>{

        if(userAnswers[index] === question.correctAnswer){

            correctas++;

        }

    });

    const porcentaje =
        Math.round(
            (correctas / quiz.questions.length) * 100
        );
        localStorage.setItem("quizScore", porcentaje);

        localStorage.setItem(
            "quizCorrectAnswers",
            correctas
        );
        
        localStorage.setItem(
            "quizTotalQuestions",
            quiz.questions.length
        );

    document.querySelector(".quiz-header").style.display = "none";

    document.querySelector(".progress").style.display = "none";

    document.querySelector(".question-view").style.display = "none";

    document.querySelector(".toolbar").style.display = "none";

    const resultView =
        document.getElementById("resultView");

    resultView.style.display = "block";

    document.getElementById("resultPercentage").textContent =
        `${porcentaje}%`;

    document.getElementById("resultCorrect").textContent =
        `${correctas} de ${quiz.questions.length} respuestas correctas`;

    if(porcentaje >= 80){

        document.getElementById("resultMessage").textContent =
            "¡Excelente trabajo! Has aprobado la evaluación.";

    }else{

        document.getElementById("resultMessage").textContent =
            "No alcanzaste el porcentaje mínimo. Puedes revisar el contenido e intentarlo nuevamente.";

    }

}

document.getElementById("previousQuestion").addEventListener("click",()=>{

    if(currentQuestion>0){

        currentQuestion--;

        renderQuestion();

    }

});
document.getElementById("continueCourse").addEventListener("click", () => {

    localStorage.setItem("quizCompleted", "true");

    window.history.back();

});