import React from 'react';
import { useToast } from "@/components/ui/use-toast";

const OnboardingTour = () => {
  const { toast } = useToast();
  const steps = [
    { title: "Welcome", content: "Welcome to the Menu Creator! Let's get started with a quick tour." },
    { title: "Menu Title", content: "Start by entering a descriptive title for your menu." },
    { title: "Adding Agents", content: "Add agents to your menu. Each agent should have a name and description." },
    { title: "Adding Tools", content: "Next, add tools that your agents can use. Don't forget to describe each tool." },
    { title: "Preview", content: "Check the preview to see how your menu structure looks." },
    { title: "Generate", content: "When you're ready, click 'Generate Menu' to create your custom menu!" },
    { title: "Save and Load", content: "You can save your specifications and load them later for easy editing." },
  ];

  const startTour = () => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        toast({
          title: step.title,
          description: step.content,
        });
      }, index * 3000);
    });
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

export default OnboardingTour;