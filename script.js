// ==========================================
// PERMIS PRO - Application Complète Corrigée
// ==========================================

console.log('🚀 Script.js chargé !');

// Vérifier que questions.js est chargé
if (typeof questionsDB === 'undefined') {
    console.error('❌ questionsDB non chargé ! Vérifiez que questions.js est inclus avant script.js');
    // Créer une base de données minimale de secours
    var questionsDB = [
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
        }
    ];
}

// Fonction shuffle globale
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        console.error('shuffleArray: entrée non valide', array);
        return [];
    }
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ==========================================
// APPLICATION PRINCIPALE
// ==========================================
const App = {
    // État global
    state: {
        currentUser: null,
        isPremium: false,
        currentQuiz: null,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        timer: null,
        timeLeft: 1800,
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            streak: 0,
            bestStreak: 0,
            categories: {},
            history: []
        }
    },

    // ==========================================
    // INITIALISATION
    // ==========================================
    init() {
        console.log('🎮 Initialisation de l\'application...');
        
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
        this.checkPaymentReturn();
        
        console.log('✅ Application initialisée !');
        console.log('Utilisateur:', this.state.currentUser);
        console.log('Premium:', this.state.isPremium);
    },

    // ==========================================
    // EVENT LISTENERS (CORRIGÉS)
    // ==========================================
    setupEventListeners() {
        console.log('👂 Configuration des événements...');

        // Navigation - CORRIGÉ avec délégation d'événements
        document.addEventListener('click', (e) => {
            // Gestion des liens de navigation
            if (e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link');
                const target = link.getAttribute('href')?.substring(1);
                if (target) {
                    console.log('Navigation vers:', target);
                    this.navigateTo(target);
                }
            }

            // Bouton hamburger
            if (e.target.closest('.hamburger')) {
                console.log('Menu mobile toggle');
                document.querySelector('.nav-menu')?.classList.toggle('active');
            }

            // Bouton connexion
            if (e.target.closest('#loginBtn')) {
                console.log('Ouverture modal auth');
                this.openModal('authModal');
            }

            // Bouton déconnexion
            if (e.target.closest('#logoutBtn')) {
                console.log('Déconnexion');
                this.logout();
            }

            // Fermeture modals
            if (e.target.closest('.close') || e.target.closest('.modal:not(.modal-content)')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    console.log('Fermeture modal');
                    modal.classList.remove('active');
                }
            }

            // Tabs auth
            if (e.target.closest('.tab-btn')) {
                const btn = e.target.closest('.tab-btn');
                console.log('Switch tab:', btn.dataset.tab);
                this.switchAuthTab(btn.dataset.tab);
            }

            // Switch tab links
            if (e.target.closest('.switch-tab')) {
                e.preventDefault();
                const tab = e.target.textContent.includes('inscrire') ? 'register' : 'login';
                this.switchAuthTab(tab);
            }

            // Boutons catégories
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const category = card.dataset.category || card.onclick?.toString().match(/'(\w+)'/)?.[1];
                if (category) {
                    console.log('Démarrage catégorie:', category);
                    this.startCategory(category);
                }
            }

            // Bouton commencer entraînement
            if (e.target.closest('.btn-primary') && e.target.textContent.includes('Commencer')) {
                console.log('Démarrage entraînement général');
                this.startTraining();
            }

            // Bouton premium
            if (e.target.closest('.btn-secondary') && e.target.textContent.includes('Premium')) {
                console.log('Affichage premium');
                this.showPremium();
            }

            // Méthodes de paiement
            if (e.target.closest('.pay-method')) {
                const btn = e.target.closest('.pay-method');
                console.log('Paiement méthode:', btn.dataset.method);
                this.handlePayment(btn.dataset.method);
            }

            // Stripe
            if (e.target.closest('#payStripe')) {
                console.log('Paiement Stripe');
                this.handlePayment('stripe');
            }

            // Options de réponse
            if (e.target.closest('.option-btn')) {
                const btn = e.target.closest('.option-btn');
                const index = parseInt(btn.dataset.index);
                if (!isNaN(index)) {
                    console.log('Réponse sélectionnée:', index);
                    this.selectAnswer(index);
                }
            }

            // Bouton continuer feedback
            if (e.target.closest('#feedbackModal .btn-primary')) {
                console.log('Question suivante');
                this.nextQuestion();
            }

            // Démarrer examen
            if (e.target.closest('#examIntro .btn-primary')) {
                console.log('Démarrage examen');
                this.startExam();
            }

            // Nouvel examen
            if (e.target.closest('.result-actions .btn-secondary')) {
                console.log('Nouvel examen');
                this.startExam();
            }

            // Revoir erreurs
            if (e.target.closest('.result-actions .btn-primary')) {
                console.log('Revoir erreurs');
                this.reviewErrors();
            }
        });

        // Formulaires - CORRIGÉ avec preventDefault explicite
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Submit login');
                this.handleLogin(e);
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Submit register');
                this.handleRegister(e);
            });
        }

        // Settings
        const darkMode = document.getElementById('darkMode');
        if (darkMode) {
            darkMode.addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.target.checked);
                localStorage.setItem('darkMode', e.target.checked);
            });
        }

        console.log('✅ Événements configurés');
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    navigateTo(sectionId) {
        console.log('Navigation vers section:', sectionId);

        // Vérifier accès premium pour examen
        if (sectionId === 'exam' && !this.state.isPremium && this.state.currentUser) {
            this.showToast('L\'examen blanc nécessite un compte Premium', 'info');
            this.showPremium();
            return;
        }

        // Masquer toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section cible
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo(0, 0);
        } else {
            console.error('Section non trouvée:', sectionId);
        }

        // Mettre à jour menu actif
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });

        // Fermer menu mobile
        document.querySelector('.nav-menu')?.classList.remove('active');

        // Rendu spécifique
        if (sectionId === 'stats') this.renderStats();
        if (sectionId === 'account') this.renderAccount();
    },

    // ==========================================
    // MODALS
    // ==========================================
    openModal(modalId) {
        console.log('Ouverture modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    switchAuthTab(tab) {
        console.log('Switch auth tab:', tab);
        
        // Tabs buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Forms
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.classList.toggle('hidden', tab !== 'login');
        if (registerForm) registerForm.classList.toggle('hidden', tab !== 'register');
    },

    // ==========================================
    // AUTHENTIFICATION
    // ==========================================
    async handleLogin(e) {
        console.log('Tentative de connexion...');
        
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;

        if (!email || !password) {
            this.showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Réponse login:', data);

            if (data.success) {
                this.state.currentUser = data.user;
                this.state.isPremium = data.user.isPremium;
                if (data.user.stats) this.state.stats = data.user.stats;
                
                this.saveToStorage();
                this.updateUI();
                this.closeAllModals();
                this.showToast('Connexion réussie ! 🎉', 'success');
                this.createConfetti();
                this.navigateTo('home');
            } else {
                this.showToast(data.error || 'Email ou mot de passe incorrect', 'error');
            }
        } catch (error) {
            console.error('Erreur login:', error);
            this.showToast('Erreur de connexion au serveur', 'error');
        }
    },

    async handleRegister(e) {
        console.log('Tentative d\'inscription...');
        
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        const confirm = document.getElementById('confirmPassword')?.value;

        if (!email || !password || !confirm) {
            this.showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (password !== confirm) {
            this.showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        if (password.length < 8) {
            this.showToast('Le mot de passe doit faire au moins 8 caractères', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Réponse register:', data);

            if (data.success) {
                this.showToast('Inscription réussie ! Connectez-vous.', 'success');
                this.switchAuthTab('login');
                // Préremplir l'email
                const loginEmail = document.getElementById('loginEmail');
                if (loginEmail) loginEmail.value = email;
            } else {
                this.showToast(data.error || 'Erreur lors de l\'inscription', 'error');
            }
        } catch (error) {
            console.error('Erreur register:', error);
            this.showToast('Erreur de connexion au serveur', 'error');
        }
    },

    logout() {
        console.log('Déconnexion...');
        this.state.currentUser = null;
        this.state.isPremium = false;
        localStorage.removeItem('permisProUser');
        this.updateUI();
        this.navigateTo('home');
        this.showToast('Vous êtes déconnecté', 'info');
    },

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    },

    // ==========================================
    // QUIZ / ENTRAÎNEMENT
    // ==========================================
    startTraining() {
        console.log('Démarrage entraînement...');
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.initQuiz('training');
    },

    startCategory(category) {
        console.log('Démarrage catégorie:', category);
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.initQuiz('category', category);
    },

    initQuiz(mode, category = null) {
        console.log('Initialisation quiz:', mode, category);
        
        let questions = [];
        
        if (mode === 'training') {
            questions = shuffleArray(questionsDB).slice(0, 20);
        } else if (mode === 'category') {
            questions = questionsDB.filter(q => q.category === category);
            questions = shuffleArray(questions).slice(0, Math.min(20, questions.length));
        } else if (mode === 'exam') {
            questions = shuffleArray(questionsDB).slice(0, 40);
        }

        if (questions.length === 0) {
            this.showToast('Pas assez de questions disponibles', 'error');
            return;
        }

        this.state.currentQuiz = {
            mode,
            questions,
            startTime: Date.now()
        };
        this.state.currentQuestionIndex = 0;
        this.state.score = 0;
        this.state.answers = [];

        console.log('Quiz initialisé avec', questions.length, 'questions');
        this.renderQuestion();
    },

    renderQuestion() {
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestionIndex];
        const isExam = quiz.mode === 'exam';

        console.log('Rendu question', this.state.currentQuestionIndex + 1, '/', quiz.questions.length);

        // Éléments DOM
        const progressFill = document.getElementById(isExam ? 'examProgressFill' : 'progressFill');
        const counter = document.getElementById(isExam ? 'examQuestionCounter' : 'questionCounter');
        const scoreDisplay = document.getElementById(isExam ? 'examScoreDisplay' : 'scoreDisplay');
        const qNumber = document.getElementById(isExam ? 'examQuestionNumber' : 'questionNumber');
        const qText = document.getElementById(isExam ? 'examQuestionText' : 'questionText');
        const optionsGrid = document.getElementById(isExam ? 'examOptionsGrid' : 'optionsGrid');

        // Mise à jour progression
        const progress = ((this.state.currentQuestionIndex + 1) / quiz.questions.length) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (counter) counter.textContent = `Question ${this.state.currentQuestionIndex + 1}/${quiz.questions.length}`;
        
        if (isExam) {
            if (scoreDisplay) scoreDisplay.textContent = `${this.state.score} fautes`;
        } else {
            if (scoreDisplay) scoreDisplay.textContent = `Score: ${this.state.score}`;
        }

        if (qNumber) qNumber.textContent = `#${this.state.currentQuestionIndex + 1}`;
        if (qText) qText.textContent = question.question;

        // Rendu des options
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            question.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.dataset.index = idx;
                btn.innerHTML = `
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt}</span>
                `;
                optionsGrid.appendChild(btn);
            });
        }

        // Animation
        const card = document.getElementById(isExam ? 'examQuestionCard' : 'questionCard');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => card.style.animation = 'slideIn 0.5s ease', 10);
        }
    },

    selectAnswer(answerIndex) {
        console.log('Réponse sélectionnée:', answerIndex);
        
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestionIndex];
        const isCorrect = answerIndex === question.correctAnswer;

        // Mettre à jour le score
        if (isCorrect) {
            this.state.score++;
            this.state.stats.streak++;
            if (this.state.stats.streak > this.state.stats.bestStreak) {
                this.state.stats.bestStreak = this.state.stats.streak;
            }
        } else {
            this.state.stats.streak = 0;
        }

        // Sauvegarder la réponse
        this.state.answers.push({
            questionId: question.id,
            selected: answerIndex,
            correct: isCorrect,
            time: Date.now()
        });

        // Stats par catégorie
        if (!this.state.stats.categories[question.category]) {
            this.state.stats.categories[question.category] = { total: 0, correct: 0 };
        }
        this.state.stats.categories[question.category].total++;
        if (isCorrect) this.state.stats.categories[question.category].correct++;

        // Feedback visuel immédiat sur les boutons
        const isExam = quiz.mode === 'exam';
        const optionsGrid = document.getElementById(isExam ? 'examOptionsGrid' : 'optionsGrid');
        const buttons = optionsGrid?.querySelectorAll('.option-btn');
        
        if (buttons) {
            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === question.correctAnswer) {
                    btn.classList.add('correct');
                    btn.innerHTML += ' <i class="fas fa-check" style="margin-left: auto; color: var(--accent)"></i>';
                } else if (idx === answerIndex && !isCorrect) {
                    btn.classList.add('wrong');
                    btn.innerHTML += ' <i class="fas fa-times" style="margin-left: auto; color: var(--danger)"></i>';
                }
            });
        }

        // Son
        if (document.getElementById('soundEnabled')?.checked) {
            this.playSound(isCorrect ? 'success' : 'error');
        }

        if (isExam) {
            // En examen, délai court puis suivant
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            // En entraînement, montrer le feedback modal
            setTimeout(() => this.showFeedback(isCorrect, question), 500);
        }
    },

    showFeedback(isCorrect, question) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const title = document.getElementById('feedbackTitle');
        const text = document.getElementById('feedbackText');
        const explanation = document.getElementById('explanationText');

        if (!modal) return;

        modal.classList.remove('hidden');
        
        if (icon) {
            icon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
            icon.innerHTML = `<i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>`;
        }
        
        if (title) {
            title.textContent = isCorrect ? 'Bonne réponse ! 🎉' : 'Mauvaise réponse';
            title.style.color = isCorrect ? 'var(--accent)' : 'var(--danger)';
        }
        
        if (text) {
            text.textContent = isCorrect 
                ? 'Excellent travail ! Continuez comme ça.' 
                : 'Ne vous découragez pas, apprenez de vos erreurs.';
        }
        
        if (explanation) explanation.textContent = question.explanation;
    },

    nextQuestion() {
        document.getElementById('feedbackModal')?.classList.add('hidden');
        this.state.currentQuestionIndex++;

        if (this.state.currentQuestionIndex >= this.state.currentQuiz.questions.length) {
            this.finishQuiz();
        } else {
            this.renderQuestion();
        }
    },

    finishQuiz() {
        console.log('Quiz terminé !');
        
        const quiz = this.state.currentQuiz;
        
        // Mettre à jour stats
        this.state.stats.totalQuestions += quiz.questions.length;
        this.state.stats.correctAnswers += this.state.score;
        
        this.state.stats.history.push({
            date: new Date().toISOString(),
            mode: quiz.mode,
            score: this.state.score,
            total: quiz.questions.length,
            percentage: Math.round((this.state.score / quiz.questions.length) * 100)
        });

        this.saveToStorage();
        this.syncStats();

        if (quiz.mode === 'exam') {
            this.showExamResults();
        } else {
            this.showToast(`Quiz terminé ! Score: ${this.state.score}/${quiz.questions.length}`, 'success');
            this.navigateTo('stats');
        }
    },

    // ==========================================
    // EXAMEN BLANC
    // ==========================================
    startExam() {
        console.log('Démarrage examen blanc...');
        
        if (!this.state.isPremium) {
            this.showPremium();
            return;
        }

        // Réinitialiser l'affichage
        const intro = document.getElementById('examIntro');
        const container = document.getElementById('examContainer');
        const results = document.getElementById('examResults');
        
        if (intro) intro.classList.add('hidden');
        if (container) container.classList.remove('hidden');
        if (results) results.classList.add('hidden');

        // Timer
        this.state.timeLeft = 1800; // 30 minutes
        this.startTimer();
        
        // Démarrer le quiz
        this.initQuiz('exam');
    },

    startTimer() {
        this.updateTimerDisplay();
        
        if (this.state.timer) clearInterval(this.state.timer);
        
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            const timerEl = document.getElementById('examTimer');
            if (this.state.timeLeft <= 300) { // 5 min
                timerEl?.classList.add('warning');
            }
            
            if (this.state.timeLeft <= 0) {
                clearInterval(this.state.timer);
                this.finishQuiz();
            }
        }, 1000);
    },

    updateTimerDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timerEl = document.getElementById('examTimer');
        if (timerEl) {
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    showExamResults() {
        clearInterval(this.state.timer);
        
        const container = document.getElementById('examContainer');
        const results = document.getElementById('examResults');
        
        if (container) container.classList.add('hidden');
        if (results) results.classList.remove('hidden');

        // Calculer résultats (en examen, score = fautes)
        const fautes = this.state.currentQuiz.questions.length - this.state.score;
        const reussi = fautes <= 5; // Max 5 fautes

        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const scoreEl = document.getElementById('resultScore');
        const message = document.getElementById('resultMessage');
        const details = document.getElementById('resultDetails');

        if (reussi) {
            if (icon) {
                icon.className = 'result-icon success';
                icon.innerHTML = '<i class="fas fa-trophy"></i>';
            }
            if (title) {
                title.textContent = 'Félicitations ! 🎉';
                title.style.color = 'var(--accent)';
            }
            if (message) message.textContent = 'Vous avez réussi l\'examen blanc !';
            this.unlockBadge('exam_pass');
            this.createConfetti();
        } else {
            if (icon) {
                icon.className = 'result-icon fail';
                icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            }
            if (title) {
                title.textContent = 'Examen non réussi';
                title.style.color = 'var(--danger)';
            }
            if (message) message.textContent = 'Continuez à vous entraîner pour améliorer votre score.';
        }

        if (scoreEl) {
            scoreEl.textContent = `${this.state.score}/40`;
            scoreEl.style.color = reussi ? 'var(--accent)' : 'var(--danger)';
        }

        if (details) {
            const tempsUtilise = 1800 - this.state.timeLeft;
            const minutes = Math.floor(tempsUtilise / 60);
            const secondes = tempsUtilise % 60;
            
            details.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    <strong>Seuil de réussite :</strong> 35/40 (max 5 fautes)
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Votre résultat :</strong> ${this.state.score}/40 bonnes réponses (${fautes} fautes)
                </div>
                <div>
                    <strong>Temps utilisé :</strong> ${minutes}min ${secondes}s
                </div>
            `;
        }
    },

    reviewErrors() {
        this.showToast('Fonctionnalité de révision à venir !', 'info');
    },

    // ==========================================
    // PREMIUM & PAIEMENT
    // ==========================================
    showPremium() {
        console.log('Affichage modal premium');
        if (this.state.isPremium) {
            this.showToast('Vous êtes déjà membre Premium !', 'info');
            return;
        }
        this.openModal('premiumModal');
    },

    async handlePayment(method) {
        console.log('Traitement paiement:', method);
        
        if (!this.state.currentUser) {
            this.showToast('Connectez-vous d\'abord', 'error');
            this.closeAllModals();
            this.openModal('authModal');
            return;
        }

        // Simulation pour test local
        if (method !== 'stripe') {
            try {
                const response = await fetch('http://localhost:3000/simulate-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.state.currentUser.email,
                        method: method
                    })
                });

                const data = await response.json();
                console.log('Réponse paiement:', data);

                if (data.success) {
                    this.state.isPremium = true;
                    this.state.currentUser.isPremium = true;
                    this.saveToStorage();
                    this.updateUI();
                    this.closeAllModals();
                    this.showToast('🎉 Paiement réussi ! Bienvenue en Premium !', 'success');
                    this.createConfetti();
                }
            } catch (error) {
                console.error('Erreur paiement:', error);
                this.showToast('Erreur de paiement', 'error');
            }
        } else {
            // Stripe - redirection
            try {
                const response = await fetch('http://localhost:3000/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.state.currentUser.email })
                });
                const data = await response.json();
                if (data.url) window.location.href = data.url;
            } catch (error) {
                this.showToast('Erreur Stripe', 'error');
            }
        }
    },

    checkPaymentReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        const email = urlParams.get('email');

        if (payment === 'success') {
            this.showToast('✅ Paiement confirmé !', 'success');
            // Mettre à jour le statut
            if (this.state.currentUser) {
                this.state.isPremium = true;
                this.state.currentUser.isPremium = true;
                this.saveToStorage();
                this.updateUI();
                this.createConfetti();
            }
            // Nettoyer URL
            window.history.replaceState({}, document.title, '/');
        }
    },

    // ==========================================
    // STATISTIQUES
    // ==========================================
    renderStats() {
        console.log('Rendu statistiques...');
        
        const total = this.state.stats.totalQuestions;
        const correct = this.state.stats.correctAnswers;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        const globalScore = document.getElementById('globalScore');
        const currentStreak = document.getElementById('currentStreak');
        const bestStreak = document.getElementById('bestStreak');
        const avgTime = document.getElementById('avgTime');

        if (globalScore) globalScore.textContent = `${percentage}%`;
        if (currentStreak) currentStreak.textContent = this.state.stats.streak;
        if (bestStreak) bestStreak.textContent = this.state.stats.bestStreak;
        
        // Temps moyen simulé
        const avg = total > 0 ? Math.max(15, 45 - (percentage * 0.25)) : 0;
        if (avgTime) avgTime.textContent = `${Math.round(avg)}s`;

        // Badges
        this.checkBadges();

        // Historique
        const historyList = document.getElementById('historyList');
        if (historyList) {
            if (this.state.stats.history.length === 0) {
                historyList.innerHTML = '<p class="empty-state">Aucune session enregistrée. Commencez à vous entraîner !</p>';
            } else {
                historyList.innerHTML = this.state.stats.history
                    .slice(-10)
                    .reverse()
                    .map(h => {
                        const date = new Date(h.date);
                        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        const isGood = h.percentage >= 80;
                        return `
                            <div class="history-item" style="
                                display: flex;
                                justify-content: space-between;
                                padding: 1rem;
                                background: white;
                                margin-bottom: 0.5rem;
                                border-radius: 8px;
                                border-left: 4px solid ${isGood ? 'var(--accent)' : 'var(--warning)'};
                            ">
                                <div>
                                    <div style="font-weight: 600;">${h.mode === 'exam' ? 'Examen blanc' : 'Entraînement'}</div>
                                    <div style="font-size: 0.85rem; color: #6b7280;">${dateStr}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: 700; color: ${isGood ? 'var(--accent)' : 'var(--dark)'};">
                                        ${h.score}/${h.total}
                                    </div>
                                    <div style="font-size: 0.85rem; color: #6b7280;">
                                        ${h.percentage}%
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
            }
        }

        this.drawChart();
    },

    drawChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        // Ajuster la taille du canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        const ctx = canvas.getContext('2d');
        const categories = this.state.stats.categories;
        const catNames = Object.keys(categories);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (catNames.length === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune donnée disponible', canvas.width/2, canvas.height/2);
            ctx.font = '14px Poppins';
            ctx.fillText('Faites des quiz pour voir vos statistiques', canvas.width/2, canvas.height/2 + 30);
            return;
        }

        // Dessiner graphique en barres
        const barWidth = Math.min(80, (canvas.width - 80) / catNames.length - 20);
        const maxBarHeight = canvas.height - 100;
        const startX = 40;
        const startY = canvas.height - 50;

        catNames.forEach((cat, i) => {
            const data = categories[cat];
            const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            const barHeight = (pct / 100) * maxBarHeight;
            const x = startX + i * (barWidth + 20);

            // Gradient
            const gradient = ctx.createLinearGradient(0, startY - barHeight, 0, startY);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');

            // Barre
            ctx.fillStyle = gradient;
            ctx.fillRect(x, startY - barHeight, barWidth, barHeight);

            // Pourcentage
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 14px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(pct)}%`, x + barWidth/2, startY - barHeight - 10);

            // Label
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Poppins';
            const label = cat.charAt(0).toUpperCase() + cat.slice(1, 8);
            ctx.fillText(label, x + barWidth/2, startY + 20);
        });
    },

    checkBadges() {
        const badges = {
            starter: this.state.stats.totalQuestions >= 1,
            streak_10: this.state.stats.bestStreak >= 10,
            streak_50: this.state.stats.bestStreak >= 50,
            master: this.state.stats.totalQuestions >= 100 && 
                   (this.state.stats.correctAnswers / this.state.stats.totalQuestions) >= 0.9,
            exam_pass: this.state.stats.history.some(h => h.mode === 'exam' && h.percentage >= 87.5), // 35/40
            night_owl: false
        };

        document.querySelectorAll('.badge').forEach(badge => {
            const type = badge.dataset.badge;
            if (badges[type]) {
                badge.classList.remove('locked');
            }
        });
    },

    unlockBadge(badgeId) {
        const badge = document.querySelector(`[data-badge="${badgeId}"]`);
        if (badge && badge.classList.contains('locked')) {
            badge.classList.remove('locked');
            badge.style.animation = 'bounce 0.5s ease';
            this.showToast(`🏅 Nouveau badge débloqué !`, 'success');
        }
    },

    // ==========================================
    // COMPTE
    // ==========================================
    renderAccount() {
        if (!this.state.currentUser) {
            this.navigateTo('home');
            this.openModal('authModal');
            return;
        }

        const email = this.state.currentUser.email;
        const isPremium = this.state.isPremium;

        // Mettre à jour l'affichage
        const profileEmail = document.getElementById('profileEmail');
        const accountStatus = document.getElementById('accountStatus');
        const upgradeBtn = document.getElementById('upgradeBtn');
        const totalQuestions = document.getElementById('totalQuestions');
        const correctRate = document.getElementById('correctRate');
        const examTaken = document.getElementById('examTaken');

        if (profileEmail) profileEmail.textContent = email;
        
        if (accountStatus) {
            accountStatus.textContent = isPremium ? 'Premium' : 'Gratuit';
            accountStatus.className = 'status-badge ' + (isPremium ? 'premium' : '');
        }

        if (upgradeBtn) {
            upgradeBtn.style.display = isPremium ? 'none' : 'inline-flex';
        }

        if (totalQuestions) totalQuestions.textContent = this.state.stats.totalQuestions;

        const rate = this.state.stats.totalQuestions > 0 
            ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalQuestions) * 100) 
            : 0;
        if (correctRate) correctRate.textContent = `${rate}%`;

        const examCount = this.state.stats.history.filter(h => h.mode === 'exam').length;
        if (examTaken) examTaken.textContent = examCount;
    },

    // ==========================================
    // UTILITAIRES
    // ==========================================
    updateUI() {
        console.log('Mise à jour UI...');
        
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const premiumBadge = document.getElementById('premiumBadge');
        const examLink = document.getElementById('examLink');

        if (this.state.currentUser) {
            loginBtn?.classList.add('hidden');
            logoutBtn?.classList.remove('hidden');
            premiumBadge?.classList.toggle('hidden', !this.state.isPremium);
            
            if (examLink) {
                if (!this.state.isPremium) {
                    examLink.innerHTML = '<i class="fas fa-lock"></i> Examen blanc';
                } else {
                    examLink.innerHTML = '<i class="fas fa-file-alt"></i> Examen blanc';
                }
            }
        } else {
            loginBtn?.classList.remove('hidden');
            logoutBtn?.classList.add('hidden');
            premiumBadge?.classList.add('hidden');
            
            if (examLink) {
                examLink.innerHTML = '<i class="fas fa-file-alt"></i> Examen blanc';
            }
        }
    },

    saveToStorage() {
        localStorage.setItem('permisProUser', JSON.stringify({
            currentUser: this.state.currentUser,
            isPremium: this.state.isPremium,
            stats: this.state.stats
        }));
    },

    loadFromStorage() {
        const saved = localStorage.getItem('permisProUser');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.state.currentUser = data.currentUser;
                this.state.isPremium = data.isPremium || false;
                this.state.stats = data.stats || this.state.stats;
                console.log('✅ Données chargées depuis le stockage');
            } catch (e) {
                console.error('Erreur chargement stockage:', e);
            }
        }

        // Charger mode sombre
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const darkToggle = document.getElementById('darkMode');
            if (darkToggle) darkToggle.checked = true;
        }
    },

    async syncStats() {
        if (!this.state.currentUser) return;
        
        try {
            await fetch('http://localhost:3000/update-stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.currentUser.email,
                    stats: this.state.stats
                })
            });
        } catch (error) {
            console.log('Sync échouée (mode offline)');
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            min-width: 300px;
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            margin-bottom: 0.75rem;
        `;
        
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        toast.innerHTML = `
            <i class="fas fa-${icon}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'}; font-size: 1.25rem;"></i>
            <span style="font-weight: 500;">${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    playSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            if (type === 'success') {
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // Do
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // Mi
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else {
                osc.frequency.value = 200;
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
            }
        } catch (e) {
            console.log('Audio non supporté');
        }
    },

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${['#ff0', '#f0f', '#0ff', '#0f0', '#00f', '#f00'][Math.floor(Math.random() * 6)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    z-index: 9999;
                    animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }
};

// ==========================================
// DÉMARRAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM chargé, démarrage app...');
    App.init();
});

// Exposer globalement pour debug
window.App = App;
