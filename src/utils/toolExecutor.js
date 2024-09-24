import { Configuration, OpenAIApi } from 'openai';

const executeOpenAITool = async (tool, input, apiKey) => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `${tool.description}\n\nInput: ${input}\n\nOutput:`,
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error executing OpenAI tool:', error);
    throw new Error('Failed to execute tool');
  }
};

export const executeTool = async (tool, input, apiKey) => {
  switch (tool.type) {
    case 'openai':
      return executeOpenAITool(tool, input, apiKey);
    // Add more tool types here as needed
    default:
      throw new Error('Unsupported tool type');
  }
};