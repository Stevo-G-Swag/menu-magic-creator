import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMenuCode(title, agents, tools, customizations) {
  const prompt = `
    Create an OLLAMA mode menu with the following specifications:
    Title: ${title}
    Agents: ${JSON.stringify(agents)}
    Tools: ${JSON.stringify(tools)}
    Customizations: ${JSON.stringify(customizations)}

    Generate HTML, CSS, and JavaScript code for a responsive and accessible menu.
    Use best practices for performance and follow WCAG 2.1 guidelines for accessibility.
    Include comments explaining the code structure and functionality.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a skilled web developer specializing in creating OLLAMA mode menus with agents and tools." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate menu code');
  }
}