import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import SettingsModal from '../components/SettingsModal';
import AIHelper from '../components/AIHelper';

const OPENAI_API_KEY = "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";

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [userSettings, setUserSettings] = useState({ openaiApiKey: OPENAI_API_KEY });
  const [freeCallsRemaining, setFreeCallsRemaining] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (location.state?.template) {
      const { agents, tools, customizations } = location.state.template;
      setMenuSpecification({
        title: location.state.template.name,
        agents,
        tools,
        customizations
      });
    }
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setUserSettings(savedSettings);
    }
    const savedFreeCalls = localStorage.getItem('freeCallsRemaining');
    if (savedFreeCalls) {
      setFreeCallsRemaining(parseInt(savedFreeCalls, 10));
    }
    setIsLoading(false);
  }, [location]);

  const handleSpecificationSubmit = useCallback((specification) => {
    setMenuSpecification(specification);
  }, []);

  const handleSettingsUpdate = useCallback((newSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    toast({ title: "Settings updated successfully" });
  }, [toast]);

  const handleAIHelperToggle = () => {
    setShowAIHelper(!showAIHelper);
  };

  const handleApiCall = useCallback(() => {
    if (freeCallsRemaining > 0) {
      setFreeCallsRemaining(prev => {
        const newValue = prev - 1;
        localStorage.setItem('freeCallsRemaining', newValue.toString());
        return newValue;
      });
    } else {
      toast({
        title: "Free trial ended",
        description: "Please add your own API key in the settings to continue.",
        variant: "destructive",
      });
    }
  }, [freeCallsRemaining, toast]);

  if (isLoading) {
    return <Loader2 className="h-16 w-16 animate-spin mx-auto mt-16" />;
  }

  return (
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
      
      {showAIHelper && <AIHelper />}

      <Tabs defaultValue="specify" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specify">Specify Menu</TabsTrigger>
          <TabsTrigger value="generate" disabled={!menuSpecification}>Generate Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="specify">
          <Card className="p-6">
            <MenuSpecificationForm onSubmit={handleSpecificationSubmit} initialData={menuSpecification} />
          </Card>
        </TabsContent>
        <TabsContent value="generate">
          <Card className="p-6">
            {menuSpecification && (
              <MenuGenerator
                {...menuSpecification}
                userSettings={userSettings}
                onApiCall={handleApiCall}
                freeCallsRemaining={freeCallsRemaining}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onUpdate={handleSettingsUpdate}
        initialSettings={userSettings}
      />
    </div>
  );
};

export default CreateMenu;
