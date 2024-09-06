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

const googleCallbackURL = isDevelopment
  ? "http://localhost:3001/auth/google/callback"
  : "https://yourdomain.com/auth/google/callback";

const appleCallbackURL = isDevelopment
  ? "http://localhost:3001/auth/apple/callback"
  : "https://yourdomain.com/auth/apple/callback";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: googleCallbackURL
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
  callbackURL: appleCallbackURL,
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
    res.status(500).json({ message: 'Failed to analyze errors', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.post('/api/generate-menu', authMiddleware, async (req, res) => {
  try {
    const { title, agents, tools, customizations, provider } = req.body;
    let providerClient;

    switch (provider) {
      case 'openai':
        providerClient = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
        break;
      case 'huggingface':
        providerClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
        break;
      case 'github':
        providerClient = new Octokit({ auth: process.env.GITHUB_TOKEN });
        break;
      case 'litellm':
        providerClient = new LiteLLM({ apiKey: process.env.LITELLM_API_KEY });
        break;
      case 'openrouter':
        providerClient = { apiKey: process.env.OPENROUTER_API_KEY };
        break;
      default:
        throw new Error('Invalid provider specified');
    }

    const menuItems = await generateModMenu(providerClient, provider, title, agents, tools, customizations);
    const sandboxUrl = await createSandboxEnvironment(menuItems);

    res.json({ menu: menuItems, sandboxUrl });
  } catch (error) {
    console.error('Error generating menu:', error);
    res.status(500).json({ message: 'Failed to generate menu', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error signing up', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.get('/api/user/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await Setting.findOne({ user: req.user._id });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.post('/api/user/settings', authMiddleware, async (req, res) => {
  try {
    const { openaiApiKey, githubClientId, githubClientSecret, litellmApiKey, openrouterApiKey } = req.body;
    let settings = await Setting.findOne({ user: req.user._id });
    if (!settings) {
      settings = new Setting({ user: req.user._id });
    }
    settings.openaiApiKey = openaiApiKey;
    settings.githubClientId = githubClientId;
    settings.githubClientSecret = githubClientSecret;
    settings.litellmApiKey = litellmApiKey;
    settings.openrouterApiKey = openrouterApiKey;
    await settings.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Error updating settings', error: isDevelopment ? error.message : 'Internal server error' });
  }
});

app.use(errorHandler);

if (isDevelopment) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something broke in development!',
      error: err.message,
      stack: err.stack
    });
  });
} else {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${isDevelopment ? 'development' : 'production'} mode`);
});