// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 4242;

// 📂 Base utilisateurs simple (JSON)
let users = [];
const USERS_FILE = './users.json';

// Charger utilisateurs existants
if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// ✅ Inscription
app.post('/register', (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password) return res.json({error: "Email et mot de passe requis"});
    if(users.find(u=>u.email===email)) return res.json({error: "Utilisateur déjà existant"});
    const newUser = { email, password, premium: false };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
    res.json({success: true});
});

// ✅ Login
app.post('/login', (req,res)=>{
    const { email, password } = req.body;
    const user = users.find(u=>u.email===email && u.password===password);
    if(!user) return res.json({error: "Email ou mot de passe incorrect"});
    res.json({email: user.email, premium: user.premium});
});

// ✅ Simuler abonnement premium (juste pour test)
app.post('/create-checkout-session', (req,res)=>{
    const { email } = req.body;
    const user = users.find(u=>u.email===email);
    if(!user) return res.json({error: "Utilisateur non trouvé"});
    // On active directement premium pour test
    user.premium = true;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
    res.json({url: window.location.href + "?success=true"});
});

app.listen(PORT, ()=> console.log(`Backend démarré sur http://localhost:${PORT}`));
