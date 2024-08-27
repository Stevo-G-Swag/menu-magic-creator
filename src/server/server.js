import express from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { generateModMenu, createSandboxEnvironment } from './menuGenerator.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const configureOpenAI = (apiKey) => {
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
};

app.post('/api/generate-menu', async (req, res) => {
  try {
    const { title, agents, tools, customizations } = req.body;
    const apiKey = req.headers.authorization.split(' ')[1];
    const openai = configureOpenAI(apiKey);
    const generatedMenu = await generateModMenu(openai, title, agents, tools, customizations);
    const sandboxUrl = await createSandboxEnvironment(generatedMenu);
    res.json({ menu: generatedMenu, sandboxUrl });
  } catch (error) {
    console.error('Error generating mod menu:', error);
    res.status(500).json({ error: 'An error occurred while generating the mod menu.' });
  }
});

app.post('/api/run-task', async (req, res) => {
  try {
    const { task } = req.body;
    const apiKey = req.headers.authorization.split(' ')[1];
    const openai = configureOpenAI(apiKey);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "system", content: "You are a helpful AI assistant." }, { role: "user", content: `Execute the following task: ${task}` }],
    });

    res.json({ message: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error running task:', error);
    res.status(500).json({ error: 'An error occurred while running the task.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});