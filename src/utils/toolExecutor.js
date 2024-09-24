import { Configuration, OpenAIApi } from 'openai';

let Octokit;
try {
  Octokit = require('@octokit/rest').Octokit;
} catch (error) {
  console.warn('Octokit package not found. GitHub tools will not be available.');
}

let HfInference;
try {
  HfInference = require('@huggingface/inference').HfInference;
} catch (error) {
  console.warn('HuggingFace inference package not found. HuggingFace tools will not be available.');
}

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
  if (!HfInference) {
    throw new Error('HuggingFace inference package is not installed. Unable to execute HuggingFace tool.');
  }
  
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
  if (!Octokit) {
    throw new Error('Octokit package is not installed. Unable to execute GitHub tool.');
  }

  const octokit = new Octokit({ auth: apiKey });

  try {
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
