import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import MenuPreview from './MenuPreview';

const MenuGenerator = ({ title, agents, tools, customizations }) => {
  const [generatedCode, setGeneratedCode] = useState('');
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
        body: JSON.stringify({ title, agents: agents.split(','), tools: tools.split(','), customizations }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate menu');
      }
      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error('Error generating menu:', error);
      setError('An error occurred while generating the menu. Please try again.');
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
        <div className="text-red-500">{error}</div>
      )}

      {generatedCode && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Generated Menu Preview:</h3>
          <MenuPreview html={generatedCode} />
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