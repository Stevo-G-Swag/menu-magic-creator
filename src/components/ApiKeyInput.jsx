import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ModelProviderSelector from './ModelProviderSelector';

const ApiKeyInput = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApiKeySubmit(provider, apiKey);
    setIsOpen(false);
  };

  const handleProviderSelect = (selectedProvider) => {
    setProvider(selectedProvider);
    if (selectedProvider === 'huggingface' || selectedProvider === 'github') {
      setApiKey('free');
    } else {
      setApiKey('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Provider and Enter API Key</DialogTitle>
          <DialogDescription>
            Choose a model provider and enter your API key if required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ModelProviderSelector onProviderSelect={handleProviderSelect} />
          {provider && provider !== 'huggingface' && provider !== 'github' && (
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          )}
          <Button type="submit" disabled={!provider || (!apiKey && provider !== 'huggingface' && provider !== 'github')}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyInput;