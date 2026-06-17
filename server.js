import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load variables from the .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Securely load your Assistant ID from the .env file!
const ASSISTANT_ID = process.env.ASSISTANT_ID;

app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, conversationHistory } = req.body;

    // 1. Create a new thread (conversation session) for the Assistant
    const thread = await openai.beta.threads.create();

    // 2. Load the previous conversation history into the thread
    for (const msg of conversationHistory) {
      if (msg.role !== 'system') { 
        await openai.beta.threads.messages.create(thread.id, {
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // 3. Add the user's newest message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userMessage
    });

    // 4. Run the specific Assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    if (run.status === 'completed') {
      // 5. Fetch the Assistant's response
      const messages = await openai.beta.threads.messages.list(thread.id);
      let latestMessage = messages.data[0].content[0].text.value;
      
      // Clean up citation brackets if the AI reads your uploaded document
      latestMessage = latestMessage.replace(/【.*?】/g, '');

      res.json({ reply: latestMessage });
    } else {
      console.error("Run status:", run.status);
      res.status(500).json({ error: "Assistant run did not complete successfully." });
    }

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong communicating with the AI." });
  }
});

app.listen(port, () => {
  console.log(`🤖 AniMORE Chatbot Backend running at http://localhost:${port}`);
});