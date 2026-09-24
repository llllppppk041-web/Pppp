const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || process.env.PORT || 3000;
const MODEL = process.env.AI_MODEL || 'swarm-coder';
const AI_URL = process.env.AI_URL || 'http://localhost:4000/v1/chat/completions';

app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname));

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
    .slice(-20)
    .map(message => ({ role: message.role, content: message.content.slice(0, 12000) }));
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pppp-api' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, subject, history } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 8000) {
      return res.status(413).json({ error: 'message is too long' });
    }

    const system = `You are Nova Tutor, a rigorous and friendly tutor. Teach from first principles, build a clear master chain before details, use Hinglish when the user does, define difficult terms, and explain why each step is true. The current subject is ${typeof subject === 'string' && subject.trim() ? subject.trim() : 'general learning'}.`;
    const messages = [
      { role: 'system', content: system },
      ...cleanHistory(history),
      { role: 'user', content: message.trim() }
    ];

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.AI_API_KEY) {
      headers.Authorization = `Bearer ${process.env.AI_API_KEY}`;
    }

    const upstream = await fetch(AI_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.4, max_tokens: 1800 })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('AI provider error:', upstream.status, data);
      return res.status(502).json({ error: 'AI provider request failed' });
    }

    const reply = data.reply || data.message || data.content || data.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: 'AI provider returned no answer' });
    return res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'Index.Html')));

app.listen(PORT, () => console.log(`PPPP API running on port ${PORT}`));
