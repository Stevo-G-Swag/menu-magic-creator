import express from 'express';
import dotenv from 'dotenv';
import { generateMenuCode } from './menuGenerator.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/generate-menu', async (req, res) => {
  try {
    const { title, agents, tools, customizations } = req.body;
    const generatedCode = await generateMenuCode(title, agents, tools, customizations);
    res.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating menu code:', error);
    res.status(500).json({ error: 'An error occurred while generating the menu code.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});