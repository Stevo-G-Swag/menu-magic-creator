import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const MenuGenerator = React.lazy(() => import('../components/MenuGenerator'));
const MenuSpecificationForm = React.lazy(() => import('../components/MenuSpecificationForm'));
const SettingsModal = React.lazy(() => import('../components/SettingsModal'));
const AIHelper = React.lazy(() => import('../components/AIHelper'));

const fetchInitialData = async () => {
  // Simulating API call with reduced delay
  await new Promise(resolve => setTimeout(resolve, 500));
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
  const [userSettings, setUserSettings] = useState(null);
  const location = useLocation();
  const { toast } = useToast();

  const { data: initialData, isLoading, error } = useQuery(['initialData'], fetchInitialData, {
    staleTime: 60000, // Cache for 1 minute
    retry: 2, // Retry twice before showing error
  });

  useEffect(() => {
    if (location.state?.template) {
      setMenuSpecification(location.state.template);
    }
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setUserSettings(savedSettings);
    } else {
      setIsSettingsOpen(true);
    }
  }, [location]);

  const handleSpecificationSubmit = useCallback((specification) => {
    setMenuSpecification(specification);
  }, []);

  const handleSettingsUpdate = useCallback((newSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    toast({ title: "Settings updated successfully" });
  }, [toast]);

  const handleAIHelperToggle = () => setShowAIHelper(!showAIHelper);

  const handleSuggestionApply = useCallback((suggestion) => {
    setMenuSpecification(prevSpec => ({ ...prevSpec, ...suggestion }));
  }, []);

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
              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} />
                {showAIHelper && <AIHelper specification={menuSpecification} onSuggestionApply={handleSuggestionApply} />}
              </Suspense>
            </Card>
          </TabsContent>
          <TabsContent value="generate">
            <Card className="p-6">
              {menuSpecification && userSettings && (
                <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                  <MenuGenerator {...menuSpecification} userSettings={userSettings} />
                </Suspense>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Suspense fallback={null}>
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onUpdate={handleSettingsUpdate}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CreateMenu;