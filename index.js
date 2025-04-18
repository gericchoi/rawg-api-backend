import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';
import https from 'https';

const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://rawg-api.surge.sh');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Use custom agent only in development to bypass self-signed cert issues
const isDev = process.env.NODE_ENV !== 'production';
const agent = new https.Agent({ rejectUnauthorized: false });

app.get('/api/games', async (req, res) => {
  const apiKey = process.env.RAWG_API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=2025-01-01,2025-03-30&page_size=10`;

  try {
    const fetchOptions = isDev ? { agent } : {};
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from RAWG:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
