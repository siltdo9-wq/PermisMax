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
// -------------------
// Éclairage (501-515)
// -------------------
{ id: 501, category: "Éclairage", difficulty: "facile", question: "Quand utiliser feux de croisement ?", options: ["Toujours la nuit","Toujours","Jamais","Seulement en campagne"], correctAnswer: 0, explanation: "Feux de croisement obligatoires la nuit et visibilité réduite." },
{ id: 502, category: "Éclairage", difficulty: "moyen", question: "Utilisation feux brouillard avant ?", options: ["Toujours","Seulement brouillard dense","En ville","Jamais"], correctAnswer: 1, explanation: "Seulement en cas de brouillard dense pour ne pas éblouir." },
// ... continuer jusqu'à id 515

// -------------------
// Téléphone et Distractions (516-530)
// -------------------
{ id: 516, category: "Téléphone et Distractions", difficulty: "facile", question: "Utilisation oreillette autorisée ?", options: ["Oui","Non"], correctAnswer: 1, explanation: "Interdite même oreillette." },
{ id: 517, category: "Téléphone et Distractions", difficulty: "moyen", question: "Sanctions pour distraction au volant ?", options: ["Amende","Perte de points","Les deux","Aucune"], correctAnswer: 2, explanation: "Amende + perte de points." },
// ... continuer jusqu'à id 530

// -------------------
// Dépassement (531-545)
// -------------------
{ id: 531, category: "Dépassement", difficulty: "facile", question: "Dépassement sur autoroute ?", options: ["Toujours par la gauche","Toujours par la droite","Indifférent","Jamais"], correctAnswer: 0, explanation: "Toujours par la gauche sauf situations exceptionnelles." },
{ id: 532, category: "Dépassement", difficulty: "moyen", question: "Quand dépasser un cycliste ?", options: ["Toujours","Avec prudence","Jamais","Aucune règle"], correctAnswer: 1, explanation: "Toujours avec prudence et distance de sécurité." },
// ... continuer jusqu'à id 545

// -------------------
// Environnement (546-560)
// -------------------
{ id: 546, category: "Environnement", difficulty: "facile", question: "Comment réduire consommation carburant ?", options: ["Conduite agressive","Conduite souple","Rouler vite","Rouler au point mort"], correctAnswer: 1, explanation: "Conduite souple et anticipative réduit consommation." },
{ id: 547, category: "Environnement", difficulty: "moyen", question: "Émissions CO2 véhicule électrique ?", options: ["0","Variable selon électricité","Toujours élevées","Indifférent"], correctAnswer: 1, explanation: "Dépend de la source d’électricité utilisée." },
// ... continuer jusqu'à id 560

// -------------------
// Mécanique (561-575)
// -------------------
{ id: 561, category: "Mécanique", difficulty: "facile", question: "Quand vérifier niveaux d’huile ?", options: ["Jamais","Chaque jour","Selon notice constructeur","Une fois par an"], correctAnswer: 2, explanation: "Suivre la notice constructeur." },
{ id: 562, category: "Mécanique", difficulty: "moyen", question: "Voyant batterie allumé ?", options: ["Problème charge","Tout OK","Frein à main","Rien"], correctAnswer: 0, explanation: "Indique un problème de charge ou batterie." },
// ... continuer jusqu'à id 575

// -------------------
// Conduite (576-590)
// -------------------
{ id: 576, category: "Conduite", difficulty: "facile", question: "Comment freiner sur route glissante ?", options: ["Freinage brusque","Freinage progressif","Ne pas freiner","Tourner brusquement"], correctAnswer: 1, explanation: "Freinage progressif pour garder contrôle." },
{ id: 577, category: "Conduite", difficulty: "moyen", question: "Comment négocier virage en montagne ?", options: ["Freiner avant","Accélérer avant","Rester neutre","Ignorer"], correctAnswer: 0, explanation: "Ralentir avant le virage." },
// ... continuer jusqu'à id 590

// -------------------
// Règlementation (591-600)
// -------------------
{ id: 591, category: "Règlementation", difficulty: "facile", question: "Durée validité contrôle technique ?", options: ["1 an","2 ans","4 ans","10 ans"], correctAnswer: 2, explanation: "Valide 4 ans pour véhicule neuf, puis tous les 2 ans." },
{ id: 592, category: "Règlementation", difficulty: "moyen", question: "Permis probatoire nombre points ?", options: ["6","8","12","10"], correctAnswer: 0, explanation: "Permis probatoire commence avec 6 points." }
// ... compléter jusqu'à id 600
// -------------------
// Signalisation (601-615)
// -------------------
{ id: 601, category: "Signalisation", difficulty: "facile", question: "Que signifie un panneau rond rouge avec barre blanche ?", options: ["Sens interdit","Route prioritaire","Stop","Cédez-le-passage"], correctAnswer: 0, explanation: "Sens interdit." },
{ id: 602, category: "Signalisation", difficulty: "moyen", question: "Panneau carré bleu avec 'H' blanc ?", options: ["Hôpital","Hôtel","Halte","Hélicoptère"], correctAnswer: 0, explanation: "Indique un hôpital à proximité." },
// ... continuer jusqu'à id 615

// -------------------
// Priorités (616-630)
// -------------------
{ id: 616, category: "Priorités", difficulty: "facile", question: "Qui a priorité à un carrefour non signalé ?", options: ["Venant de gauche","Venant de droite","Celui le plus rapide","Piéton"], correctAnswer: 1, explanation: "Priorité à droite par défaut." },
{ id: 617, category: "Priorités", difficulty: "moyen", question: "Véhicule d'urgence approche ?", options: ["Toujours priorité","Parfois","Jamais","Seulement en ville"], correctAnswer: 0, explanation: "Toujours céder le passage." },
// ... continuer jusqu'à id 630

// -------------------
// Vitesse (631-645)
// -------------------
{ id: 631, category: "Vitesse", difficulty: "facile", question: "Vitesse max autoroute ?", options: ["110","120","130","140"], correctAnswer: 2, explanation: "130 km/h sur autoroute." },
{ id: 632, category: "Vitesse", difficulty: "moyen", question: "Vitesse réduite en cas de pluie ?", options: ["10 km/h","20 km/h","30 km/h","50 km/h"], correctAnswer: 1, explanation: "On réduit de 20 km/h sur autoroute et nationale." },
// ... continuer jusqu'à id 645

// -------------------
// Sécurité (646-660)
// -------------------
{ id: 646, category: "Sécurité", difficulty: "facile", question: "Port ceinture obligatoire ?", options: ["Oui","Non"], correctAnswer: 0, explanation: "Obligatoire pour tous." },
{ id: 647, category: "Sécurité", difficulty: "moyen", question: "Que faire en cas d'accident léger ?", options: ["Quitter les lieux","Échanger informations","Téléphoner police","Ignorer"], correctAnswer: 1, explanation: "Échanger informations et assurer sécurité." },
// ... continuer jusqu'à id 660

// -------------------
// Alcool & Stupéfiants (661-675)
// -------------------
{ id: 661, category: "Alcool et Stupéfiants", difficulty: "facile", question: "Taux légal pour conducteur confirmé ?", options: ["0,2","0,5","0,8","1,0"], correctAnswer: 1, explanation: "0,5 g/L maximum pour conducteur confirmé." },
{ id: 662, category: "Alcool et Stupéfiants", difficulty: "moyen", question: "Effet cannabis sur conduite ?", options: ["Aucun","Réflexes réduits","Vitesse augmente","Meilleure coordination"], correctAnswer: 1, explanation: "Réduction de réflexes et attention." },
// ... continuer jusqu'à id 675

// -------------------
// Stationnement (676-690)
// -------------------
{ id: 676, category: "Stationnement", difficulty: "facile", question: "Stationnement interdit devant garage ?", options: ["Oui","Non"], correctAnswer: 0, explanation: "Interdit pour ne pas gêner." },
{ id: 677, category: "Stationnement", difficulty: "moyen", question: "Stationnement payant ?", options: ["Toujours","Jamais","Selon panneaux","Indifférent"], correctAnswer: 2, explanation: "Suivre signalisation." },
// ... continuer jusqu'à id 690

// -------------------
// Distance de sécurité (691-700)
// -------------------
{ id: 691, category: "Distance de Sécurité", difficulty: "moyen", question: "Distance de sécurité en conditions normales ?", options: ["1 s","2 s","3 s","5 s"], correctAnswer: 2, explanation: "2 secondes minimum par 10 km/h." },
{ id: 692, category: "Distance de Sécurité", difficulty: "difficile", question: "Distance d'arrêt à 50 km/h sur route sèche ?", options: ["15 m","25 m","35 m","45 m"], correctAnswer: 2, explanation: "Distance d'arrêt environ 25-35 m selon véhicule." }
// ... compléter jusqu'à id 700
// -------------------
// Éclairage (701-715)
// -------------------
{ id: 701, category: "Éclairage", difficulty: "facile", question: "Quand utiliser feux de route ?", options: ["Toujours","Uniquement de nuit","Sur route dégagée sans trafic","Jamais"], correctAnswer: 2, explanation: "Feux de route uniquement sur route dégagée, sans gêner les autres." },
{ id: 702, category: "Éclairage", difficulty: "moyen", question: "Feux de brouillard arrière ?", options: ["Toujours","Brouillard dense","En ville","Jamais"], correctAnswer: 1, explanation: "Seulement en cas de brouillard dense." },
// ... continuer jusqu'à id 715

// -------------------
// Téléphone et Distractions (716-730)
// -------------------
{ id: 716, category: "Téléphone et Distractions", difficulty: "facile", question: "Utilisation téléphone au volant ?", options: ["Interdit","Autorisé","Uniquement kit mains libres","Variable"], correctAnswer: 0, explanation: "Interdite, même avec kit mains libres pour certains cas." },
{ id: 717, category: "Téléphone et Distractions", difficulty: "moyen", question: "Quelle sanction pour envoi SMS ?", options: ["Amende","Perte de points","Les deux","Aucune"], correctAnswer: 2, explanation: "Amende et perte de points." },
// ... continuer jusqu'à id 730

// -------------------
// Dépassement (731-745)
// -------------------
{ id: 731, category: "Dépassement", difficulty: "facile", question: "Distance minimum lors d’un dépassement vélo ?", options: ["1 m","1,5 m","2 m","3 m"], correctAnswer: 1, explanation: "1,5 m minimum selon réglementation." },
{ id: 732, category: "Dépassement", difficulty: "moyen", question: "Dépasser sur route à double sens ?", options: ["Toujours","Jamais","Avec prudence","Seulement voiture rapide"], correctAnswer: 2, explanation: "Toujours avec prudence." },
// ... continuer jusqu'à id 745

// -------------------
// Environnement (746-760)
// -------------------
{ id: 746, category: "Environnement", difficulty: "facile", question: "Comment réduire consommation carburant ?", options: ["Freiner brusquement","Conduite souple","Accélérer","Rouler au point mort"], correctAnswer: 1, explanation: "Conduite souple et anticipative réduit consommation." },
{ id: 747, category: "Environnement", difficulty: "moyen", question: "Crit’Air obligatoire ?", options: ["Uniquement zones polluées","Partout","Jamais","Seulement autoroute"], correctAnswer: 0, explanation: "Obligatoire dans zones à circulation restreinte selon pollution." },
// ... continuer jusqu'à id 760

// -------------------
// Mécanique (761-775)
// -------------------
{ id: 761, category: "Mécanique", difficulty: "facile", question: "Quand vérifier pression pneus ?", options: ["Jamais","Chaque jour","Chaque semaine","Chaque mois"], correctAnswer: 3, explanation: "Vérifier régulièrement, au moins une fois par mois." },
{ id: 762, category: "Mécanique", difficulty: "moyen", question: "Voyant ABS allumé ?", options: ["Pas grave","Problème freinage","Signal obligatoire","Clignotant normal"], correctAnswer: 1, explanation: "Indique problème système ABS." },
// ... continuer jusqu'à id 775

// -------------------
// Conduite (776-790)
// -------------------
{ id: 776, category: "Conduite", difficulty: "facile", question: "Comment freiner sur sol mouillé ?", options: ["Freinage brusque","Freinage progressif","Ne pas freiner","Tourner brusquement"], correctAnswer: 1, explanation: "Freinage progressif pour garder contrôle." },
{ id: 777, category: "Conduite", difficulty: "moyen", question: "Comment aborder virage rapide ?", options: ["Accélérer","Ralentir et tourner","Ignorer","Freiner brusquement"], correctAnswer: 1, explanation: "Ralentir avant le virage et tourner progressivement." },
// ... continuer jusqu'à id 790

// -------------------
// Règlementation (791-800)
// -------------------
{ id: 791, category: "Règlementation", difficulty: "facile", question: "Validité permis probatoire ?", options: ["2 ans","3 ans","4 ans","5 ans"], correctAnswer: 0, explanation: "Durée du permis probatoire : 2 ans (ou 3 ans selon formation)." },
{ id: 792, category: "Règlementation", difficulty: "moyen", question: "Nombre points initial permis probatoire ?", options: ["6","8","12","10"], correctAnswer: 0, explanation: "6 points au départ pour permis probatoire." }
// ... compléter jusqu'à id 800
// -------------------
// Signalisation (801-815)
// -------------------
{ id: 801, category: "Signalisation", difficulty: "facile", question: "Panneau octogonal rouge ?", options: ["Stop","Cédez-le-passage","Sens interdit","Route prioritaire"], correctAnswer: 0, explanation: "Panneau stop : arrêt obligatoire." },
{ id: 802, category: "Signalisation", difficulty: "moyen", question: "Panneau rond bleu avec flèche droite ?", options: ["Tourner à droite obligatoire","Sens interdit","Stop","Priorité"], correctAnswer: 0, explanation: "Indique la direction obligatoire : droite." },
// ... continuer jusqu'à id 815

// -------------------
// Priorités (816-830)
// -------------------
{ id: 816, category: "Priorités", difficulty: "facile", question: "Qui a priorité sur route prioritaire ?", options: ["Venant de gauche","Venant de droite","Venant de la route prioritaire","Piéton"], correctAnswer: 2, explanation: "Priorité aux véhicules sur route prioritaire." },
{ id: 817, category: "Priorités", difficulty: "moyen", question: "Céder passage à piétons ?", options: ["Toujours","Jamais","Seulement trottoir","Seulement passage clouté"], correctAnswer: 0, explanation: "Toujours céder passage aux piétons qui traversent." },
// ... continuer jusqu'à id 830

// -------------------
// Vitesse (831-845)
// -------------------
{ id: 831, category: "Vitesse", difficulty: "facile", question: "Vitesse max en agglomération ?", options: ["50","30","70","90"], correctAnswer: 0, explanation: "50 km/h en ville sauf indication contraire." },
{ id: 832, category: "Vitesse", difficulty: "moyen", question: "Vitesse max sur route humide ?", options: ["80","90","100","110"], correctAnswer: 0, explanation: "Réduire la vitesse de 20 km/h sur route humide." },
// ... continuer jusqu'à id 845

// -------------------
// Sécurité (846-860)
// -------------------
{ id: 846, category: "Sécurité", difficulty: "facile", question: "Quand porter gilet réfléchissant ?", options: ["Toujours","En cas panne","Jamais","Seulement en ville"], correctAnswer: 1, explanation: "Obligatoire si arrêt d’urgence hors agglomération." },
{ id: 847, category: "Sécurité", difficulty: "moyen", question: "Premiers gestes accident ?", options: ["Évaluer danger","Alerter secours","Secourir victime","Tout à la fois"], correctAnswer: 3, explanation: "Évaluer danger, alerter et secourir en même temps." },
// ... continuer jusqu'à id 860

// -------------------
// Alcool & Stupéfiants (861-875)
// -------------------
{ id: 861, category: "Alcool et Stupéfiants", difficulty: "facile", question: "Taux légal alcool jeune conducteur ?", options: ["0,2","0,5","0,8","1,0"], correctAnswer: 0, explanation: "0,2 g/L maximum." },
{ id: 862, category: "Alcool et Stupéfiants", difficulty: "moyen", question: "Effets stupéfiants conduite ?", options: ["Aucun","Diminution réflexes","Augmentation attention","Variable"], correctAnswer: 1, explanation: "Réduction des réflexes et vigilance." },
// ... continuer jusqu'à id 875

// -------------------
// Stationnement (876-890)
// -------------------
{ id: 876, category: "Stationnement", difficulty: "facile", question: "Stationnement trottoir ?", options: ["Oui","Non"], correctAnswer: 1, explanation: "Interdit sauf signalisation." },
{ id: 877, category: "Stationnement", difficulty: "moyen", question: "Stationnement zone bleue ?", options: ["Gratuit","Payant selon disque","Interdit","Libre"], correctAnswer: 1, explanation: "Stationnement limité avec disque." },
// ... continuer jusqu'à id 890

// -------------------
// Distance de sécurité (891-900)
// -------------------
{ id: 891, category: "Distance de Sécurité", difficulty: "moyen", question: "Distance sécurité à 90 km/h ?", options: ["20 m","30 m","40 m","50 m"], correctAnswer: 2, explanation: "Distance d’arrêt environ 40 m." },
{ id: 892, category: "Distance de Sécurité", difficulty: "difficile", question: "Règle 2 secondes ?", options: ["Distance min","Temps de réaction","Distance freinage","Vitesse max"], correctAnswer: 1, explanation: "La règle des 2 secondes sert à évaluer le temps de réaction et distance de sécurité." }
// ... compléter jusqu'à id 900
// -------------------
// Éclairage (901-910)
// -------------------
{ id: 901, category: "Éclairage", difficulty: "facile", question: "Feux de détresse ?", options: ["En cas d'urgence","Toujours","Jamais","Seulement de nuit"], correctAnswer: 0, explanation: "À utiliser uniquement en cas d'urgence ou panne." },
{ id: 902, category: "Éclairage", difficulty: "moyen", question: "Feux diurnes obligatoires ?", options: ["Oui","Non"], correctAnswer: 0, explanation: "Les véhicules récents doivent les utiliser la journée." },
// ... continuer jusqu'à id 910

// -------------------
// Téléphone et Distractions (911-920)
// -------------------
{ id: 911, category: "Téléphone et Distractions", difficulty: "facile", question: "Envoyer SMS au volant ?", options: ["Interdit","Autorisé"], correctAnswer: 0, explanation: "Strictement interdit." },
{ id: 912, category: "Téléphone et Distractions", difficulty: "moyen", question: "Utilisation GPS sur téléphone ?", options: ["Oui","Uniquement support","Non"], correctAnswer: 1, explanation: "Toujours sur support pour ne pas tenir le téléphone." },
// ... continuer jusqu'à id 920

// -------------------
// Dépassement (921-930)
// -------------------
{ id: 921, category: "Dépassement", difficulty: "facile", question: "Dépasser sur ligne continue ?", options: ["Interdit","Autorisé","Seulement vélo","Variable"], correctAnswer: 0, explanation: "Interdit sur ligne continue." },
{ id: 922, category: "Dépassement", difficulty: "moyen", question: "Quand dépasser camion ?", options: ["Toujours","Jamais","Avec prudence","Seulement autoroute"], correctAnswer: 2, explanation: "Toujours avec prudence et visibilité." },
// ... continuer jusqu'à id 930

// -------------------
// Environnement (931-940)
// -------------------
{ id: 931, category: "Environnement", difficulty: "facile", question: "Éco-conduite ?", options: ["Accélérer et freiner","Conduite souple","Rouler vite","Utiliser klaxon"], correctAnswer: 1, explanation: "Conduite souple et anticipative réduit consommation et pollution." },
{ id: 932, category: "Environnement", difficulty: "moyen", question: "Véhicule électrique émission CO2 ?", options: ["0","Variable","Toujours élevée","Indifférent"], correctAnswer: 1, explanation: "Émissions dépendent de source d’électricité." },
// ... continuer jusqu'à id 940

// -------------------
// Mécanique (941-950)
// -------------------
{ id: 941, category: "Mécanique", difficulty: "facile", question: "Contrôle freins ?", options: ["Jamais","Annuel","Selon notice","Mensuel"], correctAnswer: 2, explanation: "Suivre notice constructeur." },
{ id: 942, category: "Mécanique", difficulty: "moyen", question: "Voyant airbag ?", options: ["OK","Défaut","Indifférent","Clignote"], correctAnswer: 1, explanation: "Indique défaut système airbag." },
// ... continuer jusqu'à id 950

// -------------------
// Conduite (951-970)
// -------------------
{ id: 951, category: "Conduite", difficulty: "facile", question: "Frein moteur ?", options: ["Ne pas utiliser","Utiliser pour ralentir","Toujours","Jamais"], correctAnswer: 1, explanation: "Permet ralentir sans freiner excessivement." },
{ id: 952, category: "Conduite", difficulty: "moyen", question: "Angle mort ?", options: ["Regarder rétro","Vérifier avant bras","Contrôle visuel côté","Ignorer"], correctAnswer: 2, explanation: "Toujours contrôler l’angle mort visuellement." },
// ... continuer jusqu'à id 970

// -------------------
// Règlementation (971-1000)
// -------------------
{ id: 971, category: "Règlementation", difficulty: "facile", question: "Validité carte grise ?", options: ["1 an","2 ans","Indéfinie","5 ans"], correctAnswer: 3, explanation: "Renouvellement selon réglementation locale." },
{ id: 972, category: "Règlementation", difficulty: "moyen", question: "Assurance obligatoire ?", options: ["Oui","Non"], correctAnswer: 0, explanation: "Obligatoire pour tout véhicule en circulation." },
// ... compléter jusqu'à id 1000
