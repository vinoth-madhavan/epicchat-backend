import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
const port = 3001;

const openai = new OpenAI({ apiKey: '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' });

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  console.log("-------------------------");
  console.log("Request Headers: \n",req.headers);
  console.log("Request Body: \n",req.body);
  console.log("messages Received: \n", messages);
  console.log("-------------------------");
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
