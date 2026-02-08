const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const USERS_FILE = path.join(__dirname, 'users.json');

async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
}

async function getUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Inscription
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUsers();
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      isPremium: false,
      createdAt: new Date().toISOString(),
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        streak: 0,
        bestStreak: 0,
        categories: {},
        history: []
      }
    };
    
    users.push(newUser);
    await saveUsers(users);
    
    res.json({ 
      success: true, 
      message: 'Inscription réussie',
      user: { id: newUser.id, email: newUser.email, isPremium: newUser.isPremium }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        email: user.email, 
        isPremium: user.isPremium,
        stats: user.stats
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Simulation paiement
app.post('/simulate-payment', async (req, res) => {
  try {
    const { email, method, plan } = req.body;
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].isPremium = true;
      users[userIndex].premiumMethod = method;
      users[userIndex].premiumPlan = plan;
      users[userIndex].premiumDate = new Date().toISOString();
      await saveUsers(users);
      
      res.json({ 
        success: true, 
        message: 'Paiement réussi',
        user: {
          email: users[userIndex].email,
          isPremium: true
        }
      });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mise à jour stats
app.post('/update-stats', async (req, res) => {
  try {
    const { email, stats } = req.body;
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].stats = { ...users[userIndex].stats, ...stats };
      await saveUsers(users);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

initUsersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});
