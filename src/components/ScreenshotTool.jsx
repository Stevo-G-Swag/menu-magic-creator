import React from 'react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ScreenshotTool = () => {
  const { toast } = useToast();

  const captureScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body);
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = image;
      link.click();
      toast({
        title: "Screenshot captured",
        description: "Your screenshot has been saved.",
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={captureScreenshot}>
      Capture Screenshot
    </Button>
  );
};

export default ScreenshotTool;