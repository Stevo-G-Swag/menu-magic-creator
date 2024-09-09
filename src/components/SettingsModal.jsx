import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultSettings = {
  openaiApiKey: 'sk-...', // Default or placeholder value
  githubToken: 'ghp_...',
  huggingfaceApiKey: 'hf_...',
  litellmApiKey: 'litellm_...',
  openrouterApiKey: 'openrouter_...',
  defaultProvider: 'openai',
  defaultModel: 'gpt-3.5-turbo',
};

const SettingsModal = ({ isOpen, onClose, onUpdate }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setSettings(prevSettings => ({ ...prevSettings, ...savedSettings }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
              <Input
                id="openaiApiKey"
                name="openaiApiKey"
                value={settings.openaiApiKey}
                onChange={handleChange}
                placeholder="Enter your OpenAI API key"
              />
            </div>
            <div>
              <Label htmlFor="githubToken">GitHub Token</Label>
              <Input
                id="githubToken"
                name="githubToken"
                value={settings.githubToken}
                onChange={handleChange}
                placeholder="Enter your GitHub token"
              />
            </div>
            <div>
              <Label htmlFor="huggingfaceApiKey">Hugging Face API Key</Label>
              <Input
                id="huggingfaceApiKey"
                name="huggingfaceApiKey"
                value={settings.huggingfaceApiKey}
                onChange={handleChange}
                placeholder="Enter your Hugging Face API key"
              />
            </div>
            <div>
              <Label htmlFor="litellmApiKey">LiteLLM API Key</Label>
              <Input
                id="litellmApiKey"
                name="litellmApiKey"
                value={settings.litellmApiKey}
                onChange={handleChange}
                placeholder="Enter your LiteLLM API key"
              />
            </div>
            <div>
              <Label htmlFor="openrouterApiKey">OpenRouter API Key</Label>
              <Input
                id="openrouterApiKey"
                name="openrouterApiKey"
                value={settings.openrouterApiKey}
                onChange={handleChange}
                placeholder="Enter your OpenRouter API key"
              />
            </div>
            <div>
              <Label htmlFor="defaultProvider">Default Provider</Label>
              <Select
                name="defaultProvider"
                value={settings.defaultProvider}
                onValueChange={handleSelectChange('defaultProvider')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="huggingface">Hugging Face</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="litellm">LiteLLM</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultModel">Default Model</Label>
              <Select
                name="defaultModel"
                value={settings.defaultModel}
                onValueChange={handleSelectChange('defaultModel')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-2">Claude 2</SelectItem>
                  <SelectItem value="llama-2">LLaMA 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;