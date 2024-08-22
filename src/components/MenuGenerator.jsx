import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MenuGenerator = () => {
  const [title, setTitle] = useState('');
  const [agents, setAgents] = useState('');
  const [tools, setTools] = useState('');
  const [customizations, setCustomizations] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, agents: agents.split(','), tools: tools.split(','), customizations }),
      });
      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error('Error generating menu:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate OLLAMA Menu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Menu Title</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="agents" className="block text-sm font-medium text-gray-700">Agents (comma-separated)</label>
          <Input
            id="agents"
            value={agents}
            onChange={(e) => setAgents(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tools" className="block text-sm font-medium text-gray-700">Tools (comma-separated)</label>
          <Input
            id="tools"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customizations" className="block text-sm font-medium text-gray-700">Customizations</label>
          <Textarea
            id="customizations"
            value={customizations}
            onChange={(e) => setCustomizations(e.target.value)}
            rows={4}
          />
        </div>
        <Button type="submit">Generate Menu</Button>
      </form>
      {generatedCode && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Generated Code:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default MenuGenerator;