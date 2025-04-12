const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

// Fonction utilitaire pour écrire
function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Création du fichier users.json si manquant
if (!fs.existsSync(USERS_FILE)) writeFile(USERS_FILE, []);

// Fonction utilitaire pour lire
function readFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

// Route d'inscription
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = readFile(USERS_FILE);

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Utilisateur déjà inscrit' });
  }

  users.push({ username, password });
  writeFile(USERS_FILE, users);

  res.json({ success: true, message: 'Inscription réussie' });
});

// Route de connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readFile(USERS_FILE);

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  res.json({ success: true, message: 'Connexion réussie' });
});

// Message d'accueil
app.get('/', (req, res) => {
  res.send('TournoiApi is running');
});

// Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lancée sur le port ${PORT}`));
