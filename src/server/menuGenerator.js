import fetch from 'node-fetch';

export async function generateModMenu(providerClient, provider, title, agents, tools, customizations) {
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
    The output should be a JSON array of menu categories, each containing a name and an array of items.
  `;

  try {
    let menuItems;
    switch (provider) {
      case 'openai':
        const response = await providerClient.createChatCompletion({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a skilled AI assistant specializing in creating mod menus for AI systems." },
            { role: "user", content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        });
        menuItems = JSON.parse(response.data.choices[0].message.content);
        break;
      case 'huggingface':
        const hfResponse = await providerClient.textGeneration({
          model: 'gpt2',
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
          },
        });
        menuItems = JSON.parse(hfResponse.generated_text);
        break;
      case 'github':
        const { data } = await providerClient.repos.getContent({
          owner: 'your-org',
          repo: 'menu-templates',
          path: 'default-template.json',
        });
        const template = JSON.parse(Buffer.from(data.content, 'base64').toString());
        menuItems = modifyTemplate(template, { title, agents, tools, customizations });
        break;
      case 'litellm':
        const liteLLMResponse = await providerClient.complete({
          messages: [
            { role: "system", content: "You are a skilled AI assistant specializing in creating mod menus for AI systems." },
            { role: "user", content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        });
        menuItems = JSON.parse(liteLLMResponse.choices[0].message.content);
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
            messages: [
              { role: "system", content: "You are a skilled AI assistant specializing in creating mod menus for AI systems." },
              { role: "user", content: prompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });
        const openRouterData = await openRouterResponse.json();
        menuItems = JSON.parse(openRouterData.choices[0].message.content);
        break;
    }
    return menuItems;
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    throw new Error('Failed to generate mod menu');
  }
}

function modifyTemplate(template, { title, agents, tools, customizations }) {
  template.title = title;
  template.agents = agents;
  template.tools = tools;
  // Apply customizations
  return template;
}

export async function createSandboxEnvironment(menuItems) {
  const sandboxCode = `
    import React from 'react';
    import ReactDOM from 'react-dom';

    const ModMenu = ({ menuItems }) => (
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px' }}>
        <h1>${menuItems[0].title}</h1>
        {menuItems.map((category, index) => (
          <div key={index}>
            <h2>{category.name}</h2>
            <ul>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );

    ReactDOM.render(
      <ModMenu menuItems={${JSON.stringify(menuItems)}} />,
      document.getElementById('root')
    );
  `;

  const sandboxConfig = {
    files: {
      'index.js': {
        content: sandboxCode,
      },
    },
    template: 'create-react-app',
  };

  try {
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sandboxConfig),
    });

    const data = await response.json();
    return `https://codesandbox.io/s/${data.sandbox_id}`;
  } catch (error) {
    console.error('Error creating sandbox:', error);
    throw new Error('Failed to create sandbox environment');
  }
}