const questionsDB = [
  {
    id: 1,
    category: "priorite",
    difficulty: "easy",
    question: "Quelle est la règle de priorité à une intersection sans panneau ?",
    options: ["Priorité à droite", "Priorité à gauche", "Le plus grand véhicule passe", "Celui qui arrive le premier"],
    correctAnswer: 0,
    explanation: "La règle de la priorité à droite s'applique par défaut."
  },
  {
    id: 2,
    category: "circulation",
    difficulty: "easy",
    question: "Quelle est la vitesse maximale en agglomération ?",
    options: ["30 km/h", "50 km/h", "70 km/h", "90 km/h"],
    correctAnswer: 1,
    explanation: "La vitesse est limitée à 50 km/h en agglomération sauf indication contraire."
  },
  {
    id: 3,
    category: "panneaux",
    difficulty: "medium",
    question: "Que signifie un panneau rond à fond blanc avec bordure rouge ?",
    options: ["Obligation", "Interdiction", "Danger", "Fin d'interdiction"],
    correctAnswer: 1,
    explanation: "Les panneaux circulaires à fond blanc avec bordure rouge sont des panneaux d'interdiction."
  },
  {
    id: 4,
    category: "priorite",
    difficulty: "medium",
    question: "Dans un rond-point, qui a la priorité ?",
    options: ["Les véhicules entrant", "Les véhicules déjà engagés", "Les véhicules de droite", "Les plus rapides"],
    correctAnswer: 1,
    explanation: "Dans un rond-point, la priorité est aux véhicules déjà engagés dans le giratoire."
  },
  {
    id: 5,
    category: "stationnement",
    difficulty: "easy",
    question: "Quelle est la distance minimale de stationnement avant un passage piéton ?",
    options: ["3 mètres", "5 mètres", "10 mètres", "15 mètres"],
    correctAnswer: 1,
    explanation: "Il est interdit de stationner à moins de 5 mètres avant un passage piéton."
  },
  {
    id: 6,
    category: "circulation",
    difficulty: "medium",
    question: "Par temps de pluie sur autoroute, la vitesse est limitée à :",
    options: ["90 km/h", "100 km/h", "110 km/h", "130 km/h"],
    correctAnswer: 2,
    explanation: "Par temps de pluie sur autoroute, la limite passe de 130 à 110 km/h."
  },
  {
    id: 7,
    category: "secours",
    difficulty: "easy",
    question: "Quel est le numéro d'urgence européen ?",
    options: ["15", "17", "18", "112"],
    correctAnswer: 3,
    explanation: "Le 112 est le numéro d'appel d'urgence européen, valable dans tous les pays de l'UE."
  },
  {
    id: 8,
    category: "technique",
    difficulty: "medium",
    question: "Quelle est la profondeur minimale légale des pneus ?",
    options: ["0.8 mm", "1.0 mm", "1.6 mm", "2.0 mm"],
    correctAnswer: 2,
    explanation: "La profondeur minimale légale des pneus est de 1.6 mm."
  },
  {
    id: 9,
    category: "eclairage",
    difficulty: "easy",
    question: "Quand doit-on allumer les feux de croisement ?",
    options: ["Uniquement la nuit", "Dès qu'il fait sombre ou en cas de mauvaise visibilité", "Seulement en ville", "De 20h à 6h"],
    correctAnswer: 1,
    explanation: "Les feux de croisement sont obligatoires dès qu'il fait sombre ou en cas de mauvaise visibilité."
  },
  {
    id: 10,
    category: "croisement",
    difficulty: "hard",
    question: "Quand est-il interdit de dépasser ?",
    options: ["En approche d'un sommet", "Dans un virage sans visibilité", "À proximité d'un passage à niveau", "Toutes ces réponses"],
    correctAnswer: 3,
    explanation: "Le dépassement est interdit dans toutes ces situations pour des raisons de sécurité."
  }
];

// Générer plus de questions pour atteindre 100+
for (let i = 11; i <= 100; i++) {
  const categories = ['priorite', 'panneaux', 'circulation', 'stationnement', 'croisement', 'eclairage', 'secours', 'technique'];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  
  questionsDB.push({
    id: i,
    category: cat,
    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
    question: `Question #${i}: ${cat.charAt(0).toUpperCase() + cat.slice(1)} - Quelle est la bonne réponse ?`,
    options: [
      `Réponse A pour question ${i}`,
      `Réponse B pour question ${i}`,
      `Réponse C pour question ${i}`,
      `Réponse D pour question ${i}`
    ],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: `Explication détaillée pour la question ${i} sur le thème ${cat}.`
  });
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
