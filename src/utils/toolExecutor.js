import { Configuration, OpenAIApi } from 'openai';
import { HfInference } from '@huggingface/inference';
import { Octokit } from '@octokit/rest';

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
    throw new Error('Failed to execute OpenAI tool');
  }
};

const executeHuggingFaceTool = async (tool, input, apiKey) => {
  const hf = new HfInference(apiKey);

  try {
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: `${tool.description}\n\nInput: ${input}\n\nOutput:`,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
      },
    });
    return response.generated_text.trim();
  } catch (error) {
    console.error('Error executing HuggingFace tool:', error);
    throw new Error('Failed to execute HuggingFace tool');
  }
};

const executeGitHubTool = async (tool, input, apiKey) => {
  const octokit = new Octokit({ auth: apiKey });

  try {
    // This is a placeholder implementation. Adjust according to your specific GitHub tool needs.
    const response = await octokit.rest.search.repos({
      q: input,
      sort: 'stars',
      order: 'desc',
    });
    return JSON.stringify(response.data.items.slice(0, 5), null, 2);
  } catch (error) {
    console.error('Error executing GitHub tool:', error);
    throw new Error('Failed to execute GitHub tool');
  }
};

export const executeTool = async (tool, input, apiKey) => {
  switch (tool.type) {
    case 'openai':
      return executeOpenAITool(tool, input, apiKey);
    case 'huggingface':
      return executeHuggingFaceTool(tool, input, apiKey);
    case 'github':
      return executeGitHubTool(tool, input, apiKey);
    default:
      throw new Error(`Unsupported tool type: ${tool.type}`);
  }
};
