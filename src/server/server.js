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

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(passport.initialize());

// Passport strategies configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
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
  callbackURL: "/api/auth/apple/callback",
  keyID: process.env.APPLE_KEY_ID,
  privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
}, async (accessToken, refreshToken, profile, done) => {
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

const getProviderClient = async (userId, provider) => {
  const user = await User.findById(userId);
  const settings = await Setting.findOne({ user: userId });

  if (!settings) {
    throw new Error('User settings not found');
  }

  switch (provider) {
    case 'openai':
      return new OpenAIApi(new Configuration({ apiKey: settings.openaiApiKey }));
    case 'huggingface':
      return new HfInference(settings.huggingfaceApiKey);
    case 'github':
      return new Octokit({ auth: settings.githubAccessToken });
    case 'litellm':
      return new LiteLLM({ apiKey: settings.litellmApiKey });
    case 'openrouter':
      return { apiKey: settings.openrouterApiKey };
    default:
      throw new Error('Unsupported provider');
  }
};

app.post('/api/generate-menu', authMiddleware, async (req, res, next) => {
  try {
    const { title, agents, tools, customizations, provider } = req.body;
    const providerClient = await getProviderClient(req.user._id, provider);
    const generatedMenu = await generateModMenu(providerClient, provider, title, agents, tools, customizations);
    const sandboxUrl = await createSandboxEnvironment(generatedMenu);
    res.json({ menu: generatedMenu, sandboxUrl });
  } catch (error) {
    next(error);
  }
});

app.post('/api/run-task', authMiddleware, async (req, res, next) => {
  try {
    const { task, provider } = req.body;
    const providerClient = await getProviderClient(req.user._id, provider);
    
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
            'Authorization': `Bearer ${providerClient.apiKey}`,
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
    next(error);
  }
});

app.post('/api/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`/?token=${token}`);
});

app.get('/api/auth/apple', passport.authenticate('apple'));

app.get('/api/auth/apple/callback', passport.authenticate('apple', { session: false }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`/?token=${token}`);
});

app.get('/api/user/settings', authMiddleware, async (req, res, next) => {
  try {
    const settings = await Setting.findOne({ user: req.user._id });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.post('/api/user/settings', authMiddleware, async (req, res, next) => {
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
    next(error);
  }
});

app.get('/api/admin/check-first-login', async (req, res, next) => {
  try {
    const admin = await Admin.findOne();
    res.json({ isFirstLogin: !admin });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/change-password', async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin();
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: 'Admin password changed successfully' });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});