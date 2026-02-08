// ✅ Gestion login / inscription
async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://localhost:4242/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
    });
    const data = await res.json();
    alert(data.success ? '✅ Inscription réussie' : data.error);
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://localhost:4242/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(data.error) return alert(data.error);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('premium', data.premium);
    alert('✅ Connecté');
}

// ✅ Abonnement premium
document.getElementById('subscribeBtn').onclick = async () => {
    const email = localStorage.getItem('userEmail');
    if(!email) return alert("Connectez-vous d'abord");
    const res = await fetch('http://localhost:4242/create-checkout-session', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email})
    });
    const data = await res.json();
    window.location = data.url;
}

if(new URLSearchParams(window.location.search).get('success')==='true'){
    localStorage.setItem('premium','true');
    alert("✅ Abonnement activé !");
}

// ✅ Quiz / Examen blanc
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let examMode = false;

function isPremium() { return localStorage.getItem('premium') === 'true'; }

function startExam() {
    if(!isPremium()) { alert("💎 Abonnez-vous pour accéder à l'examen blanc complet."); return; }
    examMode = true;
    currentQuestions = shuffle([...questionsDatabase]).slice(0,40);
    currentIndex = 0;
    score = 0;
    document.getElementById('quiz').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('progress').innerText = `Question ${currentIndex+1}/${currentQuestions.length}`;
    document.getElementById('question').innerText = q.question;
    const optsDiv = document.getElementById('options');
    optsDiv.innerHTML = '';
    q.options.forEach((o,i)=>{
        const btn = document.createElement('button');
        btn.innerText = o;
        btn.className = 'bg-gray-200 p-2 m-1 w-full rounded';
        btn.onclick = () => selectAnswer(i);
        optsDiv.appendChild(btn);
    });
}

function selectAnswer(index){
    const q = currentQuestions[currentIndex];
    if(index === q.correctAnswer){ score++; alert("✅ Correct"); }
    else{ alert("❌ Faux. " + q.explanation); }
    currentIndex++;
    if(currentIndex < currentQuestions.length){ showQuestion(); }
    else{ showResult(); }
}

function showResult(){
    document.getElementById('quiz').classList.add('hidden');
    const resDiv = document.getElementById('result');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `<h2>Résultat : ${score}/${currentQuestions.length}</h2>`;
}

// ✅ Fonction utilitaire shuffle
function shuffle(array){
    let currentIndex = array.length, randomIndex;
    while(currentIndex != 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
