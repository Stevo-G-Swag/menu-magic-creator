import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ToolLibrary = () => {
  const { toast } = useToast();

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const response = await fetch('/api/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      return response.json();
    },
  });

  const handleAddTool = async (toolId) => {
    try {
      const response = await fetch(`/api/user/tools/${toolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add tool');
      }
      toast({
        title: "Tool Added",
        description: "The tool has been added to your workspace.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add tool: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading tools...</div>;
  if (error) return <div>Error loading tools: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tool Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools && tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{tool.description}</p>
              <Button onClick={() => handleAddTool(tool.id)}>Add to Workspace</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolLibrary;