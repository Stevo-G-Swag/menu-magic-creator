import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import MenuPreview from './MenuPreview';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Check, Copy } from 'lucide-react';

const MenuGenerator = ({ title, agents, tools, customizations }) => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For development purposes, simulate a successful response
      // Remove this and uncomment the fetch call when the backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedMenu = {
        title,
        agents,
        tools,
        customizations,
      };
      setGeneratedCode(JSON.stringify(generatedMenu, null, 2));

      toast({
        title: "Menu Generated",
        description: "Your OLLAMA menu has been successfully generated.",
        duration: 3000,
      });

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
      toast({
        title: "Error",
        description: `Failed to generate menu: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [title, agents, tools, customizations, toast]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "The generated code has been copied to your clipboard.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  }, [toast]);

  return (
    <div className="space-y-6">
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? <><Spinner className="mr-2" />Generating...</> : 'Generate Menu'}
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
          <MenuPreview title={title} agents={agents} tools={tools} customizations={customizations} />
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">Generated Code:</h3>
              <CopyToClipboard text={generatedCode} onCopy={handleCopy}>
                <Button variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </CopyToClipboard>
            </div>
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