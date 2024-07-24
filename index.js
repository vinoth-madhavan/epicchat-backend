import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import logger from './logger.js';
import dotenv from 'dotenv';
import { botsList } from './botsList.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.method === 'POST' ? req.body : undefined,
  });
  next();
});
app.options('/api/chat', cors(corsOptions));

app.get('/', async (req, res) => {
  res.json({ message: 'helloworld' });
});

app.get('/api/botsList', async (req, res) => {
  res.json(botsList);
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    logger.error('Error in /api/chat', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});