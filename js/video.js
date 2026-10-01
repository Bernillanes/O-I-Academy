const videoData =
    JSON.parse(
        localStorage.getItem("oiCurrentVideo")
    );


const courseId =
    localStorage.getItem(
        "oiVideoCourseId"
    );


const moduleId =
    localStorage.getItem(
        "oiVideoModuleId"
    );


const modules =
    JSON.parse(
        localStorage.getItem("oiModules")
    ) || [];


const videoTitle =
    document.getElementById(
        "videoTitle"
    );


const videoDescription =
    document.getElementById(
        "videoDescription"
    );


const videoPlayer =
    document.getElementById(
        "videoPlayer"
    );


const markVideo =
    document.getElementById(
        "markVideo"
    );


const backToCourse =
    document.getElementById(
        "backToCourse"
    );


/* =========================================
   COMPROBAR VIDEO
========================================= */

if(!videoData){

    if(videoTitle){

        videoTitle.textContent =
            "Video no encontrado";

    }

} else {


    const name =
        typeof videoData === "object"
            ? videoData.name
            : videoData;


    const url =
        typeof videoData === "object"
            ? videoData.url
            : "";


    const description =
        typeof videoData === "object"
            ? videoData.description
            : "";


    if(videoTitle){

        videoTitle.textContent =
            name || "Video";

    }


    if(videoDescription){

        videoDescription.textContent =
            description ||
            "Contenido de capacitación de O-I Academy.";

    }


    if(videoPlayer){

        const embedUrl =
            convertToEmbedUrl(url);


        if(embedUrl){

            videoPlayer.src =
                embedUrl;

        } else {

            videoPlayer.src = "";

            videoPlayer.innerHTML = `
                <div class="video-error">
                    <i class="bi bi-exclamation-circle"></i>
                    <p>
                        No se pudo cargar el video.
                    </p>
                </div>
            `;

        }

    }

}


/* =========================================
   CONVERTIR URL YOUTUBE
========================================= */

function convertToEmbedUrl(url){

    if(!url){

        return null;

    }


    try{

        const parsed =
            new URL(url);


        if(
            parsed.hostname.includes(
                "youtube.com"
            )
        ){

            const videoId =
                parsed.searchParams.get(
                    "v"
                );


            if(videoId){

                return (
                    "https://www.youtube.com/embed/" +
                    videoId
                );

            }


            if(
                parsed.pathname.startsWith(
                    "/embed/"
                )
            ){

                return url;

            }

        }


        if(
            parsed.hostname ===
            "youtu.be"
        ){

            const videoId =
                parsed.pathname.substring(1);


            if(videoId){

                return (
                    "https://www.youtube.com/embed/" +
                    videoId
                );

            }

        }


        return url;

    } catch(error){

        return null;

    }

}


/* =========================================
   MARCAR COMO VISTO
========================================= */

function completeVideo(){

    if(
        !courseId ||
        !moduleId ||
        !videoData
    ){

        return;

    }


    const videoId =
        typeof videoData === "object"
            ? videoData.id
            : videoData;


    localStorage.setItem(

        `oiProgress_${courseId}_${moduleId}_${videoId}`,

        "completed"

    );


    if(markVideo){

        markVideo.textContent =
            "✓ Video completado";


        markVideo.classList.add(
            "completed"
        );

    }

}


/* =========================================
   BOTÓN COMPLETAR
========================================= */

if(markVideo){

    markVideo.addEventListener(
        "click",
        () => {

            completeVideo();

        }
    );

}


/* =========================================
   REGRESAR AL CURSO
========================================= */

if(backToCourse){

    backToCourse.addEventListener(
        "click",
        () => {

            if(courseId){

                window.location.href =
                    `student-course.html?id=${courseId}`;

            } else {

                window.location.href =
                    "cursos.html";

            }

        }
    );

}


/* =========================================
   ESTADO INICIAL
========================================= */

if(
    videoData &&
    courseId &&
    moduleId
){

    const videoId =
        typeof videoData === "object"
            ? videoData.id
            : videoData;


    const progressKey =
        `oiProgress_${courseId}_${moduleId}_${videoId}`;


    if(
        localStorage.getItem(
            progressKey
        ) === "completed"
    ){

        if(markVideo){

            markVideo.textContent =
                "✓ Video completado";


            markVideo.classList.add(
                "completed"
            );

        }

    }

}