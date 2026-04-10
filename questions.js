const questions = [
  {
    id: 1,
    moduleId: "ondansetron",
    type: "multiple-choice",
    question: "Ondansetron belongs to which medication class?",
    answers: [
      "NK1 receptor antagonist",
      "Serotonin 5-HT3 receptor antagonist",
      "Antihistamine",
      "Antacid"
    ],
    correctAnswer: "Serotonin 5-HT3 receptor antagonist",
    explanation:
      "Ondansetron is classified as a serotonin 5-HT3 receptor antagonist."
  },
  {
    id: 2,
    moduleId: "ondansetron",
    type: "multiple-choice",
    question: "Which serious adverse effect should the nurse monitor for with ondansetron?",
    answers: [
      "QT prolongation",
      "Renal stones",
      "Ototoxicity",
      "Hypoglycemia"
    ],
    correctAnswer: "QT prolongation",
    explanation:
      "Ondansetron can cause QT prolongation, especially in clients with cardiac risk factors."
  },
  {
    id: 3,
    moduleId: "ondansetron",
    type: "multiple-choice",
    question: "Which instruction should be included in client teaching for ondansetron?",
    answers: [
      "Stop drinking fluids for 24 hours",
      "Report palpitations or syncope",
      "Take only with dairy products",
      "Use with apomorphine if nausea is severe"
    ],
    correctAnswer: "Report palpitations or syncope",
    explanation:
      "Clients taking ondansetron should report palpitations or syncope."
  },
  {
    id: 4,
    moduleId: "ondansetron",
    type: "multiple-choice",
    question: "Ondansetron is commonly used for which therapeutic purpose?",
    answers: [
      "Treating hypertension",
      "Treating heart failure",
      "Reducing nausea and vomiting",
      "Reducing blood glucose"
    ],
    correctAnswer: "Reducing nausea and vomiting",
    explanation:
      "Ondansetron is used to treat nausea and vomiting related to chemotherapy, radiation, and postanesthesia."
  },

  {
    id: 5,
    moduleId: "aprepitant",
    type: "multiple-choice",
    question: "Aprepitant primarily works by blocking which receptor?",
    answers: [
      "Histamine receptor",
      "NK1 receptor",
      "Dopamine receptor",
      "Serotonin 5-HT3 receptor"
    ],
    correctAnswer: "NK1 receptor",
    explanation:
      "Aprepitant is an NK1 receptor antagonist that blocks substance P."
  },
  {
    id: 6,
    moduleId: "aprepitant",
    type: "multiple-choice",
    question: "Aprepitant is most commonly used to prevent which condition?",
    answers: [
      "Motion sickness",
      "Chemotherapy-induced nausea and vomiting",
      "Peptic ulcer disease",
      "Migraine headaches"
    ],
    correctAnswer: "Chemotherapy-induced nausea and vomiting",
    explanation:
      "Aprepitant is used to prevent chemotherapy-induced nausea and vomiting."
  },
  {
    id: 7,
    moduleId: "aprepitant",
    type: "multiple-choice",
    question: "Which teaching is important for a client taking aprepitant?",
    answers: [
      "Use backup birth control if instructed",
      "Increase sodium intake",
      "Avoid all dairy products",
      "Take only at bedtime"
    ],
    correctAnswer: "Use backup birth control if instructed",
    explanation:
      "Aprepitant can reduce the effectiveness of oral contraceptives."
  },
  {
    id: 8,
    moduleId: "aprepitant",
    type: "multiple-choice",
    question: "Which body system should be reviewed closely before giving aprepitant?",
    answers: [
      "Vision",
      "Liver function",
      "Hearing",
      "Skin temperature"
    ],
    correctAnswer: "Liver function",
    explanation:
      "Aprepitant requires review of liver function and medication interactions."
  },

  {
    id: 9,
    moduleId: "metoclopramide",
    type: "multiple-choice",
    question: "Metoclopramide is commonly used to promote what effect?",
    answers: [
      "Bronchodilation",
      "Gastric emptying",
      "Blood clotting",
      "Urine production"
    ],
    correctAnswer: "Gastric emptying",
    explanation:
      "Metoclopramide increases gastrointestinal motility and promotes gastric emptying."
  },
  {
    id: 10,
    moduleId: "metoclopramide",
    type: "multiple-choice",
    question: "Which serious adverse effect should the nurse monitor for with metoclopramide?",
    answers: [
      "Tardive dyskinesia",
      "Hypoglycemia",
      "Renal stones",
      "Tinnitus"
    ],
    correctAnswer: "Tardive dyskinesia",
    explanation:
      "Metoclopramide can cause tardive dyskinesia and other extrapyramidal symptoms."
  },
  {
    id: 11,
    moduleId: "metoclopramide",
    type: "multiple-choice",
    question: "What should a client report immediately while taking metoclopramide?",
    answers: [
      "Involuntary movements",
      "Mild hunger",
      "Warm hands",
      "Increased thirst after exercise"
    ],
    correctAnswer: "Involuntary movements",
    explanation:
      "Involuntary movements may indicate extrapyramidal effects or tardive dyskinesia."
  },
  {
    id: 12,
    moduleId: "metoclopramide",
    type: "multiple-choice",
    question: "Metoclopramide is classified as which type of drug?",
    answers: [
      "Antihistamine",
      "Dopamine receptor antagonist",
      "Antacid",
      "Beta blocker"
    ],
    correctAnswer: "Dopamine receptor antagonist",
    explanation:
      "Metoclopramide is a dopamine receptor antagonist."
  },

  {
    id: 13,
    moduleId: "promethazine",
    type: "multiple-choice",
    question: "Promethazine belongs to which medication class?",
    answers: [
      "Antihistamine",
      "NK1 receptor antagonist",
      "Antacid",
      "ACE inhibitor"
    ],
    correctAnswer: "Antihistamine",
    explanation:
      "Promethazine is classified as an antihistamine."
  },
  {
    id: 14,
    moduleId: "promethazine",
    type: "multiple-choice",
    question: "Promethazine is commonly used for nausea and what other condition?",
    answers: [
      "Motion sickness",
      "Glaucoma",
      "Heart failure",
      "Hyperthyroidism"
    ],
    correctAnswer: "Motion sickness",
    explanation:
      "Promethazine is used for nausea, vomiting, and motion sickness."
  },
  {
    id: 15,
    moduleId: "promethazine",
    type: "multiple-choice",
    question: "Which common side effect should the nurse expect with promethazine?",
    answers: [
      "Dry mouth",
      "Hearing loss",
      "Hypoglycemia",
      "Severe hypertension"
    ],
    correctAnswer: "Dry mouth",
    explanation:
      "Promethazine commonly causes dry mouth and drowsiness."
  },
  {
    id: 16,
    moduleId: "promethazine",
    type: "multiple-choice",
    question: "Which instruction is important for a client taking promethazine?",
    answers: [
      "Avoid alcohol",
      "Double the dose if nausea continues",
      "Take with apomorphine",
      "Stop all fluids"
    ],
    correctAnswer: "Avoid alcohol",
    explanation:
      "Promethazine can increase sedation, especially when combined with alcohol."
  }
];
