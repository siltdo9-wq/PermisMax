const questionsDatabase = [
  // -------------------
  // Signalisation (1-7)
  // -------------------
  { id: 1, category: "Signalisation", difficulty: "facile", question: "Que signifie ce panneau STOP ?", options: ["Stop","Cédez-le-passage","Sens interdit","Priorité à droite"], correctAnswer: 0, explanation: "Vous devez marquer l'arrêt." },
  { id: 2, category: "Signalisation", difficulty: "facile", question: "Que signifie le panneau Sens Interdit ?", options: ["Route à sens unique","Accès interdit","Priorité à droite","Arrêt obligatoire"], correctAnswer: 1, explanation: "Le panneau Sens interdit interdit l'accès aux véhicules." },
  { id: 3, category: "Signalisation", difficulty: "moyen", question: "Que signifie un panneau triangulaire rouge avec un point d'exclamation ?", options: ["Danger","Stop","Priorité","Interdiction"], correctAnswer: 0, explanation: "C'est un panneau de danger général." },
  { id: 4, category: "Signalisation", difficulty: "moyen", question: "Que signifie un panneau circulaire bleu avec flèche blanche ?", options: ["Obligation","Interdiction","Danger","Information"], correctAnswer: 0, explanation: "C'est un panneau d'obligation, indiquant la direction à suivre." },
  { id: 5, category: "Signalisation", difficulty: "difficile", question: "Que signifie un panneau triangulaire avec un tracteur ?", options: ["Travaux","Véhicules agricoles","Danger général","Ralentir"], correctAnswer: 1, explanation: "Ce panneau indique un passage possible de véhicules agricoles." },
  { id: 6, category: "Signalisation", difficulty: "facile", question: "Que signifie un panneau rond rouge avec un chiffre ?", options: ["Limitation de vitesse","Interdiction","Stop","Priorité"], correctAnswer: 0, explanation: "Indique la vitesse maximale autorisée." },
  { id: 7, category: "Signalisation", difficulty: "moyen", question: "Que signifie un panneau bleu avec un H blanc ?", options: ["Hôpital","Hotel","Halte","Hydrant"], correctAnswer: 0, explanation: "Il indique la présence d'un hôpital." },

  // -------------------
  // Priorités (8-21)
  // -------------------
  { id: 8, category: "Priorités", difficulty: "facile", question: "Qui a la priorité à une intersection sans panneau ?", options: ["La voiture de droite","La voiture de gauche","Le piéton","Le cycliste"], correctAnswer: 0, explanation: "Priorité à droite." },
  { id: 9, category: "Priorités", difficulty: "moyen", question: "Qui a la priorité dans un rond-point ?", options: ["Véhicules entrant","Véhicules circulant déjà","Piétons","Cyclistes"], correctAnswer: 1, explanation: "Priorité aux véhicules circulant déjà." },
  { id: 10, category: "Priorités", difficulty: "difficile", question: "Qui a priorité lorsqu’un véhicule d’urgence arrive ?", options: ["Toujours le véhicule d’urgence","Toujours moi","Celui de droite","Celui de gauche"], correctAnswer: 0, explanation: "Les véhicules d'urgence ont priorité." },
  // ... continuer jusqu'à id 21 pour la catégorie Priorités

  // -------------------
  // Vitesse (22-35)
  // -------------------
  { id: 22, category: "Vitesse", difficulty: "facile", question: "Limitation en agglomération ?", options: ["50","70","90","110"], correctAnswer: 0, explanation: "50 km/h en agglomération." },
  { id: 23, category: "Vitesse", difficulty: "moyen", question: "Limitation sur route départementale hors agglomération ?", options: ["50","70","80","90"], correctAnswer: 3, explanation: "90 km/h." },
  { id: 24, category: "Vitesse", difficulty: "difficile", question: "Limitation sur autoroute en France ?", options: ["90","110","130","150"], correctAnswer: 2, explanation: "130 km/h sur autoroute par temps sec." },
  // ... continuer jusqu'à id 35 pour Vitesse

  // -------------------
  // Sécurité (36-49)
  // -------------------
  { id: 36, category: "Sécurité", difficulty: "facile", question: "Quand faut-il boucler sa ceinture ?", options: ["Toujours","Seulement en autoroute","Seulement la nuit","Jamais"], correctAnswer: 0, explanation: "Toujours." },
  { id: 37, category: "Sécurité", difficulty: "moyen", question: "Quand vérifier la pression des pneus ?", options: ["Chaque semaine","Chaque mois","Avant un long trajet","Jamais"], correctAnswer: 2, explanation: "Avant un long trajet." },
  { id: 38, category: "Sécurité", difficulty: "difficile", question: "Que faire en cas de dérapage ?", options: ["Freiner fort","Tourner dans le sens du dérapage","Accélérer","Ignorer"], correctAnswer: 1, explanation: "Tourner dans le sens du dérapage." },
  // ... continuer jusqu'à id 49

  // -------------------
  // Alcool et Stupéfiants (50-63)
  // -------------------
  { id: 50, category: "Alcool et Stupéfiants", difficulty: "facile", question: "Taux légal pour conducteur novice ?", options: ["0,2g/L","0,5g/L","0,8g/L","1,0g/L"], correctAnswer: 0, explanation: "0,2 g/L maximum." },
  { id: 51, category: "Alcool et Stupéfiants", difficulty: "moyen", question: "Taux légal pour conducteur confirmé ?", options: ["0,2g/L","0,5g/L","0,8g/L","1,0g/L"], correctAnswer: 1, explanation: "0,5 g/L maximum." },
  { id: 52, category: "Alcool et Stupéfiants", difficulty: "difficile", question: "Effets de l'alcool sur réaction ?", options: ["Augmente","Diminue","Aucune","Variable"], correctAnswer: 1, explanation: "Diminue le temps de réaction." },
  // ... continuer jusqu'à id 63

  // -------------------
  // Stationnement (64-77)
  // -------------------
  // ...

  // -------------------
  // Distance de sécurité (78-91)
  // -------------------
  // ...

  // -------------------
  // Éclairage (92-105)
  // -------------------
  // ...
];
// -------------------
// Téléphone et Distractions (101-114)
// -------------------
{ id: 101, category: "Téléphone et Distractions", difficulty: "facile", question: "Est-il autorisé de téléphoner sans kit mains-libres ?", options: ["Oui","Non","Seulement en agglomération","Seulement la nuit"], correctAnswer: 1, explanation: "Interdiction d’utiliser le téléphone sans kit mains-libres." },
{ id: 102, category: "Téléphone et Distractions", difficulty: "moyen", question: "Que risque-t-on en utilisant le téléphone au volant ?", options: ["Amende","Perte de points","Accident","Tout cela"], correctAnswer: 3, explanation: "Toutes les réponses sont correctes." },
// ... continuer jusqu'à id 114

// -------------------
// Dépassement (115-128)
// -------------------
{ id: 115, category: "Dépassement", difficulty: "facile", question: "Peut-on dépasser à droite ?", options: ["Oui","Non","Seulement en ville","Seulement sur autoroute"], correctAnswer: 1, explanation: "Le dépassement à droite est interdit sauf exceptions spécifiques." },
{ id: 116, category: "Dépassement", difficulty: "moyen", question: "Distance minimale pour dépasser ?", options: ["2 mètres","3 mètres","5 mètres","Variable"], correctAnswer: 3, explanation: "La distance dépend du type de route et du véhicule." },
// ... continuer jusqu'à id 128

// -------------------
// Environnement (129-142)
// -------------------
{ id: 129, category: "Environnement", difficulty: "facile", question: "Qu’est-ce que l’éco-conduite ?", options: ["Conduire vite","Conduire lentement","Conduire économiquement","Conduire en montagne"], correctAnswer: 2, explanation: "Conduire en réduisant consommation et pollution." },
{ id: 130, category: "Environnement", difficulty: "moyen", question: "Impact des pneus mal gonflés ?", options: ["Aucun","Consommation accrue","Sécurité améliorée","Pollution réduite"], correctAnswer: 1, explanation: "Pneus mal gonflés augmentent consommation et usure." },
// ... continuer jusqu'à id 142

// -------------------
// Mécanique (143-156)
// -------------------
{ id: 143, category: "Mécanique", difficulty: "facile", question: "Que signifie un voyant rouge moteur ?", options: ["Moteur OK","Problème moteur","Pneus crevés","Feux allumés"], correctAnswer: 1, explanation: "Problème moteur nécessitant intervention." },
{ id: 144, category: "Mécanique", difficulty: "moyen", question: "Fréquence entretien courant ?", options: ["Chaque semaine","Chaque mois","Selon notice constructeur","Jamais"], correctAnswer: 2, explanation: "Suivre le carnet constructeur." },
// ... continuer jusqu'à id 156

// -------------------
// Conduite (157-170)
// -------------------
{ id: 157, category: "Conduite", difficulty: "facile", question: "Comment réagir en cas de verglas ?", options: ["Accélérer","Freiner doucement","Tourner brusquement","Rien faire"], correctAnswer: 1, explanation: "Freiner doucement pour garder le contrôle." },
{ id: 158, category: "Conduite", difficulty: "moyen", question: "Comment négocier un virage dangereux ?", options: ["Accélérer","Ralentir","Freiner brutalement","Rester neutre"], correctAnswer: 1, explanation: "Ralentir avant le virage." },
// ... continuer jusqu'à id 170

// -------------------
// Règlementation (171-200)
// -------------------
{ id: 171, category: "Règlementation", difficulty: "facile", question: "Nombre de points au permis probatoire ?", options: ["6","8","12","10"], correctAnswer: 0, explanation: "Permis probatoire commence avec 6 points." },
{ id: 172, category: "Règlementation", difficulty: "moyen", question: "Durée permis probatoire ?", options: ["2 ans","3 ans","1 an","4 ans"], correctAnswer: 0, explanation: "Permis probatoire : 2 ans pour la majorité." },
// ... continuer jusqu'à id 200
// -------------------
// Téléphone et Distractions (101-114)
// -------------------
{ id: 101, category: "Téléphone et Distractions", difficulty: "facile", question: "Est-il autorisé de téléphoner sans kit mains-libres ?", options: ["Oui","Non","Seulement en agglomération","Seulement la nuit"], correctAnswer: 1, explanation: "Interdiction d’utiliser le téléphone sans kit mains-libres." },
{ id: 102, category: "Téléphone et Distractions", difficulty: "moyen", question: "Que risque-t-on en utilisant le téléphone au volant ?", options: ["Amende","Perte de points","Accident","Tout cela"], correctAnswer: 3, explanation: "Toutes les réponses sont correctes." },
// ... continuer jusqu'à id 114

// -------------------
// Dépassement (115-128)
// -------------------
{ id: 115, category: "Dépassement", difficulty: "facile", question: "Peut-on dépasser à droite ?", options: ["Oui","Non","Seulement en ville","Seulement sur autoroute"], correctAnswer: 1, explanation: "Le dépassement à droite est interdit sauf exceptions spécifiques." },
{ id: 116, category: "Dépassement", difficulty: "moyen", question: "Distance minimale pour dépasser ?", options: ["2 mètres","3 mètres","5 mètres","Variable"], correctAnswer: 3, explanation: "La distance dépend du type de route et du véhicule." },
// ... continuer jusqu'à id 128

// -------------------
// Environnement (129-142)
// -------------------
{ id: 129, category: "Environnement", difficulty: "facile", question: "Qu’est-ce que l’éco-conduite ?", options: ["Conduire vite","Conduire lentement","Conduire économiquement","Conduire en montagne"], correctAnswer: 2, explanation: "Conduire en réduisant consommation et pollution." },
{ id: 130, category: "Environnement", difficulty: "moyen", question: "Impact des pneus mal gonflés ?", options: ["Aucun","Consommation accrue","Sécurité améliorée","Pollution réduite"], correctAnswer: 1, explanation: "Pneus mal gonflés augmentent consommation et usure." },
// ... continuer jusqu'à id 142

// -------------------
// Mécanique (143-156)
// -------------------
{ id: 143, category: "Mécanique", difficulty: "facile", question: "Que signifie un voyant rouge moteur ?", options: ["Moteur OK","Problème moteur","Pneus crevés","Feux allumés"], correctAnswer: 1, explanation: "Problème moteur nécessitant intervention." },
{ id: 144, category: "Mécanique", difficulty: "moyen", question: "Fréquence entretien courant ?", options: ["Chaque semaine","Chaque mois","Selon notice constructeur","Jamais"], correctAnswer: 2, explanation: "Suivre le carnet constructeur." },
// ... continuer jusqu'à id 156

// -------------------
// Conduite (157-170)
// -------------------
{ id: 157, category: "Conduite", difficulty: "facile", question: "Comment réagir en cas de verglas ?", options: ["Accélérer","Freiner doucement","Tourner brusquement","Rien faire"], correctAnswer: 1, explanation: "Freiner doucement pour garder le contrôle." },
{ id: 158, category: "Conduite", difficulty: "moyen", question: "Comment négocier un virage dangereux ?", options: ["Accélérer","Ralentir","Freiner brutalement","Rester neutre"], correctAnswer: 1, explanation: "Ralentir avant le virage." },
// ... continuer jusqu'à id 170

// -------------------
// Règlementation (171-200)
// -------------------
{ id: 171, category: "Règlementation", difficulty: "facile", question: "Nombre de points au permis probatoire ?", options: ["6","8","12","10"], correctAnswer: 0, explanation: "Permis probatoire commence avec 6 points." },
{ id: 172, category: "Règlementation", difficulty: "moyen", question: "Durée permis probatoire ?", options: ["2 ans","3 ans","1 an","4 ans"], correctAnswer: 0, explanation: "Permis probatoire : 2 ans pour la majorité." },
// ... continuer jusqu'à id 200
// -------------------
// Signalisation (401-415)
// -------------------
{ id: 401, category: "Signalisation", difficulty: "facile", question: "Que signifie un panneau carré bleu avec flèche blanche ?", options: ["Direction obligatoire","Stop","Priorité","Sens interdit"], correctAnswer: 0, explanation: "Indique la direction obligatoire." },
{ id: 402, category: "Signalisation", difficulty: "moyen", question: "Que signifie un panneau avec triangle et chute de pierres ?", options: ["Danger chute de pierres","Route glissante","Travaux","Risque cycliste"], correctAnswer: 0, explanation: "Attention risque chute de pierres." },
// ... continuer jusqu'à id 415

// -------------------
// Priorités (416-430)
// -------------------
{ id: 416, category: "Priorités", difficulty: "facile", question: "Qui a la priorité sur un giratoire ?", options: ["Celui entrant","Celui circulant","Piéton","Cycliste"], correctAnswer: 1, explanation: "Priorité aux véhicules circulant déjà." },
{ id: 417, category: "Priorités", difficulty: "moyen", question: "Priorité à un véhicule d'urgence ?", options: ["Toujours","Jamais","Parfois","Seulement en ville"], correctAnswer: 0, explanation: "Toujours priorité aux véhicules d'urgence." },
// ... continuer jusqu'à id 430

// -------------------
// Vitesse (431-445)
// -------------------
{ id: 431, category: "Vitesse", difficulty: "facile", question: "Vitesse max en ville ?", options: ["50","30","70","90"], correctAnswer: 0, explanation: "50 km/h en ville sauf panneau spécifique." },
{ id: 432, category: "Vitesse", difficulty: "moyen", question: "Vitesse max sur route nationale humide ?", options: ["80","90","100","110"], correctAnswer: 0, explanation: "80 km/h si chaussée humide." },
// ... continuer jusqu'à id 445

// -------------------
// Sécurité (446-460)
// -------------------
{ id: 446, category: "Sécurité", difficulty: "facile", question: "Quand utiliser feux de détresse ?", options: ["En cas d'accident","Jamais","En ville","Toujours"], correctAnswer: 0, explanation: "Uniquement en cas d'accident ou panne." },
{ id: 447, category: "Sécurité", difficulty: "moyen", question: "Distance minimum de sécurité ?", options: ["1 m","2 m","3 m","Variable"], correctAnswer: 3, explanation: "Variable selon vitesse et conditions." },
// ... continuer jusqu'à id 460

// -------------------
// Alcool & Stupéfiants (461-475)
// -------------------
{ id: 461, category: "Alcool et Stupéfiants", difficulty: "facile", question: "Taux légal alcool conducteur novice ?", options: ["0,2","0,5","0,8","1"], correctAnswer: 0, explanation: "0,2 g/L maximum." },
{ id: 462, category: "Alcool et Stupéfiants", difficulty: "moyen", question: "Effet alcool sur réflexes ?", options: ["Augmente","Diminue","Ne change rien","Variable"], correctAnswer: 1, explanation: "Diminue réflexes et vigilance." },
// ... continuer jusqu'à id 475

// -------------------
// Stationnement (476-490)
// -------------------
{ id: 476, category: "Stationnement", difficulty: "facile", question: "Stationnement sur trottoir ?", options: ["Oui","Non"], correctAnswer: 1, explanation: "Interdit sauf signalisation." },
{ id: 477, category: "Stationnement", difficulty: "moyen", question: "Stationnement handicapé ?", options: ["Réservé badge","Libre","Payant","Interdit"], correctAnswer: 0, explanation: "Réservé aux véhicules possédant le badge." },
// ... continuer jusqu'à id 490

// -------------------
// Distance de sécurité (491-500)
// -------------------
{ id: 491, category: "Distance de Sécurité", difficulty: "moyen", question: "Règle générale pour distance de sécurité ?", options: ["1 s","2 s","3 s","5 s"], correctAnswer: 2, explanation: "En général 2 secondes par 10 km/h." },
{ id: 492, category: "Distance de Sécurité", difficulty: "difficile", question: "Distance de freinage à 90 km/h sur route sèche ?", options: ["35 m","40 m","45 m","50 m"], correctAnswer: 2, explanation: "Environ 45 m pour un freinage complet sur route sèche." },
// ... compléter jusqu'à id 500
