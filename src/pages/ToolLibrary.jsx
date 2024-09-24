import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ErrorBoundary from '../components/ErrorBoundary';

const fetchTools = async () => {
  const response = await fetch('/api/tools');
  if (!response.ok) {
    throw new Error('Failed to fetch tools');
  }
  return response.json();
};

const addToolToWorkspace = async (toolId) => {
  const response = await fetch(`/api/user/tools/${toolId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to add tool');
  }
  return response.json();
};

const ToolLibrary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
    retry: 3,
    retryDelay: 1000,
  });

  const addToolMutation = useMutation({
    mutationFn: addToolToWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries(['tools']);
      toast({
        title: "Tool Added",
        description: "The tool has been added to your workspace.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add tool: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddTool = (toolId) => {
    addToolMutation.mutate(toolId);
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error) return <div>Error loading tools: {error.message}</div>;

  return (
    <ErrorBoundary>
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
                <Button 
                  onClick={() => handleAddTool(tool.id)}
                  disabled={addToolMutation.isLoading}
                >
                  {addToolMutation.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add to Workspace
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ToolLibrary;
