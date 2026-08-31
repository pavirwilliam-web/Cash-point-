const express = require('express');
const path = require('path');
const { Redis } = require('@upstash/redis');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_KEY = 'app:state';

// Connexion à la base Redis persistante (Upstash)
// Nécessite les variables d'environnement UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

const DEFAULT_STATE = { manualAmount: 0, entries: [] };

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Récupérer l'état sauvegardé
app.get('/api/state', async (req, res) => {
  try {
    const data = await redis.get(STATE_KEY);
    res.json(data || DEFAULT_STATE);
  } catch (err) {
    console.error('Erreur lecture Redis:', err);
    res.status(500).json({ error: 'Erreur de lecture' });
  }
});

// Sauvegarder l'état
app.post('/api/state', async (req, res) => {
  try {
    await redis.set(STATE_KEY, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur écriture Redis:', err);
    res.status(500).json({ error: 'Erreur de sauvegarde' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
