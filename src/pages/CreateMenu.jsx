import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import GuidedTour from '../components/GuidedTour';
import ApiKeyInput from '../components/ApiKeyInput';
import ErrorLogger from '../components/ErrorLogger';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetchInitialData = async () => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { /* Initial data structure */ };
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    role="alert"
    className="p-4 bg-red-100 border border-red-400 rounded"
  >
    <h2 className="text-lg font-semibold text-red-800">Something went wrong:</h2>
    <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">{error.message}</pre>
    <Button
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-500 text-white hover:bg-red-600"
    >
      Try again
    </Button>
  </motion.div>
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

  if (!apiKey) return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ErrorLogger>
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-screen"
            >
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-4xl font-bold text-primary"
                >
                  Create OLLAMA Menu
                </motion.h1>
                <GuidedTour />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mb-8"
              >
                Use this advanced interface to create your custom OLLAMA mode menu with AI-powered agents and selectable tools.
              </motion.p>
              
              <Tabs defaultValue="specify" className="space-y-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specify">Specify Menu</TabsTrigger>
                  <TabsTrigger value="generate" disabled={!menuSpecification}>Generate Menu</TabsTrigger>
                </TabsList>
                <TabsContent value="specify">
                  <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <h2 className="text-2xl font-semibold mb-4 text-primary">Menu Specification</h2>
                      <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} />
                    </Card>
                  </Suspense>
                </TabsContent>
                <TabsContent value="generate">
                  <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
                    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <h2 className="text-2xl font-semibold mb-4 text-primary">Generate Menu</h2>
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
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorLogger>
    </ErrorBoundary>
  );
};

export default React.memo(CreateMenu);