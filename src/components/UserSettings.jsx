import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const UserSettings = () => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    githubClientId: '',
    githubClientSecret: '',
    litellmApiKey: '',
    openrouterApiKey: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user settings from the server
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        toast({
          title: "Settings Updated",
          description: "Your settings have been successfully updated.",
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="openaiApiKey">OpenAI API Key</label>
            <Input
              id="openaiApiKey"
              name="openaiApiKey"
              type="password"
              value={settings.openaiApiKey}
              onChange={handleInputChange}
              placeholder="Enter your OpenAI API key"
            />
          </div>
          <div>
            <label htmlFor="githubClientId">GitHub Client ID</label>
            <Input
              id="githubClientId"
              name="githubClientId"
              type="text"
              value={settings.githubClientId}
              onChange={handleInputChange}
              placeholder="Enter your GitHub Client ID"
            />
          </div>
          <div>
            <label htmlFor="githubClientSecret">GitHub Client Secret</label>
            <Input
              id="githubClientSecret"
              name="githubClientSecret"
              type="password"
              value={settings.githubClientSecret}
              onChange={handleInputChange}
              placeholder="Enter your GitHub Client Secret"
            />
          </div>
          <div>
            <label htmlFor="litellmApiKey">LiteLLM API Key</label>
            <Input
              id="litellmApiKey"
              name="litellmApiKey"
              type="password"
              value={settings.litellmApiKey}
              onChange={handleInputChange}
              placeholder="Enter your LiteLLM API key"
            />
          </div>
          <div>
            <label htmlFor="openrouterApiKey">OpenRouter API Key</label>
            <Input
              id="openrouterApiKey"
              name="openrouterApiKey"
              type="password"
              value={settings.openrouterApiKey}
              onChange={handleInputChange}
              placeholder="Enter your OpenRouter API key"
            />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserSettings;