import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import GuidedTour from '../components/GuidedTour';
import ApiKeyInput from '../components/ApiKeyInput';
import ErrorLogger from '../components/ErrorLogger';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const fetchInitialData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { /* Initial data structure */ };
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded">
    <h2 className="text-lg font-semibold text-red-800">Something went wrong:</h2>
    <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Try again
    </button>
  </div>
);

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [provider, setProvider] = useState(null);
  const location = useLocation();

  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['initialData'],
    queryFn: fetchInitialData,
  });

  useEffect(() => {
    if (location.state?.template) {
      setMenuSpecification(location.state.template);
    }
  }, [location]);

  const handleSpecificationSubmit = useCallback((specification) => {
    setMenuSpecification(specification);
  }, []);

  const handleApiKeySubmit = useCallback((selectedProvider, key) => {
    setProvider(selectedProvider);
    setApiKey(key);
    if (key !== 'free') {
      localStorage.setItem(`${selectedProvider.toUpperCase()}_API_KEY`, key);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (provider && apiKey !== 'free') {
        localStorage.removeItem(`${provider.toUpperCase()}_API_KEY`);
      }
    };
  }, [provider, apiKey]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />;
  if (error) return <ErrorLogger error={error} />;
  if (!apiKey) return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ErrorLogger>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold">Create OLLAMA Menu</h1>
            <GuidedTour />
          </div>
          <p className="text-gray-600 mb-8">Use this interface to create your custom OLLAMA mode menu with agents and selectable tools.</p>
          
          <Tabs defaultValue="specify">
            <TabsList>
              <TabsTrigger value="specify">Specify Menu</TabsTrigger>
              <TabsTrigger value="generate" disabled={!menuSpecification}>Generate Menu</TabsTrigger>
            </TabsList>
            <TabsContent value="specify">
              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Menu Specification</h2>
                  <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} />
                </Card>
              </Suspense>
            </TabsContent>
            <TabsContent value="generate">
              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Generate Menu</h2>
                  {menuSpecification && (
                    <MenuGenerator
                      title={menuSpecification.title}
                      agents={menuSpecification.agents}
                      tools={menuSpecification.tools}
                      customizations={menuSpecification.customizations}
                      provider={provider}
                      apiKey={apiKey}
                    />
                  )}
                </Card>
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorLogger>
    </ErrorBoundary>
  );
};

export default React.memo(CreateMenu);