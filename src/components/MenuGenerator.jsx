import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MenuPreview from './MenuPreview';

const MenuGenerator = ({ title, agents, tools, customizations }) => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For development purposes, simulate a successful response
      // Remove this and uncomment the fetch call when the backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedCode(`
        // Sample generated code
        const OllamaMenu = {
          title: "${title}",
          agents: ${JSON.stringify(agents, null, 2)},
          tools: ${JSON.stringify(tools, null, 2)},
          // Add more generated code here
        };
      `);

      // Uncomment this when the backend is ready
      /*
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
      setGeneratedCode(data.code);
      */
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

      {generatedCode && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Generated Menu Preview:</h3>
          <MenuPreview title={title} agents={agents} tools={tools} />
          <div>
            <h3 className="text-xl font-bold mb-2">Generated Code:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuGenerator;