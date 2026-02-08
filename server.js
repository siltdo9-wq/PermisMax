const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const stripe = require('stripe')('sk_test_votre_cle_stripe'); // Remplacer par votre clé Stripe

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const USERS_FILE = path.join(__dirname, 'users.json');

// Initialiser le fichier users.json s'il n'existe pas
async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// Lire les utilisateurs
async function getUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

// Sauvegarder les utilisateurs
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
        categories: {}
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

// Créer une session de paiement Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { email } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bancontact', 'ideal', 'sepa_debit'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Permis Premium - Accès illimité',
            description: 'Accès aux examens blancs et statistiques avancées',
          },
          unit_amount: 2900, // 29€
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000?payment=success&email=${encodeURIComponent(email)}`,
      cancel_url: `http://localhost:3000?payment=cancelled`,
      customer_email: email,
    });
    
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de création de session' });
  }
});

// Vérifier et mettre à jour le statut premium (webhook simulé pour test)
app.post('/verify-premium', async (req, res) => {
  try {
    const { email } = req.body;
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      user.isPremium = true;
      await saveUsers(users);
      res.json({ success: true, isPremium: true });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour les statistiques
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

// Simuler le paiement pour test (sans Stripe)
app.post('/simulate-payment', async (req, res) => {
  try {
    const { email, method } = req.body;
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].isPremium = true;
      users[userIndex].premiumMethod = method;
      users[userIndex].premiumDate = new Date().toISOString();
      await saveUsers(users);
      
      res.json({ 
        success: true, 
        message: 'Paiement simulé réussi',
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

initUsersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});
