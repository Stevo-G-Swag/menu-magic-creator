import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AIHelper = ({ specification }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (specification) {
      generateSuggestions();
    }
  }, [specification]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(specification),
      });
      if (!response.ok) throw new Error('Failed to generate suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, specification }),
      });
      if (!response.ok) throw new Error('Failed to process query');
      const data = await response.json();
      setSuggestions([...suggestions, { question: query, answer: data.answer }]);
      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleQuerySubmit} className="mb-4">
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI for suggestions..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Ask
            </Button>
          </div>
        </form>
        {suggestions.map((suggestion, index) => (
          <div key={index} className="mb-2">
            {suggestion.question && <p className="font-semibold">{suggestion.question}</p>}
            <p>{suggestion.answer}</p>
          </div>
        ))}
        {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}
      </CardContent>
    </Card>
  );
};

export default AIHelper;
