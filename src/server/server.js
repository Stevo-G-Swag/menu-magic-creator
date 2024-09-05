import express from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { HfInference } from '@huggingface/inference';
import { Octokit } from '@octokit/rest';
import { generateModMenu, createSandboxEnvironment } from './menuGenerator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LiteLLM } from 'litellm';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// In-memory user storage (replace with a database in production)
const users = [];

const configureProvider = (provider, apiKey) => {
  switch (provider) {
    case 'openai':
      const configuration = new Configuration({ apiKey });
      return new OpenAIApi(configuration);
    case 'huggingface':
      return new HfInference(apiKey);
    case 'github':
      return new Octokit({ auth: apiKey });
    case 'litellm':
      return new LiteLLM({ apiKey });
    case 'openrouter':
      return { apiKey }; // OpenRouter doesn't have a specific client, we'll use fetch
    default:
      throw new Error('Unsupported provider');
  }
};

app.post('/api/generate-menu', async (req, res) => {
  try {
    const { title, agents, tools, customizations, provider } = req.body;
    const apiKey = req.headers.authorization.split(' ')[1];
    const providerClient = configureProvider(provider, apiKey);
    const generatedMenu = await generateModMenu(providerClient, provider, title, agents, tools, customizations);
    const sandboxUrl = await createSandboxEnvironment(generatedMenu);
    res.json({ menu: generatedMenu, sandboxUrl });
  } catch (error) {
    console.error('Error generating mod menu:', error);
    res.status(500).json({ error: 'An error occurred while generating the mod menu.' });
  }
});

app.post('/api/run-task', async (req, res) => {
  try {
    const { task, provider } = req.body;
    const apiKey = req.headers.authorization.split(' ')[1];
    const providerClient = configureProvider(provider, apiKey);
    
    let result;
    switch (provider) {
      case 'openai':
        const completion = await providerClient.createChatCompletion({
          model: "gpt-4",
          messages: [{ role: "system", content: "You are a helpful AI assistant." }, { role: "user", content: `Execute the following task: ${task}` }],
        });
        result = completion.data.choices[0].message.content;
        break;
      case 'huggingface':
        const hfResponse = await providerClient.textGeneration({
          model: 'gpt2',
          inputs: `Execute the following task: ${task}`,
        });
        result = hfResponse.generated_text;
        break;
      case 'github':
        // Implement GitHub API call
        break;
      case 'litellm':
        const liteLLMResponse = await providerClient.complete({
          messages: [{ role: "user", content: `Execute the following task: ${task}` }],
        });
        result = liteLLMResponse.choices[0].message.content;
        break;
      case 'openrouter':
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [{ role: "user", content: `Execute the following task: ${task}` }],
          }),
        });
        const openRouterData = await openRouterResponse.json();
        result = openRouterData.choices[0].message.content;
        break;
    }

    res.json({ message: result });
  } catch (error) {
    console.error('Error running task:', error);
    res.status(500).json({ error: 'An error occurred while running the task.' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    users.push(user);
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { email: user.email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.get('/api/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

app.get('/api/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userData = await userResponse.json();

    const user = { email: userData.email, githubId: userData.id };
    const existingUser = users.find(u => u.githubId === userData.id);
    if (existingUser) {
      Object.assign(existingUser, user);
    } else {
      users.push(user);
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/?token=${token}`);
  } catch (error) {
    console.error('GitHub authentication error:', error);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});