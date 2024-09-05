import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import GuidedTour from '../components/GuidedTour';
import ApiKeyInput from '../components/ApiKeyInput';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [provider, setProvider] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.template) {
      setInitialData(location.state.template);
    }
  }, [location]);

  const handleSpecificationSubmit = (specification) => {
    setMenuSpecification(specification);
  };

  const handleApiKeySubmit = (selectedProvider, key) => {
    setProvider(selectedProvider);
    setApiKey(key);
    // Store the API key in a .env file (this would typically be done server-side)
    if (key !== 'free') {
      localStorage.setItem(`${selectedProvider.toUpperCase()}_API_KEY`, key);
    }
  };

  useEffect(() => {
    // Clean up the API key when the component unmounts (simulating sign out)
    return () => {
      if (provider && apiKey !== 'free') {
        localStorage.removeItem(`${provider.toUpperCase()}_API_KEY`);
      }
    };
  }, [provider, apiKey]);

  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
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
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Menu Specification</h2>
            <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={initialData} />
          </Card>
        </TabsContent>
        <TabsContent value="generate">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateMenu;