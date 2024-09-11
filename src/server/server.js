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
import { generateModMenu, createSandboxEnvironment } from './menuGenerator.js';
import User from './models/User.js';
import Setting from './models/Setting.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.post('/api/generate-menu', authMiddleware, async (req, res) => {
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

app.post('/api/generate-suggestion', authMiddleware, async (req, res) => {
  try {
    const { specification } = req.body;
    const userSettings = await Setting.findOne({ user: req.user._id });
    if (!userSettings) {
      return res.status(400).json({ message: 'User settings not found' });
    }

    const openai = new OpenAIApi(new Configuration({ apiKey: userSettings.openaiApiKey }));
    const prompt = `Given the following menu specification, suggest improvements or additions:
    ${JSON.stringify(specification, null, 2)}
    Provide a concise suggestion to enhance this menu.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion = completion.data.choices[0].message.content;
    res.json({ suggestion });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    res.status(500).json({ message: 'Failed to generate suggestion', error: error.message });
  }
});

app.post('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { openaiApiKey, githubToken, huggingfaceApiKey, litellmApiKey, openrouterApiKey, defaultProvider, defaultModel } = req.body;
    let settings = await Setting.findOne({ user: req.user._id });
    if (!settings) {
      settings = new Setting({ user: req.user._id });
    }
    settings.openaiApiKey = openaiApiKey;
    settings.githubToken = githubToken;
    settings.huggingfaceApiKey = huggingfaceApiKey;
    settings.litellmApiKey = litellmApiKey;
    settings.openrouterApiKey = openrouterApiKey;
    settings.defaultProvider = defaultProvider;
    settings.defaultModel = defaultModel;
    await settings.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
});

app.post('/api/run-task', authMiddleware, async (req, res) => {
  try {
    const { task, provider, model } = req.body;
    const userSettings = await Setting.findOne({ user: req.user._id });
    if (!userSettings) {
      return res.status(400).json({ message: 'User settings not found' });
    }

    let result;
    switch (provider) {
      case 'openai':
        const openai = new OpenAIApi(new Configuration({ apiKey: userSettings.openaiApiKey }));
        const completion = await openai.createChatCompletion({
          model: model,
          messages: [{ role: "user", content: `Execute the following task: ${task}` }],
        });
        result = completion.data.choices[0].message.content;
        break;
      // Add cases for other providers here
      default:
        throw new Error('Invalid provider specified');
    }

    res.json({ message: `Task completed: ${result}` });
  } catch (error) {
    console.error('Error running task:', error);
    res.status(500).json({ message: 'Failed to run task', error: error.message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});