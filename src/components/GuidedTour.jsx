import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Welcome", content: "Welcome to the Menu Creator! Let's get started with a quick tour." },
  { title: "Menu Title", content: "Start by entering a descriptive title for your menu in the 'Menu Title' field." },
  { title: "Adding Agents", content: "Next, add agents to your menu. Each agent should have a name and description." },
  { title: "Adding Tools", content: "Now, add tools that your agents can use. Don't forget to describe each tool." },
  { title: "Preview", content: "Check the preview section to see how your menu structure looks." },
  { title: "Generate", content: "When you're ready, click 'Generate Menu' to create your custom menu!" },
  { title: "Save and Load", content: "You can save your specifications and load them later for easy editing." },
];

const GuidedTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const showNextStep = () => {
    if (currentStep < steps.length) {
      toast({
        title: steps[currentStep].title,
        description: steps[currentStep].content,
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const startTour = () => {
    setCurrentStep(0);
    showNextStep();
  };

  return (
    <div className="space-y-4">
      <Button onClick={startTour} variant="outline">
        Start Guided Tour
      </Button>
      {currentStep > 0 && currentStep < steps.length && (
        <Button onClick={showNextStep} variant="secondary">
          Next Step
        </Button>
      )}
    </div>
  );
};

export default GuidedTour;