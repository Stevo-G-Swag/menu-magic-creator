import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { executeTool } from '../utils/toolExecutor';

const MenuGenerator = ({ title, agents, tools, customizations, userSettings, onApiCall, freeCallsRemaining }) => {
  const [generatedMenu, setGeneratedMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sandboxUrl, setSandboxUrl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(userSettings.defaultProvider || 'openai');
  const [selectedModel, setSelectedModel] = useState(userSettings.defaultModel || 'gpt-3.5-turbo');
  const [toolInput, setToolInput] = useState('');
  const { toast } = useToast();

  console.log('Rendering MenuGenerator component');

  const handleGenerate = async () => {
    console.log('Generating menu...');
    setIsLoading(true);
    setError(null);
    try {
      if (freeCallsRemaining <= 0 && !userSettings.openaiApiKey) {
        throw new Error('No free calls remaining. Please add your API key in settings.');
      }
      onApiCall();
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          agents, 
          tools, 
          customizations, 
          provider: selectedProvider,
          model: selectedModel,
          apiKey: userSettings.openaiApiKey,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Menu generated:', data);
      setGeneratedMenu(data.menu);
      setSandboxUrl(data.sandboxUrl);
    } catch (error) {
      console.error('Error generating menu:', error);
      setError(`Failed to generate menu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (generatedMenu) {
      const interval = setInterval(() => {
        setGeneratedMenu(prevMenu => {
          if (!prevMenu) return null;
          const updatedMenu = [...prevMenu];
          const randomIndex = Math.floor(Math.random() * updatedMenu.length);
          updatedMenu[randomIndex] = `${updatedMenu[randomIndex]} (Updated)`;
          return updatedMenu;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [generatedMenu]);

  const handleToolExecution = async (tool) => {
    setIsLoading(true);
    setError(null);
    try {
      if (freeCallsRemaining <= 0 && !userSettings.openaiApiKey) {
        throw new Error('No free calls remaining. Please add your API key in settings.');
      }
      onApiCall();
      const result = await executeTool(tool, toolInput, userSettings.openaiApiKey);
      toast({
        title: "Tool Executed",
        description: `Result: ${result}`,
      });
    } catch (error) {
      console.error('Error executing tool:', error);
      setError(`Failed to execute tool: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to execute tool: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(userSettings).filter(key => key.includes('ApiKey') || key.includes('Token')).map(key => (
              <SelectItem key={key} value={key.replace('ApiKey', '').replace('Token', '').toLowerCase()}>
                {key.replace('ApiKey', '').replace('Token', '')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {['gpt-3.5-turbo', 'gpt-4', 'claude-2', 'llama-2'].map(model => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : 'Generate Menu'}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {freeCallsRemaining > 0 && (
        <Alert>
          <AlertTitle>Free Trial</AlertTitle>
          <AlertDescription>{`You have ${freeCallsRemaining} free calls remaining.`}</AlertDescription>
        </Alert>
      )}

      {generatedMenu && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Generated Mod Menu:</h3>
          <div className="bg-red-500 text-white p-4 rounded-md">
            <ScrollArea className="h-[400px]">
              <Accordion type="single" collapsible>
                {generatedMenu.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{category.name}</AccordionTrigger>
                    <AccordionContent>
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-4">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm mb-2">{item.description}</div>
                          <Input
                            placeholder="Enter input for tool"
                            value={toolInput}
                            onChange={(e) => setToolInput(e.target.value)}
                            className="mb-2"
                          />
                          <Button
                            onClick={() => handleToolExecution(item)}
                            disabled={isLoading}
                            className="w-full"
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Execute Tool
                          </Button>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      )}

      {sandboxUrl && (
        <div>
          <h3 className="text-xl font-bold mb-2">Interactive Sandbox:</h3>
          <iframe
            src={sandboxUrl}
            style={{ width: '100%', height: '500px', border: 'none' }}
            title="Interactive Sandbox"
          />
        </div>
      )}
    </div>
  );
};

export default MenuGenerator;
