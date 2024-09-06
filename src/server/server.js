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
const isDevelopment = process.env.NODE_ENV !== 'production';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(passport.initialize());

if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: isDevelopment ? "http://localhost:3001/auth/google/callback" : "https://yourdomain.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID,
  teamID: process.env.APPLE_TEAM_ID,
  callbackURL: isDevelopment ? "http://localhost:3001/auth/apple/callback" : "https://yourdomain.com/auth/apple/callback",
  keyID: process.env.APPLE_KEY_ID,
  privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
}, async (accessToken, refreshToken, idToken, profile, done) => {
  try {
    let user = await User.findOne({ appleId: profile.id });
    if (!user) {
      user = new User({
        appleId: profile.id,
        email: profile.email,
        username: profile.name.firstName + ' ' + profile.name.lastName
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

const unhashApiKey = (hashedKey) => {
  const secretPassphrase = process.env.API_KEY_SECRET;
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

if (isDevelopment) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke in development!');
  });
} else {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${isDevelopment ? 'development' : 'production'} mode`);
});