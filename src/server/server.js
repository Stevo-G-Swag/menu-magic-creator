import express from 'express';
import dotenv from 'dotenv';
import { generateModMenu } from './menuGenerator.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/generate-menu', async (req, res) => {
  try {
    const { title, agents, tools, customizations } = req.body;
    const generatedMenu = await generateModMenu(title, agents, tools, customizations);
    res.json({ menu: generatedMenu });
  } catch (error) {
    console.error('Error generating mod menu:', error);
    res.status(500).json({ error: 'An error occurred while generating the mod menu.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});