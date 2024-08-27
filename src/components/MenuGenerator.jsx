import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

const MenuGenerator = ({ title, agents, tools, customizations }) => {
  const [generatedMenu, setGeneratedMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, agents, tools, customizations }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGeneratedMenu(data.menu);
    } catch (error) {
      console.error('Error generating menu:', error);
      setError(`Failed to generate menu: ${error.message}`);
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
              <div className="space-y-2">
                {generatedMenu.map((item, index) => (
                  <div key={index} className="cursor-pointer hover:bg-red-600 p-2 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuGenerator;