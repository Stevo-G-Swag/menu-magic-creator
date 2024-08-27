import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const MenuGenerator = ({ title, agents, tools, customizations, apiKey }) => {
  const [generatedMenu, setGeneratedMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sandboxUrl, setSandboxUrl] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ title, agents, tools, customizations }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
      // Simulate real-time updates
      const interval = setInterval(() => {
        setGeneratedMenu(prevMenu => {
          const updatedMenu = [...prevMenu];
          const randomIndex = Math.floor(Math.random() * updatedMenu.length);
          updatedMenu[randomIndex] = `${updatedMenu[randomIndex]} (Updated)`;
          return updatedMenu;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [generatedMenu]);

  const handleMenuItemClick = async (item) => {
    // Simulate running a task or building an agent
    setIsLoading(true);
    try {
      const response = await fetch('/api/run-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ task: item }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert(`Task completed: ${result.message}`);
    } catch (error) {
      console.error('Error running task:', error);
      setError(`Failed to run task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Menu'}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
                        <div
                          key={itemIndex}
                          className="cursor-pointer hover:bg-red-600 p-2 rounded"
                          onClick={() => handleMenuItemClick(item)}
                        >
                          {item}
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