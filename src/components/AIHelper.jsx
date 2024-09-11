import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AIHelper = ({ specification, onSuggestionApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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
      setSuggestions(prevSuggestions => [...prevSuggestions, data.suggestion]);
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({ title: "Failed to generate suggestion", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
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
        {suggestions.length > 0 && (
          <Accordion type="single" collapsible className="mt-4">
            {suggestions.map((suggestion, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>Suggestion {index + 1}</AccordionTrigger>
                <AccordionContent>
                  <p>{suggestion}</p>
                  <Button onClick={() => applySuggestion(suggestion)} className="mt-2">Apply Suggestion</Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default AIHelper;