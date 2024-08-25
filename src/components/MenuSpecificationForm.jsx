import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Save, Upload, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import MenuPreview from './MenuPreview';

const MenuSpecificationForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [agents, setAgents] = useState([{ name: '', description: '' }]);
  const [tools, setTools] = useState([{ name: '', description: '' }]);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    validateForm();
  }, [title, agents, tools]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (agents.some(agent => !agent.name.trim())) newErrors.agents = 'All agent names are required';
    if (tools.some(tool => !tool.name.trim())) newErrors.tools = 'All tool names are required';
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({ title, agents, tools });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const saveSpecification = () => {
    const specification = JSON.stringify({ title, agents, tools });
    localStorage.setItem('menuSpecification', specification);
    toast({
      title: "Specification Saved",
      description: "Your menu specification has been saved locally.",
    });
  };

  const loadSpecification = () => {
    const savedSpecification = localStorage.getItem('menuSpecification');
    if (savedSpecification) {
      const { title: savedTitle, agents: savedAgents, tools: savedTools } = JSON.parse(savedSpecification);
      setTitle(savedTitle);
      setAgents(savedAgents);
      setTools(savedTools);
      toast({
        title: "Specification Loaded",
        description: "Your saved menu specification has been loaded.",
      });
    } else {
      toast({
        title: "No Saved Specification",
        description: "No saved menu specification found.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="menu-title" className="flex items-center">
            Menu Title
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter a descriptive title for your menu</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="menu-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter menu title"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label className="flex items-center">
            Agents
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add agents with their names and descriptions</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          {agents.map((agent, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                value={agent.name}
                onChange={(e) => handleAgentChange(index, 'name', e.target.value)}
                placeholder="Agent name"
                className={errors.agents ? 'border-red-500' : ''}
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
          {errors.agents && <p className="text-red-500 text-sm mt-1">{errors.agents}</p>}
          <Button type="button" onClick={addAgent} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Agent
          </Button>
        </div>

        <div>
          <Label className="flex items-center">
            Tools
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add tools with their names and descriptions</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          {tools.map((tool, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                value={tool.name}
                onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                placeholder="Tool name"
                className={errors.tools ? 'border-red-500' : ''}
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
          {errors.tools && <p className="text-red-500 text-sm mt-1">{errors.tools}</p>}
          <Button type="button" onClick={addTool} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Tool
          </Button>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" disabled={!isValid}>Generate Menu</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" onClick={saveSpecification}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your current specification</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" onClick={loadSpecification}>
                <Upload className="h-4 w-4 mr-2" /> Load
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load a previously saved specification</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Menu Preview</h3>
          <MenuPreview title={title} agents={agents} tools={tools} />
        </div>
      </form>
    </TooltipProvider>
  );
};

export default MenuSpecificationForm;