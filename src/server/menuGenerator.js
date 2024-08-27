import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateModMenu(title, agents, tools, customizations) {
  const prompt = `
    Create a minimalist mod menu for an agentic AI LLM system with the following specifications:
    Title: ${title}
    Agents: ${JSON.stringify(agents)}
    Tools: ${JSON.stringify(tools)}
    Customizations: ${JSON.stringify(customizations)}

    The menu should have a compact design with a red background and white text.
    Include the following main categories:
    1. Agent Configuration
    2. Core Settings
    3. Advanced Settings
    4. Model Configuration

    Under each category, list relevant options based on the provided agents and tools.
    The output should be a JSON array of menu items, including categories and their options.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a skilled AI assistant specializing in creating mod menus for AI systems." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const menuItems = JSON.parse(response.choices[0].message.content);
    return menuItems;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate mod menu');
  }
}