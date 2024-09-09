import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import SettingsModal from '../components/SettingsModal';
import AIHelper from '../components/AIHelper';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const fetchInitialData = async () => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { /* Initial data structure */ };
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 border border-red-400 rounded max-w-md mx-auto mt-8">
    <h2 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong:</h2>
    <pre className="text-sm text-red-600 whitespace-pre-wrap mb-4">{error.message}</pre>
    <Button onClick={resetErrorBoundary} variant="destructive">Try again</Button>
  </div>
);

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const { data: initialData, isLoading, error } = useQuery(['initialData'], fetchInitialData);

  useEffect(() => {
    if (location.state?.template) {
      setMenuSpecification(location.state.template);
    }
  }, [location]);

  const handleSpecificationSubmit = useCallback((specification) => {
    setMenuSpecification(specification);
  }, []);

  const handleSettingsUpdate = useCallback((newSettings) => {
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    toast({ title: "Settings updated successfully" });
  }, [toast]);

  const handleAIHelperToggle = () => setShowAIHelper(!showAIHelper);

  const handleSuggestionApply = (suggestion) => {
    // Logic to apply AI suggestion to the menu specification
    setMenuSpecification(prevSpec => ({ ...prevSpec, ...suggestion }));
  };

  if (isLoading) return <Loader2 className="h-16 w-16 animate-spin mx-auto mt-16" />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Create OLLAMA Menu</h1>
          <div className="space-x-4">
            <Button onClick={handleAIHelperToggle} variant="outline">
              {showAIHelper ? 'Hide AI Helper' : 'Show AI Helper'}
            </Button>
            <Button onClick={() => setIsSettingsOpen(true)} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="specify" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specify">Specify Menu</TabsTrigger>
            <TabsTrigger value="generate" disabled={!menuSpecification}>Generate Menu</TabsTrigger>
          </TabsList>
          <TabsContent value="specify">
            <Card className="p-6">
              <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} />
              {showAIHelper && <AIHelper specification={menuSpecification} onSuggestionApply={handleSuggestionApply} />}
            </Card>
          </TabsContent>
          <TabsContent value="generate">
            <Card className="p-6">
              {menuSpecification && <MenuGenerator {...menuSpecification} />}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onUpdate={handleSettingsUpdate} />
    </ErrorBoundary>
  );
};

export default CreateMenu;