import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const fetchAgents = async () => {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

const createAgent = async (newAgent) => {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAgent),
  });
  if (!response.ok) {
    throw new Error('Failed to create agent');
  }
  return response.json();
};

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      toast({
        title: "Agent Created",
        description: "Your new agent has been successfully created.",
      });
      setAgentName('');
      setAgentDescription('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create agent: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateAgent = (e) => {
    e.preventDefault();
    createAgentMutation.mutate({ name: agentName, description: agentDescription });
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error) return <div>Error loading agents: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Builder</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAgent} className="space-y-4">
            <Input
              placeholder="Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
            />
            <Input
              placeholder="Agent Description"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              required
            />
            <Button type="submit" disabled={createAgentMutation.isLoading}>
              {createAgentMutation.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Agent
            </Button>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-2">Existing Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents && agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{agent.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentBuilder;
