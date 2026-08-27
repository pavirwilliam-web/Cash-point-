const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Récupérer l'état sauvegardé
app.get('/api/state', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      res.json(JSON.parse(raw));
    } else {
      res.json({ manualAmount: 0, entries: [] });
    }
  } catch (err) {
    console.error('Erreur lecture data.json:', err);
    res.status(500).json({ error: 'Erreur de lecture' });
  }
});

// Sauvegarder l'état
app.post('/api/state', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur écriture data.json:', err);
    res.status(500).json({ error: 'Erreur de sauvegarde' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
