import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.VITE_SERVER_PORT || 3001;
const DATA_FILE = path.join(process.cwd(), 'data', 'suggestions.json');

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

async function readSuggestions() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { suggestions: [] };
  }
}

async function writeSuggestions(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/suggestions', verifyToken, async (req, res) => {
  try {
    const data = await readSuggestions();
    res.json(data.suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read suggestions' });
  }
});

app.post('/api/suggestions', async (req, res) => {
  try {
    const { content } = req.body;
    const data = await readSuggestions();
    
    const newSuggestion = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    data.suggestions.push(newSuggestion);
    await writeSuggestions(data);
    
    res.json(newSuggestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add suggestion' });
  }
});

app.patch('/api/suggestions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const data = await readSuggestions();
    
    const suggestion = data.suggestions.find(s => s.id === id);
    if (suggestion) {
      suggestion.isRead = isRead;
      await writeSuggestions(data);
      res.json(suggestion);
    } else {
      res.status(404).json({ error: 'Suggestion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update suggestion' });
  }
});

app.delete('/api/suggestions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readSuggestions();
    
    data.suggestions = data.suggestions.filter(s => s.id !== id);
    await writeSuggestions(data);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
