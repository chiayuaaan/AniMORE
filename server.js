import 'dotenv/config';
import express from 'express';
import chat from './api/chat.js';

const app = express();
const port = Number(process.env.ANIMORE_API_PORT || 3001);

app.use(express.json({ limit: '256kb' }));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.all('/api/chat', chat);

app.listen(port, '127.0.0.1', () => {
  console.log(`AniMORE Chatbot Backend running at http://localhost:${port}`);
}).on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is busy. Stop the old AniMORE backend with Control+C, then start this one again.`
    : `Backend could not start (${error.code || error.name}).`);
  process.exitCode = 1;
});
