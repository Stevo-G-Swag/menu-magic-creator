import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const defaultSettings = {
  openaiApiKey: '',
  githubToken: '',
  huggingfaceApiKey: '',
  litellmApiKey: '',
  openrouterApiKey: '',
  defaultProvider: 'openai',
  defaultModel: 'gpt-3.5-turbo',
};

const SettingsModal = ({ isOpen, onClose, onUpdate }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    setSettings(prevSettings => ({ ...prevSettings, ...savedSettings }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      localStorage.setItem('userSettings', JSON.stringify(settings));
      onUpdate(settings);
      toast({ title: "Settings saved successfully" });
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: "Error saving settings", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              key !== 'defaultProvider' && key !== 'defaultModel' ? (
                <div key={key}>
                  <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    type={key.includes('ApiKey') || key.includes('Token') ? 'password' : 'text'}
                  />
                </div>
              ) : null
            ))}
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
                  {['openai', 'huggingface', 'github', 'litellm', 'openrouter'].map(provider => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
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
                  {['gpt-3.5-turbo', 'gpt-4', 'claude-2', 'llama-2'].map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
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