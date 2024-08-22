import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

const MenuSpecificationForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [agents, setAgents] = useState([{ name: '', description: '' }]);
  const [tools, setTools] = useState([{ name: '', description: '' }]);

  const handleAgentChange = (index, field, value) => {
    const newAgents = [...agents];
    newAgents[index][field] = value;
    setAgents(newAgents);
  };

  const handleToolChange = (index, field, value) => {
    const newTools = [...tools];
    newTools[index][field] = value;
    setTools(newTools);
  };

  const addAgent = () => {
    setAgents([...agents, { name: '', description: '' }]);
  };

  const addTool = () => {
    setTools([...tools, { name: '', description: '' }]);
  };

  const removeAgent = (index) => {
    const newAgents = agents.filter((_, i) => i !== index);
    setAgents(newAgents);
  };

  const removeTool = (index) => {
    const newTools = tools.filter((_, i) => i !== index);
    setTools(newTools);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, agents, tools });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="menu-title">Menu Title</Label>
        <Input
          id="menu-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter menu title"
          required
        />
      </div>

      <div>
        <Label>Agents</Label>
        {agents.map((agent, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              value={agent.name}
              onChange={(e) => handleAgentChange(index, 'name', e.target.value)}
              placeholder="Agent name"
              required
            />
            <Input
              value={agent.description}
              onChange={(e) => handleAgentChange(index, 'description', e.target.value)}
              placeholder="Agent description"
            />
            <Button type="button" variant="outline" onClick={() => removeAgent(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addAgent} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Agent
        </Button>
      </div>

      <div>
        <Label>Tools</Label>
        {tools.map((tool, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              value={tool.name}
              onChange={(e) => handleToolChange(index, 'name', e.target.value)}
              placeholder="Tool name"
              required
            />
            <Input
              value={tool.description}
              onChange={(e) => handleToolChange(index, 'description', e.target.value)}
              placeholder="Tool description"
            />
            <Button type="button" variant="outline" onClick={() => removeTool(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addTool} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Tool
        </Button>
      </div>

      <Button type="submit">Generate Menu</Button>
    </form>
  );
};

export default MenuSpecificationForm;