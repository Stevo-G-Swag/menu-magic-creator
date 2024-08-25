import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

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

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        toast({
          title: steps[currentStep].title,
          description: steps[currentStep].content,
        });
        setCurrentStep(currentStep + 1);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, toast]);

  const startTour = () => {
    setCurrentStep(0);
  };

  return (
    <button
      onClick={startTour}
      className="text-blue-500 hover:text-blue-700 font-semibold"
    >
      Start Guided Tour
    </button>
  );
};

export default GuidedTour;