const modules = [
  {
    id: "ondansetron",
    label: "Antiemetics",
    title: "Ondansetron (Zofran)",
    category: "Serotonin 5-HT3 Receptor Antagonist",
    difficulty: "Easy",
    overview:
      "Used to treat nausea and vomiting related to chemotherapy, radiation therapy, and postanesthesia.",
    drugClass: "Serotonin 5-HT3 receptor antagonist",

    action:
      "Inhibits activation of the 5-HT3 receptor to decrease nausea and vomiting.",

    mechanism:
      "Blocks serotonin (5-HT3) receptors in the chemoreceptor trigger zone and GI tract, preventing nausea signals.",

    therapeuticUse: [
      "Chemotherapy-induced nausea and vomiting",
      "Radiation-related nausea and vomiting",
      "Postanesthesia nausea and vomiting"
    ],

    nursingAssessment: [
      "Obtain baseline ECG for clients with cardiac risk",
      "Monitor potassium, magnesium, calcium levels"
    ],

    administration: [
      "PO",
      "IV",
      "IM",
      "ODT (oral disintegrating tablet)"
    ],

    prescriptionParameters: [
      "Give 30 minutes before chemotherapy",
      "Give 1–2 hours before radiation therapy"
    ],

    sideEffects: [
      "Headache",
      "Fatigue",
      "Constipation",
      "Diarrhea"
    ],

    adverseEffects: [
      "QT prolongation",
      "Serotonin syndrome"
    ],

    precautions: [
      "Use caution in liver disease",
      "Monitor cardiac patients closely"
    ],

    contraindications: [
      "Hypersensitivity",
      "Do not use with apomorphine"
    ],

    interactions: [
      "Serotonergic drugs increase serotonin syndrome risk",
      "Pimozide increases QT risk"
    ],

    clientTeaching: [
      "Report palpitations or fainting",
      "Avoid combining with serotonin drugs unless directed",
      "Use dry hands for ODT and allow it to dissolve"
    ],

    nonPharmTips: [
      "Eat smaller meals",
      "Avoid strong smells",
      "Eat foods at room temperature"
    ],

    clinicalPearls: [
      "First-line for chemo nausea",
      "High-yield: QT prolongation"
    ],

    boxedWarning:
      "Risk of serotonin syndrome when combined with serotonergic medications.",

    outcomes:
      "Decreased nausea and improved ability to eat and hydrate."
  },

  {
    id: "aprepitant",
    label: "Antiemetics",
    title: "Aprepitant (Emend)",
    category: "NK1 Receptor Antagonist",
    difficulty: "Medium",
    overview:
      "Prevents chemotherapy-induced nausea, especially delayed nausea.",
    drugClass: "NK1 receptor antagonist",

    action:
      "Blocks substance P to prevent vomiting reflex.",

    mechanism:
      "Blocks neurokinin-1 receptors in the brain and GI tract, reducing vomiting signals.",

    therapeuticUse: [
      "Chemotherapy-induced nausea",
      "Delayed nausea"
    ],

    nursingAssessment: [
      "Check liver function",
      "Review medications for interactions"
    ],

    administration: [
      "PO",
      "IV"
    ],

    prescriptionParameters: [
      "Give 1 hour before chemotherapy",
      "Give within 3 hours before surgery (PONV)"
    ],

    sideEffects: [
      "Fatigue",
      "Diarrhea",
      "Hiccups"
    ],

    adverseEffects: [
      "Severe allergic reaction",
      "Stevens-Johnson syndrome"
    ],

    precautions: [
      "Use caution in liver disease"
    ],

    contraindications: [
      "Hypersensitivity"
    ],

    interactions: [
      "Reduces effectiveness of oral contraceptives",
      "Interacts with warfarin"
    ],

    clientTeaching: [
      "Use backup birth control",
      "Report rash or breathing issues"
    ],

    nonPharmTips: [
      "Stay hydrated",
      "Use electrolyte drinks if needed"
    ],

    clinicalPearls: [
      "Best for delayed chemo nausea",
      "Watch for serious skin reactions"
    ],

    boxedWarning:
      "Severe hypersensitivity and skin reactions may occur.",

    outcomes:
      "Reduced nausea and vomiting after chemotherapy."
  },

  {
    id: "metoclopramide",
    label: "Antiemetics",
    title: "Metoclopramide (Reglan)",
    category: "Dopamine Receptor Antagonist",
    difficulty: "Medium",
    overview:
      "Used for nausea, vomiting, and gastroparesis.",
    drugClass: "Dopamine receptor antagonist",

    action:
      "Blocks dopamine and increases GI motility.",

    mechanism:
      "Blocks dopamine receptors and increases gastric emptying and motility.",

    therapeuticUse: [
      "Nausea and vomiting",
      "Gastroparesis"
    ],

    nursingAssessment: [
      "Monitor for involuntary movements",
      "Assess GI function"
    ],

    administration: [
      "PO",
      "IV",
      "IM"
    ],

    prescriptionParameters: [
      "Give 30 minutes before meals",
      "Avoid long-term use (>12 weeks)"
    ],

    sideEffects: [
      "Drowsiness",
      "Fatigue"
    ],

    adverseEffects: [
      "Tardive dyskinesia",
      "Extrapyramidal symptoms",
      "Neuroleptic malignant syndrome"
    ],

    precautions: [
      "Use cautiously in older adults",
      "Avoid long-term use"
    ],

    contraindications: [
      "GI obstruction",
      "Seizure disorders"
    ],

    interactions: [
      "Increases sedation with CNS depressants"
    ],

    clientTeaching: [
      "Report abnormal movements immediately",
      "Avoid driving"
    ],

    nonPharmTips: [
      "Rise slowly",
      "Maintain hydration"
    ],

    clinicalPearls: [
      "High-risk for movement disorders",
      "Used for GI motility"
    ],

    boxedWarning:
      "Tardive dyskinesia risk increases with prolonged use and may be irreversible.",

    outcomes:
      "Improved gastric emptying and reduced nausea."
  },

  {
    id: "promethazine",
    label: "Antiemetics",
    title: "Promethazine (Phenergan)",
    category: "Antihistamine",
    difficulty: "Easy",
    overview:
      "Used for nausea, vomiting, motion sickness, and allergies.",
    drugClass: "Antihistamine",

    action:
      "Blocks histamine receptors and suppresses nausea signals.",

    mechanism:
      "Blocks H1 receptors and depresses the vomiting center in the brain.",

    therapeuticUse: [
      "Nausea and vomiting",
      "Motion sickness"
    ],

    nursingAssessment: [
      "Assess sedation level",
      "Monitor respiratory status"
    ],

    administration: [
      "PO",
      "IM",
      "Rectal"
    ],

    prescriptionParameters: [
      "Use caution with IV administration"
    ],

    sideEffects: [
      "Drowsiness",
      "Dry mouth"
    ],

    adverseEffects: [
      "Respiratory depression",
      "Tissue necrosis with improper injection"
    ],

    precautions: [
      "Use cautiously in older adults"
    ],

    contraindications: [
      "Children under 2"
    ],

    interactions: [
      "Alcohol increases sedation",
      "Opioids increase CNS depression"
    ],

    clientTeaching: [
      "Avoid alcohol",
      "Do not drive"
    ],

    nonPharmTips: [
      "Sit facing forward in motion",
      "Avoid reading",
      "Focus on horizon"
    ],

    clinicalPearls: [
      "Great for motion sickness",
      "Very sedating"
    ],

    boxedWarning:
      "Can cause severe tissue injury; avoid improper injection routes.",

    outcomes:
      "Reduced nausea and improved comfort."
  }
];
