const homeView = document.getElementById("homeView");
const learnView = document.getElementById("learnView");
const quizView = document.getElementById("quizView");
const resultView = document.getElementById("resultView");

const moduleRailList = document.getElementById("moduleRailList");
const carouselTrack = document.getElementById("carouselTrack");
const prevModuleBtn = document.getElementById("prevModuleBtn");
const nextModuleBtn = document.getElementById("nextModuleBtn");

const backHomeFromLearn = document.getElementById("backHomeFromLearn");
const backHomeFromQuiz = document.getElementById("backHomeFromQuiz");
const startQuizFromLearn = document.getElementById("startQuizFromLearn");

const learnLabel = document.getElementById("learnLabel");
const learnTitle = document.getElementById("learnTitle");
const learnCategory = document.getElementById("learnCategory");
const learnDifficulty = document.getElementById("learnDifficulty");

const overview = document.getElementById("overview");
const drugClass = document.getElementById("drugClass");
const action = document.getElementById("action");
const therapeuticUse = document.getElementById("therapeuticUse");
const nursingAssessment = document.getElementById("nursingAssessment");
const administration = document.getElementById("administration");
const sideEffects = document.getElementById("sideEffects");
const adverseEffects = document.getElementById("adverseEffects");
const contraindications = document.getElementById("contraindications");
const interactions = document.getElementById("interactions");
const clientTeaching = document.getElementById("clientTeaching");
const outcomes = document.getElementById("outcomes");

const questionCounter = document.getElementById("questionCounter");
const scoreText = document.getElementById("scoreText");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackText = document.getElementById("feedbackText");
const explanationText = document.getElementById("explanationText");
const nextBtn = document.getElementById("nextBtn");

const finalScore = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");
const goHomeBtn = document.getElementById("goHomeBtn");

const memoryUse = document.getElementById("memoryUse");
const memorySideEffect = document.getElementById("memorySideEffect");
const memoryAdverse = document.getElementById("memoryAdverse");
const memoryTeaching = document.getElementById("memoryTeaching");

const pdfUploadInput = document.getElementById("pdfUploadInput");
const generateQuizBtn = document.getElementById("generateQuizBtn");
const uploadStatus = document.getElementById("uploadStatus");

let activeModule = modules[0] || null;
let activeModuleIndex = 0;
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let pointerStartX = 0;
let pointerCurrentX = 0;
let isDraggingCarousel = false;
let dragLocked = false;

const QUIZ_API_URL = "https://zniarnkpliwasjpdgpuo.supabase.co/functions/v1/generate-quiz";
const STORAGE_KEY = "nursingflow_progress_v1";

backHomeFromLearn.addEventListener("click", showHome);
backHomeFromQuiz.addEventListener("click", showHome);
startQuizFromLearn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
retryBtn.addEventListener("click", startQuiz);
goHomeBtn.addEventListener("click", showHome);

prevModuleBtn.addEventListener("click", () => {
  setActiveModuleByIndex(activeModuleIndex - 1);
});

nextModuleBtn.addEventListener("click", () => {
  setActiveModuleByIndex(activeModuleIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (homeView.classList.contains("hidden")) return;

  if (event.key === "ArrowLeft") {
    setActiveModuleByIndex(activeModuleIndex - 1);
  }

  if (event.key === "ArrowRight") {
    setActiveModuleByIndex(activeModuleIndex + 1);
  }
});

function showOnly(view) {
  homeView.classList.add("hidden");
  learnView.classList.add("hidden");
  quizView.classList.add("hidden");
  resultView.classList.add("hidden");

  view.classList.remove("hidden");
  view.classList.add("fade-in");

  setTimeout(() => {
    view.classList.remove("fade-in");
  }, 500);
}

function showHome() {
  renderHomeCarousel();
  showOnly(homeView);
}

function openLearnView() {
  if (!activeModule) return;
  renderStudyModule(activeModule);
  showOnly(learnView);
}

function renderStudyModule(module) {
  learnLabel.textContent = module.label || "Uploaded Guide";
  learnTitle.textContent = module.title || "Generated Module";
  learnCategory.textContent = module.category || "PDF Import";
  learnDifficulty.textContent = module.difficulty || "Medium";

  overview.textContent = module.overview || "";
  drugClass.textContent = module.drugClass || "";
  action.textContent = module.action || "Not identified in uploaded guide.";
  outcomes.textContent = module.outcomes || "Not identified in uploaded guide.";

  renderList(therapeuticUse, module.therapeuticUse || []);
  renderList(nursingAssessment, module.nursingAssessment || []);
  renderList(administration, module.administration || []);
  renderList(sideEffects, module.sideEffects || []);
  renderList(adverseEffects, module.adverseEffects || []);
  renderList(contraindications, module.contraindications || []);
  renderList(interactions, module.interactions || []);
  renderList(clientTeaching, module.clientTeaching || []);

  memoryUse.textContent = module.therapeuticUse?.[0] || "Review therapeutic use";
  memorySideEffect.textContent = module.sideEffects?.[0] || "Review side effects";
  memoryAdverse.textContent = module.adverseEffects?.[0] || "Review adverse effects";
  memoryTeaching.textContent = module.clientTeaching?.[0] || "Review client teaching";
}

function renderList(element, items, fallback = "Not identified in uploaded guide.") {
  element.innerHTML = "";

  if (!items || !items.length) {
    const li = document.createElement("li");
    li.textContent = fallback;
    element.appendChild(li);
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function getModuleProgress(moduleId) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const totalQuestions = questions.filter(q => q.moduleId === moduleId).length;
  const entry = saved[moduleId] || { bestScore: 0, completed: false, lastScore: 0 };

  const percent = totalQuestions > 0
    ? Math.round((entry.bestScore / totalQuestions) * 100)
    : 0;

  let status = "New";
  if (entry.lastScore > 0 || entry.bestScore > 0) status = "In Progress";
  if (entry.completed) status = "Completed";

  return {
    totalQuestions,
    bestScore: entry.bestScore,
    lastScore: entry.lastScore,
    completed: entry.completed,
    percent,
    status
  };
}

function saveModuleProgress(moduleId, latestScore, totalQuestions) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const existing = saved[moduleId] || { bestScore: 0, completed: false, lastScore: 0 };

  const bestScore = Math.max(existing.bestScore, latestScore);
  const completed = totalQuestions > 0 && (bestScore / totalQuestions) >= 0.75;

  saved[moduleId] = {
    bestScore,
    lastScore: latestScore,
    completed
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function renderHomeCarousel() {
  renderRail();
  renderCarouselCards();
  updateRailActiveState();
  updateCarouselPosition();
  updateNavButtons();
}

function renderRail() {
  moduleRailList.innerHTML = "";

  modules.forEach((module, index) => {
    const progress = getModuleProgress(module.id);

    const item = document.createElement("button");
    item.type = "button";
    item.className = "rail-item";
    item.dataset.index = index;

    if (index === activeModuleIndex) {
      item.classList.add("active");
    }

    if (progress.completed) {
      item.classList.add("completed");
    } else if (progress.status === "In Progress") {
      item.classList.add("in-progress");
    }

    item.innerHTML = `
      <span class="rail-dot"></span>
      <div class="rail-copy">
        <span class="rail-name">${module.title}</span>
        <span class="rail-meta">${progress.percent}% mastered</span>
      </div>
      <span class="rail-state">${progress.completed ? "✓" : progress.status === "In Progress" ? "•" : ""}</span>
    `;

    item.addEventListener("click", () => {
      setActiveModuleByIndex(index);
    });

    moduleRailList.appendChild(item);
  });
}

function renderCarouselCards() {
  carouselTrack.innerHTML = "";

  modules.forEach((module, index) => {
    const progress = getModuleProgress(module.id);
    const questionCount = progress.totalQuestions;

    const card = document.createElement("article");
    card.className = "carousel-card module-card module-dashboard";
    card.dataset.index = index;

    if (progress.completed) {
      card.classList.add("completed");
    }

    const statusText = progress.completed ? "Completed" : progress.status;
    const progressDegrees = (progress.percent / 100) * 360;

    card.innerHTML = `
      <div class="module-left">
        <div class="card-topline">
          <div class="label-group">
            <p class="module-label">${module.label || "Uploaded Guide"}</p>
            <span class="status-badge">${statusText}</span>
          </div>
        </div>

        <h3>${module.title || "Generated Module"}</h3>
        <p class="muted">${module.category || "PDF Import"}</p>

        <p class="module-description">
          ${module.overview || ""}
        </p>

        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-stat-label">Questions</span>
            <strong>${questionCount}</strong>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-label">Difficulty</span>
            <strong>${module.difficulty || "Medium"}</strong>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-label">Best Score</span>
            <strong>${progress.bestScore}/${questionCount}</strong>
          </div>
        </div>

        <div class="button-row">
          <button class="learn-module-btn" data-id="${module.id}">Open Study Module</button>
          <button class="secondary quiz-module-btn" data-id="${module.id}">Start Quiz</button>
        </div>
      </div>

      <div class="module-right">
        <div class="progress-widget">
          <div class="progress-ring" style="--progress: ${progressDegrees}deg;">
            <div class="progress-ring-inner">
              <span class="progress-value">${progress.percent}%</span>
              <span class="progress-text">Mastered</span>
            </div>
          </div>

          <div class="progress-meta">
            <div class="meta-chip">${progress.bestScore}/${questionCount} complete</div>
            <div class="meta-chip soft-blue">${statusText}</div>
          </div>
        </div>

        <div class="decor-panel">
          <div class="decor-icon bubble-one">+</div>
          <div class="decor-icon bubble-two">✦</div>
          <div class="decor-icon bubble-three">❤</div>
          <p class="decor-caption">Cute, calm, focused study space</p>
        </div>
      </div>
    `;

    carouselTrack.appendChild(card);
  });

  attachCarouselCardEvents();
}

function attachCarouselCardEvents() {
  document.querySelectorAll(".learn-module-btn").forEach(button => {
    button.addEventListener("click", () => {
      const moduleId = button.dataset.id;
      const index = modules.findIndex(m => m.id === moduleId);
      activeModuleIndex = index;
      activeModule = modules[index];
      openLearnView();
    });
  });

  document.querySelectorAll(".quiz-module-btn").forEach(button => {
    button.addEventListener("click", () => {
      const moduleId = button.dataset.id;
      const index = modules.findIndex(m => m.id === moduleId);
      activeModuleIndex = index;
      activeModule = modules[index];
      startQuiz();
    });
  });
}

function setActiveModuleByIndex(index) {
  if (!modules.length) return;

  if (index < 0) {
    activeModuleIndex = modules.length - 1;
  } else if (index >= modules.length) {
    activeModuleIndex = 0;
  } else {
    activeModuleIndex = index;
  }

  activeModule = modules[activeModuleIndex];

  updateRailActiveState();
  updateCarouselPosition();
  updateNavButtons();
}

function updateRailActiveState() {
  document.querySelectorAll(".rail-item").forEach(item => {
    const isActive = Number(item.dataset.index) === activeModuleIndex;
    item.classList.toggle("active", isActive);

    if (isActive) {
      item.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  });
}

function updateCarouselPosition() {
  const cards = carouselTrack.querySelectorAll(".carousel-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const offset = index - activeModuleIndex;

    let transform = "translateX(-50%) scale(0.78)";
    let opacity = 0;
    let zIndex = 1;
    let pointerEvents = "none";

    card.classList.remove("active");

    if (offset === 0) {
      transform = "translateX(-50%) scale(1) rotateY(0deg)";
      opacity = 1;
      zIndex = 30;
      pointerEvents = "auto";
      card.classList.add("active");
    } else if (offset === -1) {
      transform = "translateX(-108%) scale(0.9) rotateY(16deg)";
      opacity = 0.58;
      zIndex = 20;
    } else if (offset === 1) {
      transform = "translateX(8%) scale(0.9) rotateY(-16deg)";
      opacity = 0.58;
      zIndex = 20;
    } else if (offset < -1) {
      transform = "translateX(-140%) scale(0.74) rotateY(22deg)";
      opacity = 0;
      zIndex = 5;
    } else if (offset > 1) {
      transform = "translateX(40%) scale(0.74) rotateY(-22deg)";
      opacity = 0;
      zIndex = 5;
    }

    card.style.transform = transform;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
    card.style.pointerEvents = pointerEvents;
  });
}

function updateNavButtons() {
  prevModuleBtn.disabled = modules.length <= 1;
  nextModuleBtn.disabled = modules.length <= 1;
}

function startQuiz() {
  if (!activeModule) return;

  currentQuizQuestions = shuffleArray(
  questions.filter(q => q.moduleId === activeModule.id)
);
  currentQuestionIndex = 0;
  score = 0;
  scoreText.textContent = "Score: 0";
  feedbackBox.classList.add("hidden");

  updateProgress(0);

  showOnly(quizView);

  if (!currentQuizQuestions.length) {
    questionCounter.textContent = "Question 0 of 0";
    questionText.textContent = "No quiz questions are available for this module yet.";
    answersContainer.innerHTML = "";
    feedbackBox.classList.add("hidden");
    return;
  }

  showQuestion();
}

function showQuestion() {
  const currentQuestion = currentQuizQuestions[currentQuestionIndex];
  if (!currentQuestion) return;

  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuizQuestions.length}`;
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";
  feedbackBox.classList.add("hidden");

  (currentQuestion.answers || []).forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.className = "answer-btn";
    button.addEventListener("click", () => handleAnswer(answer));
    answersContainer.appendChild(button);
  });
}

function handleAnswer(selectedAnswer) {
  const currentQuestion = currentQuizQuestions[currentQuestionIndex];
  if (!currentQuestion) return;

  const allButtons = answersContainer.querySelectorAll("button");

  allButtons.forEach(button => {
    button.disabled = true;

    if (button.textContent === currentQuestion.correctAnswer) {
      button.classList.add("correct");
    }

    if (
      button.textContent === selectedAnswer &&
      selectedAnswer !== currentQuestion.correctAnswer
    ) {
      button.classList.add("incorrect");
    }
  });

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
    feedbackText.textContent = "Correct";
  } else {
    feedbackText.textContent = `Incorrect. Correct answer: ${currentQuestion.correctAnswer}`;
  }

  scoreText.textContent = `Score: ${score}`;
  explanationText.textContent = currentQuestion.explanation || "";
  feedbackBox.classList.remove("hidden");

  const progressPercent = currentQuizQuestions.length
    ? Math.round((score / currentQuizQuestions.length) * 100)
    : 0;
  updateProgress(progressPercent);
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuizQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  finalScore.textContent = `You scored ${score} out of ${currentQuizQuestions.length}.`;

  if (activeModule) {
    saveModuleProgress(activeModule.id, score, currentQuizQuestions.length);
  }

  renderHomeCarousel();
  showOnly(resultView);
}

function updateProgress(percent) {
  const activeCard = document.querySelector(".carousel-card.active");
  if (!activeCard) return;

  const ring = activeCard.querySelector(".progress-ring");
  const value = activeCard.querySelector(".progress-value");

  if (!ring || !value) return;

  const degrees = (percent / 100) * 360;
  ring.style.setProperty("--progress", `${degrees}deg`);
  value.textContent = `${percent}%`;
}

function setupCarouselDrag() {
  const viewport = document.getElementById("carouselViewport");
  if (!viewport) return;

  viewport.style.touchAction = "pan-y";

  viewport.addEventListener("pointerdown", handlePointerDown);
  viewport.addEventListener("pointermove", handlePointerMove);
  viewport.addEventListener("pointerup", handlePointerUp);
  viewport.addEventListener("pointercancel", handlePointerUp);
  viewport.addEventListener("pointerleave", handlePointerUp);
}

function handlePointerDown(event) {
  if (homeView.classList.contains("hidden")) return;

  isDraggingCarousel = true;
  dragLocked = false;
  pointerStartX = event.clientX;
  pointerCurrentX = event.clientX;

  const activeCard = document.querySelector(".carousel-card.active");
  if (activeCard) {
    activeCard.style.transition = "none";
  }
}

function handlePointerMove(event) {
  if (!isDraggingCarousel) return;

  pointerCurrentX = event.clientX;
  const deltaX = pointerCurrentX - pointerStartX;

  const activeCard = document.querySelector(".carousel-card.active");
  if (!activeCard) return;

  activeCard.style.transform = `translateX(calc(-50% + ${deltaX}px)) scale(1) rotateY(0deg)`;

  const prevCard = carouselTrack.querySelector(
    `.carousel-card[data-index="${activeModuleIndex - 1}"]`
  );
  const nextCard = carouselTrack.querySelector(
    `.carousel-card[data-index="${activeModuleIndex + 1}"]`
  );

  if (prevCard && deltaX > 0) {
    prevCard.style.opacity = Math.min(0.75, 0.25 + Math.abs(deltaX) / 220);
  }

  if (nextCard && deltaX < 0) {
    nextCard.style.opacity = Math.min(0.75, 0.25 + Math.abs(deltaX) / 220);
  }
}

function handlePointerUp() {
  if (!isDraggingCarousel || dragLocked) return;

  dragLocked = true;
  isDraggingCarousel = false;

  const deltaX = pointerCurrentX - pointerStartX;
  const threshold = 70;

  const activeCard = document.querySelector(".carousel-card.active");
  if (activeCard) {
    activeCard.style.transition = "";
  }

  if (deltaX <= -threshold) {
    setActiveModuleByIndex(activeModuleIndex + 1);
    return;
  }

  if (deltaX >= threshold) {
    setActiveModuleByIndex(activeModuleIndex - 1);
    return;
  }

  updateCarouselPosition();
}

generateQuizBtn?.addEventListener("click", handlePdfQuizGeneration);

async function handlePdfQuizGeneration() {
  const file = pdfUploadInput.files[0];

  if (!file) {
    uploadStatus.textContent = "Please choose a PDF first.";
    return;
  }

  uploadStatus.textContent = "Processing PDF...";
  generateQuizBtn.disabled = true;

  try {
    const pages = await extractPagesFromPdf(file);
    const chunks = chunkPages(pages, 5);

    let allModules = [];
    let allQuestions = [];

    for (let i = 0; i < chunks.length; i++) {
      uploadStatus.textContent = `Processing chunk ${i + 1} / ${chunks.length}`;

      const res = await fetch(QUIZ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWFybmtwbGl3YXNqcGRncHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5OTA2NDIsImV4cCI6MjA5MDU2NjY0Mn0.5Fo-FkMc4LKOQZoF0rJ2pHKTkT_r3aft6Z52RJ55Sow"
        },
        body: JSON.stringify({
          chunkText: chunks[i].chunkText,
          chunkIndex: i,
          startPage: chunks[i].startPage,
          endPage: chunks[i].endPage
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Chunk ${i + 1} failed: ${errorText}`);
      }

      const data = await res.json();

      if (!Array.isArray(data.modules)) continue;

      data.modules.forEach(m => {
        if (m?.module) {
          allModules.push(m.module);
        }
        if (Array.isArray(m?.questions)) {
          allQuestions.push(...m.questions);
        }
      });
    }

    loadGeneratedModules(allModules, allQuestions);

    uploadStatus.textContent = "Done!";
  } catch (err) {
    console.error(err);
    uploadStatus.textContent = "Error processing PDF.";
  } finally {
    generateQuizBtn.disabled = false;
  }
}

function loadGeneratedModules(modulesArr, questionsArr) {
  let mergedModules = [...modules];

  modulesArr.filter(isValidModule).forEach(newModule => {
    let found = false;

    for (let i = 0; i < mergedModules.length; i++) {
      if (modulesMatch(mergedModules[i], newModule)) {
        mergedModules[i] = mergeModuleData(mergedModules[i], newModule);
        found = true;
        break;
      }
    }

    if (!found) {
      mergedModules.unshift({
        ...newModule,
        id: `uploaded-${Date.now()}-${Math.random()}`,
        label: newModule.label || "Uploaded Guide",
        category: newModule.category || "PDF Import",
        difficulty: newModule.difficulty || "Medium",
        overview: newModule.overview || "Generated from uploaded PDF.",
        drugClass: newModule.drugClass || "",
        action: newModule.action || "",
        therapeuticUse: newModule.therapeuticUse || [],
        nursingAssessment: newModule.nursingAssessment || [],
        administration: newModule.administration || [],
        sideEffects: newModule.sideEffects || [],
        adverseEffects: newModule.adverseEffects || [],
        contraindications: newModule.contraindications || [],
        interactions: newModule.interactions || [],
        clientTeaching: newModule.clientTeaching || [],
        outcomes: newModule.outcomes || ""
      });
    }
  });

  modules.length = 0;
  modules.push(...mergedModules);

 const formattedQuestions = questionsArr
  .filter(q => q?.question && Array.isArray(q?.answers) && q.answers.length === 4 && q?.correctAnswer)
  .map(q => {
    const matchedModule = modules.find(
      m => normalizeText(m.title || "") === normalizeText(q.moduleTitle || "")
    );

    if (!matchedModule) return null;

    // 🔥 Shuffle answers
    const shuffledAnswers = shuffleArray(q.answers);

    return {
      moduleId: matchedModule.id,
      question: q.question,
      answers: shuffledAnswers,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || ""
    };
  })
  .filter(Boolean);

  const dedupedQuestions = mergeQuestions(questions, formattedQuestions);

  questions.length = 0;
  questions.push(...dedupedQuestions);

  activeModuleIndex = 0;
  activeModule = modules[0] || null;

  renderHomeCarousel();
  if (activeModule) {
    openLearnView();
  }
}

window.addEventListener("resize", () => {
  if (!homeView.classList.contains("hidden")) {
    updateCarouselPosition();
  }
});

async function extractPagesFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const text = textContent.items.map(item => item.str || "").join(" ");

    pages.push({
      pageNumber: i,
      text: cleanText(text)
    });
  }

  return pages;
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/Page \d+/gi, "")
    .trim();
}

function chunkPages(pages, size = 5) {
  const chunks = [];

  for (let i = 0; i < pages.length; i += size) {
    const slice = pages.slice(i, i + size);

    chunks.push({
      chunkText: slice.map(p => p.text).join("\n"),
      startPage: slice[0].pageNumber,
      endPage: slice[slice.length - 1].pageNumber
    });
  }

  return chunks;
}

function normalizeText(s = "") {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(s = "") {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ✅ ADD IT HERE
function shuffleArray(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function modulesMatch(a, b) {
  const aNames = [a.title || "", ...(a.aliases || [])].map(normalizeText);
  const bNames = [b.title || "", ...(b.aliases || [])].map(normalizeText);

  return aNames.some(name => bNames.includes(name) && name.length > 2);
}

function mergeArrays(a = [], b = []) {
  const map = new Map();

  [...a, ...b].forEach(item => {
    const clean = (item || "").trim();
    if (!clean) return;

    const key = normalizeText(clean);

    if (!map.has(key) || clean.length > map.get(key).length) {
      map.set(key, clean);
    }
  });

  return [...map.values()];
}

function mergeModuleData(existing, incoming) {
  return {
    ...existing,
    title: existing.title || incoming.title,
    aliases: mergeArrays(existing.aliases, incoming.aliases),

    label: existing.label || incoming.label || "Uploaded Guide",
    category: existing.category || incoming.category || "PDF Import",
    difficulty: existing.difficulty || incoming.difficulty || "Medium",

    overview:
      (existing.overview || "").length > (incoming.overview || "").length
        ? existing.overview
        : (incoming.overview || existing.overview || "Generated from uploaded PDF."),

    drugClass: existing.drugClass || incoming.drugClass || "",

    action:
      (existing.action || "").length > (incoming.action || "").length
        ? existing.action
        : (incoming.action || existing.action || ""),

    therapeuticUse: mergeArrays(existing.therapeuticUse, incoming.therapeuticUse),
    nursingAssessment: mergeArrays(existing.nursingAssessment, incoming.nursingAssessment),
    administration: mergeArrays(existing.administration, incoming.administration),
    sideEffects: mergeArrays(existing.sideEffects, incoming.sideEffects),
    adverseEffects: mergeArrays(existing.adverseEffects, incoming.adverseEffects),
    contraindications: mergeArrays(existing.contraindications, incoming.contraindications),
    interactions: mergeArrays(existing.interactions, incoming.interactions),
    clientTeaching: mergeArrays(existing.clientTeaching, incoming.clientTeaching),

    outcomes:
      (existing.outcomes || "").length > (incoming.outcomes || "").length
        ? existing.outcomes
        : (incoming.outcomes || existing.outcomes || "")
  };
}

function questionKey(q) {
  return normalizeText((q.question || "") + (q.correctAnswer || ""));
}

function mergeQuestions(existing, incoming) {
  const map = new Map();

  [...existing, ...incoming].forEach(q => {
    const key = questionKey(q);

    if (!map.has(key)) {
      map.set(key, q);
    }
  });

  return [...map.values()];
}

function isValidModule(m) {
  const populatedCount = [
    m?.action,
    m?.overview,
    m?.drugClass,
    ...(m?.therapeuticUse || []),
    ...(m?.sideEffects || []),
    ...(m?.adverseEffects || [])
  ].filter(Boolean).length;

  return Boolean(m?.title && m.title.length > 2 && populatedCount >= 3);
}

renderHomeCarousel();
showOnly(homeView);
setupCarouselDrag();
