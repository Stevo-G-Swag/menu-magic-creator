import React from 'react';
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const providers = [
  { name: 'OpenAI', value: 'openai' },
  { name: 'LiteLLM', value: 'litellm' },
  { name: 'OpenRouter', value: 'openrouter' },
  { name: 'Hugging Face', value: 'huggingface' },
  { name: 'GitHub (Models)', value: 'github' },
];

const ModelProviderSelector = ({ onProviderSelect }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="provider-select">Select Model Provider</Label>
      <Select onValueChange={onProviderSelect}>
        <Select.Trigger id="provider-select">
          <Select.Value placeholder="Select a provider" />
        </Select.Trigger>
        <Select.Content>
          {providers.map((provider) => (
            <Select.Item key={provider.value} value={provider.value}>
              {provider.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};

export default ModelProviderSelector;