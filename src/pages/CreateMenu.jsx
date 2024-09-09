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
import SettingsModal from '../components/SettingsModal';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    className="p-4 bg-red-100 border border-red-400 rounded max-w-md mx-auto mt-8"
  >
    <h2 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong:</h2>
    <pre className="text-sm text-red-600 whitespace-pre-wrap mb-4">{error.message}</pre>
    <Button
      onClick={resetErrorBoundary}
      className="bg-red-500 text-white hover:bg-red-600 transition-colors"
    >
      Try again
    </Button>
  </motion.div>
);

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

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
  }, []);

  const handleSettingsUpdate = useCallback((newSettings) => {
    // Update settings in localStorage or context
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully.",
    });
  }, [toast]);

  const toggleAIHelper = () => {
    setShowAIHelper(!showAIHelper);
  };

  const renderContent = () => {
    if (!apiKey) {
      return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
    }

    return (
      <motion.div
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
          <div className="flex space-x-4">
            <GuidedTour />
            <Button onClick={() => setIsSettingsOpen(true)} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Need Assistance?</DialogTitle>
                  <DialogDescription>
                    Our AI helper can guide you through the menu creation process. Would you like to enable the AI assistant?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {}}>No, thanks</Button>
                  <Button onClick={toggleAIHelper}>Yes, enable AI helper</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} showAIHelper={showAIHelper} />
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
                    showAIHelper={showAIHelper}
                  />
                )}
              </Card>
            </Suspense>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ErrorLogger>
        <AnimatePresence mode="wait">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onUpdate={handleSettingsUpdate} />
      </ErrorLogger>
    </ErrorBoundary>
  );
};

export default React.memo(CreateMenu);