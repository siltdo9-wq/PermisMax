// Application principale
const app = {
    // État global
    state: {
        currentUser: null,
        isPremium: false,
        currentQuiz: null,
        currentQuestion: 0,
        score: 0,
        answers: [],
        timer: null,
        timeLeft: 1800, // 30 minutes pour l'examen
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            streak: 0,
            bestStreak: 0,
            categories: {},
            history: []
        }
    },

    // Initialisation
    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.updateUI();
        this.checkPaymentReturn();
    },

    // Configuration des événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.navigateTo(target);
            });
        });

        // Mobile menu
        document.querySelector('.hamburger').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });

        // Auth modal
        document.getElementById('loginBtn').addEventListener('click', () => this.openModal('authModal'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Tabs auth
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchAuthTab(btn.dataset.tab));
        });

        document.querySelectorAll('.switch-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.textContent.includes('inscrire') ? 'register' : 'login';
                this.switchAuthTab(tab);
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Payment methods
        document.querySelectorAll('.pay-method').forEach(btn => {
            btn.addEventListener('click', () => this.handlePayment(btn.dataset.method));
        });

        document.getElementById('payStripe').addEventListener('click', () => this.handlePayment('stripe'));

        // Settings
        document.getElementById('darkMode').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
        });
    },

    // Navigation
    navigateTo(section) {
        // Vérifier l'accès premium pour l'examen
        if (section === 'exam' && !this.state.isPremium && this.state.currentUser) {
            this.showPremium();
            return;
        }

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[href="#${section}"]`)?.classList.add('active');

        if (section === 'stats') this.renderStats();
        if (section === 'account') this.renderAccount();

        // Fermer le menu mobile
        document.querySelector('.nav-menu').classList.remove('active');
    },

    // Modal management
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    },

    // Authentification
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.state.currentUser = data.user;
                this.state.isPremium = data.user.isPremium;
                this.state.stats = data.user.stats || this.state.stats;
                this.saveToLocalStorage();
                this.updateUI();
                this.closeModal('authModal');
                this.showToast('Connexion réussie !', 'success');
                this.createConfetti();
            } else {
                this.showToast(data.error || 'Erreur de connexion', 'error');
            }
        } catch (error) {
            this.showToast('Erreur serveur', 'error');
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (password !== confirm) {
            this.showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Inscription réussie ! Connectez-vous.', 'success');
                this.switchAuthTab('login');
            } else {
                this.showToast(data.error || 'Erreur d\'inscription', 'error');
            }
        } catch (error) {
            this.showToast('Erreur serveur', 'error');
        }
    },

    logout() {
        this.state.currentUser = null;
        this.state.isPremium = false;
        localStorage.removeItem('permisProUser');
        this.updateUI();
        this.navigateTo('home');
        this.showToast('Déconnexion réussie', 'info');
    },

    // Quiz / Entraînement
    startTraining() {
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.startQuiz('training');
    },

    startCategory(category) {
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.startQuiz('category', category);
    },

    startQuiz(mode, category = null) {
        let questions = [];
        
        if (mode === 'training') {
            questions = shuffleArray(questionsDB).slice(0, 20);
        } else if (mode === 'category') {
            questions = questionsDB.filter(q => q.category === category);
            questions = shuffleArray(questions).slice(0, Math.min(20, questions.length));
        } else if (mode === 'exam') {
            questions = shuffleArray(questionsDB).slice(0, 40);
        }

        this.state.currentQuiz = {
            mode,
            questions,
            startTime: Date.now()
        };
        this.state.currentQuestion = 0;
        this.state.score = 0;
        this.state.answers = [];
        
        this.showQuestion();
    },

    showQuestion() {
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestion];
        const isExam = quiz.mode === 'exam';

        // Mise à jour de la progression
        const progress = ((this.state.currentQuestion + 1) / quiz.questions.length) * 100;
        document.getElementById(isExam ? 'examProgressFill' : 'progressFill').style.width = `${progress}%`;
        document.getElementById(isExam ? 'examQuestionCounter' : 'questionCounter').textContent = 
            `Question ${this.state.currentQuestion + 1}/${quiz.questions.length}`;

        if (isExam) {
            document.getElementById('examScoreDisplay').textContent = `${this.state.score} fautes`;
            document.getElementById('examQuestionNumber').textContent = `#${this.state.currentQuestion + 1}`;
            document.getElementById('examQuestionText').textContent = question.question;
            
            const optionsGrid = document.getElementById('examOptionsGrid');
            optionsGrid.innerHTML = '';
            question.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt}</span>
                `;
                btn.onclick = () => this.selectAnswer(idx, isExam);
                optionsGrid.appendChild(btn);
            });
        } else {
            document.getElementById('scoreDisplay').textContent = `Score: ${this.state.score}`;
            document.getElementById('questionNumber').textContent = `#${this.state.currentQuestion + 1}`;
            document.getElementById('questionText').textContent = question.question;
            
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            question.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt}</span>
                `;
                btn.onclick = () => this.selectAnswer(idx, isExam);
                optionsGrid.appendChild(btn);
            });
        }
    },

    selectAnswer(answerIndex, isExam) {
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestion];
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
            if (isExam) this.state.score++; // Compte les fautes en examen
        }

        // Sauvegarder la réponse
        this.state.answers.push({
            question: question.id,
            correct: isCorrect,
            time: Date.now()
        });

        // Mettre à jour les stats par catégorie
        if (!this.state.stats.categories[question.category]) {
            this.state.stats.categories[question.category] = { total: 0, correct: 0 };
        }
        this.state.stats.categories[question.category].total++;
        if (isCorrect) this.state.stats.categories[question.category].correct++;

        if (isExam) {
            // En examen, passer directement à la question suivante
            this.nextQuestion();
        } else {
            // En entraînement, montrer le feedback
            this.showFeedback(isCorrect, question);
        }
    },

    showFeedback(isCorrect, question) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const title = document.getElementById('feedbackTitle');
        const text = document.getElementById('feedbackText');
        const explanation = document.getElementById('explanationText');

        modal.classList.remove('hidden');
        icon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
        icon.innerHTML = `<i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>`;
        title.textContent = isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse';
        title.style.color = isCorrect ? 'var(--accent)' : 'var(--danger)';
        text.textContent = isCorrect ? 'Continuez comme ça !' : 'Ne vous découragez pas, apprenez de vos erreurs.';
        explanation.textContent = question.explanation;

        // Jouer un son si activé
        if (document.getElementById('soundEnabled').checked) {
            this.playSound(isCorrect ? 'success' : 'error');
        }
    },

    nextQuestion() {
        document.getElementById('feedbackModal').classList.add('hidden');
        this.state.currentQuestion++;

        if (this.state.currentQuestion >= this.state.currentQuiz.questions.length) {
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    },

    finishQuiz() {
        const quiz = this.state.currentQuiz;
        const isExam = quiz.mode === 'exam';
        
        // Mettre à jour les stats globales
        this.state.stats.totalQuestions += quiz.questions.length;
        this.state.stats.correctAnswers += this.state.score;
        
        // Sauvegarder l'historique
        this.state.stats.history.push({
            date: new Date().toISOString(),
            mode: quiz.mode,
            score: this.state.score,
            total: quiz.questions.length,
            percentage: Math.round((this.state.score / quiz.questions.length) * 100)
        });

        this.saveToLocalStorage();
        this.syncStatsWithServer();

        if (isExam) {
            this.showExamResults();
        } else {
            this.showToast(`Quiz terminé ! Score: ${this.state.score}/${quiz.questions.length}`, 'success');
            this.navigateTo('stats');
        }
    },

    // Examen blanc
    startExam() {
        if (!this.state.isPremium) {
            this.showPremium();
            return;
        }
        
        document.getElementById('examIntro').classList.add('hidden');
        document.getElementById('examContainer').classList.remove('hidden');
        document.getElementById('examResults').classList.add('hidden');
        
        this.state.timeLeft = 1800; // 30 minutes
        this.startTimer();
        this.startQuiz('exam');
    },

    startTimer() {
        this.updateTimerDisplay();
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.state.timeLeft <= 300) { // 5 minutes restantes
                document.getElementById('examTimer').classList.add('warning');
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
        document.getElementById('examTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    showExamResults() {
        clearInterval(this.state.timer);
        document.getElementById('examContainer').classList.add('hidden');
        document.getElementById('examResults').classList.remove('hidden');
        
        const fautes = this.state.score; // En examen, score = fautes
        const reussite = fautes <= 5; // Max 5 fautes pour réussir
        
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const score = document.getElementById('resultScore');
        const message = document.getElementById('resultMessage');
        const details = document.getElementById('resultDetails');
        
        if (reussite) {
            icon.className = 'result-icon success';
            icon.innerHTML = '<i class="fas fa-trophy"></i>';
            title.textContent = 'Félicitations !';
            title.style.color = 'var(--accent)';
            message.textContent = 'Vous avez réussi l\'examen blanc !';
            this.unlockBadge('exam_pass');
            this.createConfetti();
        } else {
            icon.className = 'result-icon fail';
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            title.textContent = 'Examen non réussi';
            title.style.color = 'var(--danger)';
            message.textContent = 'Continuez à vous entraîner pour améliorer votre score.';
        }
        
        score.textContent = `${fautes}/40`;
        score.style.color = reussite ? 'var(--accent)' : 'var(--danger)';
        
        details.innerHTML = `
            <p><strong>Seuil de réussite :</strong> 35/40 (max 5 fautes)</p>
            <p><strong>Votre résultat :</strong> ${40 - fautes}/40 bonnes réponses</p>
            <p><strong>Temps utilisé :</strong> ${Math.floor((1800 - this.state.timeLeft) / 60)} min</p>
        `;
    },

    // Premium et paiement
    showPremium() {
        if (this.state.isPremium) {
            this.showToast('Vous êtes déjà membre Premium !', 'info');
            return;
        }
        this.openModal('premiumModal');
    },

    async handlePayment(method) {
        if (!this.state.currentUser) {
            this.showToast('Connectez-vous d\'abord', 'error');
            this.closeModal('premiumModal');
            this.openModal('authModal');
            return;
        }

        try {
            if (method === 'stripe') {
                // Redirection vers Stripe Checkout
                const response = await fetch('http://localhost:3000/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.state.currentUser.email })
                });
                const data = await response.json();
                window.location.href = data.url;
            } else {
                // Simulation pour les autres méthodes (test local)
                const response = await fetch('http://localhost:3000/simulate-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email: this.state.currentUser.email,
                        method: method 
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    this.state.isPremium = true;
                    this.state.currentUser.isPremium = true;
                    this.saveToLocalStorage();
                    this.updateUI();
                    this.closeModal('premiumModal');
                    this.showToast('Paiement réussi ! Bienvenue en Premium !', 'success');
                    this.createConfetti();
                }
            }
        } catch (error) {
            this.showToast('Erreur de paiement', 'error');
        }
    },

    checkPaymentReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        const email = urlParams.get('email');
        
        if (payment === 'success' && email) {
            // Vérifier le statut premium
            fetch('http://localhost:3000/verify-premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: decodeURIComponent(email) })
            }).then(() => {
                if (this.state.currentUser && this.state.currentUser.email === email) {
                    this.state.isPremium = true;
                    this.state.currentUser.isPremium = true;
                    this.saveToLocalStorage();
                    this.updateUI();
                    this.showToast('Paiement confirmé ! Vous êtes maintenant Premium.', 'success');
                    this.createConfetti();
                }
                // Nettoyer l'URL
                window.history.replaceState({}, document.title, '/');
            });
        }
    },

    // Statistiques
    renderStats() {
        // Stats globales
        const total = this.state.stats.totalQuestions;
        const correct = this.state.stats.correctAnswers;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        document.getElementById('globalScore').textContent = `${percentage}%`;
        document.getElementById('currentStreak').textContent = this.state.stats.streak;
        document.getElementById('bestStreak').textContent = this.state.stats.bestStreak;
        
        // Calculer le temps moyen (simulation)
        const avgTime = total > 0 ? Math.round(45 - (percentage * 0.3)) : 0;
        document.getElementById('avgTime').textContent = `${avgTime}s`;

        // Vérifier les badges
        this.checkBadges();

        // Historique
        const historyList = document.getElementById('historyList');
        if (this.state.stats.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">Aucune session enregistrée</p>';
        } else {
            historyList.innerHTML = this.state.stats.history.slice(-10).reverse().map(h => `
                <div class="history-item">
                    <span class="history-date">${new Date(h.date).toLocaleDateString()}</span>
                    <span class="history-mode">${h.mode === 'exam' ? 'Examen' : 'Entraînement'}</span>
                    <span class="history-score ${h.percentage >= 80 ? 'good' : 'bad'}">${h.score}/${h.total}</span>
                </div>
            `).join('');
        }

        // Dessiner le graphique (simplifié)
        this.drawCategoryChart();
    },

    drawCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const categories = this.state.stats.categories;
        const catNames = Object.keys(categories);
        
        if (catNames.length === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '14px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune donnée disponible', canvas.width/2, canvas.height/2);
            return;
        }

        // Dessiner un graphique simple en barres
        const barWidth = 60;
        const gap = 20;
        const startX = 40;
        const startY = canvas.height - 40;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        catNames.forEach((cat, i) => {
            const data = categories[cat];
            const percentage = (data.correct / data.total) * 100;
            const barHeight = (percentage / 100) * (canvas.height - 80);
            
            // Barre
            const gradient = ctx.createLinearGradient(0, startY - barHeight, 0, startY);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            ctx.fillRect(startX + i * (barWidth + gap), startY - barHeight, barWidth, barHeight);
            
            // Label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(cat.substring(0, 8), startX + i * (barWidth + gap) + barWidth/2, startY + 20);
            
            // Pourcentage
            ctx.fillStyle = '#6366f1';
            ctx.font = 'bold 12px Poppins';
            ctx.fillText(`${Math.round(percentage)}%`, startX + i * (barWidth + gap) + barWidth/2, startY - barHeight - 10);
        });
    },

    checkBadges() {
        const badges = {
            starter: this.state.stats.totalQuestions >= 1,
            streak_10: this.state.stats.bestStreak >= 10,
            streak_50: this.state.stats.bestStreak >= 50,
            master: this.state.stats.totalQuestions >= 100 && 
                    (this.state.stats.correctAnswers / this.state.stats.totalQuestions) >= 0.9,
            exam_pass: false, // Débloqué lors de la réussite d'un examen
            night_owl: false // Pourrait être vérifié avec l'heure des sessions
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
            this.showToast(`Nouveau badge débloqué !`, 'success');
        }
    },

    // Compte
    renderAccount() {
        if (this.state.currentUser) {
            document.getElementById('profileEmail').textContent = this.state.currentUser.email;
            document.getElementById('accountStatus').textContent = this.state.isPremium ? 'Premium' : 'Gratuit';
            document.getElementById('accountStatus').className = 'status-badge ' + (this.state.isPremium ? 'premium' : '');
            document.getElementById('totalQuestions').textContent = this.state.stats.totalQuestions;
            
            const rate = this.state.stats.totalQuestions > 0 
                ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalQuestions) * 100) 
                : 0;
            document.getElementById('correctRate').textContent = `${rate}%`;
            
            const examCount = this.state.stats.history.filter(h => h.mode === 'exam').length;
            document.getElementById('examTaken').textContent = examCount;
            
            document.getElementById('upgradeBtn').style.display = this.state.isPremium ? 'none' : 'block';
        }
    },

    resetProgress() {
        if (confirm('Voulez-vous vraiment réinitialiser tous vos progrès ?')) {
            this.state.stats = {
                totalQuestions: 0,
                correctAnswers: 0,
                streak: 0,
                bestStreak: 0,
                categories: {},
                history: []
            };
            this.saveToLocalStorage();
            this.syncStatsWithServer();
            this.showToast('Progrès réinitialisés', 'info');
            this.renderStats();
        }
    },

    // Utilitaires
    updateUI() {
        if (this.state.currentUser) {
            document.getElementById('loginBtn').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            document.getElementById('premiumBadge').classList.toggle('hidden', !this.state.isPremium);
            
            // Mettre à jour le lien examen
            const examLink = document.getElementById('examLink');
            if (!this.state.isPremium) {
                examLink.innerHTML = '<i class="fas fa-lock"></i> Examen blanc';
            } else {
                examLink.innerHTML = '<i class="fas fa-file-alt"></i> Examen blanc';
            }
        } else {
            document.getElementById('loginBtn').classList.remove('hidden');
            document.getElementById('logoutBtn').classList.add('hidden');
            document.getElementById('premiumBadge').classList.add('hidden');
        }
    },

    saveToLocalStorage() {
        localStorage.setItem('permisProUser', JSON.stringify({
            currentUser: this.state.currentUser,
            isPremium: this.state.isPremium,
            stats: this.state.stats
        }));
    },

    loadFromLocalStorage() {
        const saved = localStorage.getItem('permisProUser');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.currentUser = data.currentUser;
            this.state.isPremium = data.isPremium;
            this.state.stats = data.stats || this.state.stats;
        }
    },

    async syncStatsWithServer() {
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
            console.error('Erreur sync stats:', error);
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    playSound(type) {
        // Simulation de sons (peut être remplacé par des vrais fichiers audio)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'success') {
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } else {
            osc.frequency.value = 300;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        }
    },

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = ['#ff0', '#f0f', '#0ff', '#0f0', '#00f'][Math.floor(Math.random() * 5)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }
};

// Fonction utilitaire pour mélanger
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
