import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Save, Upload, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MenuPreview from './MenuPreview';
import AIHelper from './AIHelper';

const MenuSpecificationForm = ({ onSubmit, initialData, showAIHelper }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [agents, setAgents] = useState(initialData?.agents || [{ name: '', description: '' }]);
  const [tools, setTools] = useState(initialData?.tools || [{ name: '', description: '' }]);
  const [customizations, setCustomizations] = useState(initialData?.customizations || {});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAgents(initialData.agents || [{ name: '', description: '' }]);
      setTools(initialData.tools || [{ name: '', description: '' }]);
      setCustomizations(initialData.customizations || {});
    }
  }, [initialData]);

  useEffect(() => {
    validateForm();
  }, [title, agents, tools, customizations]);

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

  const handleCustomizationChange = (key, value) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const addAgent = () => setAgents([...agents, { name: '', description: '' }]);
  const addTool = () => setTools([...tools, { name: '', description: '' }]);
  const removeAgent = (index) => setAgents(agents.filter((_, i) => i !== index));
  const removeTool = (index) => setTools(tools.filter((_, i) => i !== index));

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
      onSubmit({ title, agents, tools, customizations, menuItems: previewItems });
    } else {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
    }
  };

  const saveSpecification = () => {
    const specification = JSON.stringify({ title, agents, tools, customizations });
    localStorage.setItem('menuSpecification', specification);
    toast({ title: "Specification Saved", description: "Your menu specification has been saved locally." });
  };

  const loadSpecification = () => {
    const savedSpecification = localStorage.getItem('menuSpecification');
    if (savedSpecification) {
      const { title: savedTitle, agents: savedAgents, tools: savedTools, customizations: savedCustomizations } = JSON.parse(savedSpecification);
      setTitle(savedTitle);
      setAgents(savedAgents);
      setTools(savedTools);
      setCustomizations(savedCustomizations);
      toast({ title: "Specification Loaded", description: "Your saved menu specification has been loaded." });
    } else {
      toast({ title: "No Saved Specification", description: "No saved menu specification found.", variant: "destructive" });
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="menu-title">Menu Title</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="menu-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter menu title"
              className={errors.title ? 'border-red-500' : ''}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter a descriptive title for your OLLAMA menu.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label>Agents</Label>
          {agents.map((agent, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                value={agent.name}
                onChange={(e) => handleAgentChange(index, 'name', e.target.value)}
                placeholder="Agent name"
                className={errors.agents ? 'border-red-500' : ''}
              />
              <Textarea
                value={agent.description}
                onChange={(e) => handleAgentChange(index, 'description', e.target.value)}
                placeholder="Agent description"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" onClick={() => removeAgent(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove this agent</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
          {errors.agents && <p className="text-red-500 text-sm mt-1">{errors.agents}</p>}
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
                className={errors.tools ? 'border-red-500' : ''}
              />
              <Textarea
                value={tool.description}
                onChange={(e) => handleToolChange(index, 'description', e.target.value)}
                placeholder="Tool description"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" onClick={() => removeTool(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove this tool</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
          {errors.tools && <p className="text-red-500 text-sm mt-1">{errors.tools}</p>}
          <Button type="button" onClick={addTool} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Tool
          </Button>
        </div>

        <div>
          <Label>Customizations</Label>
          <Input
            value={customizations.theme || ''}
            onChange={(e) => handleCustomizationChange('theme', e.target.value)}
            placeholder="Theme (e.g., light, dark)"
            className="mb-2"
          />
          <Input
            value={customizations.language || ''}
            onChange={(e) => handleCustomizationChange('language', e.target.value)}
            placeholder="Language"
            className="mb-2"
          />
          {/* Add more customization fields as needed */}
        </div>

        <div className="flex space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={!isValid}>Generate Menu</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create your OLLAMA menu based on the current specification</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" onClick={saveSpecification}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your current menu specification locally</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" onClick={loadSpecification}>
                <Upload className="h-4 w-4 mr-2" /> Load
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load a previously saved menu specification</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Menu Preview</h3>
          <MenuPreview title={title} agents={agents} tools={tools} customizations={customizations} onUpdate={setPreviewItems} />
        </div>

        {showAIHelper && <AIHelper specification={{ title, agents, tools, customizations }} />}
      </form>
    </TooltipProvider>
  );
};

export default MenuSpecificationForm;
