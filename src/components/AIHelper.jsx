import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AIHelper = ({ specification, onSuggestionApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specification),
      });
      if (!response.ok) throw new Error('Failed to generate suggestion');
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({ title: "Failed to generate suggestion", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    onSuggestionApply(suggestion);
    toast({ title: "Suggestion applied successfully" });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Need help improving your menu specification? Let our AI assistant suggest enhancements!</p>
        <Button onClick={generateSuggestion} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : 'Generate Suggestion'}
        </Button>
        {suggestion && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">AI Suggestion:</h4>
            <p>{suggestion}</p>
            <Button onClick={applySuggestion} className="mt-2">Apply Suggestion</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIHelper;