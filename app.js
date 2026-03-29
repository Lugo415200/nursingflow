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

let activeModule = modules[0] || null;
let activeModuleIndex = 0;
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let pointerStartX = 0;
let pointerCurrentX = 0;
let isDraggingCarousel = false;
let dragLocked = false;

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
  learnLabel.textContent = module.label;
  learnTitle.textContent = module.title;
  learnCategory.textContent = module.category;
  learnDifficulty.textContent = module.difficulty;

  overview.textContent = module.overview;
  drugClass.textContent = module.drugClass;
  action.textContent = module.action;
  outcomes.textContent = module.outcomes;

  renderList(therapeuticUse, module.therapeuticUse);
  renderList(nursingAssessment, module.nursingAssessment);
  renderList(administration, module.administration);
  renderList(sideEffects, module.sideEffects);
  renderList(adverseEffects, module.adverseEffects);
  renderList(contraindications, module.contraindications);
  renderList(interactions, module.interactions);
  renderList(clientTeaching, module.clientTeaching);

    memoryUse.textContent = module.therapeuticUse?.[0] || "Review therapeutic use";
  memorySideEffect.textContent = module.sideEffects?.[0] || "Review side effects";
  memoryAdverse.textContent = module.adverseEffects?.[0] || "Review adverse effects";
  memoryTeaching.textContent = module.clientTeaching?.[0] || "Review client teaching";

}

function renderList(element, items) {
  element.innerHTML = "";
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
            <p class="module-label">${module.label}</p>
            <span class="status-badge">${statusText}</span>
          </div>
        </div>

        <h3>${module.title}</h3>
        <p class="muted">${module.category}</p>

        <p class="module-description">
          ${module.overview}
        </p>

        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-stat-label">Questions</span>
            <strong>${questionCount}</strong>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-label">Difficulty</span>
            <strong>${module.difficulty}</strong>
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

  currentQuizQuestions = questions.filter(q => q.moduleId === activeModule.id);
  currentQuestionIndex = 0;
  score = 0;
  scoreText.textContent = "Score: 0";
  feedbackBox.classList.add("hidden");

  updateProgress(0);

  showOnly(quizView);
  showQuestion();
}

function showQuestion() {
  const currentQuestion = currentQuizQuestions[currentQuestionIndex];
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuizQuestions.length}`;
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";
  feedbackBox.classList.add("hidden");

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.className = "answer-btn";
    button.addEventListener("click", () => handleAnswer(answer));
    answersContainer.appendChild(button);
  });
}

function handleAnswer(selectedAnswer) {
  const currentQuestion = currentQuizQuestions[currentQuestionIndex];
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
  explanationText.textContent = currentQuestion.explanation;
  feedbackBox.classList.remove("hidden");

  const progressPercent = Math.round((score / currentQuizQuestions.length) * 100);
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

window.addEventListener("resize", () => {
  if (!homeView.classList.contains("hidden")) {
    updateCarouselPosition();
  }
});

renderHomeCarousel();
showOnly(homeView);
setupCarouselDrag();