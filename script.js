// ==========================================
// PERMIS PRO - Application Complète
// ==========================================

console.log('🚀 Script.js chargé !');

// Base de données de secours
if (typeof questionsDB === 'undefined') {
    console.warn('questionsDB non chargé, utilisation de la base de secours');
    var questionsDB = [];
    for (let i = 1; i <= 50; i++) {
        questionsDB.push({
            id: i,
            category: ['priorite', 'panneaux', 'circulation'][i % 3],
            difficulty: 'easy',
            question: `Question de test #${i}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: `Explication pour la question ${i}`
        });
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ==========================================
// APPLICATION
// ==========================================
const App = {
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
        },
        selectedPlan: null,
        selectedPlanPrice: null
    },

    init() {
        console.log('🎮 Initialisation...');
        this.loadFromStorage();
        this.setupEvents();
        this.updateUI();
        console.log('✅ Prêt !');
    },

    setupEvents() {
        // Fermer modals en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    navigateTo(sectionId) {
        console.log('Navigation vers:', sectionId);
        
        if (sectionId === 'exam' && !this.state.isPremium && this.state.currentUser) {
            this.showToast('L\'examen blanc nécessite un compte Premium', 'info');
            this.openModal('premiumModal');
            return;
        }

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[href="#${sectionId}"]`)?.classList.add('active');
        
        document.querySelector('.nav-menu')?.classList.remove('active');
        window.scrollTo(0, 0);

        if (sectionId === 'stats') this.renderStats();
        if (sectionId === 'account') this.renderAccount();
    },

    // ==========================================
    // MODALS
    // ==========================================
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            if (modalId === 'premiumModal') {
                this.showPlanSelection();
            }
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    // ==========================================
    // AUTHENTIFICATION
    // ==========================================
    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(t => {
            t.classList.toggle('active', t.textContent.toLowerCase().includes(tab === 'login' ? 'connexion' : 'inscription'));
        });
        
        const loginContainer = document.getElementById('loginFormContainer');
        const registerContainer = document.getElementById('registerFormContainer');
        
        if (loginContainer) loginContainer.classList.toggle('hidden', tab !== 'login');
        if (registerContainer) registerContainer.classList.toggle('hidden', tab !== 'register');
    },

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

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

            if (data.success) {
                this.state.currentUser = data.user;
                this.state.isPremium = data.user.isPremium;
                if (data.user.stats) this.state.stats = data.user.stats;
                
                this.saveToStorage();
                this.updateUI();
                this.closeModal('authModal');
                form.reset();
                this.showToast('Connexion réussie ! 🎉', 'success');
                this.createConfetti();
            } else {
                this.showToast(data.error || 'Identifiants incorrects', 'error');
            }
        } catch (error) {
            console.log('Mode démo - connexion simulée');
            this.state.currentUser = { email: email, id: 'demo-' + Date.now() };
            this.saveToStorage();
            this.updateUI();
            this.closeModal('authModal');
            form.reset();
            this.showToast('Connexion réussie (mode démo)', 'success');
        }
    },

    async handleRegister(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!email || !password || !confirmPassword) {
            this.showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (password !== confirmPassword) {
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

            if (data.success) {
                this.showToast('Inscription réussie ! Connectez-vous.', 'success');
                this.switchAuthTab('login');
            } else {
                this.showToast(data.error || 'Erreur lors de l\'inscription', 'error');
            }
        } catch (error) {
            this.showToast('Inscription réussie (mode démo)', 'success');
            this.switchAuthTab('login');
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

    // ==========================================
    // QUIZ
    // ==========================================
    startTraining() {
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.initQuiz('training');
    },

    startCategory(category) {
        if (!this.state.currentUser) {
            this.openModal('authModal');
            return;
        }
        this.navigateTo('training');
        this.initQuiz('category', category);
    },

    initQuiz(mode, category = null) {
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

        this.state.currentQuiz = { mode, questions, startTime: Date.now() };
        this.state.currentQuestionIndex = 0;
        this.state.score = 0;
        this.state.answers = [];

        this.renderQuestion();
    },

    renderQuestion() {
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestionIndex];
        const isExam = quiz.mode === 'exam';

        const progress = ((this.state.currentQuestionIndex + 1) / quiz.questions.length) * 100;
        const progressFill = document.getElementById(isExam ? 'examProgressFill' : 'progressFill');
        const counter = document.getElementById(isExam ? 'examQuestionCounter' : 'questionCounter');
        const scoreDisplay = document.getElementById(isExam ? 'examScoreDisplay' : 'scoreDisplay');
        const qNumber = document.getElementById(isExam ? 'examQuestionNumber' : 'questionNumber');
        const qText = document.getElementById(isExam ? 'examQuestionText' : 'questionText');
        const optionsGrid = document.getElementById(isExam ? 'examOptionsGrid' : 'optionsGrid');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (counter) counter.textContent = `Question ${this.state.currentQuestionIndex + 1}/${quiz.questions.length}`;
        
        if (isExam) {
            if (scoreDisplay) scoreDisplay.textContent = `${this.state.score} fautes`;
        } else {
            if (scoreDisplay) scoreDisplay.textContent = `Score: ${this.state.score}`;
        }

        if (qNumber) qNumber.textContent = `#${this.state.currentQuestionIndex + 1}`;
        if (qText) qText.textContent = question.question;

        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            question.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt}</span>
                `;
                btn.onclick = () => this.selectAnswer(idx);
                optionsGrid.appendChild(btn);
            });
        }
    },

    selectAnswer(answerIndex) {
        const quiz = this.state.currentQuiz;
        const question = quiz.questions[this.state.currentQuestionIndex];
        const isCorrect = answerIndex === question.correctAnswer;

        if (isCorrect) {
            this.state.score++;
            this.state.stats.streak++;
            if (this.state.stats.streak > this.state.stats.bestStreak) {
                this.state.stats.bestStreak = this.state.stats.streak;
            }
        } else {
            this.state.stats.streak = 0;
        }

        this.state.answers.push({
            questionId: question.id,
            selected: answerIndex,
            correct: isCorrect,
            time: Date.now()
        });

        if (!this.state.stats.categories[question.category]) {
            this.state.stats.categories[question.category] = { total: 0, correct: 0 };
        }
        this.state.stats.categories[question.category].total++;
        if (isCorrect) this.state.stats.categories[question.category].correct++;

        // Feedback visuel
        const isExam = quiz.mode === 'exam';
        const optionsGrid = document.getElementById(isExam ? 'examOptionsGrid' : 'optionsGrid');
        const buttons = optionsGrid?.querySelectorAll('.option-btn');
        
        if (buttons) {
            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === question.correctAnswer) {
                    btn.style.borderColor = 'var(--accent)';
                    btn.style.background = 'rgba(16, 185, 129, 0.1)';
                } else if (idx === answerIndex && !isCorrect) {
                    btn.style.borderColor = 'var(--danger)';
                    btn.style.background = 'rgba(239, 68, 68, 0.1)';
                }
            });
        }

        if (isExam) {
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            setTimeout(() => this.showFeedback(isCorrect, question), 500);
        }
    },

    showFeedback(isCorrect, question) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const title = document.getElementById('feedbackTitle');
        const explanation = document.getElementById('explanationText');

        if (modal) modal.classList.remove('hidden');
        if (icon) {
            icon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
            icon.innerHTML = `<i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>`;
        }
        if (title) {
            title.textContent = isCorrect ? 'Bonne réponse ! 🎉' : 'Mauvaise réponse';
            title.style.color = isCorrect ? 'var(--accent)' : 'var(--danger)';
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
        const quiz = this.state.currentQuiz;
        
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
    // EXAMEN
    // ==========================================
    startExam() {
        if (!this.state.isPremium) {
            this.showPremium();
            return;
        }

        document.getElementById('examIntro')?.classList.add('hidden');
        document.getElementById('examContainer')?.classList.remove('hidden');
        document.getElementById('examResults')?.classList.add('hidden');

        this.state.timeLeft = 1800;
        this.startTimer();
        this.initQuiz('exam');
    },

    startTimer() {
        this.updateTimerDisplay();
        if (this.state.timer) clearInterval(this.state.timer);
        
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            const timerEl = document.getElementById('examTimer');
            if (this.state.timeLeft <= 300) timerEl?.classList.add('warning');
            
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
        
        document.getElementById('examContainer')?.classList.add('hidden');
        document.getElementById('examResults')?.classList.remove('hidden');

        const fautes = 40 - this.state.score;
        const reussi = fautes <= 5;

        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const scoreEl = document.getElementById('resultScore');
        const message = document.getElementById('resultMessage');

        if (reussi) {
            if (icon) { icon.className = 'result-icon success'; icon.innerHTML = '<i class="fas fa-trophy"></i>'; }
            if (title) { title.textContent = 'Félicitations ! 🎉'; title.style.color = 'var(--accent)'; }
            if (message) message.textContent = 'Vous avez réussi l\'examen blanc !';
            this.unlockBadge('exam_pass');
            this.createConfetti();
        } else {
            if (icon) { icon.className = 'result-icon fail'; icon.innerHTML = '<i class="fas fa-times-circle"></i>'; }
            if (title) { title.textContent = 'Examen non réussi'; title.style.color = 'var(--danger)'; }
            if (message) message.textContent = 'Continuez à vous entraîner pour améliorer votre score.';
        }

        if (scoreEl) {
            scoreEl.textContent = `${this.state.score}/40`;
            scoreEl.style.color = reussi ? 'var(--accent)' : 'var(--danger)';
        }
    },

    // ==========================================
    // PREMIUM
    // ==========================================
    showPremium() {
        if (this.state.isPremium) {
            this.showToast('Vous êtes déjà membre Premium !', 'info');
            return;
        }
        this.openModal('premiumModal');
    },

    selectPlan(plan, price) {
        this.state.selectedPlan = plan;
        this.state.selectedPlanPrice = price;
        
        const names = {
            monthly: 'Mensuel (9,99€/mois)',
            yearly: 'Annuel (71,88€/an)',
            lifetime: 'À Vie (149€ unique)'
        };
        
        const nameEl = document.getElementById('selectedPlanName');
        if (nameEl) nameEl.textContent = names[plan];
        
        document.getElementById('pricingPlans')?.classList.add('hidden');
        document.getElementById('paymentSection')?.classList.remove('hidden');
    },

    showPlanSelection() {
        document.getElementById('pricingPlans')?.classList.remove('hidden');
        document.getElementById('paymentSection')?.classList.add('hidden');
        this.state.selectedPlan = null;
    },

    async processPayment(method) {
        if (!this.state.currentUser) {
            this.showToast('Connectez-vous d\'abord', 'error');
            this.closeModal('premiumModal');
            this.openModal('authModal');
            return;
        }

        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
        btn.disabled = true;

        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:3000/simulate-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.state.currentUser.email,
                        method: method,
                        plan: this.state.selectedPlan
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    this.state.isPremium = true;
                    this.state.currentUser.isPremium = true;
                    this.saveToStorage();
                    this.updateUI();
                    this.closeModal('premiumModal');
                    this.showToast('🎉 Paiement réussi ! Bienvenue en Premium !', 'success');
                    this.createConfetti();
                    this.showPlanSelection();
                }
            } catch (error) {
                // Mode démo
                this.state.isPremium = true;
                this.state.currentUser.isPremium = true;
                this.saveToStorage();
                this.updateUI();
                this.closeModal('premiumModal');
                this.showToast('🎉 Paiement réussi (mode démo) !', 'success');
                this.createConfetti();
                this.showPlanSelection();
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        }, 1500);
    },

    // ==========================================
    // STATISTIQUES
    // ==========================================
    renderStats() {
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
        
        const avg = total > 0 ? Math.max(15, 45 - (percentage * 0.25)) : 0;
        if (avgTime) avgTime.textContent = `${Math.round(avg)}s`;

        this.checkBadges();

        const historyList = document.getElementById('historyList');
        if (historyList) {
            if (this.state.stats.history.length === 0) {
                historyList.innerHTML = '<p class="empty-state">Aucune session enregistrée</p>';
            } else {
                historyList.innerHTML = this.state.stats.history.slice(-10).reverse().map(h => `
                    <div class="history-item">
                        <span>${new Date(h.date).toLocaleDateString()}</span>
                        <span>${h.mode === 'exam' ? 'Examen' : 'Entraînement'}</span>
                        <span><strong>${h.score}/${h.total}</strong> (${h.percentage}%)</span>
                    </div>
                `).join('');
            }
        }

        this.drawChart();
    },

    drawChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const categories = this.state.stats.categories;
        const catNames = Object.keys(categories);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (catNames.length === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune donnée disponible', canvas.width/2, canvas.height/2);
            return;
        }

        const barWidth = 60;
        const gap = 30;
        const startX = 40;
        const startY = canvas.height - 40;
        const maxHeight = canvas.height - 80;

        catNames.forEach((cat, i) => {
            const data = categories[cat];
            const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            const barHeight = (pct / 100) * maxHeight;
            const x = startX + i * (barWidth + gap);

            ctx.fillStyle = '#6366f1';
            ctx.fillRect(x, startY - barHeight, barWidth, barHeight);

            ctx.fillStyle = '#374151';
            ctx.font = 'bold 14px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(pct)}%`, x + barWidth/2, startY - barHeight - 10);

            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Poppins';
            ctx.fillText(cat.substring(0, 8), x + barWidth/2, startY + 20);
        });
    },

    checkBadges() {
        const badges = {
            starter: this.state.stats.totalQuestions >= 1,
            streak_10: this.state.stats.bestStreak >= 10,
            streak_50: this.state.stats.bestStreak >= 50,
            master: this.state.stats.totalQuestions >= 100 && (this.state.stats.correctAnswers / this.state.stats.totalQuestions) >= 0.9,
            exam_pass: this.state.stats.history.some(h => h.mode === 'exam' && h.percentage >= 87.5)
        };

        document.querySelectorAll('.badge').forEach(badge => {
            const type = badge.dataset.badge;
            if (badges[type]) badge.classList.remove('locked');
        });
    },

    unlockBadge(badgeId) {
        const badge = document.querySelector(`[data-badge="${badgeId}"]`);
        if (badge && badge.classList.contains('locked')) {
            badge.classList.remove('locked');
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

        const profileEmail = document.getElementById('profileEmail');
        const accountStatus = document.getElementById('accountStatus');
        const upgradeBtn = document.getElementById('upgradeBtn');
        const totalQuestions = document.getElementById('totalQuestions');
        const correctRate = document.getElementById('correctRate');
        const examTaken = document.getElementById('examTaken');

        if (profileEmail) profileEmail.textContent = this.state.currentUser.email;
        
        if (accountStatus) {
            accountStatus.textContent = this.state.isPremium ? 'Premium' : 'Gratuit';
            accountStatus.className = 'status-badge ' + (this.state.isPremium ? 'premium' : '');
        }

        if (upgradeBtn) upgradeBtn.style.display = this.state.isPremium ? 'none' : 'inline-flex';

        if (totalQuestions) totalQuestions.textContent = this.state.stats.totalQuestions;

        const rate = this.state.stats.totalQuestions > 0 
            ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalQuestions) * 100) 
            : 0;
        if (correctRate) correctRate.textContent = `${rate}%`;

        const examCount = this.state.stats.history.filter(h => h.mode === 'exam').length;
        if (examTaken) examTaken.textContent = examCount;
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
            this.saveToStorage();
            this.showToast('Progrès réinitialisés', 'info');
            this.renderStats();
        }
    },

    // ==========================================
    // UTILITAIRES
    // ==========================================
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const premiumBadge = document.getElementById('premiumBadge');

        if (this.state.currentUser) {
            loginBtn?.classList.add('hidden');
            logoutBtn?.classList.remove('hidden');
            premiumBadge?.classList.toggle('hidden', !this.state.isPremium);
        } else {
            loginBtn?.classList.remove('hidden');
            logoutBtn?.classList.add('hidden');
            premiumBadge?.classList.add('hidden');
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
            } catch (e) {
                console.error('Erreur chargement:', e);
            }
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
        } catch (e) {}
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        `;
        
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        const color = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
            <span style="font-weight: 500;">${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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
                    border-radius: 50%;
                    z-index: 9999;
                    pointer-events: none;
                    animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }
};

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM prêt');
    App.init();
});
