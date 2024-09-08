import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <SelectTrigger id="provider-select">
          <SelectValue placeholder="Select a provider" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelProviderSelector;