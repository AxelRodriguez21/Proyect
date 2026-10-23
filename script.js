document.addEventListener("DOMContentLoaded", () => {
  /* ===================================================
     1. GESTIÓN DEL AVISO DE PRIVACIDAD & LEY ARCO
     =================================================== */
  const privacyModal = document.getElementById("privacyModal");
  const btnAcceptPrivacy = document.getElementById("btnAcceptPrivacy");
  const openPrivacyLink = document.getElementById("openPrivacyLink");

  const privacyAccepted = localStorage.getItem("privacy_arco_accepted_v1");
  if (!privacyAccepted) {
    privacyModal.style.display = "flex";
  }

  btnAcceptPrivacy.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("privacy_arco_accepted_v1", "true");
    privacyModal.style.display = "none";
  });

  if (openPrivacyLink) {
    openPrivacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  /* ===================================================
     2. MENÚ RESPONSIVO MÓVIL (HAMBURGUESA)
     =================================================== */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("active");
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });
  }

  /* ===================================================
     3. CARRUSEL DINÁMICO CON ENLACES A FUENTES
     =================================================== */
  const noticias = [
    {
      categoria: "Prevención y Concientización",
      titulo: "Depresión y ansiedad en jóvenes: la edad clave de manifestación",
      resumen: "Identificación de signos tempranos, síntomas de aislamiento y factores de vulnerabilidad en la transición a la vida adulta.",
      fuente: "Gaceta UNAM",
      url: "https://www.gaceta.unam.mx/adolescentes-y-adultos-jovenes-los-mas-propensos-a-padecer-depresion/"
    },
    {
      categoria: "Juventud y Contexto Actual",
      titulo: "La influencia de las pantallas y redes sociales en el bienestar emocional",
      resumen: "Estrategias para regular el tiempo frente a pantallas, prevenir la sobreexposición y reducir la ansiedad digital.",
      fuente: "UNICEF México",
      url: "https://www.unicef.org/mexico/historias/informar-y-cuidar-la-salud-mental-de-las-juventudes"
    },
    {
      categoria: "Hábitos y Acompañamiento",
      titulo: "Higiene del sueño: pilar esencial para el rendimiento cognitivo y emocional",
      resumen: "El impacto del descanso en la consolidación de la memoria, el aprendizaje y la regulación del estado de ánimo.",
      fuente: "C3 UNAM",
      url: "https://www.c3.unam.mx/noticias/noticia295.html"
    },
    {
      categoria: "Acompañamiento",
      titulo: "El papel de las redes de apoyo familiar y escolar en la prevención de crisis",
      resumen: "Guía práctica para identificar estrés agudo en jóvenes y ofrecer acompañamiento empático sin estigmas.",
      fuente: "UNICEF Latinoamérica",
      url: "https://www.unicef.org/lac/crianza/seguridad-proteccion/como-gestionar-estres"
    },
    {
      categoria: "Atención Inmediata",
      titulo: "Líneas de ayuda y recursos de atención inmediata en México",
      resumen: "Directorio de orientación psicológica profesional, confidencial y gratuita (Línea de la Vida 800 911 2000).",
      fuente: "Secretaría de Salud",
      url: "https://www.gob.mx/salud/es/articulos/linea-de-la-vida-ayuda-profesional-para-personas-con-depresion?idiom=es"
    }
  ];

  const INTERVALO_TIEMPO = 8000;
  let indiceActual = 0;
  let temporizador = null;
  let animacionBarra = null;
  let tiempoInicio = 0;

  const newsContent = document.getElementById("newsContent");
  const newsCategory = document.getElementById("newsCategory");
  const newsSource = document.getElementById("newsSource");
  const newsLink = document.getElementById("newsLink");
  const newsBtnLink = document.getElementById("newsBtnLink");
  const newsSummary = document.getElementById("newsSummary");
  const indicatorsContainer = document.getElementById("indicatorsContainer");
  const progressBar = document.getElementById("progressBar");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const newsCardContainer = document.getElementById("newsCardContainer");

  function crearIndicadores() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = "";
    noticias.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => irANoticia(index));
      indicatorsContainer.appendChild(dot);
    });
  }

  function mostrarNoticia(index) {
    if (!newsContent) return;
    newsContent.classList.add("fade-out");

    setTimeout(() => {
      const item = noticias[index];
      newsCategory.textContent = item.categoria;
      newsSource.textContent = item.fuente;
      
      newsLink.textContent = item.titulo;
      newsLink.href = item.url;
      if (newsBtnLink) newsBtnLink.href = item.url;
      
      newsSummary.textContent = item.resumen;

      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      newsContent.classList.remove("fade-out");
    }, 250);

    reiniciarTemporizador();
  }

  function iniciarBarraProgreso() {
    if (!progressBar) return;
    progressBar.style.width = "0%";
    tiempoInicio = Date.now();

    if (animacionBarra) clearInterval(animacionBarra);

    animacionBarra = setInterval(() => {
      const tiempoTranscurrido = Date.now() - tiempoInicio;
      const porcentaje = Math.min((tiempoTranscurrido / INTERVALO_TIEMPO) * 100, 100);
      progressBar.style.width = porcentaje + "%";

      if (porcentaje >= 100) {
        clearInterval(animacionBarra);
      }
    }, 50);
  }

  function reiniciarTemporizador() {
    if (temporizador) clearInterval(temporizador);
    iniciarBarraProgreso();

    temporizador = setInterval(() => {
      siguienteNoticia();
    }, INTERVALO_TIEMPO);
  }

  function siguienteNoticia() {
    indiceActual = (indiceActual + 1) % noticias.length;
    mostrarNoticia(indiceActual);
  }

  function anteriorNoticia() {
    indiceActual = (indiceActual - 1 + noticias.length) % noticias.length;
    mostrarNoticia(indiceActual);
  }

  function irANoticia(index) {
    indiceActual = index;
    mostrarNoticia(indiceActual);
  }

  if (btnNext && btnPrev) {
    btnNext.addEventListener("click", siguienteNoticia);
    btnPrev.addEventListener("click", anteriorNoticia);
  }

  if (newsCardContainer) {
    newsCardContainer.addEventListener("mouseenter", () => {
      if (temporizador) clearInterval(temporizador);
      if (animacionBarra) clearInterval(animacionBarra);
    });

    newsCardContainer.addEventListener("mouseleave", () => {
      reiniciarTemporizador();
    });
  }

  crearIndicadores();
  mostrarNoticia(0);

  /* ===================================================
     4. TEST PSICOLÓGICO DE 15 PREGUNTAS
     =================================================== */
  const btnStartQuiz = document.getElementById("btnStartQuiz");
  const quizIntroCard = document.getElementById("quizIntroCard");
  const quizFormContainer = document.getElementById("quizFormContainer");
  const form = document.getElementById("quizForm");
  const resultCard = document.getElementById("quizResult");
  const resultBadge = document.getElementById("resultLevelBadge");
  const resultTitle = document.getElementById("resultTitle");
  const resultFeedback = document.getElementById("resultFeedback");
  const btnReset = document.getElementById("btnResetQuiz");

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener("click", () => {
      quizIntroCard.style.display = "none";
      quizFormContainer.style.display = "block";
      quizFormContainer.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const answers = new FormData(form);
      let totalScore = 0;

      for (let value of answers.values()) {
        totalScore += parseInt(value, 10);
      }

      let badgeColor = "";
      let badgeText = "";
      let titleText = "";
      let feedbackText = "";

      if (totalScore <= 12) {
        badgeText = "Nivel Leve / Estable";
        badgeColor = "#00897b";
        titleText = "Estado Emocional en Equilibrio";
        feedbackText = "Tus respuestas reflejan una buena gestión emocional y adaptación frente a las situaciones diarias. Conservar tus hábitos de descanso, desconexión digital y actividades placenteras fortalecerá este bienestar.";
      } else if (totalScore <= 26) {
        badgeText = "Nivel Moderado";
        badgeColor = "#f4a261";
        titleText = "Presencia de Sobrecarga y Desgaste Frecuente";
        feedbackText = "Has experimentado episodios continuos de tensión, desgaste emocional o inquietud. Explorar herramientas de regulación conductual y considerar un acompañamiento psicológico preventivo te ayudará a recuperar el equilibrio antes de que el malestar aumente.";
      } else {
        badgeText = "Nivel Significativo";
        badgeColor = "#e63946";
        titleText = "Señales Notables de Malestar Emocional";
        feedbackText = "Tus respuestas sugieren que las cargas emocionales están interfiriendo de manera importante en tu vida cotidiana. Te sugerimos agendar una sesión de orientación con la psicóloga Sonia para elaborar un plan de trabajo adaptado a tus necesidades.";
      }

      resultBadge.textContent = badgeText;
      resultBadge.style.backgroundColor = badgeColor;
      resultBadge.style.color = "#ffffff";

      resultTitle.textContent = titleText;
      resultFeedback.textContent = feedbackText;

      form.style.display = "none";
      resultCard.style.display = "block";
      resultCard.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      form.reset();
      resultCard.style.display = "none";
      form.style.display = "block";
      quizFormContainer.scrollIntoView({ behavior: "smooth" });
    });
  }
});