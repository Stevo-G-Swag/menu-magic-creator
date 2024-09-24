import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { captureScreenshot } from '../utils/screenshotUtil';
import { multiOnService } from '../services/multiOnService';
import { examplePresets } from '../utils/examplePresets';

const AIHelper = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preset, setPreset] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(async () => {
        const newScreenshot = await captureScreenshot();
        setScreenshot(newScreenshot);
        
        const pageContent = await multiOnService.getPageContent();
        setCurrentPage(pageContent);
        
        // Send screenshot and page content to AI for analysis
        const aiSuggestions = await multiOnService.getAISuggestions(newScreenshot, pageContent);
        // Handle AI suggestions (e.g., display them to the user)
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleActivate = async () => {
    try {
      await multiOnService.requestControl();
      setIsActive(true);
      toast({
        title: "AI Helper Activated",
        description: "AI Helper is now monitoring your screen.",
      });
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Failed to activate AI Helper. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = () => {
    multiOnService.releaseControl();
    setIsActive(false);
    setScreenshot(null);
    toast({
      title: "AI Helper Deactivated",
      description: "AI Helper is no longer monitoring your screen.",
    });
  };

  const handleShowPreset = () => {
    const userLevel = ['beginner', 'medium', 'advanced'][Math.floor(Math.random() * 3)];
    const newPreset = examplePresets[userLevel][Math.floor(Math.random() * examplePresets[userLevel].length)];
    setPreset(newPreset);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={isActive ? handleDeactivate : handleActivate}>
            {isActive ? 'Deactivate AI Helper' : 'Activate AI Helper'}
          </Button>
          <Button onClick={handleShowPreset}>Show Random Preset</Button>
          {isActive && screenshot && (
            <div>
              <h3 className="font-semibold">Current Screenshot:</h3>
              <img src={screenshot} alt="Current page" className="mt-2 max-w-full h-auto" />
            </div>
          )}
          {preset && (
            <div>
              <h3 className="font-semibold">Example Preset:</h3>
              <p>{preset.description}</p>
              <pre className="mt-2 p-2 bg-gray-100 rounded">{preset.code}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIHelper;
