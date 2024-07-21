import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import logger from './logger.js'; 
import dotenv from 'dotenv'

const app = express();
const port = 3001;

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
    logger.info('Request Received', { method: req.method, url: req.url });
    const response = {
        message: 'helloword'
    }
    res.json(response);
});
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  logger.info('Request to /api/chat', { headers: req.headers, body: req.body, messages });
  try {
      const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    logger.error('Error in /api/chat', { message: error.message });
    res.status(500).send(error.message);
  }
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
