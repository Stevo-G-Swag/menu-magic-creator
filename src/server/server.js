import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Configuration, OpenAIApi } from 'openai';
import { HfInference } from '@huggingface/inference';
import { Octokit } from '@octokit/rest';
import { LiteLLM } from 'litellm';
import fetch from 'node-fetch';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { generateModMenu, createSandboxEnvironment } from './menuGenerator.js';
import User from './models/User.js';
import Setting from './models/Setting.js';
import Agent from './models/Agent.js';
import Tool from './models/Tool.js';
import Problem from './models/Problem.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected routes
app.use(authMiddleware);

app.post('/api/generate-menu', async (req, res) => {
  try {
    const { title, agents, tools, customizations, provider, model } = req.body;
    let providerClient;

    const userSettings = await Setting.findOne({ user: req.user._id });
    if (!userSettings) {
      return res.status(400).json({ message: 'User settings not found' });
    }

    switch (provider) {
      case 'openai':
        providerClient = new OpenAIApi(new Configuration({ apiKey: userSettings.openaiApiKey }));
        break;
      case 'huggingface':
        providerClient = new HfInference(userSettings.huggingfaceApiKey);
        break;
      case 'github':
        providerClient = new Octokit({ auth: userSettings.githubToken });
        break;
      case 'litellm':
        providerClient = new LiteLLM({ apiKey: userSettings.litellmApiKey });
        break;
      case 'openrouter':
        providerClient = { apiKey: userSettings.openrouterApiKey };
        break;
      default:
        throw new Error('Invalid provider specified');
    }

    const menuItems = await generateModMenu(providerClient, provider, model, title, agents, tools, customizations);
    const sandboxUrl = await createSandboxEnvironment(menuItems);

    res.json({ menu: menuItems, sandboxUrl });
  } catch (error) {
    console.error('Error generating menu:', error);
    res.status(500).json({ message: 'Failed to generate menu', error: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const { name, description } = req.body;
    const agent = new Agent({ name, description, user: req.user._id });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating agent', error: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await Agent.find({ user: req.user._id });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error: error.message });
  }
});

app.post('/api/tools', async (req, res) => {
  try {
    const { name, description } = req.body;
    const tool = new Tool({ name, description, user: req.user._id });
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tool', error: error.message });
  }
});

app.get('/api/tools', async (req, res) => {
  try {
    const tools = await Tool.find({ user: req.user._id });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tools', error: error.message });
  }
});

app.post('/api/solve-problem', async (req, res) => {
  try {
    const { problem, agents } = req.body;
    // Implement problem-solving logic here
    const solution = `Solution for: ${problem}`;
    const newProblem = new Problem({ description: problem, solution, user: req.user._id });
    await newProblem.save();
    res.json({ solution });
  } catch (error) {
    res.status(500).json({ message: 'Error solving problem', error: error.message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
