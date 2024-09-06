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
import Admin from './models/Admin.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import CryptoJS from 'crypto-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(passport.initialize());

// ... (previous passport configurations remain unchanged)

// Function to unhash the API key
const unhashApiKey = (hashedKey) => {
  const secretPassphrase = process.env.API_KEY_SECRET; // Store this securely in your environment variables
  return CryptoJS.AES.decrypt(hashedKey, secretPassphrase).toString(CryptoJS.enc.Utf8);
};

app.post('/api/scan-for-errors', async (req, res) => {
  try {
    const { errors } = req.body;
    const hashedApiKey = req.headers['x-api-key'];
    const unhashedApiKey = unhashApiKey(hashedApiKey);

    const openai = new OpenAIApi(new Configuration({ apiKey: unhashedApiKey }));
    
    const prompt = `Analyze the following errors and provide detailed explanations, possible affected files, and solutions if possible:
    
    Errors: ${JSON.stringify(errors)}
    
    Please format your response as JSON with the following structure:
    {
      "newErrors": [
        {
          "message": "Detailed explanation of the error",
          "affectedFiles": ["list", "of", "potentially", "affected", "files"],
          "possibleSolution": "A possible solution to the error"
        }
      ]
    }`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = JSON.parse(completion.data.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing errors:', error);
    res.status(500).json({ message: 'Failed to analyze errors' });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});